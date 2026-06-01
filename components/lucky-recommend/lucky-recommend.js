// components/lucky-recommend/lucky-recommend.js
const cartStore = require('../../store/CartStore')

Component({
  properties: {
    products: {
      type: Array,
      value: [],
    },
  },

  data: {
    current: {},
    animating: false,
    _lastIndex: -1,
  },

  observers: {
    'products': function (products) {
      if (products.length > 0) {
        this.shuffle()
      }
    },
  },

  methods: {
    /** 随机换一道菜（避免连续重复） */
    shuffle() {
      const products = this.data.products
      if (!products.length) return

      let idx
      do {
        idx = Math.floor(Math.random() * products.length)
      } while (idx === this.data._lastIndex && products.length > 1)

      this.setData({
        current: products[idx],
        _lastIndex: idx,
      })
    },

    /** 点击卡片换一道 */
    onShuffle() {
      this.setData({ animating: true })
      setTimeout(() => {
        this.shuffle()
        this.setData({ animating: false })
      }, 250)
    },

    /** 加入购物车 */
    onAdd(e) {
      // 阻止冒泡触发 onShuffle
      const product = this.data.current
      if (product.specs && product.specs.length > 0) {
        this.triggerEvent('selectsku', { product })
        return
      }
      cartStore.addItem(product, null)
      wx.showToast({ title: '已加入~', icon: 'none', duration: 800 })
      this.triggerEvent('cartchange')
    },

    onImageError(e) {
      console.error('[幸运推荐图片加载失败]', this.data.current._id, this.data.current.image, e.detail)
    },
  },
})
