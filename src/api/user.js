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
