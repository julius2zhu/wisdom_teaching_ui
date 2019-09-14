<template>
  <!--学生自己作业提交-->
  <div>
    <el-table :data="tableData" stripe border max-height="500" height="450"
              v-loading="loading" element-loading-text="拼命加载中"
              element-loading-spinner="el-icon-loading"
              element-loading-background="rgba(0, 0, 0, 0.8">
      <el-table-column label="序号" type="index" width="50"/>
      <el-table-column align="center" prop="homeWork.name" label="作业名称"/>
      <el-table-column align="center" prop="homeWork.describes" label="描述信息"/>
      <el-table-column align="center" prop="homeWork.teacherName" label="发布教师"/>
      <el-table-column align="center" label="提交状态">
        <template slot-scope="props">
          <span style="color:red;" v-if="props.row.submitState==='0'">
            未提交
          </span>
          <span style="color:green;" v-else>
            已提交
          </span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <el-upload
            class="upload-demo" ref="upload" :action="action" :file-list="file"
            :auto-upload="true" :data="form"
            :on-success="success" :on-error="error">
            <el-button @click="column_submit(scope.$index)" slot="trigger" size="small" type="primary">上传</el-button>
          </el-upload>
          <el-button size="mini" type="danger" @click="column_download(scope.$index)">下载
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <!--页脚分页,这个一般直接交给框架去做自动分页-->
    <div class="table_footer">
      <el-pagination background
                     layout="total, sizes, prev, pager, next, jumper">
      </el-pagination>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'StudentTaskSubmit',
    data () {
      return {
        //上传的文件
        file: [],
        //上传的地址
        action: this.url_request.ip_port_dev + '/student_task_submit_upload',
        //上传携带的额外数据
        form: {
          id: -1
        },
        tableData: [],
        currentPage: 1,
        count: 100,
        loading: true
      }
    },
    methods: {
      column_submit (index) {
        //获取点击作业的该条主键id
        const id = this.tableData[index].id
        this.form.id = id
      },
      //文件上传成功的钩子函数
      success (response) {
        if (response === '成功') {
          this.$message({
            message: '提交成功',
            type: 'success'
          })
        } else {
          this.$message({
            message: '提交失败',
            type: 'error'
          })
        }
        this.file = []
        this.reset()
      },
      //出错
      error () {
        this.$message({
          message: '出错了哦，请稍后再试',
          type: 'error'
        })
      },
      column_download (index) {
        //获取下载路径
        const downloadUrl = this.tableData[index].homeWork.path
        const url = this.url_request.ip_port_dev + '/issue_task_download/'
        window.location.href = url + '?path=' + downloadUrl
      },
      //主要负责重置数显页面
      reset () {
        const vm = this
        let url = vm.url_request.ip_port_dev + '/student_task_submit_check'
        vm.netWorkRequest('post', url, {
          username: sessionStorage.getItem('username'),
          currentPage: 1,
          count: 100
        }, function (response) {
          //分页信息对象
          let pageInfo = response.pageInfo
          vm.currentPage = pageInfo.currentPage
          vm.totalPage = pageInfo.totalPage
          vm.count = pageInfo.count
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
  .table_footer {
    text-align: center;
  }
</style>
