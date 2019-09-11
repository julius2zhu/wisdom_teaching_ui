<template>
  <div>
    <el-container>
      <el-header>
        <Header/>
      </el-header>

      <el-container>
        <el-aside class="aside" style="width: 15%;">
          <Submenu/>
        </el-aside>

        <el-container>
          <el-main>
            <router-view></router-view>
          </el-main>
          <!--去掉页脚,增大空间的显示-->
          <!--<el-footer>-->
            <!--<Footer/>-->
          <!--</el-footer>-->
        </el-container>
      </el-container>
    </el-container>
  </div>
</template>

<script>
  import Header from './Header'
  import Footer from './Footer'
  import Submenu from './Submenu'

  export default {
    name: 'Main',
    components: {
      Header, Footer, Submenu
    }
  }
</script>

<style>
  .el-main {
    padding: 0 0 0 5px;
  }

  .el-header {
    padding: 0 0 0 0;
  }
</style>
