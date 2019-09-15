/**
 * 通用插件js库,例如常见的网络请求访问
 *
 */
export default {
  install: function (Vue, options) {
    /**
     * 向后台发送网络请求
     * @param way 方式 get/post
     * @param url 请求地址
     * @param params 携带的参数
     * @param fn 回调函数
     */
    Vue.prototype.netWorkRequest = function (way, url, params, fn) {
      if (way === 'get') {
        this.axios.get(url, {
          params: params,
        }).then(response => {
          fn(response.data)
        }).catch(error => {
          this.$message({
            title: '提示',
            message: '系统出错,稍后再试',
            type: 'error',
            center: true
          })
        }).finally(() => {
          return false
        })
      } else {
        this.axios({
          method: 'post',
          url: url,
          data: params
        }).then(response => {
          fn(response.data)
        }).catch(error => {
          this.$message({
            title: '提示',
            message: '系统出错,稍后再试',
            type: 'error',
            center: true
          })
        }).finally(() => {
          return false
        })
      }
    }
    /**
     * 弹出确认对话框
     * @param title 标题
     * @param message 信息
     * @param fn 确定的回调函数
     */
    Vue.prototype.myConfirm = function (title, message, fn) {
      if (title === null) {
        title = '提示信息'
      }
      if (message === null) {
        message = '您确定要删除该条记录吗?此操作将不可恢复!'
      }
      this.$confirm(message, title, {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        fn()
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    }
  }
}
