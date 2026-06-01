// components/cart-bar/cart-bar.js — 购物车栏（优化版）
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
    bouncing: false,
    _prevCount: 0,
    _bounceTimer: null,
  },

  lifetimes: {
    attached() {
      this._onCartChange = () => this.syncStore()
      cartStore.subscribe(this._onCartChange)
      this.syncStore()
    },
    detached() {
      cartStore.unsubscribe(this._onCartChange)
      if (this.data._bounceTimer) {
        clearTimeout(this.data._bounceTimer)
      }
    },
  },

  methods: {
    syncStore() {
      var prevCount = this.data.totalCount
      // 预计算每个商品的展示价格（WXML 不支持 .toFixed()）
      var items = cartStore.items.map(function (item) {
        return Object.assign({}, item, {
          displayPrice: (item.price * item.quantity).toFixed(2),
        })
      })
      this.setData({
        items: items,
        totalCount: cartStore.totalCount,
        totalPrice: cartStore.totalPrice,
        isEmpty: cartStore.isEmpty,
      })

      // 如果数量增加了，触发图标弹跳动画
      if (cartStore.totalCount > prevCount) {
        this.triggerBounce()
      }
    },

    /** 触发图标弹跳动画 */
    triggerBounce() {
      if (this.data._bounceTimer) {
        clearTimeout(this.data._bounceTimer)
      }
      this.setData({ bouncing: true })
      this.data._bounceTimer = setTimeout(function () {
        this.setData({ bouncing: false })
      }.bind(this), 500)
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
      // 加购触发弹跳（通过 syncStore 自动触发）
    },

    onClearCart() {
      wx.showModal({
        title: '清空购物车',
        content: '确定要清空所有已选的商品吗？',
        cancelText: '再想想',
        confirmText: '清空',
        confirmColor: '#E8574A',
        success: function (res) {
          if (res.confirm) {
            cartStore.clearCart()
            this.setData({ showPopup: false })
          }
        }.bind(this),
      })
    },

    onTapCheckout() {
      if (cartStore.isEmpty) return
      this.setData({ showPopup: false })
      this.triggerEvent('checkout')
    },
  },
})
