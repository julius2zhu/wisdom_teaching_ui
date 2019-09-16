<template>
  <!--作业管理：
  包括教师发布作业
  修改删除作业
  -->
  <div>
    <el-button  plain @click="showDialog(0)">
      <i class="el-icon-plus"></i>发布作业
    </el-button>
    <el-table :data="tableData" stripe border max-height="500" height="450"
              v-loading="loading" element-loading-text="拼命加载中"
              element-loading-spinner="el-icon-loading"
              element-loading-background="rgba(0, 0, 0, 0.8">
      <el-table-column label="序号" type="index" width="50"/>
      <el-table-column align="center" prop="name" label="作业名称"/>
      <el-table-column align="center" prop="describes" label="描述信息"/>
      <el-table-column align="center" prop="createDate" label="发布时间"/>
      <el-table-column type="expand" label="下载">
        <template slot-scope="props">
          附件下载:
          <el-button circle icon="el-icon-link" @click="download(props.row.path)">
          </el-button>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <el-button size="mini"  @click="column_edit(scope.$index)">
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
          <el-input v-model="form.name"/>
        </el-form-item>
        <el-form-item label="作业描述:" prop="describes">
          <el-input v-model="form.describes"/>
        </el-form-item>
        <el-form-item label="选择文件:" prop="file">
          <el-upload
            class="upload-demo" ref="upload" :action="url"
            :file-list="form.file" :limit="1" :data="form" :auto-upload="false"
            :on-success="success" :on-error="error">
            <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
          </el-upload>
        </el-form-item>
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
        searchCondition: [
          {value: 'name', label: '用户姓名'},
          {value: 'username', label: '用户账号'},
          {value: 'state', label: '用户状态'},
        ],
        loading: true,
        tableData: [],
        //当前页
        currentPage: 1,
        //总页数
        totalPage: 1,
        counts:
          [100, 200, 300, 400, 500],
        //每页显示的条数
        count: 100,
        //总条数
        totalCount: 1,
        //搜索下拉框选项
        itemSelect: 'name',
        searchKeys: '',
        url: this.url_request.ip_port_dev + '/issue_task',
        dialogFormVisible: false,
        form: {
          id: -1,
          name: '',
          describes: '',
          teacherName: sessionStorage.getItem('name'),
          file: []
        },
        title: '新增作业',
        rules: {
          name: [
            {required: true, message: '请输入作业名称', trigger: 'blur'},
            {min: 6, max: 20, message: '作业名称应在6-20个字符之间', trigger: 'blur'}
          ],
          describes: [
            {required: true, message: '请输入作业描述信息', trigger: 'blur'},
            {min: 3, max: 100, message: '作业名称应在3-100个字符之间', trigger: 'blur'}
          ]
        }
      }
    },
    methods: {
      /**
       * 显示对话框
       * @param what 做什么
       * @param index 数据下标,编辑时候用到
       */
      showDialog (what, index) {
        if (what === 0) {
          //新增就改变id为-1,也是更改上次编辑残留的id信息
          this.form.id = -1
          this.form.name = ''
          this.form.describes = ''
          this.form.file = []
          this.dialogFormVisible = true
        } else {
          this.title = '编辑作业信息'
          this.form.file = []
          this.dialogFormVisible = true
          const object = Object.assign({}, this.tableData[index])
          this.form = object
        }
      },
      //确定
      enSure () {
        //上传到服务器
        this.$refs.dialog_form.validate((validate) => {
          if (validate) {
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
        this.file = []
        this.dialogFormVisible = false
        this.reset()
      },
      //出错
      error (error, file, fileList) {
        this.$message({
          message: '出错了哦，请稍后再试',
          type: 'error'
        })
      },
      handleSizeChange (val) {
        this.count = val
        this.search()
      },
      handleCurrentChange (val) {
        //将改变后的页数赋值给当前页
        this.currentPage = val
        this.search()
      },
      //查询学生信息
      search () {
        const vm = this
        let item = this.itemSelect
        let key = this.searchKeys.trim()
        let condition = {
          teacherName: sessionStorage.getItem('name'),
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
      //重置查询条件
      reset () {
        const vm = this
        this.itemSelect = 'name'
        this.searchKeys = ''
        this.loading = true
        let url = this.url_request.ip_port_dev + '/issue_task_check'
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
        })
        vm.loading = false
      },
      //列的编辑
      column_edit (index) {
        this.showDialog(1, index)
      },
      //列的删除
      column_delete (index) {
        let id = this.tableData[index].id
        const vm = this
        let url = this.url_request.ip_port_dev + '/issue_task_delete/'
        vm.myConfirm(null, null, function () {
          vm.netWorkRequest('get', url, {
            id: id
          }, function (response) {
            vm.reset()
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
      }
    },
    mounted () {
      this.reset()
    }
  }
</script>

<style scoped>

</style>
