<template>
  <div class="demo-image">
    <span class="block" v-for="fit in fits" :key="fit">
      <span class="demonstration">{{ fit }}</span>
      <el-image
        style="width: 100px; height: 100px"
        :src="url"
        :fit="fit"></el-image>
    </span>
  </div>
</template>

<script>
  export default {
    name: 'Welcome',
    data(){
      return{
        fits: ['fill', 'contain', 'cover', 'none', 'scale-down'],
        url: 'https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg'
      }
    }
  }
</script>

<style scoped>
  div {
    color: white;
    font-size: large;
  }

  ol li {
    line-height: 30px;
  }
</style>
