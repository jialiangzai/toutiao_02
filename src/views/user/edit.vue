<template>
  <div class="page-user-profile">
    <van-nav-bar
      left-arrow
      @click-left="$router.back()"
      title="编辑资料"
      right-text="保存"
      @click-right="save()"
    ></van-nav-bar>
  </div>
</template>

<script>
// 本地持久化token；将来实现刷新token，需要存储的信息。关闭浏览器后再次打开，需要保持登录状态。
/**
 * 1. 获取到手机号和验证码
2. 使用手机号和验证码作为接口参数发送登录请求
3. 登录请求成功=》后台返回什么？=》token(登录成功的标识)=》存到localStorage中
4. 跳转到后台的首页

 */
export default {
  name: 'user-profile',
  methods: {
    save () {
      this.$toast.success('保存成功')
    }
  }
}
</script>

<style scoped lang='less'></style>
