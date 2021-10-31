<template>
  <!-- @closed="editing=false" 关闭屉式菜单  重置编辑状态为不编辑 -->
  <van-action-sheet
    :value="value"
    @closed="editing = false"
    @input="$emit('input', $event)"
    title="编辑频道"
    position="top"
  >
    <div class="channel">
      <div class="tit">
        我的频道：
        <span class="tip">点击可进入频道</span>
        <van-button
          v-if="!editing"
          @click="editing = true"
          size="mini"
          type="info"
          plain
          >编辑</van-button
        >
        <van-button
          v-else
          @click="editing = false"
          size="mini"
          type="danger"
          plain
          >完成</van-button
        >
      </div>
      <!-- 我的 -->
      <van-grid class="van-hairline--left">
        <van-grid-item v-for="(channel, i) in Channels" :key="channel.id">
          <span
            class="f12"
            :class="{ red: activeIndex === i }"
            @click="clss(i)"
            >{{ channel.name }}</span
          >
          <van-icon
            v-show="editing && i !== 0"
            class="btn"
            name="cross"
            @click="delChannel(channel.id, i)"
          ></van-icon>
        </van-grid-item>
      </van-grid>
    </div>
    <!-- 可选 -->
    <div class="channel">
      <div class="tit">可选频道：</div>
      <van-grid class="van-hairline--left">
        <van-grid-item v-for="item in optionalChannels" :key="item.id">
          <span class="f12">频道{{ item.name }}</span>
          <!-- 添加 -->
          <van-icon
            class="btn"
            name="plus"
            @click="addChannels(item)"
          ></van-icon>
        </van-grid-item>
      </van-grid>
    </div>
  </van-action-sheet>
</template>
<script>
import { getAllChannels, delChannel, addChannel } from '@/api/channel'
export default {
  props: {
    // 打开/关闭的状态
    value: {
      type: Boolean,
      default: false
    },
    // 当前激活的频道
    activeIndex: {
      type: Number,
      default: 0
    },
    // 已选择频道
    Channels: {
      type: Array,
      default: () => []
    }
  },
  data () {
    return {
      // 编辑状态
      editing: false,
      allChannels: []
    }
  },
  created () {
    this.getAllChannels()
  },
  methods: {
    // 进入
    clss (i) {
      // console.log(i)
      this.$emit('update:activeIndex', i)
      // 关闭弹层
      this.$emit('input', false)
    },
    async getAllChannels () {
      const { status, data } = await getAllChannels()
      if (status === 200) {
        console.log(data)
        // 存储到data上
        this.allChannels = data.channels
      }
    },
    // 删除
    async delChannel (id, i) {
      try {
        await delChannel(id)
        this.$toast.success('删除成功！')
        // 当前激活的索引值：如果是当前激活的前边频道数据被删除需要更新索引值=》向前进一位
        // 当前选中频道，删除后错位问题
        if (i < this.activeIndex) {
          this.$emit('update:activeIndex', this.activeIndex - 1)
        }
        // 前端 复杂的只能改值不能把地址改了
        this.Channels.splice(i, 1)
      } catch (error) {
        this.$toast.fail('删除失败！')
      }
    },
    // 添加
    async addChannels (channel) {
      console.log(channel)
      // 先处理选中的频道
      const newChannels = this.Channels.map((item, i) => {
        return {
          id: item.id,
          seq: i
        }
      })
      // newChannels.push({ id: channel.id, seq: newChannels.length })
      newChannels.push({ ...channel, seq: newChannels.length })
      // 删除推荐的
      newChannels.shift()
      console.log('处理完数据结构：', newChannels)

      try {
        await addChannel(newChannels)
        this.$toast.success('添加成功！')
        // 更新父组件中我的频道数据
        this.Channels.push({ ...channel })
      } catch (error) {
        console.dir(error)
        this.$toast.fail('添加失败！')
      }
    }
  },
  computed: {
    optionalChannels () {
      return this.allChannels.filter(all => {
        return !this.Channels.some(my => my.id === all.id)
      })
    }
  }
}
</script>
<style lang="less" scoped>
.van-popup--left {
  &.van-popup--round {
    border-radius: 0;
  }
}
.van-action-sheet {
  max-height: 100%;
  height: 100%;
  .van-action-sheet__header {
    background: #fc6627;
    color: #fff;
    .van-icon-close,
    .van-action-sheet__close {
      color: #fff;
    }
  }
}
.channel {
  padding: 10px;
  .tit {
    line-height: 3;
    text-align: left;
    .tip {
      font-size: 10px;
      color: #999;
    }
  }
  .van-button {
    float: right;
    margin-top: 7px;
  }
  .btn {
    position: absolute;
    bottom: 0;
    right: 0;
    background: #ddd;
    font-size: 12px;
    color: #fff;
  }
  .f12 {
    font-size: 12px;
    color: #555;
  }
  .red {
    color: red;
  }
}
</style>
