<template>
  <el-form :model="form" :rules="rules" ref="login_form" label-width="100px"
           class="login-form">
    <p class="title">密码修改</p>
    <el-form-item label="旧的密码:" prop="oldPass">
      <el-input v-model="form.oldPass" show-password
                placeholder="请输入旧的密码"></el-input>
    </el-form-item>
    <el-form-item label="新的密码:" prop="newPass">
      <el-input v-model="form.newPass" show-password
                placeholder="请输入新的密码"></el-input>
    </el-form-item>
    <el-form-item label="确认密码:" prop="againPass">
      <el-input v-model="form.againPass" show-password
                placeholder="请再次输入密码"></el-input>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="alter">确定修改</el-button>
      <el-button @click="reset">重置表单</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
  export default {
    name: 'AlterPassWord',
    data () {
      return {
        form: {
          oldPass: '',
          againPass: '',
          newPass: '',
        },
        rules: {
          oldPass: [
            {required: true, message: '请输入旧的密码', trigger: 'blur'},
            {min: 6, max: 20, message: '密码应在6-20个字符之间', trigger: 'blur'}
          ],
          newPass: [
            {required: true, message: '请输新的密码', trigger: 'blur'},
            {min: 6, max: 20, message: '密码应在6-20个字符之间', trigger: 'blur'}
          ],
          againPass: [
            {required: true, message: '请再次输入密码', trigger: 'blur'},
            {min: 6, max: 20, message: '密码应在6-20个字符之间', trigger: 'blur'}
          ]
        }
      }
    },
    methods: {
      alter () {
        let vm = this
        const oldPass = this.form.oldPass
        const newPass = this.form.newPass
        const againPass = this.form.againPass
        this.$refs.login_form.validate((valid) => {
          if (valid) {
            if (newPass !== againPass) {
              this.$message.error('两次密码输入不一致,请检查输入')
            } else {
              const url = vm.url_request.ip_port_dev + '/alter_password'
              //发送后台进行认证
              vm.netWorkRequest('post', url, {
                username: sessionStorage.getItem('username'),
                password: oldPass,
                newPassWord: newPass
              }, function (response) {
                let type = 'success'
                if (response === '失败') {
                  type = 'error'
                }
                vm.$message({
                  type: type,
                  message: response
                })
              })
            }
          }
        })
      },
      reset () {
        this.$refs.login_form.resetFields()
      }
    }
  }
</script>

<style scoped>
  .login-form {
    width: 40%;
    text-align: center;
    margin: 50px auto;
  }

  .el-input {
    width: 80%;
  }

  .title {
    color: white;
    font-size: 30px;
  }
</style>
