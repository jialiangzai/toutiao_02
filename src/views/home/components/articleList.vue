<template>
  <!-- 抽离的滚动区域 -->
  <!-- 可滚动内容区域 默认插槽-->
  <div @scroll="rememPro" ref="scrollList" class="scroll-wrapper">
    <!-- 下拉刷新 -->
    <van-pull-refresh
      loosing-text="手放开~刷新"
      success-text="已刷新"
      v-model="refreshing"
      @refresh="onRefresh"
    >
      <!-- list列表 加载 -->
      <van-list
        v-model="loading"
        :finished="finished"
        finished-text="没有更多了"
        @load="onLoad"
      >
        <!-- 新闻列表 -->
        <van-cell v-for="item in list" :key="item.art_id">
          <!-- 一条新闻的遍历 -->
          <div
            class="article_item"
            @click="$router.push(`/article/${item.art_id}`)"
          >
            <h3 class="van-ellipsis">
              {{ item.title }}
            </h3>
            <div class="img_box" v-if="item.cover.type">
              <!-- w100 -->
              <van-image
                :class="item.cover.type === 1 ? 'w100' : 'w33'"
                v-for="(img, inde) in item.cover.images"
                :key="inde"
                fit="cover"
                :src="img"
                lazy-load
              >
                <!-- 图片懒加载提示 -->
                <template v-slot:loading>
                  <van-loading type="spinner" size="20" />
                </template>
              </van-image>
              <!-- <van-image
                class="w33"
                fit="cover"
                src="https://img.yzcdn.cn/vant/cat.jpeg"
              />
              <van-image
                class="w33"
                fit="cover"
                src="https://img.yzcdn.cn/vant/cat.jpeg"
              /> -->
            </div>
            <div class="info_box">
              <span>{{ item.aut_name }}</span>
              <span>{{ item.comm_count }}评论</span>
              <span>{{ item.pubdate | relTime }}</span>
              <!--更多操作 -->
              <span v-if="$store.state.user" class="close"
                ><van-icon
                  name="cross"
                  @click="openMore(item.art_id)"
                ></van-icon
              ></span>
            </div>
          </div>
        </van-cell>
      </van-list>
    </van-pull-refresh>
    <!-- 更多操作 -->
    <MoreAction
      v-if="$store.state.user"
      @click.stop="openMore(item.art_id)"
      v-model="showMore"
      @on-dislike="removeArticle"
      @on-report="removeArticle"
      :artId="artId"
    />
  </div>
</template>

<script>
// 记录被缓存组件的阅读位置
// 给列表绑定滚动事件 获取滚动高度，存储到变量上
// 在切页面后再次回来通过上次记录的滚动高度 获取到列表dom对象
import { getArticleListApi } from '@/api/home'
import MoreAction from './moreAction.vue'
export default {
  // 注册更多操作
  components: {
    MoreAction
  },
  props: {
    channelId: {
      type: Number,
      default: 0
    }
  },
  data () {
    return {
      showMore: false,
      artId: '',
      // 列表数据（新闻列表）
      list: [],
      // 频道
      // Channels: [],
      // 列表加载状态=》true 显示loading | 关闭loading
      loading: false,
      // 列表数据是否加载完成=》加载完成改成true
      finished: false,
      // 是否开始刷新=》true 显示loading | 关闭loading
      refreshing: false,
      timestamp: Date.now(),
      // 阅读记忆
      scrollTop: 0
    }
  },
  methods: {
    // 列表滚动事件
    rememPro (e) {
      // console.log(e.target.scrollTop)
      this.scrollTop = e.target.scrollTop
    },
    // 切换执行滚动的方法  滚动到指定位置=====》dom对象
    scrollList () {
      this.$refs.scrollList.scrollTop = this.scrollTop
    },
    async onLoad () {
      // 使用自定义插件
      // await this.$sleep()
      /**
     * 上拉加载分页数据
     * 1. 第一次默认执行一次，加载第一页数据（如果不够一屏，加载第二页数据）
     * 2. 列表滚动到底部的时候，再去加载一页数据（多次触发）
     */
      // 异步更新数据
      // setTimeout 仅做示例，真实场景中一般为 ajax 请求
      // setTimeout(() => {
      if (this.refreshing) {
        this.list = []
        this.refreshing = false
      }
      // 造假数据（请求）
      // for (let i = 0; i < 10; i++) {
      //   this.list.push(this.list.length + 1)
      // }
      // 发起请求
      const { data } = await getArticleListApi({
        channel_id: this.channelId,
        timestamp: this.timestamp
      })
      console.log(data)// 对象
      // 追加当前分页数据 ...展开数组
      this.list.push(...data.results)
      // pre_timestamp

      // 触发onLoad事件时会自动开启loading加载状态结束=>关闭loading
      this.loading = false
      // 数据全部加载完成 判断pre_timestamp为null时加载完成
      if (!data.pre_timestamp) {
        this.finished = true
      } else {
        // 还有数据===>把查询下一页数据的时间戳pre_timestamp赋值给timestamp当前时间戳
        this.timestamp = data.pre_timestamp
      }
      // }, 1000)
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
      // 每次刷新的时候重置时间戳为当前时间
      this.timestamp = Date.now()
      this.onLoad()
    },
    // 小×
    openMore (artId) {
      this.showMore = true
      // 存储文章ID=》后续使用
      this.artId = artId
    },
    // 删除不感兴趣的
    removeArticle (id) {
      // 获取要删除文章ID的索引
      const ind = this.list.findIndex(item => item.art_id === this.artId)
      this.list.splice(ind, 1)
    }
  },
  /**
   * 1. 默认会执行一次
   * 2. 被缓存后，离开再次进入
   * 子组件没有进入提示但是有缓存的
   */
  activated () {
    // articleList组件激活时=》activated钩子中执行=》滚动列表的方法
    this.scrollList()
    console.log('子被缓存了，再次进入')
  }
  // 离开被缓存组件会被执行
  // deactivated () {
  //   console.log('子组被缓存了，离开了')
  // }

}
</script>

<style lang="less" scoped>
.article_item {
  h3 {
    font-weight: normal;
    line-height: 2;
  }
  .img_box {
    display: flex;
    justify-content: space-between;
    .w33 {
      width: 33%;
      height: 1.125rem;
    }
    .w100 {
      width: 100%;
      height: 2.25rem;
    }
  }
  .info_box {
    color: #999;
    line-height: 2;
    position: relative;
    font-size: 0.15rem;
    span {
      padding-right: 0.125rem;
      &.close {
        border: 0.0125rem solid #ddd;
        border-radius: 0.025rem;
        line-height: 0.1875rem;
        height: 0.15rem;
        width: 0.2rem;
        text-align: center;
        padding-right: 0;
        font-size: 0.1rem;
        position: absolute;
        right: 0;
        top: 0.0875rem;
      }
    }
  }
}
</style>
