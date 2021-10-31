import request from '../utils/request'
// 根据文章ID添加不感兴趣
/**
 *
 * @param {*} target 文章ID
 */
export function disLikeById (target) {
  return request.post('article/dislikes', {
    target
  })
}
// 根据文章ID举报
/**
 *
 * @param {*} target 文章ID
 * @param {*} type 举报类型
 */
export function reportById (target, type) {
  return request.post('article/reports', {
    target, type
  })
}
/**
 * 联想自动补全
 * @param {*} q 搜索词
 */
export function suggest (q) {
  return request.get('suggestion', {
    params: {
      q
    }
  })
}
/**
 * 搜索文章
 * @param {*} page 页码
 * @param {*} per_page 每页条数
 * @param {*} q 搜索关键字
 */
// eslint-disable-next-line camelcase
export function searchArticles ({ page = 1, per_page = 20, q }) {
  return request.get('search', {
    params: {
      page,
      per_page,
      q
    }
  })
}
/**
 * 获取文章详情
 * @param {*} id 根据文章ID获取文章详情
 */
export function getDetailById (id) {
  return request.get(`articles/${id}`)
}

/**
 * 对文章不喜欢
 * @param {*} target 文章ID
 */
export function disLike (target) {
  return request.post('article/dislikes', {
    target
  })
}

/**
 * 取消对文章不喜欢
 * @param {*} target 文章ID
 */
export function unDisLike (target) {
  return request.delete(`article/dislikes/${target}`)
}

/**
 * 对文章点赞
 * @param {*} target 文章ID
 */
export function like (target) {
  return request.post('article/likings', {
    target
  })
}

/**
 * 取消对文章点赞
 * @param {*} target 文章ID
 */
export function unLike (target) {
  return request.delete(`article/likings/${target}`)
}

/**
 * 获取评论或回复
 * @param {String} type - a 查询文章的评论  c 查询评论的回复
 * @param {String} source - 如果查询评论是文章的ID  如果查询回复是评论的ID
 * @param {String} offset - 查询每一页数据的最后一个数据的ID，当作下一页的偏移量
 * @param {String} limit - 每页显示多少条
 */
export function getComments ({ type, source, offset, limit = 10 }) {
  return request.get('comments', {
    params: {
      type, source, offset, limit
    }
  })
}

/**
 * 提交评论或者回复
 * @param {String} target - 做评论的时候：文章ID  做回复的时候：评论ID
 * @param {String} content - 评论内容
 * @param {String} artId - 文章id，对评论内容发表回复时，需要传递此参数，表明所属文章id。对文章进行评论，不要传此参数
 */
export const commentOrReply = (target, content, art_id = null) => {
  return request.post('comments', { target, content, art_id })
}
