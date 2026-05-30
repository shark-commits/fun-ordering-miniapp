// cloudfunctions/getMenu/index.js
const cloud = require('wx-server-sdk')
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })
const db = cloud.database()

exports.main = async (event, context) => {
  try {
    const { shopId } = event

    // 获取分类
    const { data: categories } = await db
      .collection('categories')
      .where({ shopId })
      .orderBy('sort', 'asc')
      .get()

    // 获取商品
    const { data: products } = await db
      .collection('products')
      .where({ shopId, status: 'active' })
      .orderBy('sort', 'asc')
      .get()

    // 按分类组装
    const result = categories.map((cat) => ({
      _id: cat._id,
      name: cat.name,
      sort: cat.sort,
      products: products.filter((p) => p.categoryId === cat._id),
    }))

    return {
      code: 0,
      data: { categories: result },
    }
  } catch (err) {
    console.error('getMenu error:', err)
    return {
      code: -1,
      message: '获取菜单失败',
    }
  }
}
