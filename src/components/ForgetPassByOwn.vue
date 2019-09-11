<template>
  <div>
    自助找回密码<br/>
    <router-link class="back" to="/login">返回登陆界面</router-link>
  </div>
</template>

<script>
  export default {
    name: 'ForgetPassByOwn'
  }
</script>

<style scoped>
  .back {
    text-decoration: none;
  }
  html{
    width: 100%;
    height: 100%;
  }
</style>
