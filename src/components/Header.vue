<template>
  <div class="header">
    <span class="left">
      欢迎您使用智慧教学在线系统
    </span>
    欢迎您:{{name}}
    您的角色:
    <span v-if="this.role==='0'">
      学生
    </span>
    <span v-if="this.role==='1'">
      教师
    </span>
    <span v-if="this.role==='2'">
      管理员
    </span>
    <el-button type="danger" @click="logout">退出登录</el-button>
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

<style scoped>
  .header {
    text-align: center;
    /*color: #13ce66;*/
    font-size: larger;
    /*background-color: #13ce66;*/
    margin: 0;
    padding: 0;
  }

  .left {
    margin-right: 600px;
  }

</style>
