import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import Vant, { Lazyload } from 'vant'
import 'vant/lib/index.less'

import './styles/index.less'

import 'amfe-flexible'
import plugins from './utils/plugins'
Vue.use(Vant)
// 图片懒加载 图片进入可是去才会加载渲染    如果不用vant则基于vue-lazyload插件注册引入使用加v-lazy 少个单词
Vue.use(Lazyload)
Vue.use(plugins)
Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
