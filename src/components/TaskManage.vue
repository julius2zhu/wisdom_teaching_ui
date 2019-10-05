<template>
  <!--作业管理：
  包括教师发布作业
  修改删除作业
  -->
  <div>
    <el-button plain @click="showDialog(0)">
      <i class="el-icon-plus"></i>发布作业
    </el-button>
    <span class="taskName">作业名称:</span>
    <el-input placeholder="输入关键字进行筛选" style="width: 180px"
              v-model="taskName" clearable/>
    <el-button icon="el-icon-search" plain @click="searchTask">查询</el-button>
    <el-button icon="el-icon-refresh" plain @click="resetTask">重置</el-button>
    <el-table :data="tableData" stripe border max-height="500" height="450"
              v-loading="loading" element-loading-text="拼命加载中"
              element-loading-spinner="el-icon-loading"
              element-loading-background="rgba(0, 0, 0, 0.8">
      <el-table-column label="序号" type="index" align="center" width="50"/>
      <el-table-column align="center" prop="name" label="作业名称"/>
      <el-table-column align="center" prop="describes" label="描述信息"/>
      <el-table-column align="center" prop="createDate" label="发布时间"/>
      <el-table-column type="expand" label="下载" width="50px">
        <template slot-scope="props">
          附件下载:
          <el-button circle icon="el-icon-link" @click="download(props.row.path)">
          </el-button>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <el-button size="mini" @click="column_edit(scope.$index)">
            <i class="el-icon-edit-outline"></i>编辑
          </el-button>
          <el-button size="mini" type="danger" @click="column_delete(scope.$index)">
            <i class="el-icon-delete-solid"></i>删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination background
                   @size-change="handleSizeChange"
                   @current-change="handleCurrentChange"
                   :current-page="currentPage" :page-sizes="counts"
                   :page-size="count"
                   layout="total, sizes, prev, pager, next, jumper"
                   :total="totalCount">
    </el-pagination>
    <!--弹出框嵌套一个表单-->
    <el-dialog :title="title" :visible.sync="dialogFormVisible"
               :center="true" :close-on-click-modal="false">
      <el-form :model="form" :rules="rules" ref="dialog_form" label-width="100px">
        <el-form-item label="作业名称:" prop="name">
          <el-input placeholder="请输入作业名称" v-model="form.name"/>
        </el-form-item>
        <el-form-item label="作业描述:" prop="describes">
          <el-input placeholder="请输入作业描述" v-model="form.describes"/>
        </el-form-item>
        <el-form-item label="附件上传:" prop="file">
          <el-upload
            class="upload-demo" ref="upload" :action="url"
            :file-list="form.file" :limit="1" :data="form" :auto-upload="false"
            :on-success="success" :on-error="error">
            <el-button slot="trigger" class="el-icon-upload" size="small" plain>选取文件</el-button>
          </el-upload>
          <span class="toast">单次上传附件不能超过10MB </span>
        </el-form-item>
        <span v-if="title==='新增作业信息'">
              <p style="margin-left: 30px ;color: #00FF7F;font-weight: bold;">选择学生:</p>
          <!--搜索条件中下拉框-->
          <el-select v-model="itemSelect" style="width: 120px">
            <el-option v-for="item in searchCondition" :key="item.value" :label="item.label"
                       :value="item.value">
            </el-option>
          </el-select>
          <el-input placeholder="输入关键字进行筛选" style="width: 180px"
                    v-model="searchKeys" clearable/>
          <el-button icon="el-icon-search" plain @click="searchInfo">查询</el-button>
          <el-button icon="el-icon-refresh" plain @click="reset">重置</el-button>
          <!--表格主体内容部分 设置max-height需要设置height 否则不起作用-->
          <el-table :data="innerTableData" stripe border max-height="300" height="280"
                    v-loading="loading"
                    element-loading-text="拼命加载中"
                    element-loading-spinner="el-icon-loading"
                    element-loading-background="rgba(0, 0, 0, 0.8"
                    @select="selectionSingle"
                    @select-all="selectAll">
            <el-table-column type="selection"/>
            <el-table-column label="序号" type="index" align="center" width="50"/>
            <el-table-column prop="name" label="姓名" align="center"/>
            <el-table-column prop="number" label="学号" align="center"/>
          </el-table>
          <el-pagination background
                         @size-change="innerHandleSizeChange"
                         @current-change="innerHandleCurrentChange"
                         :current-page="innerCurrentPage"
                         :page-sizes="innerCounts"
                         :page-size="innerCount"
                         layout="total, sizes, prev, pager, next, jumper"
                         :total="innerTotalCount">
          </el-pagination>
        </span>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="enSure">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  export default {
    name: 'TaskManage',
    data () {
      return {
        //表格数据
        tableData: [],
        //内部表格的数据
        innerTableData: [],
        //当前页
        currentPage: 1,
        innerCurrentPage: 1,
        //总页数
        totalPage: 1,
        innerTotalPage: 1,
        //每页显示的条数
        counts: [100, 200, 300, 400, 500],
        innerCounts: [100, 200, 300, 400, 500],
        //传递给后台
        count: 100,
        innerCount: 100,
        //总条数
        totalCount: 1,
        innerTotalCount: 1,
        //搜索下拉框选项
        itemSelect: 'name',
        searchKeys: null,
        //作业名称
        taskName: null,
        //所有选择数据的id
        selections: [],
        searchCondition: [
          {value: 'name', label: '学生姓名'},
          {value: 'number', label: '学生学号'},
          {value: 'grade', label: '学生班级'},
          {value: 'department', label: '所在系部'},
          {value: 'major', label: '所学专业'},
        ],
        loading: true,
        url: this.url_request.ip_port_dev + '/issue_task',
        dialogFormVisible: false,
        form: {
          id: -1,
          name: '',
          describes: '',
          file: [],
          //需要推送的学生
          studentIds: [],
          userId: sessionStorage.getItem('id')
        },
        title: '新增作业信息',
        rules: {
          name: [
            {required: true, message: '作业名称不能为空', trigger: 'blur'},
            {min: 6, max: 20, message: '作业名称应在6-20个字符之间', trigger: 'blur'}
          ],
          describes: [
            {required: true, message: '作业描述信息不能为空', trigger: 'blur'},
            {min: 3, max: 100, message: '作业描述应在3-100个字符之间', trigger: 'blur'}
          ]
        }
      }
    },
    methods: {
      //输入框中内容被改变或者每页显示条数改变
      handleSizeChange (val) {
        this.count = val
        this.searchInfo()
      },
      //当前页数被改变
      handleCurrentChange (val) {
        // 将改变后的页数赋值给当前页
        this.innerCurrentPage = val
        this.searchInfo()
      },
      innerHandleSizeChange (val) {
        this.innerCount = val
        this.searchInfo()
      },
      innerHandleCurrentChange (val) {
        // 将改变后的页数赋值给当前页
        this.innerCurrentPage = val
        this.searchInfo()
      },
      //初始化学生数据
      initStudentInfo () {
        const vm = this
        this.itemSelect = 'name'
        this.searchKeys = ''
        let url = this.url_request.ip_port_dev + '/student_check'
        vm.netWorkRequest('post', url, {
          userId: sessionStorage.getItem('id'),
          currentPage: 1,
          count: 100
        }, function (response) {
          //分页信息对象
          let pageInfo = response.pageInfo
          vm.innerTotalPage = pageInfo.totalPage
          vm.innerTotalCount = pageInfo.totalCount
          //数据信息
          vm.innerTableData = response.data
          vm.loading = false
        })
      },
      //查询学生信息
      searchInfo () {
        let item = this.itemSelect
        let key = this.searchKeys.trim()
        const vm = this
        let condition = {
          currentPage: this.innerCurrentPage,
          count: this.innerCount,
          userId: sessionStorage.getItem('id')
        }
        if (item === 'name') {
          condition.name = key
        } else if (item === 'number') {
          condition.number = key
        } else if (item === 'grade') {
          condition.grade = key
        }
        else if (item === 'department') {
          condition.department = key
        } else {
          condition.major = key
        }
        //执行搜索操作
        let url = this.url_request.ip_port_dev + '/student_check'
        vm.netWorkRequest('post', url, condition, function (response) {
          //分页信息对象
          let pageInfo = response.pageInfo
          vm.innerTotalPage = pageInfo.totalPage
          vm.innerTotalCount = pageInfo.totalCount
          //数据信息
          vm.innerTableData = response.data
          vm.loading = false
        })
      },
      //重置学生信息查询条件
      reset () {
        this.innerCurrentPage = 1
        const vm = this
        this.itemSelect = 'name'
        this.searchKeys = ''
        let url = this.url_request.ip_port_dev + '/student_check'
        vm.netWorkRequest('post', url, {
          userId: sessionStorage.getItem('id'),
          currentPage: 1,
          count: 100
        }, function (response) {
          //分页信息对象
          let pageInfo = response.pageInfo
          vm.innerTotalPage = pageInfo.totalPage
          vm.innerTotalCount = pageInfo.totalCount
          //数据信息
          vm.innerTableData = response.data
          vm.loading = false
        })
      },
      //每次选中一个则会被添加到selection中
      //取消选中一个则会从selection去掉一个
      selectionSingle (selection, row) {
        this.selections = selection
      },
      //选中所有触发
      selectAll (selection) {
        this.selections = selection
      },
      /**
       * 显示对话框
       * @param what 做什么
       * @param index 数据下标,编辑时候用到
       */
      showDialog (what, index) {
        //bug----重置表单信息
        this.$nextTick(() => {
          this.$refs.dialog_form.resetFields()
        })
        if (what === 0) {
          //显示学生数据
          this.initStudentInfo()
          //新增就改变id为-1,也是更改上次编辑残留的id信息
          this.form.id = -1
          this.form.studentIds = []
          this.dialogFormVisible = true
          this.title = '新增作业信息'
        } else {
          this.title = '编辑作业信息'
          this.dialogFormVisible = true
          const object = Object.assign({}, this.tableData[index])
          this.form = object
        }
      },
      //确定
      enSure () {
        const vm = this
        //上传到服务器
        this.$refs.dialog_form.validate((validate) => {
          if (validate) {
            //遍历选择数据学生的id
            vm.selections.forEach(item => {
              vm.form.studentIds.push(item.id)
            })
            this.$refs.upload.submit()
          } else {
            return false
          }
        })
      },
      //文件上传成功的钩子函数
      success (response, file, fileList) {
        if (response === '成功') {
          this.$message({
            message: '上传成功',
            type: 'success'
          })
        } else {
          this.$message({
            message: '上传失败',
            type: 'error'
          })
        }
        this.form.name = ''
        this.form.describes = ''
        this.form.file = []
        this.dialogFormVisible = false
        this.resetTask()
      },
      //出错
      error (error, file, fileList) {
        this.$message({
          message: '出错了哦，请稍后再试',
          type: 'error'
        })
      },
      search () {
        const vm = this
        let item = this.itemSelect
        let key = this.searchKeys.trim()
        let condition = {
          userId: sessionStorage.getItem('id'),
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
        vm.netWorkRequest('post', url, condition, function (response) {
          //分页信息对象
          let pageInfo = response.data.pageInfo
          vm.totalPage = pageInfo.totalPage
          vm.totalCount = pageInfo.totalCount
          //数据信息
          vm.tableData = response.data.data
          vm.loading = false
        })
      },
      //列的编辑
      column_edit (index) {
        this.showDialog(1, index)
      },
      //列的删除
      column_delete (index) {
        let id = this.tableData[index].id
        const vm = this
        let url = this.url_request.ip_port_dev + '/issue_task_delete'
        vm.myConfirm(null, null, function () {
          vm.netWorkRequest('get', url, {
            id: id
          }, function (response) {
            vm.resetTask()
            vm.$message({
              type: 'success',
              message: response
            })
          })
        })
      },
      download (path) {
        let url = this.url_request.ip_port_dev + '/issue_task_download/'
        window.location.href = url + '?path=' + path
      },
      resetTask () {
        const vm = this
        this.taskName = ''
        this.loading = true
        let url = this.url_request.ip_port_dev + '/issue_task_check'
        vm.currentPage = 1
        vm.netWorkRequest('post', url, {
          userId: sessionStorage.getItem('id'),
          currentPage: 1,
          count: 100
        }, function (response) {
          //分页信息对象
          let pageInfo = response.pageInfo
          vm.totalPage = pageInfo.totalPage
          vm.totalCount = pageInfo.totalCount
          //数据信息
          vm.tableData = response.data
        })
        vm.loading = false
      },
      //根据作业名搜索作业
      searchTask () {
        const vm = this
        vm.currentPage = 1
        let url = this.url_request.ip_port_dev + '/issue_task_check'
        vm.netWorkRequest('post', url, {
          userId: sessionStorage.getItem('id'),
          name: vm.taskName,
          currentPage: 1,
          count: 100
        }, function (response) {
          //分页信息对象
          let pageInfo = response.pageInfo
          vm.totalPage = pageInfo.totalPage
          vm.totalCount = pageInfo.totalCount
          //数据信息
          vm.tableData = response.data
        })
        vm.loading = false
      }
    },
    mounted () {
      this.resetTask()
    }
  }
</script>

<style scoped>
  .toast {
    color: yellow;
    font-weight: bold;
    font-size: 20px;
  }

  .taskName {
    color: white;
    font-weight: bold;
  }
</style>
