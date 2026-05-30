// pages/order-detail/order-detail.js
const { callCloud } = require('../../utils/request')

Page({
  data: {
    order: {},
    paid: false,
    statusText: '安排中',
    posterImage: '',
    showPoster: false,
  },

  onLoad(options) {
    const { orderId, paid } = options
    this.setData({ paid: paid === '1' })

    if (orderId) {
      this.loadOrder(orderId)
    }
  },

  /** 加载订单详情 */
  async loadOrder(orderId) {
    try {
      const order = await callCloud('getOrder', { orderId })
      const statusMap = {
        pending: '待支付',
        paid: '安排中',
        preparing: '安排中',
        done: '已完成',
        cancelled: '已取消',
      }
      this.setData({
        order,
        statusText: statusMap[order.status] || '安排中',
      })
    } catch (err) {
      wx.showToast({ title: '加载订单失败', icon: 'none' })
    }
  },

  /** 回到首页 */
  onBackHome() {
    wx.reLaunch({ url: '/pages/menu/menu' })
  },

  /** 再来一单 */
  onReorder() {
    wx.reLaunch({ url: '/pages/menu/menu' })
  },

  /** 分享给好友 */
  onShareAppMessage() {
    const { order } = this.data
    const itemName = (order.items && order.items[0] && order.items[0].name) || '风格'
    return {
      title: '我刚约了' + itemName + '，你也来试试！',
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

  /** 生成分享海报 */
  onCreatePoster() {
    wx.showLoading({ title: '生成海报中...' })
    const { order } = this.data
    if (!order.items || !order.items.length) {
      wx.hideLoading()
      wx.showToast({ title: '订单数据加载中', icon: 'none' })
      return
    }

    const query = wx.createSelectorQuery()
    query.select('#posterCanvas')
      .fields({ node: true, size: true })
      .exec((res) => {
        const canvas = res[0].node
        const ctx = canvas.getContext('2d')
        const dpr = wx.getWindowInfo().pixelRatio
        const width = 600
        const height = 800
        canvas.width = width * dpr
        canvas.height = height * dpr
        ctx.scale(dpr, dpr)

        // 背景
        ctx.fillStyle = '#FFFFFF'
        ctx.roundRect(0, 0, width, height, 20)
        ctx.fill()

        // 顶部色块
        ctx.fillStyle = '#FF6B35'
        ctx.fillRect(0, 0, width, 160)
        ctx.fillStyle = '#FFFFFF'
        ctx.font = 'bold 36px sans-serif'
        ctx.fillText('🎲 趣味预约', 40, 70)
        ctx.font = '24px sans-serif'
        ctx.fillText('预约成功！快来看看我选了什么', 40, 115)

        // 商品列表
        ctx.fillStyle = '#333333'
        let y = 200
        order.items.forEach((item, idx) => {
          if (idx > 4) return // 最多显示5个
          ctx.font = 'bold 28px sans-serif'
          ctx.fillText(item.name, 40, y)
          ctx.font = '24px sans-serif'
          ctx.fillStyle = '#999999'
          const spec = item.specsText ? `（${item.specsText}）` : ''
          ctx.fillText(`¥${item.price} × ${item.quantity}${spec}`, 40, y + 32)
          ctx.fillStyle = '#333333'
          y += 80
        })

        // 总价
        y += 20
        ctx.fillStyle = '#F0F0F0'
        ctx.fillRect(40, y, width - 80, 2)
        y += 40
        ctx.fillStyle = '#FF6B35'
        ctx.font = 'bold 32px sans-serif'
        ctx.fillText(`实付 ¥${order.totalPrice}`, 40, y)

        // 底部提示
        y = height - 80
        ctx.fillStyle = '#BBBBBB'
        ctx.font = '22px sans-serif'
        ctx.fillText('长按识别小程序码，来选你喜欢的风格！', 40, y)

        // 导出图片
        wx.canvasToTempFilePath({
          canvas,
          success: (res) => {
            wx.hideLoading()
            this.setData({
              posterImage: res.tempFilePath,
              showPoster: true,
            })
          },
          fail: () => {
            wx.hideLoading()
            wx.showToast({ title: '生成失败', icon: 'none' })
          },
        })
      })
  },

  /** 保存海报到相册 */
  onSavePoster() {
    wx.saveImageToPhotosAlbum({
      filePath: this.data.posterImage,
      success: () => {
        wx.showToast({ title: '已保存到相册', icon: 'success' })
      },
      fail: (err) => {
        if (err.errMsg.includes('deny') || err.errMsg.includes('auth')) {
          wx.showModal({
            title: '提示',
            content: '需要授权保存图片到相册',
            success: (res) => {
              if (res.confirm) wx.openSetting()
            },
          })
        }
      },
    })
  },

  /** 关闭海报弹窗 */
  onClosePoster() {
    this.setData({ showPoster: false })
  },
})
