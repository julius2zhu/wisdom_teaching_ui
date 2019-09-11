/*国际化文件*/
export default {
  install: function (Vue, options) {
    /*消息通知类*/
    Vue.prototype.message_show = {
      success: '成功',
      fail: '失败',
      error: '出错'
    }
    /*登录验证相关*/
    Vue.prototype.login_show = {
      success: '登录成功'
    }
  }
}
