<template>
  <div>
    <el-button type="success" @click="showDialog(0)">添加学生</el-button>
    <el-select v-model="itemSelect" style="width: 120px">
      <el-option v-for="item in searchCondition" :key="item.value" :label="item.label"
                 :value="item.value">
      </el-option>
    </el-select>
    <el-input placeholder="输入关键字进行自动筛选" style="width: 200px"
              v-model="searchKeys" clearable/>
    <el-button icon="el-icon-search" plain @click="searchInfo">查询</el-button>
    <el-button icon="el-icon-refresh" plain @click="reset">重置</el-button>
    <!--表格主体内容部分 设置max-height需要设置height 否则不起作用-->
    <el-table :data="tableData" stripe border max-height="500" height="450"
              v-loading="loading" element-loading-text="拼命加载中"
              element-loading-spinner="el-icon-loading"
              element-loading-background="rgba(0, 0, 0, 0.8">
      <el-table-column label="序号" type="index" width="50"/>
      <el-table-column prop="name" label="姓名" width="100"/>
      <el-table-column prop="sex" label="性别" width="50"/>
      <el-table-column prop="grade" label="班级" width="100"/>
      <el-table-column prop="number" label="学号"/>
      <el-table-column prop="department" label="系别"/>
      <el-table-column prop="major" label="专业"/>
      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <el-button size="mini" @click="showDialog(1,scope.$index)">编辑
          </el-button>
          <el-button size="mini" type="danger" @click="column_delete(scope.$index)">删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <!--页脚分页,这个一般直接交给框架去做自动分页-->
    <div class="footer">
      <el-pagination background
                     @size-change="handleSizeChange" @current-change="handleCurrentChange"
                     :current-page="currentPage" :page-sizes="counts"
                     :page-size="count"
                     layout="total, sizes, prev, pager, next, jumper" :total="totalCount">
      </el-pagination>
    </div>
    <!--弹出框嵌套一个表单-->
    <el-dialog :title="title" :visible.sync="dialogFormVisible"
               :center="true" :close-on-click-modal="false" @open="open">
      <el-form :model="form" :rules="rules" :inline="true" ref="dialog_form">
        <el-form-item label="学生姓名:" prop="name">
          <el-input v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item label="专科学号:" prop="juniorNumber">
          <el-input v-model="form.number"></el-input>
        </el-form-item>
        <el-form-item label="专科年级:" prop="juniorGrade">
          <el-input v-model.number="form.grade"></el-input>
        </el-form-item>
        <el-form-item label="专业名称:" prop="majorName">
          <el-input v-model="form.major"></el-input>
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
        department: [
          {
            value: '计算机与通信工程学院',
            label: '计算机与通信工程学院'
          }, {
            value: '商学院',
            label: '商学院'
          }, {
            value: '电子工程学院',
            label: '电子工程学院'
          }, {
            value: '自动化学院',
            label: '自动化学院'
          }],
        form: {
          id: -1,
          name: '',
          number: '',
          grade: '',
          sex: '',
          department: ''
        },
        loading: true,
        //验证规则
        rules: {
          name: [
            {required: true, message: '请输入学生性名'},
            {min: 2, max: 6, message: '学生姓名应在2-6个字符之间'}
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
          switch (type) {//1编辑2添加
            case 0:
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
          let url = this.url_request.ip_port_dev +
            this.url_request.root_request + '/student_manage/delete'
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
            //向后台传递数据
            let id = this.form.id
            let name = this.form.name
            let idNumber = this.form.idNumber
            let birthDate = this.form.birthDate
            let juniorNumber = this.form.juniorNumber
            let juniorClass = this.form.juniorClass
            let juniorGrade = this.form.juniorGrade
            let mainAcademy = this.form.mainAcademy
            let majorNumber = this.form.majorNumber
            let majorName = this.form.majorName
            let examRegistrationNumber = this.form.examRegistrationNumber
            let department = this.form.department
            let sex = this.form.sex
            let gradeNumber = this.form.gradeNumber
            let studentInfo = {
              id, name, idNumber, birthDate, juniorNumber,
              juniorClass, juniorGrade, mainAcademy,
              majorNumber, majorName, examRegistrationNumber, department,
              sex, gradeNumber
            }
            let url = this.url_request.ip_port_dev + this.url_request.root_request
            //判断是新增还是编辑
            if (id < 0) {
              //新增
              url += '/student_manage/add'
              this.addOrUpdateOrDelete(url, studentInfo)
            } else {
              //编辑
              url += '/student_manage/update'
              this.addOrUpdateOrDelete(url, studentInfo)
            }
            this.dialogFormVisible = false
          } else {
            return false
          }
        })
      },
      //查询学生信息
      searchInfo () {
        let item = this.itemSelect
        let key = this.searchKeys.trim()
        let condition = {
          currentPage: this.currentPage,
          count: this.count
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
        this.axios(url, {
          method: 'post',
          data: condition
        }).then(response => {
          //分页信息对象
          let pageInfo = response.data.pageInfo
          this.currentPage = pageInfo.currentPage
          this.totalPage = pageInfo.totalPage
          this.count = pageInfo.count
          this.totalCount = pageInfo.totalCount
          //数据信息
          this.tableData = response.data.data
          this.loading = false
        }).catch(error => {
          this.loading = false
        })
      },
      //重置查询条件
      reset () {
        this.itemSelect = 'name'
        this.searchKeys = ''
        this.loading = true
        let url = this.url_request.ip_port_dev + '/student_check'
        this.axios(url, {
          method: 'post',
          data: {
            currentPage: 1,
            count: this.count
          }
        }).then(response => {
          //分页信息对象
          let pageInfo = response.data.pageInfo
          this.currentPage = pageInfo.currentPage
          this.totalPage = pageInfo.totalPage
          this.count = pageInfo.count
          this.totalCount = pageInfo.totalCount
          //数据信息
          this.tableData = response.data.data
          this.loading = false
        }).catch(error => {
          this.loading = false
        })
      },
      /**
       * 添加或者更新或者删除学生信息
       * @param url 请求的地址
       * @param student 学生信息对象实体
       */
      addOrUpdateOrDelete (url, student) {
        //执行新增或者更新操作
        this.axios(url, {
          method: 'post',
          data: student
        }).then(response => {
          let result = response.data
          this.reset()
          this.$message({
            title: '提示',
            message: result,
            type: 'success',
            center: true
          })
        }).catch(error => {
          this.$message({
            title: '提示',
            message: '系统出错,请稍后再试!',
            type: 'error',
            center: true
          })
        })
      },
      //输入框中内容被改变
      handleSizeChange (val) {
        switch (val) {
          case 100:
          case 200:
          case 300:
          case 400:
          case 500:
            this.count = val
            break
        }
        this.handleCurrentChange(val)
      },
      //当前页数被改变
      handleCurrentChange (val) {
        //将改变后的页数赋值给当前页
        this.currentPage = val
        this.searchInfo()
      }
    }
    ,
    mounted () {
      let url = this.url_request.ip_port_dev + '/student_check'
      this.axios(url, {
        method: 'post',
        data: {
          currentPage: 1,
          count: this.count
        }
      }).then(response => {
        //分页信息对象
        let pageInfo = response.data.pageInfo
        this.currentPage = pageInfo.currentPage
        this.totalPage = pageInfo.totalPage
        this.count = pageInfo.count
        this.totalCount = pageInfo.totalCount
        //数据信息
        this.tableData = response.data.data
        this.loading = false
      }).catch(error => {
        this.loading = false
      })
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

  .footer {
    text-align: center;
  }
</style>
