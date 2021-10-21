/**
 *
1. 创建自定义配置的axios函数 工厂函数创建
- 设置基础请求地址：http://geek.itheima.net/v1_0/
// - 在transformResponse中处理响应res数据的大整型数据精度丢失问题
2. 导入创建的store对象，获取token数据
3. 在请求拦截器中，统一处理请求头中携带token，排除登录注册等接口（根据接口文档）
4. 在响应拦截器中，处理和简化返回的数据
   最后，测试自定义axios方法
 */
/**
 * 封装全局接口请求axios函数
 */
import axios from 'axios'
// import JSONBIGINT from 'json-bigint'
import store from '../store'
const MyAxios = axios.create({
  baseURL: 'http://geek.itheima.net/v1_0/'
  // transformResponse: [function (data) {
  //   console.log('1', data)
  //   // Do whatever you want to transform the data
  //   // data =>后台返回的JSON字符串
  //   try {
  //     // 处理JSON.parse/stringify精度丢失
  //     // test:console.log(JSONBIGINT.parse('{"a":9223372036854775807}').a.toString(), JSON.parse('{"a":9223372036854775807}'))

  //     return JSONBIGINT.parse(data)
  //   } catch (e) {
  //     return data
  //   }
  // }
  // ]

})

// 请求拦截器 请求之前 统一为请求头添加token，参数是两个函数 成功执行第一个 失败执行第二个
MyAxios.interceptors.request.use(function (config) {
  // Do something before request is sent
  // 请求之前，统一向header中加入token
  // ?.user 处理null
  // token 排除登录注册等接口    token是在vuex中，这个请求工具是js，不能$store 获取对应的数据，通过引入store实例对象
  if (store.state.user.token && config.url !== 'authorizations') {
    // 这里是追加请求头config.headers.Authorization不是直接赋值
    config.headers.Authorization = `Bearer ${store.state.user.token}`
  }
  return config
}, function (error) {
  // Do something with request error
  return Promise.reject(error)
})

// 响应之前执行
MyAxios.interceptors.response.use(function (response) {
  // Any status code that lie within the range of 2xx cause this function to trigger
  // Do something with response data
  // 处理和简化返回的数据
  // return response
  return {
    status: response.status,
    data: response.data.data
  }
}, function (error) {
  // Any status codes that falls outside the range of 2xx cause this function to trigger
  // Do something with response error
  // error错误对象在控制台显示必须是dir，否则显示不全
  console.dir(error)
  return Promise.reject(error)
})

// 导出axios
export default MyAxios
