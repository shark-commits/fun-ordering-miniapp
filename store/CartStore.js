// store/CartStore.js — 购物车状态管理（纯JS，零依赖）
// 不使用 MobX，用简单的发布-订阅模式实现响应式

const cartStore = {
  // ======== 数据 ========
  items: [],
  shopId: 'default_shop',

  // 订阅者列表
  _listeners: [],

  // ======== 计算属性 ========
  get totalCount() {
    return this.items.reduce((sum, item) => sum + item.quantity, 0)
  },

  get totalPrice() {
    return this.items.reduce((sum, item) => sum + item.price * item.quantity, 0)
  },

  get isEmpty() {
    return this.items.length === 0
  },

  // ======== 订阅机制 ========

  /** 订阅购物车变化 */
  subscribe(listener) {
    this._listeners.push(listener)
  },

  /** 取消订阅 */
  unsubscribe(listener) {
    this._listeners = this._listeners.filter((l) => l !== listener)
  },

  /** 通知所有订阅者 */
  _notify() {
    this._listeners.forEach((fn) => fn())
  },

  // ======== 操作 ========

  /** 添加商品到购物车 */
  addItem(product, sku, quantity = 1) {
    const specKey = sku ? JSON.stringify(sku.specs) : ''
    const existing = this.items.find(
      (item) => item.productId === product._id && item.specKey === specKey
    )

    if (existing) {
      existing.quantity += quantity
    } else {
      this.items.push({
        cartKey: product._id + '_' + specKey,  // 唯一标识，用于 wx:key
        productId: product._id,
        name: product.name,
        price: sku ? sku.price : product.price,
        image: product.image,
        sku: sku,
        specKey,
        specsText: sku ? sku.specs.map((s) => s.value).join('/') : '',
        quantity,
      })
    }
    this._notify()
  },

  /** 减少数量 */
  decreaseItem(productId, specKey = '') {
    const index = this.items.findIndex(
      (item) => item.productId === productId && item.specKey === specKey
    )
    if (index === -1) return

    if (this.items[index].quantity > 1) {
      this.items[index].quantity--
    } else {
      this.items.splice(index, 1)
    }
    this._notify()
  },

  /** 增加数量 */
  increaseItem(productId, specKey = '') {
    const item = this.items.find(
      (item) => item.productId === productId && item.specKey === specKey
    )
    if (item) item.quantity++
    this._notify()
  },

  /** 清空购物车 */
  clearCart() {
    this.items = []
    this._notify()
  },

  /** 生成订单数据 */
  toOrderData() {
    return {
      shopId: this.shopId,
      items: this.items.map((item) => ({
        productId: item.productId,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        specsText: item.specsText,
      })),
      totalPrice: this.totalPrice,
      totalCount: this.totalCount,
    }
  },
}

module.exports = cartStore
