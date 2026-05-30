// utils/request.js — 云函数统一调用封装
// 纯线上点餐无需自建后端，直接调用云函数即可
// 开发阶段：云开发未开通时自动使用本地 mock 数据

// ======== 本地 Mock 数据（云开发未开通时的降级方案） ========
const MOCK_ENABLED = true  // 云开发开通后改为 false

const MOCK_MENU = {
  categories: [
    {
      _id: 'cat_1',
      name: '🎀 女仆装',
      sort: 1,
      products: [
        {
          _id: 'p1',
          name: '经典法式女仆',
          price: 128,
          image: '',
          sales: 320,
          desc: '黑白经典围裙，蕾丝头饰，优雅端茶服务',
          specs: [
            {
              name: '时长',
              options: [
                { value: '1小时', price: 128 },
                { value: '2小时', price: 228 }
              ]
            }
          ],
          tags: ['招牌', '必点']
        },
        {
          _id: 'p2',
          name: '维多利亚女仆',
          price: 158,
          image: '',
          sales: 256,
          desc: '长裙复古风，英式下午茶礼仪服务',
          specs: [
            {
              name: '时长',
              options: [
                { value: '1小时', price: 158 },
                { value: '2小时', price: 288 }
              ]
            }
          ],
          tags: ['热销']
        },
        {
          _id: 'p3',
          name: '日式咖啡厅女仆',
          price: 108,
          image: '',
          sales: 180,
          desc: '短裙可爱风，萌系问候与拉花咖啡',
          specs: [],
          tags: []
        }
      ]
    },
    {
      _id: 'cat_2',
      name: '🐱 猫耳',
      sort: 2,
      products: [
        {
          _id: 'p4',
          name: '白猫耳萝莉',
          price: 98,
          image: '',
          sales: 450,
          desc: '白色猫耳发箍，毛绒尾巴，软萌撒娇',
          specs: [
            {
              name: '套装',
              options: [
                { value: '仅猫耳', price: 98 },
                { value: '猫耳+尾巴', price: 128 }
              ]
            }
          ],
          tags: ['必点']
        },
        {
          _id: 'p5',
          name: '黑猫耳御姐',
          price: 118,
          image: '',
          sales: 340,
          desc: '黑色猫耳，皮choker，高冷傲娇风格',
          specs: [],
          tags: []
        },
        {
          _id: 'p6',
          name: '渐变猫耳',
          price: 108,
          image: '',
          sales: 120,
          desc: '粉紫渐变猫耳，发光款，暗场超吸睛',
          specs: [],
          tags: []
        }
      ]
    },
    {
      _id: 'cat_3',
      name: '🛋️ 居家休闲',
      sort: 3,
      products: [
        {
          _id: 'p7',
          name: '居家慵懒风',
          price: 88,
          image: '',
          sales: 580,
          desc: '宽松卫衣+棉拖，窝沙发聊天放松',
          specs: [
            {
              name: '时长',
              options: [
                { value: '1小时', price: 88 },
                { value: '2小时', price: 158 }
              ]
            }
          ],
          tags: []
        },
        {
          _id: 'p8',
          name: '睡衣派对风',
          price: 108,
          image: '',
          sales: 290,
          desc: '丝绸睡衣+拖鞋，轻松自在氛围',
          specs: [],
          tags: ['新品']
        }
      ]
    },
    {
      _id: 'cat_4',
      name: '🎓 清纯男大',
      sort: 4,
      products: [
        {
          _id: 'p9',
          name: '白衬衫学长',
          price: 138,
          image: '',
          sales: 210,
          desc: '白衬衫+眼镜，温柔学长陪你自习聊天',
          specs: [
            {
              name: '风格',
              options: [
                { value: '温柔学长', price: 138 },
                { value: '高冷学神', price: 138 }
              ]
            }
          ],
          tags: []
        },
        {
          _id: 'p10',
          name: '运动系男大',
          price: 128,
          image: '',
          sales: 150,
          desc: '运动背心+篮球，阳光活力型陪你逛街',
          specs: [],
          tags: []
        }
      ]
    },
    {
      _id: 'cat_5',
      name: '💼 商务风',
      sort: 5,
      products: [
        {
          _id: 'p11',
          name: '精英西装',
          price: 198,
          image: '',
          sales: 420,
          desc: '定制西装+领带，商务场合最佳搭档',
          specs: [],
          tags: ['人气']
        },
        {
          _id: 'p12',
          name: '商务休闲',
          price: 168,
          image: '',
          sales: 180,
          desc: '休闲西服+衬衫，日常社交也得体',
          specs: [],
          tags: ['超值']
        }
      ]
    }
  ]
}

const MOCK_ORDER = {
  orderId: 'ORD' + Date.now(),
  totalPrice: 0,
  totalCount: 0,
  items: [],
  status: 'paid',
  createTime: new Date().toISOString(),
}

// ======== Mock 处理器 ========
const mockHandlers = {
  getMenu: (data) => {
    return { code: 0, data: MOCK_MENU }
  },
  createOrder: (data) => {
    const order = { ...MOCK_ORDER, ...data, orderId: 'ORD' + Date.now() }
    return { code: 0, data: order }
  },
  getOrder: (data) => {
    return { code: 0, data: { ...MOCK_ORDER, orderId: data.orderId || 'ORD000001' } }
  },
}

/**
 * 调用云函数
 * @param {string} name - 云函数名称
 * @param {object} data - 传入参数
 * @returns {Promise<any>} 云函数返回数据
 */
const callCloud = (name, data = {}) => {
  // 优先使用 mock（开发阶段）
  if (MOCK_ENABLED) {
    console.log('[Mock] 云函数 ' + name + ' 使用本地数据')
    const handler = mockHandlers[name]
    if (handler) {
      return Promise.resolve(handler(data).data)
    }
    return Promise.reject(new Error('未找到 mock: ' + name))
  }

  // 正式环境走云函数
  return new Promise((resolve, reject) => {
    wx.cloud.callFunction({
      name: name,
      data: data,
      success: (res) => {
        if (res.result && res.result.code === 0) {
          resolve(res.result.data)
        } else {
          var errMsg = (res.result && res.result.message) || '请求失败'
          reject(new Error(errMsg))
        }
      },
      fail: (err) => {
        console.error('云函数 ' + name + ' 调用失败:', err)
        reject(new Error('网络异常，请稍后重试'))
      },
    })
  })
}

/**
 * 带加载提示的云函数调用
 */
const callCloudWithLoading = function (name, data, loadingText) {
  data = data || {}
  loadingText = loadingText || '加载中...'
  wx.showLoading({ title: loadingText, mask: true })
  return callCloud(name, data).then(function (result) {
    wx.hideLoading()
    return result
  }).catch(function (err) {
    wx.hideLoading()
    throw err
  })
}

/**
 * 微信支付
 * @param {object} payParams - 服务端返回的支付参数
 */
const wxPay = (payParams) => {
  return new Promise((resolve, reject) => {
    wx.requestPayment({
      timeStamp: payParams.timeStamp,
      nonceStr: payParams.nonceStr,
      package: payParams.package,
      signType: payParams.signType || 'RSA',
      paySign: payParams.paySign,
      success: () => resolve(true),
      fail: (err) => {
        if (err.errMsg && err.errMsg.indexOf('cancel') !== -1) {
          resolve(false)
        } else {
          reject(new Error('支付失败'))
        }
      },
    })
  })
}

module.exports = {
  callCloud: callCloud,
  callCloudWithLoading: callCloudWithLoading,
  wxPay: wxPay,
  MOCK_ENABLED: MOCK_ENABLED,
}
