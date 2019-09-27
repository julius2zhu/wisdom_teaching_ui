<template>
  <el-menu :default-openeds="['6','7','8','9','10']">
    <el-submenu index="1" v-if="hasTeacherRole">
      <template slot="title">
        <svg class="icon" aria-hidden="true">
          <use xlink:href="#icon-xueshengxinxi"></use>
        </svg>
        <span class="sub-item">学生信息管理</span>
      </template>
      <el-menu-item index="1-1">
        <svg class="icon" aria-hidden="true">
          <use xlink:href="#icon-chakan"></use>
        </svg>
        <router-link to="/main/studentInfoCheck">学生信息查看</router-link>
      </el-menu-item>
      <el-menu-item index="1-2">
        <svg class="icon" aria-hidden="true">
          <use xlink:href="#icon-xinxiweihu"></use>
        </svg>
        <router-link to="/main/studentInfoMaintain">学生信息维护</router-link>
      </el-menu-item>
      <el-menu-item index="1-3">
        <svg class="icon" aria-hidden="true">
          <use xlink:href="#icon-daochu"></use>
        </svg>
        <router-link to="/main/studentExport">学生信息导出</router-link>
      </el-menu-item>
      <el-menu-item index="1-4">
        <svg class="icon" aria-hidden="true">
          <use xlink:href="#icon-daoru"></use>
        </svg>
        <router-link to="/main/studentInfoImport">学生信息导入</router-link>
      </el-menu-item>
    </el-submenu>
    <el-submenu index="3" v-if="hasTeacherRole">
      <template slot="title">
        <svg class="icon" aria-hidden="true">
          <use xlink:href="#icon-xueshengzuoye"></use>
        </svg>
        <span class="sub-item">学生作业管理</span>
      </template>
      <el-menu-item index="3-1">
        <svg class="icon" aria-hidden="true">
          <use xlink:href="#icon-fabuzuoye"></use>
        </svg>
        <router-link to="/main/taskManage">发布作业信息</router-link>
      </el-menu-item>
      <el-menu-item index="3-2">
        <svg class="icon" aria-hidden="true">
          <use xlink:href="#icon-guanchajiluchakan"></use>
        </svg>
        <router-link to="/main/taskSubmitCheck">提交情况查看</router-link>
      </el-menu-item>
    </el-submenu>
    <el-submenu index="4" v-if="hasTeacherRole">
      <template slot="title">
        <svg class="icon" aria-hidden="true">
          <use xlink:href="#icon-ketang"></use>
        </svg>
        <span class="sub-item">课堂信息管理</span>
      </template>
      <el-menu-item index="4-1">
        <svg class="icon" aria-hidden="true">
          <use xlink:href="#icon-kaoqinguanli-copy"></use>
        </svg>
        <router-link to="/main/onlineCheckName">学生在线考勤</router-link>
      </el-menu-item>
      <el-menu-item index="4-2">
        <svg class="icon" aria-hidden="true">
          <use xlink:href="#icon-chakan"></use>
        </svg>
        <router-link to="/main/onlineCheckNameCheck">考勤记录查看</router-link>
      </el-menu-item>
    </el-submenu>
    <el-submenu index="5" v-if="hasTeacherRole">
      <template slot="title">
        <svg class="icon" aria-hidden="true">
          <use xlink:href="#icon-kaoshi2"></use>
        </svg>
        <span class="sub-item">在线考试管理</span>
      </template>
      <el-menu-item index="5-1">
        <svg class="icon" aria-hidden="true">
          <use xlink:href="#icon-shijuan"></use>
        </svg>
        <router-link to="/main/onlineExaminationAdd">在线试题导入</router-link>
      </el-menu-item>
      <el-menu-item index="5-2">
        <svg class="icon" aria-hidden="true">
          <use xlink:href="#icon-shijuanguanli"></use>
        </svg>
        <router-link to="/main/onlineExaminationManage">在线试题管理</router-link>
      </el-menu-item>
      <el-menu-item index="5-2">
        <svg class="icon" aria-hidden="true">
          <use xlink:href="#icon-shijuanguanli1"></use>
        </svg>
        <router-link to="/main/onlineExaminationManage">在线组卷管理</router-link>
      </el-menu-item>
    </el-submenu>
    <el-submenu index="6" v-if="hasStudentRole">
      <template slot="title">
        <svg class="icon" aria-hidden="true">
          <use xlink:href="#icon-zuoye"></use>
        </svg>
        <span class="sub-item">个人作业管理</span>
      </template>
      <el-menu-item index="6-1">
        <svg class="icon" aria-hidden="true">
          <use xlink:href="#icon-tijiao"></use>
        </svg>
        <router-link to="/main/studentTaskSubmit">作业提交</router-link>
      </el-menu-item>
      <el-menu-item index="6-2">
        <svg class="icon" aria-hidden="true">
          <use xlink:href="#icon-chengjichakan"></use>
        </svg>
        <router-link to="/main/studentTaskScoreCheck">
          成绩查看
        </router-link>
      </el-menu-item>
    </el-submenu>
    <el-submenu index="7" v-if="hasStudentRole">
      <template slot="title">
        <svg class="icon" aria-hidden="true">
          <use xlink:href="#icon-kaoshi2"></use>
        </svg>
        <span class="sub-item">
          在线试卷题库
        </span>
      </template>
      <el-menu-item index="7-1">
        <svg class="icon" aria-hidden="true">
          <use xlink:href="#icon-kaoshi"></use>
        </svg>
        <router-link to="/main/onlineExamination">在线考试</router-link>
      </el-menu-item>
    </el-submenu>

    <el-submenu index="8" v-if="hasAdminRole">
      <template slot="title">
        <svg class="icon" aria-hidden="true">
          <use xlink:href="#icon-yonghu"></use>
        </svg>
        <span class="sub-item">用户信息管理</span>
      </template>
      <el-menu-item index="8-1">
        <svg class="icon" aria-hidden="true">
          <use xlink:href="#icon-xinxiweihu"></use>
        </svg>
        <router-link to="/main/userManage">用户信息维护</router-link>
      </el-menu-item>
    </el-submenu>

    <el-submenu index="9" v-if="hasAdminRole">
      <template slot="title">
        <svg class="icon" aria-hidden="true">
          <use xlink:href="#icon-kecheng"></use>
        </svg>
        <span class="sub-item">课程信息管理</span>
      </template>
      <el-menu-item index="9-1">
        <svg class="icon" aria-hidden="true">
          <use xlink:href="#icon-xinxiweihu"></use>
        </svg>
        <router-link to="/main/courseManage">课程信息维护</router-link>
      </el-menu-item>
    </el-submenu>
    <el-submenu index="10" v-if="hasPublicRole">
      <template slot="title">
        <svg class="icon" aria-hidden="true">
          <use xlink:href="#icon-ziliaoku"></use>
        </svg>
        <span class="sub-item">资源信息管理</span>
      </template>
      <el-menu-item index="10-1">
        <svg class="icon" aria-hidden="true">
          <use xlink:href="#icon-ziyuanchaxun-hover"></use>
        </svg>
        <router-link to="/main/publicResourcesSearch">
          公共资源查询
        </router-link>
      </el-menu-item>
      <el-menu-item index="10-2">
        <svg class="icon" aria-hidden="true">
          <use xlink:href="#icon-shangchuan"></use>
        </svg>
        <router-link to="/main/publicResourcesUpload">
          公共资源上传
        </router-link>
      </el-menu-item>
    </el-submenu>
    <el-submenu index="11" v-if="hasPublicRole">
      <template slot="title">
        <svg class="icon" aria-hidden="true">
          <use xlink:href="#icon-gerenxinxi"></use>
        </svg>
        <span class="sub-item">个人信息管理</span>
      </template>
      <el-menu-item index="11-1">
        <svg class="icon" aria-hidden="true">
          <use xlink:href="#icon-mimaxiugai"></use>
        </svg>
        <router-link to="/main/alterPassWord">个人密码修改</router-link>
      </el-menu-item>
      <el-menu-item index="11-1">
        <svg class="icon" aria-hidden="true">
          <use xlink:href="#icon-xinxibiangeng"></use>
        </svg>
        <router-link to="/main/personInfoAlter">个人信息完善</router-link>
      </el-menu-item>
    </el-submenu>
    <el-submenu index="12" v-if="hasPublicRole">
      <template slot="title">
        <svg class="icon" aria-hidden="true">
          <use xlink:href="#icon-xitong"></use>
        </svg>
        <span class="sub-item">关于平台系统</span>
      </template>
      <el-menu-item index="12-1">
        <svg class="icon" aria-hidden="true">
          <use xlink:href="#icon-shezhiguanyuruanjian"></use>
        </svg>
        <router-link to="/main/aboutSystem">关于软件</router-link>
      </el-menu-item>
      <el-menu-item index="12-2">
        <svg class="icon" aria-hidden="true">
          <use xlink:href="#icon-mingxie-"></use>
        </svg>
        <router-link to="/main/thanks">
          特别鸣谢
        </router-link>
      </el-menu-item>
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

  .sub-item {
    letter-spacing: 1px;
    margin-left: 6px;
    font-size: 18px;
  }

</style>
