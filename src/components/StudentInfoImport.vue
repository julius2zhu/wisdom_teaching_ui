<template>
  <!--学生信息导入-->
  <div>
    <el-upload class="upload-class" ref="upload" drag
               :action="uploadUrl"
               :on-change="beforeAvatarUpload"
               :limit="1" :file-list="file" :auto-upload="false" :on-success="success"
               :on-error="error" :on-progress="progress" :data="form">
      <br/>
      <el-link type="primary" @click="downloadTemplate">
        <i class="el-icon-download"></i>下载模板和使用说明
      </el-link>
      <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
      <br/>
      <el-button style="margin: 10px 10px;" size="small" type="success" @click="submitUpload">上传到服务器</el-button>
      <div slot="tip" class="el-upload__tip">只能上传xlsx文件</div>
    </el-upload>
    <!--弹窗-->
    <el-dialog
      title="提示" :visible.sync="dialogVisible" width="20%" center>
      <span>数据正在导入中,请勿关闭浏览器或者断开网络...</span>
    </el-dialog>
  </div>
</template>

<script>
  export default {
    data () {
      return {
        file: [],
        uploadUrl: '',
        dialogVisible: false,
        form: {
          teacherName: sessionStorage.getItem('name')
        }
      }
    },
    methods: {
      downloadTemplate () {
        window.location.href = this.url_request.ip_port_dev
          + '/public_data_resources_download?id=1'
      },
      submitUpload () {
        this.$refs.upload.submit()
      },
      beforeAvatarUpload (file) {
        this.uploadUrl = this.url_request.ip_port_dev + '/upload_template'
        const name = file.name
        const index = name.lastIndexOf('.')
        const suffix = name.slice(index + 1)
        if (!(suffix === 'xlsx')) {
          this.$message.error('上传文件只能是 xlsx 格式!')
          this.file = []
        }
      },
      //上传中
      progress (params) {
        this.dialogVisible = true
      },
      //成功
      success (params) {
        this.dialogVisible = false
        this.$message({
          showClose: true,
          message: '数据导入成功!',
          type: 'success'
        })
        this.file = []
      },
      //失败
      error (params) {
        this.dialogVisible = false
        this.$message.error('数据导入出错,请稍后再试!')
        this.file = []
      }
    }
  }
</script>

<style scoped>
  .upload-class {
    margin-top: 20px;
  }

  .el-upload__tip {
    color: red;
  }

  .progress {
    margin-left: 50px;
  }

  #toast {
    margin-top: 30px;
    color: red;
    font-size: larger;
  }
</style>
