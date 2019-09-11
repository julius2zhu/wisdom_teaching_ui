<template>
  <div>
    <el-upload class="upload-class" ref="upload" drag
               :action="uploadUrl"
               :on-change="beforeAvatarUpload"
               :limit="1" :file-list="fileList"
               :auto-upload="false"
               :on-success="success"
               :on-error="error"
               :on-progress="progress">
      <br/>
      <el-link :href="downloadTemplate" type="primary" target="_blank">
      <span id="toast">
        下载导入模板和说明文档
      </span>
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
        fileList: [],
        uploadUrl: '',
        dialogVisible: false,
        downloadTemplate: 'student_info_manage/download_template?fileName=template.zip'
      }
    },
    methods: {
      submitUpload () {
        this.$refs.upload.submit()
      },
      beforeAvatarUpload (file) {
        this.uploadUrl = this.url_request.ip_port_dev + this.url_request.root_request + '/upload_template'
        const name = file.name
        const index = name.lastIndexOf('.')
        const suffix = name.slice(index + 1)
        if (!(suffix === 'xlsx')) {
          this.$message.error('上传文件只能是 xlsx 格式!')
          this.fileList = []
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
      },
      //失败
      error (params) {
        this.dialogVisible = false
        this.$message.error('数据导入出错,请稍后再试!')
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
