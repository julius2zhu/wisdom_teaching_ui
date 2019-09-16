<template>
  <div class="header">
    <span id="toast">
      智慧课堂管理系统
    </span>
    <span id="content">
      欢迎您:{{name}}
      <span v-if="role==='0'">
     同学
    </span>
      <span v-if="role==='1'">
      老师
    </span>
      <span v-if="role==='2'">
      管理员
    </span>
      </span>
    <span id="logout">
       <el-link :underline="false" @click="logout">
      <svg class="icon" aria-hidden="true">
        <use xlink:href="#icon-tuichu1"></use>
      </svg></el-link>
    </span>
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

  body {
    margin: 0;
  }

  .el-header {
    background: url("../assets/image/header.png") center no-repeat;
    background-size: 100% 100%;
  }

  #logout {
    font-size: large;
    float: right;
  }

  #toast {
    margin-right: 420px;
    color: white;
    font-size: 35px;
    line-height: 60px;
  }

  #content {
    color: white;
  }

  #logout {
    line-height: 60px;
    margin-right: 20px;
  }
</style>


