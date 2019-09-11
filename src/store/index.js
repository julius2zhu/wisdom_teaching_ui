import Vue from 'vue'
import Vuex from 'vuex'
//使用组件
Vue.use(Vuex)
//向外暴露一个公共的store对象
export default new Vuex.Store({
  state,//状态对象
  mutations,//包含多个更新state函数的对象
  actions,//包含多个对应事件回调函数的对象
  getters,//包含多个getter计算属性函数的对象
})

//状态对象
const state = {
  count: 0,
  role: 1,
  permission: 'admin'
}
//包含多个更新state函数的对象
const mutations = {
  //state则是vuex进行传递的
  add (state) {
    state.count++
    console.log('add');
  },
  reduce (state) {
    state.count--
  }
}
//包含多个对应事件回调函数的对象
const actions = {
  //actions本身不直接更新state中数据,而是交给mutations去更新
  //commit和state都是系统传递的
//{commit,state}是固定写法,参数2则可以接收参数
  increment ({commit, state}) {
    commit('add')
  },
  decrement ({commit}) {
    commit('reduce')
  },
  incrementIfOdd ({commit, state}) {
    if (state.count % 2 === 1) {
      commit('add')
    }
  },
  incrementAsync ({commit}) {
    setTimeout(() => {
      commit('add')
    }, 1000)
  }
}
//包含多个getter计算属性函数的对象
const getters = {
  //此处的state是由vuex管理的，也就是vuex进行传递过来的
  evenOrOdd (state) {
    return state.count % 2 === 0 ? '偶数' : '奇数'
  }
}

