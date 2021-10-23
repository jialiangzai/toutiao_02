// 频道列表
import request from '@/utils/request'
// data是登录信息：手机号/验证码
export function getMyChannels () {
  // 返回promise对象
  return request({
    method: 'GET',
    url: 'channels'
  })
}
