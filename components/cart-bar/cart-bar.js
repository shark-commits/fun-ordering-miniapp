// components/cart-bar/cart-bar.js
const cartStore = require('../../store/CartStore')

Component({
  properties: {
    alwaysShow: {
      type: Boolean,
      value: false,
    },
  },

  data: {
    items: [],
    totalCount: 0,
    totalPrice: 0,
    isEmpty: true,
    showPopup: false,
  },

  lifetimes: {
    attached() {
      // 订阅购物车变化
      this._onCartChange = () => this.syncStore()
      cartStore.subscribe(this._onCartChange)
      this.syncStore()
    },
    detached() {
      cartStore.unsubscribe(this._onCartChange)
    },
  },

  methods: {
    /** 同步 store 数据到 data */
    syncStore() {
      this.setData({
        items: cartStore.items,
        totalCount: cartStore.totalCount,
        totalPrice: cartStore.totalPrice,
        isEmpty: cartStore.isEmpty,
      })
    },

    onTapCart() {
      if (cartStore.isEmpty) return
      this.setData({ showPopup: !this.data.showPopup })
    },

    onClosePopup() {
      this.setData({ showPopup: false })
    },

    onDecrease(e) {
      const { id, key } = e.currentTarget.dataset
      cartStore.decreaseItem(id, key)
      if (cartStore.isEmpty) {
        this.setData({ showPopup: false })
      }
    },

    onIncrease(e) {
      const { id, key } = e.currentTarget.dataset
      cartStore.increaseItem(id, key)
    },

    onClearCart() {
      wx.showModal({
        title: '提示',
        content: '确定清空购物车吗？',
        success: (res) => {
          if (res.confirm) {
            cartStore.clearCart()
            this.setData({ showPopup: false })
          }
        },
      })
    },

    onTapCheckout() {
      if (cartStore.isEmpty) return
      this.setData({ showPopup: false })
      this.triggerEvent('checkout')
    },
  },
})
