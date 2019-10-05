<template>
  <div>
    <el-form :model="form" :rules="rules" ref="login_form" label-width="100px"
             class="login-form">
      <p>智慧课堂管理系统用户登录</p>
      <el-form-item label="用户账号:" prop="username">
        <el-input v-model="form.username" clearable
                  prefix-icon="my-icon-user" placeholder="请输入用户账号"/>
      </el-form-item>
      <el-form-item class="my-font-color-white" label="用户密码:" prop="password">
        <el-input v-model="form.password" show-password
                  prefix-icon="my-icon-password"
                  @keyup.enter.native="login" placeholder="请输入用户密码"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="login">立即登录</el-button>
        <el-button @click="reset">重置表单</el-button>
        <el-tooltip class="item" effect="dark" content="请联系管理员进行找回" placement="top-start">
          <el-button>忘记密码</el-button>
        </el-tooltip>
      </el-form-item>
      <el-form-item>
        <router-link class="register" to="/register">新用户注册</router-link>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
  export default {
    name: 'Login',
    data () {
      return {
        form: {
          username: '',
          password: ''
        },
        info_form: {
          username: '',
          number: '',
          mobile: '',
          email: ''
        },
        visible: false,
        rules: {
          username: [
            {required: true, message: '请输入账号', trigger: 'blur'},
            {min: 6, max: 20, message: '用户账号应在6-20个字符之间', trigger: 'blur'}
          ],
          password: [
            {required: true, message: '请输入密码', trigger: 'blur'},
            {min: 6, max: 20, message: '密码应在6-20个字符之间', trigger: 'blur'}
          ]
        },
        dialogFormVisible: false
      }
    },
    methods: {
      login () {
        const vm = this
        const username = this.form.username
        const password = this.form.password
        this.$refs.login_form.validate((valid) => {
          if (valid) {
            this.netWorkRequest('post', vm.url_request.ip_port_dev + '/login',
              {username: username, password: password},
              function (response) {
                let result = response.message
                let role = response.role
                let name = response.name
                let id = response.id
                if (result === vm.login_show.success) {
                  vm.$router.replace('/main')
                  //存储数据,窗口关闭会自动销毁,临时存储下
                  sessionStorage.setItem('id', id)
                  sessionStorage.setItem('username', username)
                  sessionStorage.setItem('name', name)
                  sessionStorage.setItem('role', role)
                } else {
                  vm.$message({
                    title: '提示',
                    message: result,
                    type: 'error',
                    center: true
                  })
                }
              }
            )
          } else {
            return false
          }
        })
      },
      reset () {
        this.$refs.login_form.resetFields()
      },
      //自助找回密码
      ownRetrieve () {
        this.dialogFormVisible = true
      },
      //人工找回,直接就是两个弹框
      personRetrieve () {
        this.dialogFormVisible = true
      }
    }
  }
</script>

<style scoped>
  .login-form {
    width: 50%;
    text-align: center;
    margin: 140px auto;
  }

  .el-input {
    width: 80%;
  }

  .register {
    text-decoration: none;
    font-size: large;
    color: white;
  }

  .toast {
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

