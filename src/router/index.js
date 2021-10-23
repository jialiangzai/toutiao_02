import Vue from 'vue'
import VueRouter from 'vue-router'
// 拿到vuex实例store 因为这是路由实例不是vue组件，这里的store是this.$store
import store from '@/store'
// console.log(store)
// 路由的按需导入 定义常量为函数名，赋值箭头函数，执行到component是常量，vue就会内部调用
// 布局组件(一)
const Layout = () => import('@/views/layout.vue')
// 首页（第一个标签页）
const Index = () => import('@/views/home/index.vue')
// 问答
const Question = () => import('@/views/question/index.vue')
// 视频
const Video = () => import('@/views/video/index.vue')
// 个人中心
const Profile = () => import('@/views/profile/index.vue')
// 登录
const Login = () => import('@/views/login/index.vue')
// 编辑个人资料
const User = () => import('@/views/user/edit.vue')
// 小智
const Chat = () => import('@/views/user/chat.vue')
// 搜索
const Search = () => import('@/views/search/index.vue')
const Result = () => import('@/views/search/result.vue')
// 详情
const Article = () => import('@/views/article/index.vue')
const NotFound = () => import('@/views/NotFound')
// 注册之前
// 解决Vue-Router升级导致的Uncaught(in promise) navigation guard问题
const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push (location, onResolve, onReject) {
  if (onResolve || onReject) return originalPush.call(this, location, onResolve, onReject)
  return originalPush.call(this, location).catch(err => err)
}

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    // 布局骨架
    component: Layout,
    // 二级路由
    children: [
      {
        path: '/',
        name: 'index',
        // 首页
        component: Index
      },
      {
        path: '/question',
        name: 'question',
        // 问答
        component: Question
      },
      {
        path: '/video',
        name: 'video',
        // 视频
        component: Video
      },
      {
        path: '/user',
        name: 'user',
        // 个人中心
        component: Profile
      }
    ]
  },
  {
    path: '/login',
    name: 'login',
    // 登录
    component: Login
  },
  {
    path: '/user/profile',
    name: 'profile',
    // 编辑资料
    component: User
  },
  {
    path: '/user/chat',
    name: 'chat',
    // 小智同学
    component: Chat
  },
  {
    path: '/search',
    name: 'search',
    // 搜索
    component: Search
  },
  {
    path: '/search/result',
    name: 'result',
    // 搜索结果
    component: Result
  },
  {
    path: '/article/:id',
    name: 'article',
    // 文章详情
    component: Article
  },
  {
    path: '*',
    component: NotFound
  }
]
/**
 * 路由配置
 */
/**
 * 前端路由配置的两种方式
 * 1. hash模式(默认)
 * 2. history模式
 * 相同点：都可以实现路由配置和跳转（功能一样）
 * 不同点：路由的路径不一样=》hash模式带个#号；history不带
 * 使用场景：
 * 一般使用hash模式，因为hash可以运行在所有浏览器（兼容性好）；
 * 但是history模式只能在支持history api的浏览器运行
 */
const router = new VueRouter({
  routes
})

// 路由守卫=>前置守卫 地址 /user 开头的路径，检查是否登录。
/** router.beforeEach(回调函数)
 * 控制以/user开头的页面都需要token才能访问
 *to 去
 *from 来
 *next放行 默认是全拦截 *从vuex中获取token,必须有token无的话跳转到登录 依然可以跳转
 * next({ path:'/xxx' , query:{}}) 携带参数跳到xxx页面 登录后继续跳转指定页面

 最好不要直接修改本地 ，他是最终结果，用vuex去获取修改
 *
*/
router.beforeEach((to, from, next) => {
  // 获取token信息
  const { user } = store.state
  // console.log(user)
  // redirectUrl自定义
  const loginConfig = { path: '/login', query: { redirectUrl: to.path } }
  if (to.path.startsWith === '/user' && !user.token) {
    // 登录完成后返回之前的页面 配置前是返回主页面，登录后让用户继续浏览之前的页面
    next(loginConfig)
    // next(`/login?redirectUrl=${to.path}`)
  } else {
    next()
  }
})
export default router
