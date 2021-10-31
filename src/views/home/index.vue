<template>
  <div class="container">
    <!-- 文章分类栏 -->
    <van-tabs swipeable animated v-model="activeIndex">
      <!-- 默认插槽     页签类似分页移动端就是页签 -->
      <van-tab :key="item.id" v-for="item in Channels" :title="item.name">
        <!-- 列表 它会随着页签遍历多次根据页签的id遍历不同的ArticleList-->
        <ArticleList :channelId="item.id" />
      </van-tab>
    </van-tabs>
    <!-- 右侧图标 -->
    <span class="bar_btn" @click="showEditChannel = true">
      <van-icon name="wap-nav"></van-icon>
    </span>
    <!-- 频道管理=> 放置在根元素结束之前 -->
    <!-- <channel-edit v-model="showEditChannel"></channel-edit> -->
    <ChannelEdit
      v-model="showEditChannel"
      :Channels="Channels"
      :activeIndex.sync="activeIndex"
    />
  </div>
</template>

<script>
// 测试axios封装
// import request from '../../utils/request'
import ArticleList from './components/articleList.vue'
import { getMyChannels } from '../../api/home'
import ChannelEdit from './components/channel-edit.vue'

export default {
  name: 'home-index',
  components: {
    ArticleList,
    ChannelEdit
  },
  data () {
    return {
      // 激活索引
      activeIndex: 0,
      // 列表数据（新闻列表）
      list: [],
      // 频道
      Channels: [],
      // 列表加载状态=》true 显示loading | 关闭loading
      loading: false,
      // 列表数据是否加载完成=》加载完成改成true
      finished: false,
      // 是否开始刷新=》true 显示loading | 关闭loading
      refreshing: false,
      // 控制ActionSheet的显示
      showEditChannel: false
    }
  },
  created () {
    this.getMyChannels()
    // 测试refresh_token
    // request({ url: '/user/profile' }).then(res => {
    //   console.log('页面获取到的：', res.data)
    // })
  },
  /**
         * 1. 第一次默认执行一次，加载第一页数据（如果不够一屏，加载第二页数据）
         * 2. 列表滚动到底部的时候滚动条与底部距离小于 offset 时触发，再去加载一页数据（多次触发）
         */
  methods: {
    async getMyChannels () {
      const { data } = await getMyChannels()
      this.Channels = data.channels
      console.log(data)
    }
  }
  // 默认执行一次，被缓存后离开再次进入执行
  // 默认是深度缓存
  // activated () {
  //   console.log('home组被缓存了，进入了')
  // },
  // deactivated () {
  //   console.log('home组被缓存了，离开了')
  // }

}

</script>

<style scoped lang='less'>
// 覆盖有赞页签组件的默认样式
.van-tabs {
  height: 100%;
  display: flex;
  flex-direction: column;
  // 自定义tab样式=》/deep/覆盖子组件的样式
  /deep/ .van-tabs__wrap {
    height: 36px;
    padding-right: 36px;
    .van-tab {
      line-height: 36px;
    }
    .van-tabs__line {
      background-color: #fc6627;
      height: 2px;
    }
  }
  /deep/ .van-tabs__content {
    flex: 1;
    overflow: hidden;
  }
  /deep/ .van-tab__pane {
    height: 100%;
    // 控制列表区域可滚动
    .scroll-wrapper {
      height: 100%;
      overflow-y: auto;
    }
  }
}
.bar_btn {
  width: 36px;
  height: 35px;
  position: absolute;
  top: 0;
  right: 0;
  font-size: 20px;
  text-align: center;
  line-height: 40px;
  box-shadow: -6px -6px 8px #ddd;
}
</style>
