// pages/order-confirm/order-confirm.js
const cartStore = require('../../store/CartStore')
const { callCloudWithLoading, wxPay } = require('../../utils/request')

Page({
  data: {
    items: [],
    totalPrice: 0,
    remark: '',
  },

  onLoad() {
    // 从 store 读取当前数据
    this.syncStore()
    // 订阅变化
    this._onCartChange = () => this.syncStore()
    cartStore.subscribe(this._onCartChange)
  },

  onUnload() {
    cartStore.unsubscribe(this._onCartChange)
  },

  /** 同步 store 数据 */
  syncStore() {
    this.setData({
      items: cartStore.items,
      totalPrice: cartStore.totalPrice,
    })
  },

  onRemarkInput(e) {
    this.setData({ remark: e.detail.value })
  },

  /** 提交订单 */
  async onSubmit() {
    const { totalPrice, remark } = this.data
    if (cartStore.isEmpty) {
      wx.showToast({ title: '购物车是空的', icon: 'none' })
      return
    }

    try {
      // 1. 创建订单 → 获取支付参数
      const payParams = await callCloudWithLoading('createOrder', {
        shopId: cartStore.shopId,
        items: cartStore.toOrderData().items,
        totalPrice,
        remark,
      })

      // 2. 调用微信支付
      const paid = await wxPay(payParams)
      if (!paid) {
        wx.showToast({ title: '已取消支付', icon: 'none' })
        return
      }

      // 3. 支付成功 → 清空购物车 → 跳转订单详情
      cartStore.clearCart()
      wx.redirectTo({
        url: `/pages/order-detail/order-detail?orderId=${payParams.orderId}&paid=1`,
      })
    } catch (err) {
      wx.showToast({ title: err.message || '下单失败', icon: 'none' })
    }
  },

  /** 分享给好友 */
  onShareAppMessage() {
    return {
      title: '超有趣的风格预约小程序，快来看看！',
      path: '/pages/menu/menu',
    }
  },

  /** 分享到朋友圈 */
  onShareTimeline() {
    return {
      title: '趣味预约，一键下单！',
      query: '',
    }
  },
})
