<template>
  <el-form :model="form" :rules="rules" ref="login_form" label-width="100px"
           class="login-form">
    <p>智慧课堂管理系统用户注册</p>
    <el-form-item label="用户账号:" prop="username">
      <el-input v-model="form.username" clearable
                @change="usernameChange" placeholder="请输入用户账号"></el-input>
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
      <el-input v-model="form.name"
                placeholder="请输入您的姓名"></el-input>
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
          username: null,
          password: null,
          again: null,
          name: null,
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
            {min: 2, max: 6, message: '姓名应在2-6个字符之间', trigger: 'blur'}
          ]
        }
      }
    },
    methods: {
      //监听用户输入改变
      usernameChange (value) {
        const vm = this
        const url = vm.url_request.ip_port_dev + '/public_data_query_user'
        if (value.trim().length >= 6) {
          vm.netWorkRequest('get', url, {
            username: value
          }, function (response) {
            if (response !== '') {
              vm.$message.error(response)
            }
          })
        }
      },
      register () {
        const vm = this
        let password = vm.form.password
        let again = vm.form.again
        const url = vm.url_request.ip_port_dev + '/register'
        vm.$refs.login_form.validate((valid) => {
          if (valid) {
            if (password !== again) {
              vm.$message.error('两次密码输入不一致,请检查输入')
              return false
            }
            //进行注册
            vm.netWorkRequest('post', url, {
              name: vm.form.name,
              username: vm.form.username,
              password: password
            }, function (response) {
              vm.$message(response)
            })
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
    margin-left: 200px;
    color: white;
  }

  p {
    color: white;
    font-size: 30px;
    margin-left: 80px;
    letter-spacing: 5px;
    font-weight: bold;
  }
</style>
