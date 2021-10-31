<template>
  <div id="app">
    <!-- <router-view /> -->
    <!-- 如果配置 meta.isKeepAlive===true 渲染keep-alive包裹的router-view=》会被缓存-->
    <keep-alive>
      <router-view v-if="$route.meta.isKeepAlive"></router-view>
    </keep-alive>
    <!-- 没有配置 meta.isKeepAlive===false 组件被渲染到这里=》不会被缓存 -->
    <router-view v-if="!$route.meta.isKeepAlive"></router-view>
  </div>
</template>

<style lang="less">
</style>
