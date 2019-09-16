<template>
  <!--在线考试管理-->
  <div>
    <span class="name">课程名称:</span>
    <el-select v-model="value" placeholder="请选择">
      <el-option
        v-for="item in options"
        :key="item.value"
        :label="item.label"
        :value="item.value">
      </el-option>
    </el-select>
    <!--显示课程的相关信息-->
    <div style="color: white;">
      课程名称:java程序设计<br/>
      课程编号:02335<br/>
      <el-button plain>单选题</el-button>
      <el-button plain>多选题</el-button>
      <el-button plain>简答题</el-button>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'CoursesManage'
  }
</script>

<style scoped>
  .name {
    color: white;
    font-size: 25px;
  }
</style>
