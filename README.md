# 🚴‍♀️ 骑行助手 (Cycling Assistant) - 微信小程序

一个基于微信小程序 + Next.js 后端的现代化骑行记录与社区应用，为骑行爱好者提供全方位的骑行体验。

![License](https://img.shields.io/badge/license-MIT-blue.svg) ![Platform](https://img.shields.io/badge/platform-WeChat_Mini_Program-green.svg)

## ✨ 项目亮点

- **全栈开发**：完整的前后端实现，小程序前端 + Next.js 后端 API。
- **真实记录**：基于 `wx.startLocationUpdate` 的高频定位与轨迹平滑算法，精准记录每一次骑行。
- **互动社区**：支持发布动态、评论、点赞、关注，构建活跃的骑行圈子。
- **现代 UI**：采用 Instagram 2025 设计风格，大圆角、玻璃拟态、流畅动效。

## 📱 核心功能

### 🏠 首页 (Home)
- **数据概览**：实时展示总里程、骑行次数、卡路里消耗。
- **智能推荐**：根据天气情况提供骑行建议，推荐适合的路线。
- **最近活动**：快速查看最近的骑行记录。

### 🗺️ 路线 (Routes)
- **路线探索**：列表/网格视图切换，支持按难度、距离筛选。
- **路线详情**：弹窗展示路线地图预览、起终点、海拔等关键信息。
- **一键出发**：直接从路线详情页开始骑行，自动关联路线信息。

### ⏱️ 记录 (Record)
- **实时追踪**：高精度 GPS 定位，实时绘制骑行轨迹。
- **数据面板**：实时显示速度、距离、时长、卡路里。
- **轨迹保存**：骑行结束后自动上传完整轨迹点至后端，支持离线缓存。

### 💬 社区 (Community)
- **动态分享**：发布骑行故事，支持图片上传。
- **社交互动**：支持评论回复、点赞、关注用户。
- **本地缓存**：关注状态与点赞状态本地优化，体验更流畅。

### 👤 个人中心 (Profile)
- **骑行历史**：查看所有历史骑行记录详情。
- **数据统计**：多维度的骑行数据分析。
- **成就系统**：解锁骑行徽章（开发中）。

## 🛠 技术栈

### 前端 (Mini Program)
- **框架**：微信小程序原生开发 (WXML, WXSS, JS, JSON)
- **样式**：自定义 CSS 变量系统，适配深色模式
- **地图**：微信小程序 Map 组件，Polyline 绘制
- **交互**：WXS 响应式动画

### 后端 (Backend)
- **框架**：Next.js 14 (App Router)
- **数据库**：SQLite (开发环境) / PostgreSQL (生产环境)
- **ORM**：Prisma
- **API**：RESTful API 设计

## 🚀 快速开始

### 1. 环境准备
- 安装 [微信开发者工具](https://developers.weixin.qq.com/miniprogram/dev/devtools/download.html)
- 安装 Node.js (用于后端服务)

### 2. 后端启动
```bash
# 进入项目根目录
cd src
# 安装依赖
npm install
# 初始化数据库
npx prisma migrate dev
# 启动开发服务器
npm run dev
```
后端服务默认运行在 `http://localhost:3000`。

### 3. 小程序运行
1. 打开微信开发者工具，导入 `miniprogram` 目录。
2. 修改 `miniprogram/app.js` 中的 `baseUrl` 为你的本机 IP 地址（如 `http://192.168.1.x:3000/api`），以便真机调试。
3. 确保开发者工具中勾选“不校验合法域名、web-view（业务域名）、TLS版本以及HTTPS证书”。

### 4. 模式切换
项目支持 **Mock 模式** 和 **真实后端模式**。
- 修改 `miniprogram/utils/api.js` 中的 `USE_MOCK` 常量。
- 默认情况下，如果无法连接后端，部分功能会自动降级使用 Mock 数据。

## 📂 项目结构

```
.
├── miniprogram/             # 微信小程序源码
│   ├── assets/              # 静态资源
│   ├── components/          # 公共组件
│   ├── pages/               # 页面文件
│   │   ├── home/            # 首页
│   │   ├── routes/          # 路线页
│   │   ├── record/          # 记录页
│   │   ├── community/       # 社区页
│   │   └── profile/         # 个人中心
│   └── utils/               # 工具函数与 API 封装
├── prisma/                  # 数据库模型定义
├── src/                     # Next.js 后端源码
│   ├── app/
│   │   └── api/             # API 路由处理
│   └── lib/                 # 后端工具库
└── README.md                # 项目文档
```

## 📝 开发计划

- [x] 核心业务流程闭环（路线 -> 记录 -> 保存）
- [x] 接入真实 GPS 定位
- [x] 社区评论与关注功能
- [ ] 接入第三方天气 API
- [ ] 蓝牙心率设备连接
- [ ] 轨迹回放动画

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## 📄 许可证

MIT License
