// pages/orders/orders.js
// 预约记录 — 纯前端 mock，订单数据从本地 localStorage 读取

var callCloud = require('../../utils/request').callCloud

var STATUS_MAP = {
  pending: '待支付',
  paid: '安排中',
  preparing: '服务中',
  done: '已完成',
  cancelled: '已取消',
}

Page({
  data: {
    orders: [],
  },

  onShow() {
    this.loadOrders()
  },

  /** 加载历史订单 */
  loadOrders() {
    var that = this
    callCloud('getOrders')
      .then(function (res) {
        var orders = (res.orders || []).map(function (o) {
          o.statusText = STATUS_MAP[o.status] || '安排中'
          return o
        })
        orders.sort(function (a, b) {
          return (b._timestamp || 0) - (a._timestamp || 0)
        })
        that.setData({ orders: orders })
      })
      .catch(function () {
        that.setData({ orders: [] })
      })
  },

  /** 点击订单卡片 → 跳详情 */
  onTapOrder(e) {
    var orderId = e.currentTarget.dataset.id
    var orders = this.data.orders
    var order = null
    for (var i = 0; i < orders.length; i++) {
      if (orders[i].orderId === orderId) {
        order = orders[i]
        break
      }
    }
    if (!order) return

    wx.navigateTo({
      url: '/pages/order-detail/order-detail?orderId=' + order.orderId
        + '&paid=1&totalPrice=' + order.totalPrice
        + '&orderNo=' + order.orderNo
        + '&items=' + encodeURIComponent(JSON.stringify(order.items))
        + '&remark=' + encodeURIComponent(order.remark || ''),
    })
  },

  /** 返回上一页 */
  onBack() {
    wx.navigateBack({ delta: 1 })
  },

  /** 回到菜单 */
  onGoMenu() {
    wx.reLaunch({ url: '/pages/menu/menu' })
  },
})
