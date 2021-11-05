<template>
  <!-- 嵌套v-model会报错 子改父 -->
  <!-- <van-popup :value="value" @input="$emit('input', $event布尔值)">内容</van-popup> -->
  <!-- <van-popup v-model="value">内容</van-popup> -->
  <!-- get-container="body" -->
  <van-popup
    get-container="#app"
    :value="value"
    @input="$emit('input', $event)"
    @open="isReport = false"
  >
    <!-- 默认插槽 -->
    <van-cell-group v-if="!isReport">
      <van-cell @click="disLiske()" icon="closed-eye">不感兴趣</van-cell>
      <van-cell is-link @click="isReport = true">反馈垃圾内容</van-cell>
      <van-cell icon="info-o">拉黑作者</van-cell>
    </van-cell-group>
    <van-cell-group v-else>
      <van-cell icon="arrow-left" @click="isReport = false">返回</van-cell>
      <!-- 模拟字典 因为为每个cell绑定click事件请求，性能差 -->
      <van-cell
        @click="reportArt(item.label)"
        v-for="item in reports"
        :key="item.value"
        >{{ item.label }}</van-cell
      >
      <!-- <van-cell>色情</van-cell>
      <van-cell>暴力</van-cell>
      <van-cell>低俗</van-cell>
      <van-cell>不适</van-cell>

      <van-cell>错误</van-cell>
      <van-cell>其他</van-cell> -->
    </van-cell-group>
  </van-popup>
</template>

<script>
import { reports } from '@/utils/const'
import { disLikeById, reportById } from '@/api/article'
export default {
  props: {
    value: {
      type: Boolean,
      default: false
    },
    // 文章ID
    artId: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      // 是否显示上报垃圾内容
      isReport: false,
      // 引入不感兴趣
      reports
    }
  },
  methods: {
    async disLiske () {
      try {
        // console.log(this.ati)  //undefined
        await disLikeById(this.artId)
        // 通知父组件删除当前文章
        this.$emit('on-dislike')
        // 关闭弹出层
        this.$emit('input', false)
        this.$toast.success('不感兴趣成功！')
      } catch (error) {
        this.$toast.fail('操作失败！')
      }
    },
    // 举报
    async reportArt (type) {
      try {
        await reportById(this.articleId, type)
        this.$toast.success('举报成功！')
        this.$emit('on-report')
        this.$emit('input', false)
      } catch (error) {

      }
    }
  }
}
</script>

<style scoped lang='less'>
.van-popup {
  width: 80%;
  border-radius: 4px;
}
</style>
