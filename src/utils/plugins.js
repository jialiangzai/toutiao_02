/**
 * vue插件
 * 语法：{install (Vue){}}
 * 使用：需要去入口main.js引入并注册 Vue.use(自定义插件对象)
 */

// 全局格式化相对时间 自定义插件  dayjs 插件  都是处理时间格式
import dayjs from 'dayjs'
// 使用dayjs插件（按需）
import relativeTime from 'dayjs/plugin/relativeTime'
// 国际化
import 'dayjs/locale/zh-cn'
dayjs.locale('zh-cn')
// 添加相对事件relativeTime插件
dayjs.extend(relativeTime)
// value表示管道符左侧的要格式化的数据
const relTime = (value) => {
  return dayjs().from(value)
}

// 定义一个方法(睡眠函数)
const $sleep = (times) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve()
    }, times || 2000)
  })
}

export default {
  install (Vue) {
    // console.log('插件的形参', Vue)
    // 全局过滤器、组件、指令、全局共用方法(所有页面都可以用)
    Vue.prototype.$sleep = $sleep
    // 名字，第二个参数是(回调)执行的方法(逻辑)
    Vue.filter('relTime', relTime)
  }
}
