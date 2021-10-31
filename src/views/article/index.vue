<template>
  <div class="container" ref="container" @scroll="remember($event)">
    <van-nav-bar
      fixed
      title="文章详情"
      left-arrow
      @click-left="$router.back()"
    />
    <div class="detail">
      <h3 class="title">{{ detail.title }}</h3>
      <div class="author">
        <van-image
          round
          width="1rem"
          height="1rem"
          fit="fill"
          :src="detail.aut_photo"
        />
        <div class="text">
          <p class="name">{{ detail.aut_name }}</p>
          <p class="time">{{ detail.pubdate | relTime }}</p>
        </div>
        <van-button round size="small" type="info" @click="toggleFllow">{{
          detail.is_followed ? "已关注" : "+关注"
        }}</van-button>
      </div>
      <div class="content" v-html="detail.content"></div>
      <div class="zan">
        <van-button
          @click="toggleLike(1)"
          :class="{ active: detail.attitude === 1 }"
          round
          size="small"
          plain
          icon="like-o"
          >点赞</van-button
        >
        &nbsp;&nbsp;&nbsp;&nbsp;
        <van-button
          @click="toggleLike(0)"
          :class="{ active: detail.attitude === 0 }"
          round
          size="small"
          plain
          icon="delete"
          >不喜欢</van-button
        >
        <!-- 评论 -->
        <Comment />
      </div>
    </div>
  </div>
</template>

<script>
import {
  getDetailById, disLike,
  unDisLike,
  like,
  unLike
} from '@/api/article'
import {
  follow,
  unFollow
} from '@/api/user'
import Comment from './components/comment.vue'
export default {
  name: 'articles',
  data () {
    return {
      detail: {},
      scrollTop: 0
    }
  },
  components: {
    Comment
  },
  // created () {
  //   this.getDetailById()
  // },
  activated () {
    if (this.detail.art_id !== this.$route.params.id) {
      this.scrollTop = 0
      // 进入缓存的组件就会重新获取最新数据 时效性
      this.getDetailById()
    } else {
      this.scrollTop && (this.$refs.container.scrollTop = this.scrollTop)
    }
  },
  methods: {
    async getDetailById () {
      const { status, data } = await getDetailById(this.$route.params.id)
      if (status === 200) {
        this.detail = data
        // console.log(data)
      }
    },
    remember (e) {
      this.scrollTop = e.target.scrollTop
    },
    // 关注、取关this.detail.is_followed默认为false
    async toggleFllow () {
      try {
        if (this.detail.is_followed) {
          // 取消关注
          await unFollow(this.detail.aut_id)
          this.$toast('取关成功!')
          this.detail.is_followed = false
        } else {
          // 添加关注
          await follow(this.detail.aut_id)
          this.$toast('关注成功!')
          this.detail.is_followed = true
        }
      } catch (error) {
        this.$toast.fail(error.message)
      }
    },
    // 喜欢不喜欢 -1表示无感
    async toggleLike (type) {
      try {
        // type为1 喜欢或取消喜欢
        if (type === 1) {
          // 当前的喜欢按钮是1
          if (this.detail.attitude === 1) {
            // 点击后不喜欢
            await unLike(this.detail.art_id)
            // 更新状态
            this.detail.attitude = -1
          } else {
            await like(this.detail.art_id)
            // 更新状态
            this.detail.attitude = 1
          }
        } else {
          // 不喜欢、取消不喜欢
          if (this.detail.attitude === 0) {
            await unDisLike(this.detail.art_id)
            this.detail.attitude = -1
          } else {
            await disLike(this.detail.art_id)
            this.detail.attitude = 0
          }
        }
        // 统一提示
        this.$toast.success('操作成功！')
      } catch (error) {
        this.$toast.fail('操作失败！')
      }
    }
  }
}
</script>

<style scoped lang='less'>
.container {
  height: 100%;
  overflow-y: auto;
  box-sizing: border-box;
}
.detail {
  padding: 46px 10px 44px;
  // height: 1000%;
  .title {
    font-size: 18px;
    line-height: 2;
  }
  .zan {
    text-align: center;
    padding: 10px 0;
    .active {
      border-color: red;
      color: red;
    }
  }
  .author {
    padding: 10px 0;
    display: flex;
    .text {
      flex: 1;
      padding-left: 10px;
      line-height: 1.5;
      text-align: left;
      .name {
        font-size: 14px;
        margin: 0;
      }
      .time {
        margin: 0;
        font-size: 12px;
        color: #999;
      }
    }
  }
  // 内容中包含：img 特别宽  code pre 不能换行
  .content {
    padding: 20px 0;
    overflow: hidden;
    white-space: pre-wrap;
    word-break: break-all;
    /deep/ img {
      max-width: 100%;
      background: #f9f9f9;
    }
    /deep/ code {
      white-space: pre-wrap;
    }
    /deep/ pre {
      white-space: pre-wrap;
    }
  }
}
</style>
