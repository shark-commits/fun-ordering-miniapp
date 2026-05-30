// cloudfunctions/getOrder/index.js
const cloud = require('wx-server-sdk')
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })
const db = cloud.database()

exports.main = async (event, context) => {
  const { OPENID } = cloud.getWXContext()
  const { orderId } = event

  if (!orderId) {
    return { code: -1, message: '订单ID不能为空' }
  }

  try {
    const { data: order } = await db
      .collection('orders')
      .doc(orderId)
      .get()

    // 权限校验：只能查自己的订单
    if (order._openid !== OPENID) {
      return { code: -1, message: '无权查看该订单' }
    }

    // 格式化时间
    const createTime = order.createTime
      ? new Date(order.createTime).toLocaleString('zh-CN', { hour12: false })
      : ''

    return {
      code: 0,
      data: {
        ...order,
        createTime,
      },
    }
  } catch (err) {
    console.error('getOrder error:', err)
    return {
      code: -1,
      message: '查询订单失败',
    }
  }
}
