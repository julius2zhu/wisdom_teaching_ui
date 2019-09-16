<template>
  <!--学生信息维护-->
  <div>
    <el-button plain @click="showDialog(0)">
      <i class="el-icon-circle-plus"></i>添加学生
    </el-button>
    <el-select v-model="itemSelect" style="width: 120px">
      <el-option v-for="item in searchCondition" :key="item.value" :label="item.label"
                 :value="item.value">
      </el-option>
    </el-select>
    <el-input placeholder="输入关键字进行筛选" style="width: 200px"
              v-model="searchKeys" clearable/>
    <el-button icon="el-icon-search" plain @click="searchInfo">查询</el-button>
    <el-button icon="el-icon-refresh" plain @click="reset">重置</el-button>
    <!--表格主体内容部分 设置max-height需要设置height 否则不起作用-->
    <el-table :data="tableData" stripe border max-height="500" height="450"
              v-loading="loading" element-loading-text="拼命加载中"
              element-loading-spinner="el-icon-loading"
              element-loading-background="rgba(0, 0, 0, 0.8">
      <el-table-column label="序号" type="index" width="50px" align="center"/>
      <el-table-column prop="name" label="姓名" align="center"/>
      <el-table-column prop="grade" label="班级" align="center"/>
      <el-table-column prop="number" label="学号" align="center"/>
      <el-table-column prop="department" label="系别" align="center"/>
      <el-table-column prop="major" label="专业" align="center"/>
      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <el-button size="mini" @click="showDialog(1,scope.$index)">
            <i class="el-icon-edit-outline"></i>编辑
          </el-button>
          <el-button size="mini" type="danger" @click="column_delete(scope.$index)">
            <i class="el-icon-delete-solid"></i>删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination background
                   @size-change="handleSizeChange" @current-change="handleCurrentChange"
                   :current-page="currentPage" :page-sizes="counts"
                   :page-size="count"
                   layout="total, sizes, prev, pager, next, jumper" :total="totalCount">
    </el-pagination>
    <!--弹出框嵌套一个表单-->
    <el-dialog :title="title" :visible.sync="dialogFormVisible"
               :center="true" :close-on-click-modal="false" @open="open">
      <el-form :model="form" :rules="rules" :inline="true" ref="dialog_form">
        <el-form-item label="学生姓名:" prop="name">
          <el-input v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item label="学生性别:" prop="sex">
          <el-radio v-model="form.sex" label="0">男</el-radio>
          <el-radio v-model="form.sex" label="1">女</el-radio>
        </el-form-item>
        <el-form-item label="学生班级:" prop="grade">
          <el-input v-model="form.grade"/>
        </el-form-item>
        <el-form-item label="学生学号:" prop="number">
          <el-input v-model="form.number"/>
        </el-form-item>
        <el-form-item label="所在系别:" prop="department">
          <el-input v-model="form.department"/>
        </el-form-item>
        <el-form-item label="所学专业:" prop="major">
          <el-input v-model="form.major"/>
        </el-form-item>
        <el-form-item label="学生班主任:" prop="classTeacher">
          <el-input v-model="form.classTeacher"/>
        </el-form-item>
        <el-form-item>
          <span class="toast">
            提示：<br/>
            新添加学生的账号和密码默认为学号,请提醒学生及时修改自己的密码。
          </span>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="ensure">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
  export default {
    name: 'StudentInfoMaintain',
    data () {
      return {
        //表格数据
        tableData: [],
        //当前页
        currentPage: 1,
        //总页数
        totalPage: 1,
        counts: [100, 200, 300, 400, 500],
        //每页显示的条数
        count: 100,
        //总条数
        totalCount: 1,
        //搜索下拉框选项
        itemSelect: 'name',
        searchKeys: '',
        searchCondition: [
          {value: 'name', label: '学生姓名'},
          {value: 'number', label: '学生学号'},
          {value: 'department', label: '所在系部'},
          {value: 'major', label: '所学专业'},
        ],
        title: '新增学生信息',
        dialogFormVisible: false,
        form: {
          id: -1,
          name: null,
          sex: '0',
          grade: null,
          number: null,
          department: null,
          major: null,
          classTeacher: null
        },
        loading: true,
        //验证规则
        rules: {
          name: [
            {required: true, message: '请输入学生性名'},
            {min: 2, max: 6, message: '学生姓名应在2-6个字符之间'}
          ],
          sex: [
            {required: true}
          ],
          grade: [
            {required: true, message: '请输入学生班级'},
            {min: 6, max: 20, message: '班级名应在6-20个字符之间'}
          ],
          number: [
            {required: true, message: '请输入学生学号'},
            {min: 6, max: 11, message: '学生学号应在6-11个字符之间'}
          ],
          department: [
            {required: true, message: '请输入学生所在系别'},
            {min: 3, max: 20, message: '学生系别应在3-20个字符之间'}
          ],
          major: [
            {required: true, message: '请输入学生所学专业'},
            {min: 3, max: 20, message: '专业名称应在3-20个字符之间'}
          ]
        }
      }
    },
    methods: {
      /*
      *弹出框弹出的回调方法
      * @param type 打开方式
      * @param data 数据
      * */
      open (type, data) {
        //必须在该方法中才可以实现表单的重置
        this.$nextTick(() => {
          this.$refs.dialog_form.resetFields()
          switch (type) {//0添加1编辑
            case 0:
              this.form.id = -1
              this.title = '新增学生信息'
              break
            case 1:
              this.title = '编辑学生信息'
              this.form = data
              break
            default:
              break
          }
        })
      },
      //列的删除方法
      column_delete (index, row) {
        this.$confirm('您确定要删除该条学生信息吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消'
        }).then(() => {
          //执行删除操作
          let id = this.tableData[index].id
          let url = this.url_request.ip_port_dev + '/student_manage/delete'
          this.addOrUpdateOrDelete(url, {id: id})
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
      },
      /**
       * 显示对话框
       * @param what 0表示新增1表示编辑
       * @param index 当前数据的下标,只有编辑时候才有
       */
      showDialog (what, index) {
        this.dialogFormVisible = true
        if (what === 0) {
          this.open(0)
        } else {
          this.title = '编辑学生信息'
          //拷贝一份，否则影响源数据
          let object = Object.assign({}, this.tableData[index])
          this.open(1, object)
        }
      },
      //对话框确定事件
      ensure () {
        //表单校验
        this.$refs.dialog_form.validate((validate) => {
          if (validate) {
            let id = this.form.id
            //添加人信息
            this.form.teacherName = sessionStorage.getItem('name')
            let url = this.url_request.ip_port_dev
            //判断是新增还是编辑
            if (id < 0) {
              //新增
              url += '/student_manage/add'
              this.addOrUpdateOrDelete(url, this.form)
            } else {
              //编辑
              url += '/student_manage/update'
              this.addOrUpdateOrDelete(url, this.form)
            }
          } else {
            return false
          }
        })
      },
      //查询学生信息
      searchInfo () {
        let item = this.itemSelect
        let key = this.searchKeys.trim()
        const vm = this
        let condition = {
          currentPage: this.currentPage,
          count: this.count,
          teacherName: sessionStorage.getItem('name')
        }
        if (item === 'name') {
          condition.name = key
        } else if (item === 'number') {
          condition.number = key
        } else if (item === 'department') {
          condition.department = key
        } else {
          condition.major = key
        }
        //执行搜索操作
        let url = this.url_request.ip_port_dev + '/student_check'
        vm.netWorkRequest('post', url, condition, function (response) {
          //分页信息对象
          let pageInfo = response.pageInfo
          vm.totalPage = pageInfo.totalPage
          vm.totalCount = pageInfo.totalCount
          //数据信息
          vm.tableData = response.data
          vm.loading = false
        })
      },
      //重置查询条件
      reset () {
        const vm = this
        this.itemSelect = 'name'
        this.searchKeys = ''
        let url = this.url_request.ip_port_dev + '/student_check'
        vm.netWorkRequest('post', url, {
          teacherName: sessionStorage.getItem('name'),
          currentPage: 1,
          count: 100
        }, function (response) {
          //分页信息对象
          let pageInfo = response.pageInfo
          vm.totalPage = pageInfo.totalPage
          vm.totalCount = pageInfo.totalCount
          //数据信息
          vm.tableData = response.data
          vm.loading = false
        })
      },
      /**
       * 添加或者更新或者删除学生信息
       * @param url 请求的地址
       * @param student 学生信息对象实体
       */
      addOrUpdateOrDelete (url, student) {
        const vm = this
        vm.netWorkRequest('post', url, student, function (response) {
          vm.$message({
            title: '提示',
            message: response,
            type: 'success',
            center: true
          })
          vm.reset()
          vm.dialogFormVisible = false
        })
      },
      //每页显示的记录数被改变
      handleSizeChange (val) {
        this.count = val
        this.searchInfo()
      },
      //当前页数被改变
      handleCurrentChange (val) {
        //将改变后的页数赋值给当前页
        this.currentPage = val
        this.searchInfo()
      }
    },
    mounted () {
      this.reset()
    }
  }
</script>

<style scoped>
  .el-input {
    width: 200px;
  }

  .el-table {
    width: 100%;
    margin-top: 10px
  }

  .toast {
    color: red;
    font-size: large;
  }
</style>
