module.exports = {
  // 不能转换元素行内样式的单位
  plugins: {
    'postcss-pxtorem': {
      rootValue: 37.5, // 屏宽/10 = 1rem
      propList: ['*'] // 要转换的样式属性=》*代表所有排除： '!width'
    }
  }
}
