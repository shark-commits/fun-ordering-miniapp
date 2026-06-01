// pages/order-confirm/order-confirm.js
var cartStore = require('../../store/CartStore')
var callCloud = require('../../utils/request').callCloud

Page({
  data: {
    items: [],
    totalPrice: 0,
    remark: '',
    customRemark: '',
    remarkChips: {},
    remarkOptions: ['加急', '需要提前沟通', '特殊风格要求', '安静偏好', '活泼偏好', '过敏提醒'],
  },

  onLoad() {
    this.syncStore()
    this._onCartChange = () => this.syncStore()
    cartStore.subscribe(this._onCartChange)
  },

  onUnload() {
    cartStore.unsubscribe(this._onCartChange)
  },

  syncStore() {
    this.setData({
      items: cartStore.items,
      totalPrice: cartStore.totalPrice,
    })
  },

  onBack() {
    wx.navigateBack({ delta: 1 })
  },

  onRemarkInput(e) {
    this.setData({ customRemark: e.detail.value })
    this.buildRemark()
  },

  onToggleChip(e) {
    var value = e.currentTarget.dataset.value
    var chips = this.data.remarkChips
    chips[value] = !chips[value]
    this.setData({ remarkChips: chips })
    this.buildRemark()
  },

  buildRemark() {
    var chips = this.data.remarkChips
    var custom = this.data.customRemark || ''
    var selected = Object.keys(chips).filter(function (k) { return chips[k] })
    var parts = selected.concat(custom ? [custom] : [])
    this.setData({ remark: parts.join('；') })
  },

  onDecrease(e) {
    var id = e.currentTarget.dataset.id
    var key = e.currentTarget.dataset.key
    var item = cartStore.getItem(id, key)
    if (item && item.quantity > 1) {
      cartStore.updateQuantity(id, key, item.quantity - 1)
    } else {
      cartStore.removeItem(id, key)
    }
  },

  onIncrease(e) {
    var id = e.currentTarget.dataset.id
    var key = e.currentTarget.dataset.key
    var item = cartStore.getItem(id, key)
    if (item) {
      cartStore.updateQuantity(id, key, item.quantity + 1)
    }
  },

  onSubmit() {
    var that = this
    var totalPrice = this.data.totalPrice
    var remark = this.data.remark
    if (cartStore.isEmpty) {
      wx.showToast({ title: '购物车是空的', icon: 'none' })
      return
    }

    wx.showModal({
      title: '确认支付',
      content: '需支付 ¥' + totalPrice + '，确认下单吗？',
      confirmText: '确认支付',
      cancelText: '再想想',
      confirmColor: '#F26B5E',
      success: function (res) {
        if (!res.confirm) return
        wx.showLoading({ title: '支付中...', mask: true })
        setTimeout(function () {
          wx.hideLoading()
          var orderId = 'ORD' + Date.now()
          var orderNo = 'F' + (Date.now() + '').slice(-8)
          var items = that.data.items
          callCloud('createOrder', { items, totalPrice, remark })
            .then(function (serverOrder) {
              orderId = serverOrder.orderId
              orderNo = serverOrder.orderNo
              finishOrder(orderId, orderNo, items, totalPrice, remark, serverOrder.createTime)
            })
            .catch(function () {
              finishOrder(orderId, orderNo, items, totalPrice, remark, formatNow())
            })
        }, 800)
      },
    })
  },

  onShareAppMessage() {
    return { title: '超有趣的风格预约小程序，快来看看！', path: '/pages/menu/menu' }
  },

  onShareTimeline() {
    return { title: '趣味预约，一键下单！', query: '' }
  },
})

function finishOrder(orderId, orderNo, items, totalPrice, remark, createTime) {
  try {
    var cached = wx.getStorageSync('ORDER_HISTORY_CACHE') || []
    cached.unshift({ orderId, orderNo, items, totalPrice, remark, status: 'paid', createTime, _timestamp: Date.now() })
    if (cached.length > 50) cached = cached.slice(0, 50)
    wx.setStorageSync('ORDER_HISTORY_CACHE', cached)
    wx.setStorageSync('ORDER_HISTORY', cached)
  } catch (e) {}
  cartStore.clearCart()
  wx.redirectTo({
    url: '/pages/order-detail/order-detail?orderId=' + orderId
      + '&paid=1&totalPrice=' + totalPrice + '&orderNo=' + orderNo
      + '&items=' + encodeURIComponent(JSON.stringify(items))
      + '&remark=' + encodeURIComponent(remark),
  })
}

function formatNow() {
  var d = new Date()
  var pad = function (n) { return (n < 10 ? '0' : '') + n }
  return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate())
    + ' ' + pad(d.getHours()) + ':' + pad(d.getMinutes()) + ':' + pad(d.getSeconds())
}
