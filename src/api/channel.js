import request from '../utils/request'
// 获取系统中所有的频道
export function getAllChannels () {
  return request.get('channels')
}
/**
 * 删除频道
 * @param {*} channelId 频道ID
 */
export function delChannel (channelId) {
  return request.delete(`user/channels/${channelId}`)
}
/**
 * 添加频道
 * @param {*} newChannel 新的频道数据
 */
export function addChannel (newChannel) {
  return request.put('user/channels', {
    channels: newChannel
  })
}
