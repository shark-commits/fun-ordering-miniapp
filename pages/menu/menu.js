// pages/menu/menu.js — 菜单页（首页）
const { callCloud } = require('../../utils/request')
const cartStore = require('../../store/CartStore')

Page({
  data: {
    categories: [],       // [{_id, name, products: [...]}]
    allProducts: [],      // 用于幸运推荐
    activeCategory: 0,
    scrollToProduct: '',
    showSkuPicker: false,
    skuProduct: null,
    searchKeyword: '',
  },

  onLoad() {
    // 订阅购物车变化
    this._onCartChange = () => this.setData({ _cartUpdate: Date.now() })
    cartStore.subscribe(this._onCartChange)
    this.loadMenu()
  },

  onUnload() {
    cartStore.unsubscribe(this._onCartChange)
  },

  /** 加载菜单数据 */
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

  /** 点击分类 */
  onCategoryTap(e) {
    const index = e.currentTarget.dataset.index
    this.setData({
      activeCategory: index,
      scrollToProduct: `cat-${index}`,
    })
  },

  /** 搜索 */
  onSearchInput(e) {
    this.setData({ searchKeyword: e.detail.value })
  },

  onSearchConfirm() {
    // TODO: 按关键词过滤菜品
  },

  /** 购物车变化回调 */
  onCartChange() {
    this.setData({ _cartUpdate: Date.now() })
  },

  /** 点击商品 */
  onTapItem(e) {
    // 可以跳转到商品详情页（如果有的话）
  },

  /** 打开规格选择器 */
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

  /** 去结算 */
  onCheckout() {
    wx.navigateTo({ url: '/pages/order-confirm/order-confirm' })
  },

  /** 分享给好友 */
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

  /** 分享到朋友圈 */
  onShareTimeline() {
    return {
      title: '超有趣的风格预约小程序，快来看看！',
      query: '',
      imageUrl: '',
    }
  },
})
