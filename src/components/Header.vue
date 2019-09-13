<template>
  <div class="header">
    <span style="margin-right: 300px">
      欢迎您使用智慧教学在线系统
    </span>
    欢迎您:{{name}}
    <span v-if="this.role==='0'">
     同学
    </span>
    <span v-if="this.role==='1'">
      老师
    </span>
    <span v-if="this.role==='2'">
      管理员
    </span>
    <el-link id="logout" :underline="false" @click="logout">退出登陆</el-link>
    <!--<el-button type="danger" @click="logout">退出登录</el-button>-->
  </div>
</template>
<script>
  export default {
    name: 'Header',
    data () {
      return {
        name: '',
        role: ''
      }
    },
    methods: {
      logout () {
        this.$router.push('/login')
      }
    },
    mounted () {
      this.name = sessionStorage.getItem('name')
      this.role = sessionStorage.getItem('role')
    }
  }
</script>

<style>
  .header {
    text-align: center;
    font-size: larger;
    margin: 0;
    padding: 0;
  }

  .el-header {
    background: url("../assets/image/header.png") center no-repeat;
    background-size: 100% 100%;
  }

#logout {
    font-size: large;
    float: right;
  }
</style>


