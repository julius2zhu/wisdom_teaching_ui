import Vue from 'vue'
import Router from 'vue-router'
import Main from '../components/Main'
import Login from '../components/Login'
import Register from '../components/Register'
import StudentInfoMaintain from '../components/StudentInfoMaintain'
import StudentInfoCheck from '../components/StudentInfoCheck'
import StudentInfoExport from '../components/StudentInfoExport'
import StudentInfoImport from '../components/StudentInfoImport'
import OnlineExamination from '../components/OnlineExamination'
import Welcome from '../components/Welcome'
import AlterPassWord from '../components/AlterPassWord'
import UserManage from '../components/UserManage'

Vue.use(Router)
export default new Router({
  routes: [
    {
      path: '/login',
      component: Login
    },
    {
      path: '/register',
      component: Register
    },
    {
      path: '/main',
      component: Main,
      children: [
        {
          path: 'studentInfoCheck',
          component: StudentInfoCheck
        },
        {
          path: 'studentInfoMaintain',
          component: StudentInfoMaintain
        },
        {
          path: 'studentExport',
          component: StudentInfoExport
        },
        {
          path: 'studentInfoImport',
          component: StudentInfoImport
        },
        {
          path: 'onlineExamination',
          component: OnlineExamination
        },
        {
          path: 'alterPassWord',
          component: AlterPassWord
        },
        {
          path: 'userManage',
          component: UserManage
        },
        {
          path: 'welcome',
          component: Welcome
        },
        {
          //刚进来展示的页面
          path: '/main',
          redirect: '/main/welcome'
        }
      ]
    },
    {
      //默认访问根目录直接导航到登录界面
      path: '/',
      redirect: '/login'
    }
  ]
})
