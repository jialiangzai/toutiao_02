// 模块化封装后台api请求方案
/**
 * 导入封装的axios方法
 * 导出某个接口的请求方法
 *
 * 方便复用 易于管理
 * 解决代码臃肿 快速定位bug 方便后期修改接口
 */
import request from '@/utils/request'
// data是登录信息：手机号/验证码
export function login (data) {
  // 返回promise对象
  return request({
    method: 'POST',
    url: 'authorizations',
    data
  })
}
// // 刷新用户token
// export function login (data) {
//   // 返回promise对象
//   return request({
//     method: 'POST',
//     url: 'authorizations',
//     data
//   })
// }
/**
 * 关注用户
 * @param {*} target 用户ID
 */
export function follow (target) {
  return request.post('user/followings', { target })
}

/**
 * 取关用户
 * @param {*} target 用户ID
 */
export function unFollow (target) {
  return request.delete(`user/followings/${target}`)
}
/**
 * 获取用户个人信息
 */
export function getUserInfo () {
  return request.get('user')
}
/**
 * 获取个人中心用户编辑资料信息
 */
export function getUserProfile0 () {
  return request.get('user/profile')
}

/**
 * 修改用户头像
 * @param {File} photo - 选中图片后的文件对象
 */
export const updateUserPhoto = (photo) => {
  // 底层基于xhr  发送一个formdata就是上传
  const formdata = new FormData()
  formdata.append('photo', photo)
  return request.patch('user/photo', formdata)
}

/**
 * 修改用户信息
 * @param {String} name - 用户名
 * @param {Integer} gender - 性别 0 男 1 女
 * @param {String} birthday - 生日
 */
export const updateUserInfo = ({ name, gender, birthday }) => {
  return request.patch('user/profile', { name, gender, birthday })
}
