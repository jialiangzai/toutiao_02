<template>
  <div class="comment">
    <!-- 评论列表 -->
    <van-list
      v-model="loading"
      :finished="finished"
      @load="loadComments"
      finished-text="没有更多了"
      :immediate-check="false"
    >
      <div
        class="item van-hairline--bottom van-hairline--top"
        v-for="(com, index) in comments"
        :key="index"
      >
        <van-image
          round
          width="1rem"
          height="1rem"
          fit="fill"
          :src="com.aut_photo"
        />
        <div class="info">
          <p>
            <span class="name">{{ com.aut_name }}</span>
            <span style="float: right">
              <span class="van-icon van-icon-good-job-o zan"></span>
              <span class="count">{{ com.like_count }}</span>
            </span>
          </p>
          <p>{{ com.content }}</p>
          <p>
            <span class="time">{{ com.pubdate | relTime }}</span
            >&nbsp;
            <!-- <van-tag plain @click="showReply = true"
              >{{ com.reply_count }} 回复</van-tag
            > -->
            <van-tag plain @click="openReplyDialog(com.com_id)"
              >{{ com.reply_count }} 回复</van-tag
            >
          </p>
        </div>
      </div>
    </van-list>
    <!-- 底部输入框 -->
    <div class="reply-container van-hairline--top">
      <van-field
        v-model.trim="value"
        :placeholder="showReply ? '写回复' : '写评论'"
        @keyup.enter="submit"
      >
        <van-loading v-if="submiting" slot="button" type="spinner" size="16px">
        </van-loading>
        <span class="submit" v-else slot="button" @click="submit">提交</span>
      </van-field>
    </div>
    <!-- 回复弹出层 -->
    <van-action-sheet v-model="showReply" class="reply_dailog" title="回复评论">
      <!-- :immediate-check="false"手动关闭list组价自动加载 -->
      <van-list
        v-model="reply.loading"
        :finished="reply.finished"
        finished-text="没有更多了"
        :immediate-check="false"
        @load="loadReplys()"
      >
        <div
          class="item van-hairline--bottom van-hairline--top"
          v-for="item in reply.list"
          :key="item.com_id"
        >
          <van-image
            round
            width="1rem"
            height="1rem"
            fit="fill"
            :src="item.aut_photo"
          />
          <div class="info">
            <p>
              <span class="name">{{ item.aut_name }}</span>
            </p>
            <p>{{ item.content }}</p>
            <p>
              <span class="time">{{ item.pubdate | relTime }}</span>
            </p>
          </div>
        </div>
      </van-list>
    </van-action-sheet>
  </div>
</template>
<script>
import { getComments, commentOrReply } from '@/api/article'
export default {
  data () {
    return {
      // 评论列表
      comments: [],
      // 评论列表加载中状态
      loading: false,
      // 评论列表完全加载完毕状态
      finished: false,
      // 输入的内容
      value: '',
      // 分页偏移量
      offset: null,
      // 提交 评论或者回复 中
      submiting: false,
      // commentId: '', // 当前回复评论ID
      // 显示回复对话框
      showReply: false,
      reply: {
        loading: false,
        finished: false,
        list: []
      }
    }
  },
  activated () {
    this.comments = []
    this.finished = false
    this.loading = true
    this.offset = null
    this.loadComments()
  },
  methods: {
    // 评论列表
    async loadComments () {
      // 异步更新数据
      const { data } = await getComments(
        {
          type: 'a',
          source: this.$route.params.id,
          // 下一页开始请求的数据开始位置=》表示从此id的数据向后取
          offset: this.offset
        }
      )
      console.log('评论列表：', data)

      this.comments.push(...data.results)
      console.log('列表数据为：', this.comments)
      // 加载状态结束
      this.loading = false

      // 数据全部加载完成
      if (this.comments.length === data.total_count) {
        this.finished = true
      } else {
        this.offset = data.last_id
      }
    },
    // 回复
    openReplyDialog (id) {
      this.showReply = true
      this.commentId = id
      this.reply.list = []
      this.reply.loading = true
      this.reply.finished = false
      this.reply.offset = null
      this.loadReplys()
    },
    // 回复列表
    async loadReplys () {
      const { data } = await getComments({
        type: 'c', source: this.commentId, offset: this.reply.offset
      })
      this.reply.list.push(...data.results)
      // 结束加载状态
      this.reply.loading = false
      // if (data.results.length === this.reply.list.length) {
      if (data.last_id > data.end_id) {
        this.reply.offset = data.last_id
      } else {
        this.reply.finished = true
      }
    },
    async submit () {
      if (!this.value) return false
      // 提交
      this.submiting = true
      try {
        if (this.showReply) {
          // 回复
          const { data } = await commentOrReply(this.commentId, this.value, this.$route.params.id)
          this.$toast.success('回复成功')
          console.log(data)
          this.reply.list.unshift(data.new_obj)
          // 数字加1
          const comment = this.comments.find(item => item.com_id === this.commentId)
          // comment是一个对象
          console.log('commot是：', comment)
          comment.reply_count++
        } else {
          // 评论
          const { data } = await commentOrReply(
            this.$route.params.id, this.value
          )
          console.log('当前新增评论数据：', data.new_obj)

          this.comments.unshift(data.new_obj)
          this.$toast.success('评论成功')
        }
        // 评论或者回复
        this.submiting = false
        // 清空内容
        this.value = ''
      } catch (error) {
        this.submiting = false
        this.$toast.fail('操作失败')
      }
    }
  }
}
</script>
<style lang="less" scoped>
.comment {
  margin-top: 10px;
  /deep/ .item {
    display: flex;
    padding: 10px 0;
    width: 100%;
    overflow: hidden;
    text-align: left;
    .info {
      flex: 1;
      padding-left: 10px;
      .name {
        color: #069;
      }
      .zan {
        vertical-align: middle;
        padding-right: 2px;
      }
      .count {
        vertical-align: middle;
        font-size: 10px;
        color: #666;
      }
      .time {
        color: #666;
      }
      p {
        padding: 5px 0;
        margin: 0;
      }
    }
  }
  /deep/ .van-button:active::before {
    background: transparent;
  }
}
.reply-container {
  position: fixed;
  left: 0;
  bottom: 0;
  height: 44px;
  width: 100%;
  background: #f5f5f5;
  z-index: 9999;
  .submit {
    font-size: 12px;
    color: #3296fa;
  }
}
.content {
  padding: 16px 16px 160px;
}
.van-popup--bottom {
  &.van-popup--round {
    border-radius: 0;
  }
}
.reply_dailog {
  height: 100%;
  max-height: 100%;
  display: flex;
  overflow: hidden;
  flex-direction: column;
  .van-action-sheet__header {
    background: #3296fa;
    color: #fff;
    .van-icon-close {
      color: #fff;
    }
  }
  .van-action-sheet__content {
    flex: 1;
    overflow-y: auto;
    padding: 0 10px 44px;
  }
}
</style>
