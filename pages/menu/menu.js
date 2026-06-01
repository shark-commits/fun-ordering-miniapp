// pages/menu/menu.js — 菜单页（首页）
const { callCloud } = require('../../utils/request')
const cartStore = require('../../store/CartStore')

Page({
  data: {
    categories: [],
    allProducts: [],
    activeCategory: 0,
    scrollToProduct: '',
    showSkuPicker: false,
    skuProduct: null,
    searchKeyword: '',
    showBackTop: false,
    _scrollTimer: null,
  },

  onLoad() {
    this._onCartChange = () => this.setData({ _cartUpdate: Date.now() })
    cartStore.subscribe(this._onCartChange)
    this.loadMenu()
  },

  onUnload() {
    cartStore.unsubscribe(this._onCartChange)
    if (this.data._scrollTimer) {
      clearTimeout(this.data._scrollTimer)
    }
  },

  async loadMenu() {
    try {
      const data = await callCloud('getMenu', { shopId: 'default_shop' })
      this.setData({
        categories: data.categories,
        allProducts: data.categories.flatMap((c) => c.products),
      })
    } catch (err) {
      wx.showToast({ title: '加载菜单失败', icon: 'none' })
    }
  },

  onCategoryTap(e) {
    const index = e.currentTarget.dataset.index
    this.setData({
      activeCategory: index,
      scrollToProduct: 'cat-' + index,
    })
  },

  onSearchInput(e) {
    this.setData({ searchKeyword: e.detail.value })
  },

  onSearchConfirm() {
    // TODO: 按关键词过滤菜品
  },

  onCartChange() {
    this.setData({ _cartUpdate: Date.now() })
  },

  /** 商品列表滚动 — 控制回到顶部按钮显示 */
  onProductScroll(e) {
    var scrollTop = e.detail.scrollTop
    var that = this
    if (this.data._scrollTimer) {
      clearTimeout(this.data._scrollTimer)
    }
    this.data._scrollTimer = setTimeout(function () {
      that.setData({ showBackTop: scrollTop > 400 })
    }, 50)
  },

  /** 回到顶部 */
  onBackToTop() {
    this.setData({
      activeCategory: 0,
      showBackTop: false,
    })
    // 强行设置 scroll-into-view 为第一个分类
    this.setData({ scrollToProduct: 'cat-0' })
  },

  onTapItem(e) {},

  onSelectSku(e) {
    this.setData({
      showSkuPicker: true,
      skuProduct: e.detail.product,
    })
  },

  onSkuConfirm() {
    this.onCartChange()
  },

  onSkuClose() {
    this.setData({ showSkuPicker: false, skuProduct: null })
  },

  onCheckout() {
    wx.navigateTo({ url: '/pages/order-confirm/order-confirm' })
  },

  onGoOrders() {
    wx.navigateTo({ url: '/pages/orders/orders' })
  },

  onShareAppMessage() {
    const recommend = this.data.allProducts.length > 0
      ? this.data.allProducts[Math.floor(Math.random() * this.data.allProducts.length)]
      : null
    return {
      title: recommend ? recommend.name + '也太绝了吧！' : '来选你喜欢的风格！',
      path: '/pages/menu/menu',
      imageUrl: (recommend && recommend.image) || '',
    }
  },

  onShareTimeline() {
    return {
      title: '超有趣的风格预约小程序，快来看看！',
      query: '',
      imageUrl: '',
    }
  },
})
