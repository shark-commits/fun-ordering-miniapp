// cloudfunctions/seedData/index.js
// 一键导入测试数据到云数据库
// 部署后在开发者工具中右键"云端测试"即可导入
const cloud = require('wx-server-sdk')
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })
const db = cloud.database()

const categories = [
  { _id: 'cat_hot', shopId: 'default_shop', name: '🔥 热销推荐', sort: 1 },
  { _id: 'cat_burger', shopId: 'default_shop', name: '🍔 汉堡', sort: 2 },
  { _id: 'cat_snack', shopId: 'default_shop', name: '🍟 小食', sort: 3 },
  { _id: 'cat_drink', shopId: 'default_shop', name: '🥤 饮品', sort: 4 },
  { _id: 'cat_dessert', shopId: 'default_shop', name: '🍰 甜品', sort: 5 },
]

const products = [
  {
    _id: 'prod_001', shopId: 'default_shop', categoryId: 'cat_hot',
    name: '招牌双层牛肉堡', description: '澳洲安格斯牛肉，双倍满足感，酱汁浓郁',
    price: 32, image: 'https://mmbiz.qpic.cn/mmbiz_png/icTdbqWbN0k4HBSKcN7FibiaKYG0cUCYdGdaJXZm3kYbsIqqxZfiaKZT3ibiaU4ibcQtMU0I2fFV9BGYaviaGf9IDfYK5A/0?wx_fmt=png',
    tags: ['招牌', 'TOP1'],
    skus: [{ name: '规格', options: [{ value: '单层', price: 22 }, { value: '双层', price: 32 }, { value: '三层', price: 42 }] }],
    sort: 1, status: 'active',
  },
  {
    _id: 'prod_002', shopId: 'default_shop', categoryId: 'cat_hot',
    name: '香辣鸡腿堡', description: '香辣鸡腿排，外酥里嫩，辣而不燥',
    price: 26, image: 'https://mmbiz.qpic.cn/mmbiz_png/icTdbqWbN0k4HBSKcN7FibiaKYG0cUCYdGdaJXZm3kYbsIqqxZfiaKZT3ibiaU4ibcQtMU0I2fFV9BGYaviaGf9IDfYK5A/0?wx_fmt=png',
    tags: ['人气'],
    skus: [{ name: '辣度', options: [{ value: '微辣', price: 26 }, { value: '中辣', price: 26 }, { value: '变态辣', price: 28 }] }],
    sort: 2, status: 'active',
  },
  {
    _id: 'prod_003', shopId: 'default_shop', categoryId: 'cat_burger',
    name: '经典芝士堡', description: '纯正美式风味，芝士浓郁拉丝',
    price: 24, image: 'https://mmbiz.qpic.cn/mmbiz_png/icTdbqWbN0k4HBSKcN7FibiaKYG0cUCYdGdaJXZm3kYbsIqqxZfiaKZT3ibiaU4ibcQtMU0I2fFV9BGYaviaGf9IDfYK5A/0?wx_fmt=png',
    tags: [], skus: [], sort: 1, status: 'active',
  },
  {
    _id: 'prod_004', shopId: 'default_shop', categoryId: 'cat_burger',
    name: '鳕鱼堡', description: '深海鳕鱼排，鲜嫩多汁',
    price: 28, image: 'https://mmbiz.qpic.cn/mmbiz_png/icTdbqWbN0k4HBSKcN7FibiaKYG0cUCYdGdaJXZm3kYbsIqqxZfiaKZT3ibiaU4ibcQtMU0I2fFV9BGYaviaGf9IDfYK5A/0?wx_fmt=png',
    tags: ['新品'], skus: [], sort: 2, status: 'active',
  },
  {
    _id: 'prod_005', shopId: 'default_shop', categoryId: 'cat_snack',
    name: '黄金薯条', description: '外脆内软，现炸金黄',
    price: 12, image: 'https://mmbiz.qpic.cn/mmbiz_png/icTdbqWbN0k4HBSKcN7FibiaKYG0cUCYdGdaJXZm3kYbsIqqxZfiaKZT3ibiaU4ibcQtMU0I2fFV9BGYaviaGf9IDfYK5A/0?wx_fmt=png',
    tags: [],
    skus: [{ name: '大小', options: [{ value: '中份', price: 12 }, { value: '大份', price: 16 }] }],
    sort: 1, status: 'active',
  },
  {
    _id: 'prod_006', shopId: 'default_shop', categoryId: 'cat_snack',
    name: '鸡米花', description: '一口一个，香脆停不下来',
    price: 14, image: 'https://mmbiz.qpic.cn/mmbiz_png/icTdbqWbN0k4HBSKcN7FibiaKYG0cUCYdGdaJXZm3kYbsIqqxZfiaKZT3ibiaU4ibcQtMU0I2fFV9BGYaviaGf9IDfYK5A/0?wx_fmt=png',
    tags: [], skus: [], sort: 2, status: 'active',
  },
  {
    _id: 'prod_007', shopId: 'default_shop', categoryId: 'cat_drink',
    name: '冰可乐', description: '冰爽畅饮，快乐加倍',
    price: 8, image: 'https://mmbiz.qpic.cn/mmbiz_png/icTdbqWbN0k4HBSKcN7FibiaKYG0cUCYdGdaJXZm3kYbsIqqxZfiaKZT3ibiaU4ibcQtMU0I2fFV9BGYaviaGf9IDfYK5A/0?wx_fmt=png',
    tags: [],
    skus: [{ name: '规格', options: [{ value: '中杯', price: 8 }, { value: '大杯', price: 10 }] }],
    sort: 1, status: 'active',
  },
  {
    _id: 'prod_008', shopId: 'default_shop', categoryId: 'cat_drink',
    name: '杨枝甘露', description: '芒果椰汁西米露，清甜解腻',
    price: 18, image: 'https://mmbiz.qpic.cn/mmbiz_png/icTdbqWbN0k4HBSKcN7FibiaKYG0cUCYdGdaJXZm3kYbsIqqxZfiaKZT3ibiaU4ibcQtMU0I2fFV9BGYaviaGf9IDfYK5A/0?wx_fmt=png',
    tags: ['推荐'],
    skus: [{ name: '糖度', options: [{ value: '全糖', price: 18 }, { value: '七分糖', price: 18 }, { value: '半糖', price: 18 }] }],
    sort: 2, status: 'active',
  },
  {
    _id: 'prod_009', shopId: 'default_shop', categoryId: 'cat_dessert',
    name: '巧克力熔岩蛋糕', description: '切开流心，巧克力控的天堂',
    price: 22, image: 'https://mmbiz.qpic.cn/mmbiz_png/icTdbqWbN0k4HBSKcN7FibiaKYG0cUCYdGdaJXZm3kYbsIqqxZfiaKZT3ibiaU4ibcQtMU0I2fFV9BGYaviaGf9IDfYK5A/0?wx_fmt=png',
    tags: ['限量'], skus: [], sort: 1, status: 'active',
  },
  {
    _id: 'prod_010', shopId: 'default_shop', categoryId: 'cat_dessert',
    name: '抹茶冰淇淋', description: '日式宇治抹茶，清新回甘',
    price: 15, image: 'https://mmbiz.qpic.cn/mmbiz_png/icTdbqWbN0k4HBSKcN7FibiaKYG0cUCYdGdaJXZm3kYbsIqqxZfiaKZT3ibiaU4ibcQtMU0I2fFV9BGYaviaGf9IDfYK5A/0?wx_fmt=png',
    tags: [],
    skus: [{ name: '口味', options: [{ value: '抹茶', price: 15 }, { value: '抹茶+红豆', price: 18 }] }],
    sort: 2, status: 'active',
  },
]

exports.main = async (event, context) => {
  const results = { categories: [], products: [] }

  // 导入分类
  for (const cat of categories) {
    try {
      await db.collection('categories').add({ data: cat })
      results.categories.push(cat.name)
    } catch (err) {
      results.categories.push(`${cat.name} (失败)`)
    }
  }

  // 导入商品
  for (const prod of products) {
    try {
      const { _id, ...data } = prod
      await db.collection('products').add({ data: { _id, ...data } })
      results.products.push(prod.name)
    } catch (err) {
      results.products.push(`${prod.name} (失败)`)
    }
  }

  return {
    code: 0,
    data: results,
    message: `导入完成：${results.categories.length} 个分类，${results.products.length} 个商品`,
  }
}
