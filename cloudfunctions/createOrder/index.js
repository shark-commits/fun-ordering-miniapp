// cloudfunctions/createOrder/index.js
const cloud = require('wx-server-sdk')
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })
const db = cloud.database()

exports.main = async (event, context) => {
  const { OPENID } = cloud.getWXContext()
  const { shopId, items, totalPrice, remark } = event

  // 参数校验
  if (!items || !items.length) {
    return { code: -1, message: '商品不能为空' }
  }
  if (!totalPrice || totalPrice <= 0) {
    return { code: -1, message: '价格异常' }
  }

  try {
    // 生成订单号
    const now = new Date()
    const orderNo = 'OD' + now.getTime() + Math.random().toString(36).substr(2, 4).toUpperCase()

    // 创建订单记录
    const orderRes = await db.collection('orders').add({
      data: {
        _openid: OPENID,
        shopId,
        orderNo,
        items,
        totalPrice,
        remark: remark || '',
        status: 'paid', // 实际场景应该是 pending，支付回调后改为 paid
        createTime: db.serverDate(),
        updateTime: db.serverDate(),
      },
    })

    // ===== 实际生产环境 =====
    // 这里应该调用微信支付统一下单接口
    // 获取 prepay_id 后返回给前端调起支付
    // 以下为模拟支付参数，正式上线需替换
    const mockPayParams = {
      timeStamp: String(Math.floor(Date.now() / 1000)),
      nonceStr: Math.random().toString(36).substr(2),
      package: `prepay_id=mock_prepay_${orderRes._id}`,
      signType: 'RSA',
      paySign: 'mock_pay_sign',
      orderId: orderRes._id,
    }

    return {
      code: 0,
      data: mockPayParams,
    }
  } catch (err) {
    console.error('createOrder error:', err)
    return {
      code: -1,
      message: '创建订单失败',
    }
  }
}
