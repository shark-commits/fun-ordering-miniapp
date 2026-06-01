# 🧸 趣味点餐 — 预约服务小程序

> **设计语言**：温馨治愈 × 活力玩趣  
> **UI 主题色**：暖珊瑚 `#F26B5E`  
> **技术栈**：微信小程序原生（WXML + WXSS + JS）

---

## ✨ 功能页面

| 页面 | 功能 |
|------|------|
| 🏠 **菜单首页** | 分类浏览商品、搜索、今日幸运推荐、加购、购物车管理 |
| 📋 **订单确认** | 确认商品清单、快捷备注标签、内联数量调节、提交下单 |
| 📄 **订单详情** | 成功状态动画、订单进度时间线、分享海报生成、再约一次 |
| 📑 **预约记录** | 历史订单列表、卡片式展示、空状态引导 |

## 🧩 组件列表

| 组件 | 说明 |
|------|------|
| `menu-item` | 商品卡片 — 圆角阴影、渐变加号、减号展开动画、涟漪动效 |
| `cart-bar` | 购物车栏 — 深暖棕底、珊瑚图标圈、弹跳角标、底部弹出清单 |
| `lucky-recommend` | 今日幸运推荐 — 装饰背景、换一换动效 |
| `sku-picker` | 规格选择器 — 底部 Sheet 弹窗、圆角选项、渐变确认按钮 |

## 🎨 设计系统

### 色彩

| Token | 色值 | 用途 |
|-------|------|------|
| `--color-primary` | `#F26B5E` | CTA按钮、品牌标识 |
| `--bg-page` | `#FEF8F5` | 页面暖白底色 |
| `--text-primary` | `#3D2C25` | 暖深棕主文案 |
| `--text-secondary` | `#8C7A72` | 次要文案 |
| `--color-playful-teal` | `#5BC0BE` | 推荐标签、趣味点缀 |
| `--color-playful-yellow` | `#F9D56E` | 角标、高亮 |

### 设计原则

1. **温暖的空白有力量** — 留白本身就是治愈感
2. **趣味藏在细节里** — 微动效、俏皮文案、小图标
3. **分层信息，一次一件事** — 极低认知负担
4. **触感优先** — 交互区域 ≥44px，反馈即时
5. **色彩是情绪** — 暖珊瑚 = 温暖安心，点缀色 = 惊喜趣味

> 完整设计系统见 [`UI-DESIGN-SYSTEM.md`](./UI-DESIGN-SYSTEM.md)

## 🚀 快速开始

```bash
# 1. 克隆项目
git clone https://github.com/Tangent-bit/fun-ordering-miniapp.git

# 2. 用微信开发者工具打开项目目录
# 3. 编译运行即可（纯前端 mock 数据，无需后端）
```

> 项目使用纯前端 Mock 数据，无需启动任何后端服务。所有数据在 `utils/request.js` 中定义。

## 📂 项目结构

```
fun-ordering-miniapp/
├── app.js               # 应用入口
├── app.json             # 全局配置
├── app.wxss             # 全局样式 + CSS 变量系统
├── components/          # 公共组件
│   ├── cart-bar/        #   购物车栏
│   ├── lucky-recommend/ #   今日幸运推荐
│   ├── menu-item/       #   商品卡片
│   └── sku-picker/      #   规格选择器
├── pages/               # 页面
│   ├── menu/            #   菜单首页
│   ├── orders/          #   预约记录
│   ├── order-confirm/   #   订单确认
│   └── order-detail/    #   订单详情
├── store/               # 状态管理
│   └── CartStore.js     #   购物车 Store（发布-订阅）
├── utils/
│   └── request.js       #   Mock 数据 + 请求封装
├── images/              # 静态图片资源
├── UI-DESIGN-SYSTEM.md  # 设计系统文档
└── overview.md          # 设计方案总结
```

## 🛠 技术细节

- **状态管理**：纯 JS 发布-订阅模式，无第三方依赖
- **购物车**：响应式数据流，加购触发图标弹跳 + 角标动画
- **骨架屏**：CSS shimmer 动画加载占位
- **进度时间线**：4 步订单状态可视化（已提交→已确认→制作中→已完成）
- **海报生成**：Canvas 2D API，暖珊瑚主题配色

## 📸 截图

（项目为微信小程序，请在开发者工具中预览）

---

<p align="center">
  <sub>Made with 🧡 by <a href="https://github.com/Tangent-bit">Tangent-bit</a></sub>
</p>
