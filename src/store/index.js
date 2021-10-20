import Vue from 'vue'
import Vuex from 'vuex'
// 引入token方法
import * as auth from '@/utils/auth'
// console.log(auth)
Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    // 用户token
    user: auth.getToken() || []
  },
  mutations: {
    // 设置token
    setToken (state, token) {
      state.user = token
      // 更新本地(刷新页面后，可以获取到上一次存储到token数据)
      auth.setToken(token)
    },
    delToken (state) {
      state.user = {}
      auth.delToken()
    }
  },
  actions: {
  },
  modules: {
  }
})
