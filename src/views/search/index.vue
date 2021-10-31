<template>
  <div class="container">
    <van-nav-bar title="搜索中心" left-arrow @click-left="$router.back()" />

    <van-search
      v-model.trim="keyWord"
      placeholder="请输入搜索关键词"
      shape="round"
      @search="onSearch"
      @cancel="onCancel"
    />

    <van-cell-group v-if="keyWord" class="suggest-box">
      <!-- span高亮联想关键词 -->
      <van-cell
        icon="search"
        v-for="(sug, index) in suggestList"
        :key="index"
        @click="onSearch(sug.replace(`<span>${keyWord}</span>`, keyWord))"
      >
        <!-- 此时要转换为纯字符串 -->
        <p v-html="sug"></p>
      </van-cell>
    </van-cell-group>

    <div v-else-if="historyList" class="history-box">
      <div class="head">
        <span>历史记录</span>
        <!-- 清空全部 -->
        <van-icon name="delete" @click="clearHistory"></van-icon>
      </div>
      <van-cell-group>
        <van-cell icon="location-o" v-for="(his, i) in historyList" :key="i">
          <a class="word_btn" @click="onSearch(his)">{{ his }}</a>
          <van-icon
            @click="delHistory(his)"
            class="close_btn"
            slot="right-icon"
            name="cross"
          />
        </van-cell>
      </van-cell-group>
    </div>
  </div>
</template>

<script>
// 初始化历史记录数据
// 假数据
// localStorage.setItem('TT_HS', JSON.stringify(['1024', 'mi', 'honar']))
import { suggest } from '@/api/article'
const TT_HS = 'TT_HS'
export default {
  name: 'search-index',
  data () {
    return {
      // 联想建议列表
      suggestList: [],
      keyWord: '',
      timer: null,
      // 初始化历史记录 有历史记录数据才显示历史记录
      historyList: JSON.parse(localStorage.getItem(TT_HS)) || []
    }
  },
  methods: {
    // 进行搜索：用户输入关键词后，回车确认进入搜索页
    onSearch (val) {
      // console.log(val)
      // 根据历史去搜索结果页面=>可以和搜索输入框共用一个函数    联想建议和历史记录都是用onSearch事件
      // q是搜索关键词
      if (!val) return
      // 存储搜索历史 (key不能存重复的)  集合
      const kset = new Set(this.historyList)
      kset.add(val)
      this.historyList = Array.from(kset)
      // this.historyList = [...kset]
      // 存储到本地
      localStorage.setItem(TT_HS, JSON.stringify(this.historyList))
      // 跳转搜索结果
      this.$router.push({ path: '/search/result', query: { q: val } })
    },
    onCancel () {
      this.$toast('取消')
    },
    delHistory (ite) {
      // 输入的数据 console.log(item)
      const index = this.historyList.findIndex(item => item === ite)
      this.historyList.splice(index, 1)
      // 本地删除
      localStorage.setItem(TT_HS, JSON.stringify(this.historyList))
    },
    clearHistory () {
      this.historyList = []
      localStorage.removeItem(TT_HS)
    }
  },
  // 监听输入的数据内容发送请求响应不同的联想建议
  watch: {
    keyWord () {
      this.timer && clearTimeout(this.timer)
      this.timer = setTimeout(async () => {
        if (!this.keyWord) {
          this.suggestList = []
          return
        }
        try {
          const { data, status } = await suggest(this.keyWord)
          if (status === 200) {
            // console.log(data)
            if (data.options[0] === null) return
            this.suggestList = data.options.map((item) => item.toLowerCase().replace(this.keyWord, `<span>${this.keyWord}</span>`))
            // console.log(this.suggestList)
          }
        } catch (error) {
          console.dir(error)
          this.$toast('搜索失败')
        }
      }, 500)
    },
    immediate: true
  }

}
</script>

<style scoped lang='less'>
.suggest-box {
  /deep/ .van-cell {
    padding: 10px 20px;
    color: #999;
    p {
      span {
        color: red;
      }
    }
  }
}
.history-box {
  padding: 0 20px;
  .head {
    line-height: 36px;
    color: #999;
    text-align: left;
    .van-icon {
      font-size: 16px;
      float: right;
      margin-top: 10px;
    }
  }
  .van-cell {
    padding: 10px 0;
  }
  .word_btn {
    color: #3296fa;
  }
  .close_btn {
    margin-top: 5px;
    color: #999;
  }
}
</style>
