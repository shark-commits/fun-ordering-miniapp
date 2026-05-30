// app.js — 趣味点餐小程序入口
var mockConfig = require('./utils/request')

App({
  onLaunch() {
    // 云开发未开通时跳过初始化，避免超时
    if (!mockConfig.MOCK_ENABLED) {
      if (!wx.cloud) {
        console.error('请使用 2.2.3 或以上的基础库以使用云能力')
      } else {
        wx.cloud.init({
          traceUser: true,
        })
      }
    }
    this.globalData = {}
  },

  globalData: {
    userInfo: null,
    shopId: 'default_shop',
  },
})
