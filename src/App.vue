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
    background: url("./assets/image/background_2.jpg") center no-repeat;
    background-size: 100% 100%;
  }

  .icon {
    width: 1em;
    height: 1em;
    vertical-align: -0.15em;
    fill: currentColor;
    overflow: hidden;
    font-size: 30px;
  }
</style>
