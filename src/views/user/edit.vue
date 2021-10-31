<template>
  <!-- 编辑 -->
  <div class="container">
    <van-nav-bar
      left-arrow
      @click-left="$router.back()"
      title="编辑资料"
      right-text="保存"
      @click-right="save"
    />
    <!-- 用户资料 -->
    <van-cell-group>
      <van-cell is-link title="头像" @click="showPhoto = true" center>
        <van-image
          slot="default"
          width="1.5rem"
          height="1.5rem"
          fit="cover"
          round
          :src="photo"
        />
      </van-cell>
      <van-cell
        is-link
        title="名称"
        @click="showName = true"
        :value="user.name"
      />
      <van-cell
        is-link
        title="性别"
        @click="showGender = true"
        :value="user.gender === 0 ? '男' : '女'"
      />
      <van-cell
        is-link
        title="生日"
        @click="openDate()"
        :value="user.birthday"
      />
    </van-cell-group>
    <!-- 资料修改 -->
    <van-popup v-model="showPhoto" position="bottom">
      <input type="file" ref="fileInput" @change="preview" hidden />
      <van-cell value="本地相册选择" is-link @click="$refs.fileInput.click()" />
      <van-cell value="拍照" is-link />
    </van-popup>
    <van-popup v-model="showName" position="bottom">
      <van-field v-model="user.name" required placeholder="请输入用户名" />
    </van-popup>
    <van-popup v-model="showGender" position="bottom">
      <van-cell value="男" @click="changeGender(0)" is-link />
      <van-cell value="女" @click="changeGender(1)" is-link />
    </van-popup>
    <van-popup v-model="showBirthday" position="bottom">
      <van-datetime-picker
        title="选择生日"
        v-model="nowDate"
        type="date"
        :min-date="minDate"
        :max-date="maxDate"
        @cancel="showBirthday = false"
        @confirm="confirmDate"
      />
    </van-popup>
  </div>
</template>

<script>
import dayjs from 'dayjs'
import { getUserProfile0, updateUserPhoto, updateUserInfo } from '@/api/user'
import { mapMutations } from 'vuex'
// 本地持久化token；将来实现刷新token，需要存储的信息。关闭浏览器后再次打开，需要保持登录状态。
/**
 * 1. 获取到手机号和验证码
2. 使用手机号和验证码作为接口参数发送登录请求
3. 登录请求成功=》后台返回什么？=》token(登录成功的标识)=》存到localStorage中
4. 跳转到后台的首页

 */
export default {
  name: 'user-profile',
  data () {
    return {
      // 弹窗控制
      showPhoto: false,
      showName: false,
      showGender: false,
      showBirthday: false,
      // 当前选中日期
      nowDate: new Date(),
      // 最小可选日期
      minDate: new Date('1950-01-01'),
      // 日期控件 最大可选日期
      maxDate: new Date(),
      photo: 'https://img.yzcdn.cn/vant/cat.jpeg',
      // 编辑后的用户信息 头像另存，昵称、生日、性别
      user: {
        name: '默认信息',
        gender: 0,
        birthday: ''
      }
    }
  },
  created () {
    this.getInfo()
  },
  methods: {
    ...mapMutations('chat', ['setPhoto']),
    async save () {
      // this.$toast.success('保存成功')
      // 1. 判断选择图片后才执行上传，默认图片选择弹层没有加载
      // 2. 性别信息保存失败
      //  updateUserPhoto, updateUserInfo

      try {
        // 存在dominput file 且有文件
        // 可以用es10
        // 判断条件this.$refs.fileInput?.files[0]
        if (this.$refs.fileInput && this.$refs.fileInput.files[0]) {
          const { data } = await updateUserPhoto(this.$refs.fileInput.files[0])
          console.log(data)
          // 更新登录人头像
          this.setPhoto(data.photo)
          // 更新用户信息
          await updateUserInfo(this.user)
          this.$toast.success('修改成功')
        }
      } catch (error) {
        this.$toast.fail('修改失败')
      }
    },
    // 方法
    // methods
    // 打开日期选择
    openDate () {
      // 有生日数据
      if (this.user.birthday) {
        this.nowDate = new Date(this.user.birthday)
      }
      this.showBirthday = true
    },
    created () {
      this.getInfo()
    },
    // 确认选择日期
    confirmDate (value) {
      // 确认时间后  把Date转换成String
      this.user.birthday = dayjs(value).format('YYYY-MM-DD')
      this.showBirthday = false
    },
    changeGender (gender) {
      // 选择性别 gender 0 男  1 女
      this.user.gender = gender
      this.showGender = false
    },
    // 获取待编辑信息（登录人）
    async getInfo () {
      try {
        const { data } = await getUserProfile0()
        console.log(data)
        this.user = data
        this.photo = data.photo
      } catch (error) {
        this.$toast('信息错误')
      }
    },
    // 预览头像
    preview () {
      // 获取 e.target.files[0] 也可以
      const file = this.$refs.fileInput.files[0]
      // 创建读取器
      const fr = new FileReader()
      // 读取
      fr.readAsDataURL(file)
      // 加载
      fr.onload = () => {
        this.photo = fr.result
        // 关闭头像修改弹出层
        this.showPhoto = false
        this.$toast('修改头像成功！')
      }
    }
  }
}
</script>

<style scoped lang='less'></style>
