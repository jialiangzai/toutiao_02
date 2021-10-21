// 1. utils下新建auth.js
// 2. 使用localStorage处理token数据
/**
 * auth认证（令牌）
 * 之前用户信息存储位置是：内存中速度快但是计时，刷新会消失sessionStorage，关闭浏览器登录失效
 * 保持登录状态：refresh_token结合localStorage来延长token有效期
 * token: {token, refresh_token}
 */

const TT_TOKEN = 'TT_TOKEN'

// 存储token
export function setToken (token) {
  localStorage.setItem(TT_TOKEN, JSON.stringify(token))
}

// 获取token
export function getToken () {
  return JSON.parse(localStorage.getItem(TT_TOKEN))
}

// 删除token
export function delToken () {
  localStorage.removeItem(TT_TOKEN)
}
