<template>
  <div class="container">
    <!-- 文章分类栏 -->
    <van-tabs swipeable animated v-model="active">
      <!-- 默认插槽 -->
      <van-tab :key="item.id" v-for="item in Channels" :title="item.name">
        <!-- 可滚动内容区域 默认插槽-->
        <div class="scroll-wrapper">
          <!-- 下拉刷新 -->
          <van-pull-refresh
            loosing-text="手放开~刷新"
            success-text="已刷新"
            v-model="refreshing"
            @refresh="onRefresh"
          >
            <!-- 上拉加载 -->
            <van-list
              v-model="loading"
              :finished="finished"
              finished-text="没有更多了"
              @load="onLoad"
            >
              <!-- 新闻列表 -->
              <van-cell v-for="item in list" :key="item">
                <div class="article_item">
                  <h3 class="van-ellipsis">
                    PullRefresh下拉刷新PullRefresh下拉刷新下拉刷新下拉刷新
                  </h3>
                  <div class="img_box">
                    <!-- w100 -->
                    <van-image
                      class="w33"
                      fit="cover"
                      src="https://img.yzcdn.cn/vant/cat.jpeg"
                    />
                    <van-image
                      class="w33"
                      fit="cover"
                      src="https://img.yzcdn.cn/vant/cat.jpeg"
                    />
                    <van-image
                      class="w33"
                      fit="cover"
                      src="https://img.yzcdn.cn/vant/cat.jpeg"
                    />
                  </div>
                  <div class="info_box">
                    <span>你像一阵风</span>
                    <span>8评论</span>
                    <span>10分钟前</span>
                    <span class="close"
                      ><van-icon name="cross"></van-icon
                    ></span>
                  </div>
                </div>
              </van-cell>
            </van-list>
          </van-pull-refresh>
        </div>
      </van-tab>
    </van-tabs>
    <!-- 右侧图标 -->
    <span class="bar_btn">
      <van-icon name="wap-nav"></van-icon>
    </span>
  </div>
</template>

<script>
// 测试axios封装
// import request from '../../utils/request'
import { getMyChannels } from '../../api/home'
export default {
  name: 'home-index',
  data () {
    return {
      active: '',
      // 列表数据（新闻列表）
      list: [],
      Channels: [],
      // 列表加载状态=》true 显示loading | 关闭loading
      loading: false,
      // 列表数据是否加载完成=》加载完成改成true
      finished: false,
      // 是否开始刷新=》true 显示loading | 关闭loading
      refreshing: false
    }
  },
  // created () {
  //   request({ url: '/user/profile' }).then(res => {
  //     console.log('页面获取到的：', res.data)
  //   })
  // }
  created () {
    this.getMyChannels()
  },
  /**
     * 1. 第一次默认执行一次，加载第一页数据（如果不够一屏，加载第二页数据）
     * 2. 列表滚动到底部的时候滚动条与底部距离小于 offset 时触发，再去加载一页数据（多次触发）
     */
  methods: {
    async getMyChannels () {
      const { data } = await getMyChannels()
      this.Channels = data.channels
    },
    onLoad () {
      // 异步更新数据
      // setTimeout 仅做示例，真实场景中一般为 ajax 请求
      setTimeout(() => {
        if (this.refreshing) {
          this.list = []
          this.refreshing = false
        }
        // 造假数据（请求）
        for (let i = 0; i < 10; i++) {
          this.list.push(this.list.length + 1)
        }
        // 触发onLoad事件时会自动开启loading加载状态结束=>关闭loading
        this.loading = false

        if (this.list.length >= 30) {
          this.finished = true
        }
      }, 1000)
    },

    // 下拉刷新
    // 下拉刷新列表=》向下拖拽列表，手放开会触发
    // List 组件可以与 PullRefresh 组件结合使用，实现下拉刷新的效果。
    onRefresh () {
      // 清空列表数据
      this.finished = false

      // 重新加载数据
      // 将 loading 设置为 true，表示处于加载状态
      this.loading = true
      this.onLoad()
    }
  }
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
