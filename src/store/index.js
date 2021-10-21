import Vue from 'vue'
import Vuex from 'vuex'
// 引入token方法 存储到本地 硬盘中 因为是分别暴露所以用*起别名 使用的时候就点就行了
import * as auth from '@/utils/auth'
// console.log(auth)
// 获取token是从vuex中取并不是本地，本地的也是从vuex中传递的
// 导入接口请求方法
import { login } from '@/api/user'
Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    // 用户token存储的是两个{token, refresh_token}
    // user: {} // 就算有存储刷新后还是空对象，于是本地从获取，就算获取不到给一个空对象，当页面刷新后内存内是没有数据的会去本地硬盘中找重新赋值给内存
    user: auth.getToken() || {}
  },
  mutations: {
    // 设置token
    setToken (state, token) {
      // 存储到内存
      state.user = token
      // 更新本地(刷新页面后，可以获取到上一次存储到token数据)
      auth.setToken(token)
    },
    delToken (state) {
      // 删除内存中
      state.user = {}
      // 删除硬盘中的
      auth.delToken()
    }
  },
  actions: {
    async getToken ({ commit }, form) {
      const { data } = await login(form)
      // 会执行两次一次是内存一次是本地
      commit('setToken', data)
    }
  },
  modules: {
  }
})
