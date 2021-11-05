<template>
  <div class="page-user-login">
    <van-nav-bar
      left-arrow
      @click-left="$router.back()"
      title="登录"
    ></van-nav-bar>
    <!-- 表单组件  submit表单提交事件 子传父-->
    <van-form @submit="onSubmit">
      <!-- 表单中的输入框组件。 -->
      <!--pattern 默认为true 写在data中 -->
      <van-field form: v-model="form.mobile" name="mobile" label="手机号"
      placeholder="手机号" :rules="[{ required: true, message: '请填写手机号'},
      { pattern, message: '请输入正确内容' }]" />
      <van-field
        v-model="form.code"
        name="code"
        label="验证码"
        placeholder="验证码"
        :rules="[
          { required: true, message: '请填写验证码' },
          { validator, message: '请输入正确内容' },
        ]"
      >
        <!-- 具名插槽定制输入框内的结构html 不能更改 vant有赞提供直接用就行 -->
        <template #button>
          <!-- 发送验证码有提交行为要把按钮设置为button 默认的是submit -->
          <van-button size="small" native-type="button" type="#ebedf0"
            >发送验证码</van-button
          >
        </template>
      </van-field>
      <div style="margin: 16px">
        <van-button round block type="info" native-type="submit"
          >提交</van-button
        >
      </div>
    </van-form>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
export default {
  name: 'user-chat',
  data () {
    return {
      form: {
        // 变量名与后台保持一致
        mobile: '15801018868',
        code: '246810'
      },
      pattern: /^(0|86|17951)?(13[0-9]|15[012356789]|166|17[3678]|18[0-9]|14[57])[0-9]{8}$/
    }
  },
  // created () {
  //   console.log(this.$route.query.redirectUrl)
  // },
  methods: {
    ...mapActions(['getToken']),
    // 表示已经验证通过
    // 因为actions是异步，所以在请求后提示跳转一系列完成后有可能使用为返回的token这样要让请求同步化
    // async和await
    async onSubmit (values) {
      // values是form传递的表单所有数据 这里也可以运用数据双向绑定v-model  this.form获取
      // console.log('submit', values)
      // await this.getToken(values)
      // // vant有全局轻提示
      // // this.$toast('登录成功')
      // this.$toast.success('登录成功')
      // // 跳转首页
      // this.$router.push('/')
      // 捕获异常

      try {
        await this.getToken(values)
        // vant有全局轻提示
        // this.$toast('登录成功')
        this.$toast.success('登录成功')
        // 跳转首页
        //   * 校验通过=>登录
        //  * 1. 调用vuex的action发送登录请求
        //  * 2. 成功跳转首页
        // this.$route.query.redirectUrl存在
        // 就跳这个地址，不存在就跳转首页
        this.$router.push(this.$route.query.redirectUrl || '/')
      } catch (error) {
        // error对象需要通过console.dir才能看到里边的属性和值
        console.dir(error)
        this.$toast.fail(error.response.data.message)
      }
    },
    // 第三种校验规则是函数形式在methods中
    // 校验函数返回 true 表示校验通过，false 表示不通过
    validator (val) {
      if (val.length !== 6) return false
      return true
    }
  }
}
</script>

<style scoped lang='less'></style>
