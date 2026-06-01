// app.js — 趣味预约小程序入口

App({
  onLaunch() {
    // 使用本地后端，不启用云开发
    this.globalData = {}
  },

  globalData: {
    userInfo: null,
    shopId: 'default_shop',
  },
})
