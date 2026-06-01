// pages/order-detail/order-detail.js
const { callCloud } = require('../../utils/request')

Page({
  data: {
    order: {},
    paid: false,
    statusText: '安排中',
    posterImage: '',
    showPoster: false,
    estimatedWait: '',
  },

  onLoad(options) {
    const { orderId, paid, totalPrice, orderNo, remark } = options
    this.setData({ paid: paid === '1' })

    // 随机生成本次预估等待时间
    var waitMinutes = Math.floor(Math.random() * 15) + 8
    this.setData({ estimatedWait: '约' + waitMinutes + '分钟' })

    if (options.items) {
      try {
        var items = JSON.parse(decodeURIComponent(options.items))
        this.setData({
          order: {
            orderId: orderId || 'ORD000001',
            orderNo: orderNo || 'F00000001',
            items: items,
            totalPrice: totalPrice || 0,
            remark: remark || '',
            status: 'paid',
            createTime: this.formatTime(new Date()),
          },
          statusText: '安排中',
        })
        return
      } catch (e) {}
    }

    if (orderId) {
      this.loadOrder(orderId)
    }
  },

  formatTime(date) {
    var year = date.getFullYear()
    var month = (date.getMonth() + 1 + '').padStart(2, '0')
    var day = (date.getDate() + '').padStart(2, '0')
    var hour = (date.getHours() + '').padStart(2, '0')
    var minute = (date.getMinutes() + '').padStart(2, '0')
    return year + '-' + month + '-' + day + ' ' + hour + ':' + minute
  },

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

  onBackHome() {
    wx.reLaunch({ url: '/pages/menu/menu' })
  },

  onReorder() {
    wx.reLaunch({ url: '/pages/menu/menu' })
  },

  onShareAppMessage() {
    const { order } = this.data
    const itemName = (order.items && order.items[0] && order.items[0].name) || '风格'
    return {
      title: '我刚约了' + itemName + '，你也来试试！',
      path: '/pages/menu/menu',
    }
  },

  onShareTimeline() {
    return { title: '趣味预约，一键下单！', query: '' }
  },

  /** 生成分享海报 — 新设计系统配色 */
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

        // 背景 — 暖白底色
        ctx.fillStyle = '#FEF8F5'
        ctx.beginPath()
        ctx.roundRect(0, 0, width, height, 20)
        ctx.fill()

        // 顶部色块 — 暖珊瑚渐变
        var gradient = ctx.createLinearGradient(0, 0, width, 0)
        gradient.addColorStop(0, '#F26B5E')
        gradient.addColorStop(1, '#F48C7A')
        ctx.fillStyle = gradient
        ctx.beginPath()
        ctx.roundRect(0, 0, width, 180, { upperLeft: 20, upperRight: 20 })
        ctx.fill()

        // 标题
        ctx.fillStyle = '#FFFFFF'
        ctx.font = 'bold 38px sans-serif'
        ctx.fillText('🎲 趣味预约', 40, 80)
        ctx.font = '24px sans-serif'
        ctx.fillText('预约成功啦！快来看看我选了什么~', 40, 128)

        // 商品列表
        let y = 220
        order.items.forEach(function(item, idx) {
          if (idx > 4) return
          ctx.fillStyle = '#3D2C25'
          ctx.font = 'bold 28px sans-serif'
          ctx.fillText(item.name, 40, y)
          ctx.font = '22px sans-serif'
          ctx.fillStyle = '#8C7A72'
          var spec = item.specsText ? '（' + item.specsText + '）' : ''
          ctx.fillText('¥' + item.price + ' × ' + item.quantity + spec, 40, y + 32)
          y += 80
        })

        // 装饰分割
        y += 30
        ctx.strokeStyle = '#F5EDE8'
        ctx.lineWidth = 2
        ctx.beginPath()
        ctx.setLineDash([8, 6])
        ctx.moveTo(40, y)
        ctx.lineTo(width - 40, y)
        ctx.stroke()
        ctx.setLineDash([])

        // 总价
        y += 40
        ctx.fillStyle = '#F26B5E'
        ctx.font = 'bold 34px sans-serif'
        ctx.fillText('实付 ¥' + order.totalPrice, 40, y)

        // 底部提示
        y = height - 80
        ctx.fillStyle = '#B5A59C'
        ctx.font = '22px sans-serif'
        ctx.fillText('长按扫码，来选你喜欢的风格！', 40, y)

        // 底部小装饰
        ctx.fillStyle = '#FDD8D0'
        ctx.beginPath()
        ctx.arc(width - 60, height - 60, 30, 0, Math.PI * 2)
        ctx.fill()

        ctx.fillStyle = '#F9D56E'
        ctx.beginPath()
        ctx.arc(width - 100, height - 100, 15, 0, Math.PI * 2)
        ctx.fill()

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
          fail: function() {
            wx.hideLoading()
            wx.showToast({ title: '生成失败', icon: 'none' })
          },
        })
      })
  },

  onSavePoster() {
    wx.saveImageToPhotosAlbum({
      filePath: this.data.posterImage,
      success: function() {
        wx.showToast({ title: '已保存到相册', icon: 'success' })
      },
      fail: function(err) {
        if (err.errMsg.indexOf('deny') > -1 || err.errMsg.indexOf('auth') > -1) {
          wx.showModal({
            title: '提示',
            content: '需要授权保存图片到相册',
            success: function(res) {
              if (res.confirm) wx.openSetting()
            },
          })
        }
      },
    })
  },

  onClosePoster() {
    this.setData({ showPoster: false })
  },
})
