<template>
  <el-menu :default-openeds="['1']">
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
    <el-submenu index="2" v-if="hasTeacherRole">
      <template slot="title">
        <svg class="icon" aria-hidden="true">
          <use xlink:href="#icon-xueshengchengjidengji"></use>
        </svg>
        <span class="sub-item">学生成绩管理</span>
      </template>
      <el-menu-item index="2-1">
        <svg class="icon" aria-hidden="true">
          <use xlink:href="#icon-pingshichengjiluru"></use>
        </svg>
        平时成绩打分
      </el-menu-item>
      <el-menu-item index="2-2">
        <svg class="icon" aria-hidden="true">
          <use xlink:href="#icon-qimochengjiluru"></use>
        </svg>
        期末成绩录入
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
    <el-submenu index="5" v-if="hasStudentRole">
      <template slot="title">
        <svg class="icon" aria-hidden="true">
          <use xlink:href="#icon-zuoye"></use>
        </svg>
        <span class="sub-item">个人作业管理</span>
      </template>
      <el-menu-item index="5-1">
        <svg class="icon" aria-hidden="true">
          <use xlink:href="#icon-tijiao"></use>
        </svg>
        <router-link to="/main/studentTaskSubmit">作业提交</router-link>
      </el-menu-item>
      <el-menu-item index="5-2">
        <svg class="icon" aria-hidden="true">
          <use xlink:href="#icon-chengji"></use>
        </svg>
        <router-link to="/main/studentTaskScoreCheck">
          成绩查看
        </router-link>
      </el-menu-item>
    </el-submenu>
    <el-submenu index="6" v-if="hasStudentRole">
      <template slot="title">
        <svg class="icon" aria-hidden="true">
          <use xlink:href="#icon-ziliaoku"></use>
        </svg>
        <span class="sub-item">
          课前资料查看
        </span>
      </template>
      <el-menu-item index="6-1">
        <svg class="icon" aria-hidden="true">
          <use xlink:href="#icon-data-download"></use>
        </svg>
        <router-link to="/main/onlineExamination">资料下载</router-link>
      </el-menu-item>
    </el-submenu>
    <el-submenu index="7" v-if="hasPublicRole">
      <template slot="title">
        <svg class="icon" aria-hidden="true">
          <use xlink:href="#icon-gerenxinxi"></use>
        </svg>
        <span class="sub-item">个人信息管理</span>
      </template>
      <el-menu-item index="7-1">
        <svg class="icon" aria-hidden="true">
          <use xlink:href="#icon-mimaxiugai"></use>
        </svg>
        <router-link to="/main/alterPassWord">个人密码修改</router-link>
      </el-menu-item>
      <el-menu-item index="7-3">
        <svg class="icon" aria-hidden="true">
          <use xlink:href="#icon-xiangmuxinxibiangeng"></use>
        </svg>
        <router-link to="/main/alterPassWord">个人信息变更</router-link>
      </el-menu-item>
    </el-submenu>
    <el-submenu index="8" v-if="hasAdminRole">
      <template slot="title">
        <svg class="icon" aria-hidden="true">
          <use xlink:href="#icon-yonghu"></use>
        </svg>
        <span>用户信息管理</span>
      </template>
      <el-menu-item index="8-1">
        <svg class="icon" aria-hidden="true">
          <use xlink:href="#icon-xinxiweihu"></use>
        </svg>
        <router-link to="/main/userManage">用户信息维护</router-link>
      </el-menu-item>
    </el-submenu>

    <el-submenu index="9" v-if="hasPublicRole">
      <template slot="title">
        <svg class="icon" aria-hidden="true">
          <use xlink:href="#icon-ziliaoku1"></use>
        </svg>
        <span class="sub-item">资料信息库</span>
      </template>
      <el-menu-item index="9-1">
        <svg class="icon" aria-hidden="true">
          <use xlink:href="#icon-ziyuanchaxun-hover"></use>
        </svg>
        公共资源查询
      </el-menu-item>
      <el-menu-item index="9-2">
        <svg class="icon" aria-hidden="true">
          <use xlink:href="#icon-shangchuan"></use>
        </svg>
        公共资源上传
      </el-menu-item>
    </el-submenu>

    <el-submenu index="10" v-if="hasPublicRole">
      <template slot="title">
        <svg class="icon" aria-hidden="true">
          <use xlink:href="#icon-xitong"></use>
        </svg>
        <span class="sub-item">关于平台系统</span>
      </template>
      <el-menu-item index="10-1">
        <svg class="icon" aria-hidden="true">
          <use xlink:href="#icon-shezhiguanyuruanjian"></use>
        </svg>
        关于软件
      </el-menu-item>
      <el-menu-item index="10-2">
        <svg class="icon" aria-hidden="true">
          <use xlink:href="#icon-mingxie-"></use>
        </svg>
        特别鸣谢
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
    margin-left: 15px;
    font-size: 18px;
  }

</style>
