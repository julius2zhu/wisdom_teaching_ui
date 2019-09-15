<template>
  <!--公共资源上传与管理-->
  <div>
    <div class="header">
      <el-button type="primary" @click="upload">上传<i class="el-icon-upload el-icon--right"></i>
      </el-button>
    </div>
    <!--表格主体内容部分 设置max-height需要设置height 否则不起作用-->
    <el-table :data="tableData" stripe border max-height="500" height="450"
              v-loading="loading" element-loading-text="拼命加载中"
              element-loading-spinner="el-icon-loading"
              element-loading-background="rgba(0, 0, 0, 0.8)" class="tableClass">
      <el-table-column label="序号" type="index" width="50"/>
      <el-table-column align="center" prop="name" label="资源名称"/>
      <el-table-column align="center" prop="describes" label="描述信息"/>
      <el-table-column align="center" prop="createDate" label="上传时间"/>
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
    <el-dialog center :title="title" :visible.sync="dialogFormVisible">
      <el-form ref="dialog_form" :model="form" :rules="rules" :label-width="formLabelWidth">
        <el-form-item label="资源名称:" prop="name">
          <el-input v-model="form.name" placeholder="请输入资源名称" show-word-limit
                    maxlength="20"></el-input>
        </el-form-item>
        <el-form-item label="描述信息:" prop="describes">
          <el-input
            type="textarea" :autosize="{ minRows: 2, maxRows: 4}"
            placeholder="请输入描述信息" show-word-limit maxlength="200"
            v-model="form.describes">
          </el-input>
        </el-form-item>
        <el-form-item>
          <el-upload class="upload-demo" ref="upload" :action="url" :file-list="form.file"
                     :auto-upload="false" :limit="1"
                     :on-success="success" :on-error="error" :data="form">
            <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
            <div style="color: yellow;font-size: large" slot="tip" class="el-upload__tip">
              单次文件上传不能超过10MB
            </div>
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="ok">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  export default {
    name: 'PublicResourcesUpload',
    data () {
      return {
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
        dialogFormVisible: false,
        title: '新增资源',
        formLabelWidth: '150px',
        form: {
          id: -1,
          name: null,
          describes: null,
          file: [],
          username: sessionStorage.getItem('username')
        },
        url: this.url_request.ip_port_dev + '/resources_add',
        rules: {
          name: [
            {required: true, message: '请输入资源名称', trigger: 'blur'},
            {min: 3, max: 20, message: '资源名称应在3-20个字符之间', trigger: 'blur'}
          ],
          describes: [
            {required: true, message: '请输入描述信息', trigger: 'blur'},
            {min: 1, max: 200, message: '描述信息应在1-200个字符之间', trigger: 'blur'}
          ]
        }
      }
    },
    methods: {
      handleSizeChange (val) {
        this.count = val
        this.search()
      },
      handleCurrentChange (val) {
        this.currentPage = val
        this.search()
      },
      column_delete (index) {
        const vm = this
        const id = vm.tableData[index].id
        const url = vm.url_request.ip_port_dev + '/resources_delete'
        vm.netWorkRequest('post', url, {id: id}, function (response) {
          vm.myConfirm(null, null, function () {
            vm.$message(response)
            vm.reset()
          })
        })
      },
      column_edit (index) {
        const vm = this
        const obj = Object.assign({}, vm.tableData[index])
        vm.form = obj
        vm.dialogFormVisible = true
        vm.title = '编辑资源'
      },
      upload () {
        this.dialogFormVisible = true
        this.$nextTick(() => {
          this.$refs.dialog_form.resetFields()
        })
        this.title = '新增资源'
        this.form.id = -1
        this.form.name = ''
        this.form.describes = ''
        this.form.file = []
      },
      ok () {
        const vm = this
        const id = vm.form.id
        vm.$refs.dialog_form.validate((validate) => {
          if (validate) {
            vm.$refs.upload.submit()
          } else {
            return false
          }
        })
      },
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
        this.reset()
      },
      //出错
      error (error, file, fileList) {
        this.$message({
          message: '出错了哦，请稍后再试',
          type: 'error'
        })
      },
      //搜索信息
      search () {
        const vm = this
        let url = vm.url_request.ip_port_dev + '/public_data_query_resources'
        vm.netWorkRequest('post', url, {
          username: sessionStorage.getItem('username'),
          currentPage: vm.currentPage,
          count: vm.count
        }, function (response) {
          vm.tableData = response.data
          let pageInfo = response.pageInfo
          vm.totalCount = pageInfo.totalCount
          vm.totalPage = pageInfo.totalPage
          vm.loading = false
        })
      },
      reset () {
        const vm = this
        const url = vm.url_request.ip_port_dev + '/public_data_query_resources'
        vm.netWorkRequest('post', url, {
          username: sessionStorage.getItem('username'),
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
      }
    },
    mounted () {
      this.reset()
    }
  }
</script>

<style scoped>
  .header {
    text-align: left;
  }

  .tableClass {
    margin-top: 10px;
  }
</style>
