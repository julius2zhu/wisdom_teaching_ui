/*向后台地址请求相关*/
export default {
  install: function (Vue, options) {
    Vue.prototype.url_request = {
      //ip和port,控制全局,部署时候需要替换成下面的
      ip_port_dev: 'http://127.0.0.1/wisdom_teaching',
      // ip_port_dev: '/wisdom_teaching/',
    }
  }
}
