<template>
  <el-form :model="form" :rules="rules" ref="login_form" label-width="100px"
           class="login-form">
    <p>用户注册</p>
    <el-form-item label="用户账号:" prop="username">
      <el-input v-model="form.username" clearable
                placeholder="请输入用户账号"></el-input>
    </el-form-item>
    <el-form-item label="用户密码:" prop="password">
      <el-input v-model="form.password" show-password
                @keyup.enter.native="login" placeholder="请输入用户密码"></el-input>
    </el-form-item>
    <el-form-item label="再次输入:" prop="again">
      <el-input v-model="form.again" show-password
                placeholder="请再次输入密码"></el-input>
    </el-form-item>
    <el-form-item label="姓名:" prop="name">
      <el-input v-model="form.name" show-password
                placeholder="请输入您的姓名"></el-input>
    </el-form-item>
    <el-form-item label="学号:" prop="number">
      <el-input v-model="form.number" show-password
                placeholder="请输入您的学号"></el-input>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="register">立即注册</el-button>
      <el-button @click="reset">重置表单</el-button>
    </el-form-item>
    <el-form-item>
      <router-link class="back" to="/login">返回登陆</router-link>
    </el-form-item>
  </el-form>
</template>
<script>
  export default {
    name: 'Register',
    data () {
      return {
        form: {
          username: '',
          password: '',
          again: '',
          name: '',
          number: ''
        },
        rules: {
          username: [
            {required: true, message: '请输入账号', trigger: 'blur'},
            {min: 6, max: 20, message: '用户账号应在6-20个字符之间', trigger: 'blur'}
          ],
          password: [
            {required: true, message: '请输入密码', trigger: 'blur'},
            {min: 6, max: 20, message: '密码应在6-20个字符之间', trigger: 'blur'}
          ],
          again: [
            {required: true, message: '请再次输入密码', trigger: 'blur'},
            {min: 6, max: 20, message: '密码应在6-20个字符之间', trigger: 'blur'}
          ],
          name: [
            {required: true, message: '请输入您的姓名', trigger: 'blur'},
            {min: 6, max: 20, message: '姓名应在6-10个字符之间', trigger: 'blur'}
          ],
          number: [
            {required: true, message: '请输入您的学号', trigger: 'blur'},
            {min: 6, max: 20, message: '学号应在6-20个字符之间', trigger: 'blur'}
          ]
        }
      }
    },
    methods: {
      register () {
        const vm = this
        const username = this.form.username
        const password = this.form.password
        const role = this.form.role
        this.$refs.login_form.validate((valid) => {
          if (valid) {
            //发送后台进行认证
            this.axios(vm.url_request.ip_port_dev + '/login', {
              method: 'post',
              data: {
                username: username,
                password: password
              }
            }).then(response => {
              let result = response.data.message
              console.log(response.data)
              if (result === vm.login_show.success) {
                vm.$router.replace('/main')
                //隔几秒再发送,因为必须先订阅在发布才可以有效果
              } else {
                this.$message({
                  title: '提示',
                  message: result,
                  type: 'error',
                  center: true
                })
              }
            }).catch(error => {
              this.$message({
                title: '提示',
                message: '系统出错,请稍后再试!',
                type: 'error',
                center: true
              })
            })
          } else {
            return false
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
    width: 50%;
    text-align: center;
    margin: 110px auto;
  }

  .el-input {
    width: 80%;
  }

  .back {
    text-decoration: none;
    font-size: large;
    color: white;
    margin-left: 200px;
  }

  p {
    color: white;
    font-size: 35px;
  }
</style>
