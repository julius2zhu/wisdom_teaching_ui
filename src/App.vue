<template>
  <div>
    <router-view/>
  </div>
</template>

<script>
  export default {
    name: 'App'
  }
</script>
<!--不能使用scope作用域-->
<style>
  html {
    /*background-image: url("./assets/image/background.jpg");*/
    /*background-repeat: no-repeat;*/
    background: url("./assets/image/background.jpg") center no-repeat;
    background-size: 100% 100%;
  }
</style>
