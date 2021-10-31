<template>
  <!-- 小智 -->
  <div class="container">
    <van-nav-bar
      fixed
      left-arrow
      @click-left="$router.back()"
      title="小智同学"
    ></van-nav-bar>
    <div class="chat-list" ref="chatList">
      <!-- 小智 -->
      <div
        v-for="(item, index) in list"
        :key="index"
        class="chat-item"
        :class="{ left: item.name === 'xz', right: item.name === 'my' }"
      >
        <van-image fit="cover" round v-if="item.name === 'xz'" :src="xza" />
        <div class="chat-pao">{{ item.msg }}</div>
        <van-image fit="cover" round v-if="item.name === 'my'" :src="photo" />
      </div>
      <!-- my -->
      <!-- <div class="chat-item right">
        <div class="chat-pao">ewqewq</div>
        <van-image fit="cover" round src="https://img.yzcdn.cn/vant/cat.jpeg" />
      </div> -->
    </div>
    <!-- 底部 -->
    <div class="reply-container van-hairline--top">
      <van-field @keyup.enter="send" v-model="value" placeholder="说点什么...">
        <span @click="send()" slot="button" style="font-size: 12px; color: #999"
          >提交</span
        >
      </van-field>
    </div>
  </div>
</template>

<script>
// 引入小智头像
import xza from '@/assets/logo.png'
import { mapState } from 'vuex'
import io from 'socket.io-client'
export default {
  name: 'user-chat',
  data () {
    return {
      value: '',
      // 聊天记录
      list: [
        // { name: 'xz', msg: '你好！我是小智' },
        // { name: 'my', msg: '你好' }
      ],
      xza,
      // ws/socket实例
      socket: null
    }
  },
  computed: {
    ...mapState('chat', ['photo'])
  },
  deactivated () {
    this.socket.close()
  },
  created () {
    this.initSocket()
  },

  methods: {
    send () {
      // 实时通讯---发送
      this.socket.emit('message', { msg: this.value, timestamp: Date.now() })
      this.scrollBottom()
      this.list.push({ name: 'my', msg: this.value })
      this.value = ''
    },
    initSocket () {
      this.socket = io('http://geek.itheima.net', {
        query: {
          token: this.$store.state.user.token
        },
        transports: ['websocket']
      })
      // 连接
      this.socket.on('connect', () => {
        console.log('连接成功！')
        this.list.push({ name: 'xz', msg: '你好！我是小智' })
      })
      // 实时通讯---发送

      // 实时通讯---接收
      this.socket.on('message', data => {
        console.log(data)
        this.list.push({ name: 'xz', msg: data.msg })
        this.scrollBottom()
      })
    },

    scrollBottom () {
      //  等list列表渲染完，执行滚动
      this.$nextTick(() => {
        // 卷去头部的就是要滚动的高度 scrollHeight整个高度
        this.$refs.chatList.scrollTop = this.$refs.chatList.scrollHeight
      })
    }
  }
}
</script>

<style scoped lang='less'>
.container {
  height: 100%;
  width: 100%;
  position: absolute;
  left: 0;
  top: 0;
  box-sizing: border-box;
  background: #fafafa;
  padding: 46px 0 50px 0;
  .chat-list {
    height: 100%;
    overflow-y: scroll;
    .chat-item {
      padding: 10px;
      .van-image {
        vertical-align: top;
        width: 40px;
        height: 40px;
      }
      .chat-pao {
        vertical-align: top;
        display: inline-block;
        min-width: 40px;
        max-width: 70%;
        min-height: 40px;
        line-height: 38px;
        border: 0.5px solid #c2d9ea;
        border-radius: 4px;
        position: relative;
        padding: 0 10px;
        background-color: #e0effb;
        word-break: break-all;
        font-size: 14px;
        color: #333;
        &::before {
          content: "";
          width: 10px;
          height: 10px;
          position: absolute;
          top: 12px;
          border-top: 0.5px solid #c2d9ea;
          border-right: 0.5px solid #c2d9ea;
          background: #e0effb;
        }
      }
    }
  }
}
.chat-item.right {
  text-align: right;
  .chat-pao {
    margin-left: 0;
    margin-right: 15px;
    &::before {
      right: -6px;
      transform: rotate(45deg);
    }
  }
}
.chat-item.left {
  text-align: left;
  .chat-pao {
    margin-left: 15px;
    margin-right: 0;
    &::before {
      left: -5px;
      transform: rotate(-135deg);
    }
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
}
</style>
