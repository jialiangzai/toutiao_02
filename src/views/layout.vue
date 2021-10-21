<template>
  <div class="container">
    <!-- 头部 -->
    <!-- 当路由地址（path === $route.path）不是`我的`才显示 -->
    <van-nav-bar
      v-if="$route.path !== '/user'"
      title="首页"
      fixed
      right-text="搜索"
      @click-right="$router.push('/search')"
    />

    <!-- 中 -->
    <!-- 中间内容：二级路由挂载点=》注意容器样式添加 -->
    <div class="my-wrapper" :class="{noTop:$route.path === '/user'}">
      <router-view></router-view>
    </div>
    <!-- 下 -->
    <!-- route是否开启路由模式 表示true -->
    <van-tabbar route>
      <van-tabbar-item to="/" icon="home-o">首页</van-tabbar-item>
      <van-tabbar-item to="/question" icon="chat-o">问答</van-tabbar-item>
      <van-tabbar-item to="/video" icon="video-o">视频</van-tabbar-item>
      <van-tabbar-item to="/user" icon="user-o">我的</van-tabbar-item>
    </van-tabbar>
  </div>
</template>

<script>
export default {
  data () {
    return {
      active: 0
    }
  }
  // computed: {
  //   isShowNav () {
  //     return this.$route.path !== '/user'
  //   }
  // }

}
</script>

<style lang="less" scoped>
.container {
  width: 100%;
  height: 100%;
  position: relative;
  .my-wrapper {
    width: 100%;
    height: 100%;
    overflow: hidden;
    padding-top: 46px;
    padding-bottom: 50px;
    box-sizing: border-box;
    &.noTop {
      padding-top: 0;
    }
  }
}
</style>
