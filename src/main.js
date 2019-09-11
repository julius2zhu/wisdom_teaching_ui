import Vue from 'vue'
import App from './App'
import router from './router'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import './assets/css/index.css'
//引入axios
import axios from 'axios'
import PubSub from 'pubsub-js'
import store from './store'
//解决ie浏览器出现Promise未定义,由于使用axios造成的
import 'babel-polyfill'
import url_request from './plugins/url_request'
import lang_ZH from './plugins/lang_ZH'

Vue.use(lang_ZH)
Vue.use(url_request)
Vue.use(ElementUI)
Vue.use(PubSub)
Vue.use(store)
Vue.use(url_request)
Vue.prototype.axios = axios  //全局注册,任何组件都能直接使用
Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: {App},
  template: '<App/>'
})
