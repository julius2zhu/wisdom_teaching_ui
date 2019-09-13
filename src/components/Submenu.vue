<template>
  <el-menu :default-openeds="['1']">
    <el-submenu index="1" v-if="hasTeacherRole">
      <template slot="title"><i class="el-icon-message"></i>学生信息管理</template>
      <el-menu-item index="1-1">
        <router-link to="/main/studentInfoCheck">学生信息查看</router-link>
      </el-menu-item>
      <el-menu-item index="1-2">
        <router-link to="/main/studentInfoMaintain">学生信息维护</router-link>
      </el-menu-item>
      <el-menu-item index="1-3">
        <router-link to="/main/studentExport">学生信息导出</router-link>
      </el-menu-item>
      <el-menu-item index="1-4">
        <router-link to="/main/studentInfoImport">学生信息导入</router-link>
      </el-menu-item>
    </el-submenu>
    <el-submenu index="2" v-if="hasTeacherRole">
      <template slot="title"><i class="el-icon-message"></i>学生成绩管理</template>
      <el-menu-item index="2-1">选项1</el-menu-item>
      <el-menu-item index="2-2">选项2</el-menu-item>
    </el-submenu>
    <el-submenu index="3" v-if="hasTeacherRole">
      <template slot="title"><i class="el-icon-message"></i>学生作业管理</template>
      <el-menu-item index="3-1">
        <router-link to="/main/taskManage">作业管理</router-link>
      </el-menu-item>
      <el-menu-item index="3-2">选项2</el-menu-item>
    </el-submenu>
    <el-submenu index="4" v-if="hasTeacherRole">
      <template slot="title"><i class="el-icon-message"></i>课堂管理</template>
      <el-menu-item index="4-1">
        <router-link to="/main/onlineCheckName">在线考勤</router-link>
      </el-menu-item>
      <el-menu-item index="4-2">
        <router-link to="/main/onlineCheckNameCheck">考勤记录查看</router-link>
      </el-menu-item>
    </el-submenu>
    <el-submenu index="5" v-if="hasStudentRole">
      <template slot="title"><i class="el-icon-message"></i>个人作业管理</template>
      <el-menu-item index="5-1">
        <router-link to="/main/studentTaskSubmit">作业提交</router-link>
      </el-menu-item>
      <el-menu-item index="5-2">成绩查看</el-menu-item>
    </el-submenu>
    <el-submenu index="6" v-if="hasStudentRole">
      <template slot="title"><i class="el-icon-message"></i>课前资料查看</template>
      <el-menu-item index="6-1">
        <router-link to="/main/onlineExamination">资料下载</router-link>
      </el-menu-item>
      <el-menu-item index="6-2">成绩查看</el-menu-item>
    </el-submenu>
    <el-submenu index="7" v-if="hasPublicRole">
      <template slot="title"><i class="el-icon-message"></i>个人信息管理</template>
      <el-menu-item index="7-1">
        <router-link to="/main/alterPassWord">个人密码修改</router-link>
      </el-menu-item>
      <el-menu-item index="7-2">选项2</el-menu-item>
    </el-submenu>
    <el-submenu index="8" v-if="hasAdminRole">
      <template slot="title"><i class="el-icon-message"></i>用户信息管理</template>
      <el-menu-item index="8-1">
        <router-link to="/main/userManage">用户信息维护</router-link>
      </el-menu-item>
    </el-submenu>
    <el-submenu index="9" v-if="hasPublicRole">
      <template slot="title"><i class="el-icon-message"></i>关于平台系统</template>
      <el-menu-item index="9-1">关于软件</el-menu-item>
      <el-menu-item index="9-2">特别鸣谢</el-menu-item>
    </el-submenu>
  </el-menu>

</template>
<script>
  export default {
    name: 'submenu',
    data () {
      return {
        //拥有教师的角色
        hasTeacherRole: false,
        //拥有学生的角色
        hasStudentRole: false,
        //拥有管理员的角色
        hasAdminRole: false,
        //一些公共的资源角色,例如个人信息 平台信息
        hasPublicRole: true
      }
    },
    mounted () {
      //获取sessionStorage中用户角色信息
      let role = sessionStorage.getItem('role')
      if (role === '0') {
        this.hasStudentRole = true
      } else if (role === '1') {
        this.hasTeacherRole = true
      } else if (role === '2') {
        this.hasAdminRole = true
      }
    }
  }
</script>

<style scoped>
  a {
    /*取消所有超链接下划线*/
    text-decoration: none;
  }

</style>
