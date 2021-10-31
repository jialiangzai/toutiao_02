
// 获取所有频道列表
import request from '@/utils/request'
// data是登录信息：手机号/验证码
export function getMyChannels () {
  // 返回promise对象
  return request({
    method: 'GET',
    url: 'user/channels'
  })
}
// 1. 根据API文档封装文章列表数据
// 2. 设置默认的timestamp数据为当前时间--新闻的时效性无页码根据时间
// 3. 在articleList组件onLoad中调用接口
// 4. 向文章列表追加数据 ---------------不是覆盖
// 5. 根据pre_timestamp字段判断数据是否全部加载完毕 => pre_timestamp(下一页数据的开始时间戳)
// 6. onRefresh刷新时重置timestamp为当前最新时间戳 ----刷新列表拿到最新列表

// 说明：timestamp作为请求新闻数据的最新起点 =》获取当前起点时间之前的数据

// 参数
// channel_id频道ID
// timestamp时间戳，请求新的推荐数据传当前的时间戳，请求历史推荐传指定的时间戳
// data返回中的pre_timestamp根据pre_timestamp字段判断数据是否全部加载完毕=>pre_timestamp(下一页数据的开始时间戳) 以当前时间发起请求返回值为当前时间的节制点获取它之前的数据

// 根据频道的ID获取新闻列表
// params表示channel_id 和 timestamp
export function getArticleListApi (params) {
  return request({
    url: 'articles',
    params
  })
}
