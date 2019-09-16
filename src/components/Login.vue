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
        <el-popover placement="top" width="160" v-model="visible">
          <p class="toast">平台提供验证信息自助找回以及人工协助找回密码</p>
          <div style="text-align: right; margin: 0">
            <el-button size="mini" type="text" @click="ownRetrieve">自助找回</el-button>
            <el-button type="primary" size="mini" @click="personRetrieve">人工找回</el-button>
          </div>
          <el-button slot="reference">忘记密码</el-button>
        </el-popover>
      </el-form-item>
      <el-form-item>
        <router-link class="register" to="/register">新用户注册</router-link>
      </el-form-item>
    </el-form>
    <!--弹窗找回密码-->
    <el-dialog title="找回密码" :visible.sync="dialogFormVisible">
      <el-form :model="info_form">
        <el-form-item label="用户账号" label-width="100px">
          <el-input v-model="info_form.username" autocomplete="off"/>
        </el-form-item>
        <el-form-item label="预留手机号" label-width="100px">
          <el-input v-model="info_form.mobile" autocomplete="off"/>
        </el-form-item>
        <el-form-item label="学生证号:" label-width="100px">
          <el-input v-model="info_form.number" autocomplete="off"/>
        </el-form-item>
        <el-form-item label="邮箱:" label-width="100px">
          <el-input v-model="info_form.email" autocomplete="off"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogFormVisible = false">确 定</el-button>
      </div>
    </el-dialog>
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
                if (result === vm.login_show.success) {
                  vm.$router.replace('/main')
                  //存储数据,窗口关闭会自动销毁,临时存储下
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

