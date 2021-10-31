<template>
  <div class="container">
    <!-- 导航固定定位 fixed -->
    <van-nav-bar
      fixed
      title="搜索结果"
      left-arrow
      @click-left="$router.back()"
    />
    <!-- 文章列表 -->
    <van-list
      v-model="loading"
      :finished="finished"
      @load="onLoad"
      finished-text="没有更多了"
    >
      <van-cell
        v-for="(item, index) in articles"
        :key="index"
        :to="'/article/' + item.art_id"
      >
        <div class="article_item">
          <h3 class="van-ellipsis">
            {{ item.title }}
          </h3>
          <div class="img_box" v-if="item.cover.type === 3">
            <van-image
              refererpolicy="no-Referer"
              class="w33"
              fit="cover"
              :src="item.cover.images[0]"
            />
            <van-image
              refererpolicy="no-Referer"
              class="w33"
              fit="cover"
              :src="item.cover.images[1]"
            />
            <van-image
              refererpolicy="no-Referer"
              class="w33"
              fit="cover"
              :src="item.cover.images[2]"
            />
          </div>
          <div class="img_box" v-if="item.cover.type === 1">
            <van-image
              refererpolicy="no-Referer"
              class="w100"
              fit="cover"
              :src="item.cover.images[0]"
            />
          </div>

          <!-- <van-image
              class="w33"
              fit="cover"
              :src="item.images[0]"
            />
            <van-image
              class="w33"
              fit="cover"
              :src="item.images[0]"
            /> -->

          <!-- <van-image
              class="w33"
              fit="cover"
              src="https://img.yzcdn.cn/vant/cat.jpeg"
            /> -->
          <div class="info_box">
            <span>{{ item.aut_name }}</span>
            <span>{{ item.comm_count }}评论</span>
            <span>{{ item.pubdate | relTime }}</span>
          </div>
        </div>
      </van-cell>
    </van-list>
  </div>
</template>

<script>
import { searchArticles } from '@/api/article'
export default {
  name: 'search-result',
  data () {
    return {
      list: [],
      loading: false,
      finished: false,
      // 文章列表
      articles: [],
      // 在data声明的是响应式数据，但是还有一种形式在created 声明一个this对象点的形式他就是临时加的属性实际也不需要响应式
      querys: {
        page: 1,
        per_page: 20,
        q: this.$route.query.q
      }
    }
  },
  // created () {
  // 初始化默认=》查询条件数据 为在data中写的数据都是死数据不会响应
  // 目的也没有响应
  // this.query = {
  //   page: 1,
  //   q: this.$route.query.keyWord
  // }
  // },
  methods: {
    async onLoad () {
      // 异步更新数据
      try {
        const { data, status } = await searchArticles(this.querys)
        console.log(data)
        if (status === 200) {
          this.articles.push(...data.results)
          // 加载状态结束
          this.loading = false

          // 数据全部加载完成
          // if (this.articles.length === 10) {
          if (this.articles.length === data.total_count) {
            this.finished = true
          } else {
            this.querys.page++
          }
        }
      } catch (error) {
        this.$toast('操作失败')
      }
    }
  }
}
</script>

<style scoped lang='less'>
.container {
  padding-top: 46px;
  height: 100%;
  overflow-y: auto;
  box-sizing: border-box;
}
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
      height: 90px;
    }
    .w100 {
      height: 180px;
      width: 100%;
    }
  }
  .info_box {
    color: #999;
    line-height: 2;
    position: relative;
    span {
      padding-right: 10px;
    }
  }
}
</style>
