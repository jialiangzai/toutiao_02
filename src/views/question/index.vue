<template>
  <div class="container">
    <van-skeleton title :row="3" />
    <van-skeleton title :row="3" />
    <van-skeleton title :row="3" />
  </div>
</template>

<script>
export default {
  name: 'question-index',
  created () {
    console.log('question组件创建了')
  },
  activated () {
    console.log('question组被缓存了，进入了')
  },
  deactivated () {
    console.log('question组被缓存了，离开了')
  }
}
</script>

<style scoped lang='less'>
.van-skeleton {
  margin-top: 10px;
}
</style>
