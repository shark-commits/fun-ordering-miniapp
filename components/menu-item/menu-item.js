// components/menu-item/menu-item.js
const cartStore = require('../../store/CartStore')

Component({
  properties: {
    product: {
      type: Object,
      value: {},
    },
  },

  data: {
    quantity: 0,
  },

  observers: {
    // 监听购物车变化，更新当前商品数量
    'product._id': function (productId) {
      this.updateQuantity()
    },
  },

  // 监听全局购物车变化
  pageLifetimes: {
    show() {
      this.updateQuantity()
    },
  },

  methods: {
    updateQuantity() {
      const item = cartStore.items.find(
        (i) => i.productId === this.data.product._id && !i.specKey
      )
      this.setData({ quantity: item ? item.quantity : 0 })
    },

    onAdd() {
      const product = this.data.product
      // 有规格则弹出规格选择器
      if (product.specs && product.specs.length > 0) {
        this.triggerEvent('selectsku', { product })
        return
      }
      cartStore.addItem(product, null)
      this.updateQuantity()
      this.triggerEvent('cartchange')

      // 加购弹跳动画（新命名）
      this.animate('.mi-card__add', [
        { transform: 'scale(1)' },
        { transform: 'scale(1.3)' },
        { transform: 'scale(1)' },
      ], 200)
    },

    onMinus() {
      const product = this.data.product
      cartStore.decreaseItem(product._id, '')
      this.updateQuantity()
      this.triggerEvent('cartchange')
    },

    onTap() {
      this.triggerEvent('tapitem', { product: this.data.product })
    },

    onImageError(e) {
      console.error('[图片加载失败]', this.data.product._id, this.data.product.image, e.detail)
    },
  },
})
