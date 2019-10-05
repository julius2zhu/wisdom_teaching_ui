import Vue from 'vue'
import Router from 'vue-router'
import Main from '../components/Main'
import Login from '../components/Login'
import Register from '../components/Register'
import OnlineCheckName from '../components/OnlineCheckName'
import OnlineCheckNameCheck from '../components/OnlineCheckNameCheck'
import StudentInfoMaintain from '../components/StudentInfoMaintain'
import StudentInfoCheck from '../components/StudentInfoCheck'
import StudentInfoExport from '../components/StudentInfoExport'
import StudentInfoImport from '../components/StudentInfoImport'
import Welcome from '../components/Welcome'
import AlterPassWord from '../components/AlterPassWord'
import UserManage from '../components/UserManage'
import TaskManage from '../components/TaskManage'
import StudentTaskSubmit from '../components/StudentTaskSubmit'
import TaskSubmitCheck from '../components/TaskSubmitCheck'
import StudentTaskScoreCheck from '../components/StudentTaskScoreCheck'
import AboutSystem from '../components/AboutSystem'
import Thanks from '../components/Thanks'
import PublicResourcesUpload from '../components/PublicResourcesUpload'
import PublicResourcesSearch from '../components/PublicResourcesSearch'
import OnlineExaminationManage from '../components/OnlineExaminationManage'
import CourseManage from '../components/CourseManage'
import OnlineExamination from '../components/OnlineExamination'
import PersonInfoAlter from '../components/PersonInfoAlter'

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
          path: 'onlineCheckName',
          component: OnlineCheckName
        },
        {
          path: 'onlineCheckNameCheck',
          component: OnlineCheckNameCheck
        },
        {
          path: 'onlineExaminationManage',
          component: OnlineExaminationManage
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
          path: 'personInfoAlter',
          component: PersonInfoAlter
        },
        {
          path: 'userManage',
          component: UserManage
        },
        {
          path: 'courseManage',
          component: CourseManage
        },
        {
          path: 'welcome',
          component: Welcome
        },
        {
          path: 'taskManage',
          component: TaskManage
        },
        {
          path: 'studentTaskSubmit',
          component: StudentTaskSubmit
        },
        {
          path: 'taskSubmitCheck',
          component: TaskSubmitCheck
        },
        {
          path: 'studentTaskScoreCheck',
          component: StudentTaskScoreCheck
        },
        {
          path: 'aboutSystem',
          component: AboutSystem
        },
        {
          path: 'thanks',
          component: Thanks
        },
        {
          path: 'publicResourcesUpload',
          component: PublicResourcesUpload
        }, {
          path: 'publicResourcesSearch',
          component: PublicResourcesSearch
        },
        {
          //刚进来展示的页面
          path: '/main',
          redirect: '/main/studentInfoCheck'
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
