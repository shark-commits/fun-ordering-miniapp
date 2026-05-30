// components/sku-picker/sku-picker.js
const cartStore = require('../../store/CartStore')

Component({
  properties: {
    visible: {
      type: Boolean,
      value: false,
    },
    product: {
      type: Object,
      value: null,
    },
  },

  data: {
    selectedSpecs: [],   // 每组规格选中的索引
    currentPrice: 0,
    quantity: 1,
  },

  observers: {
    'product': function (product) {
      if (product && product.skus) {
        // 初始化选中状态
        const selectedSpecs = product.skus.map(() => 0)
        this.setData({ selectedSpecs, quantity: 1 })
        this.calcPrice(selectedSpecs)
      }
    },
  },

  methods: {
    calcPrice(selectedSpecs) {
      const product = this.data.product
      if (!product || !product.skus) return
      // 取最后一个规格的价格作为显示价
      const lastGroupIdx = product.skus.length - 1
      const optIdx = selectedSpecs[lastGroupIdx] || 0
      const price = product.skus[lastGroupIdx].options[optIdx]?.price || product.price
      this.setData({ currentPrice: price })
    },

    onSelectSpec(e) {
      const { group, index } = e.currentTarget.dataset
      const selectedSpecs = [...this.data.selectedSpecs]
      selectedSpecs[group] = index
      this.setData({ selectedSpecs })
      this.calcPrice(selectedSpecs)
    },

    onDecreaseQty() {
      if (this.data.quantity > 1) {
        this.setData({ quantity: this.data.quantity - 1 })
      }
    },

    onIncreaseQty() {
      this.setData({ quantity: this.data.quantity + 1 })
    },

    onConfirm() {
      const { product, selectedSpecs, quantity } = this.data
      if (!product) return

      // 构建选中规格
      const specs = product.skus.map((group, idx) => ({
        name: group.name,
        value: group.options[selectedSpecs[idx]]?.value || '',
      }))

      const sku = {
        specs,
        price: this.data.currentPrice,
      }

      cartStore.addItem(product, sku, quantity)
      this.triggerEvent('confirm', { product, sku, quantity })
      this.onClose()
    },

    onClose() {
      this.triggerEvent('close')
    },
  },
})
