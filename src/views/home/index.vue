<template>
  <div class="container">home</div>
</template>

<script>
// 测试axios封装
import request from '../../utils/request'
export default {
  name: 'home-index',
  created () {
    request({ url: 'announcements' }).then(res => {
      console.log('页面获取到的：', res.data)
    })
  }
}
</script>

<style scoped lang='less'></style>
