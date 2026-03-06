# 「你的故事」模块 QA 验收与联调用例

**版本**：1.0  
**日期**：2026-03-06  
**范围**：小程序端 + API + 数据层

---

## 1. 验收范围

- 故事列表页（story-list）加载、筛选、搜索、空状态
- 创建故事（story-create → story-edit → 发布）
- 详情查看（story-viewer）与互动（点赞、评论）
- 里程碑自动生成
- 隐私与导出（基础能力）

---

## 2. 联调前检查

- 已执行数据库同步：`npm run db:push`
- 后端服务启动并可访问 `http://localhost:3000/api`
- 小程序 `useMock=false`，baseUrl 指向本地 API
- 具备测试账号与至少 3 条骑行记录

---

## 3. API 联调用例

## 3.1 故事列表
- 请求：`GET /api/stories`
- 期望：
  - `success=true`
  - `data` 为数组
  - 每项包含 `id/userId/userName/url/description/timeAgo`

## 3.2 我的故事
- 请求：`GET /api/stories/mine`
- 期望：
  - `success=true`
  - `data.list` 为当前用户故事

## 3.3 创建故事
- 请求：`POST /api/stories`
- 关键入参：
  - `title/description/image/overlays/filter/privacy/linkedRide/medias`
- 期望：
  - `success=true`
  - 返回 `data.story.id`

## 3.4 故事详情
- 请求：`GET /api/stories/:id`
- 期望：
  - 返回故事主体 + `medias` 数组 + overlays

## 3.5 点赞与评论
- 点赞：`POST /api/stories/:id/like`
- 评论：`POST /api/stories/:id/comment`
- 评论列表：`GET /api/stories/:id/comments`
- 期望：
  - 点赞重复点击可反向取消
  - 评论计数正确递增

## 3.6 统计、归档、导出
- 统计：`GET /api/stories/:id/stats`
- 归档：`POST /api/stories/:id/archive`
- 导出：`POST /api/stories/:id/share`
- 期望：
  - stats 返回 views/likes/comments/shares
  - 归档后从 mine 消失、在 archived 可见
  - 导出返回格式与资源信息

## 3.7 里程碑生成
- 请求：`POST /api/stories/milestone/generate`
- 期望：
  - 命中规则时 `generated=true`
  - 重复规则不重复生成

---

## 4. 小程序端用例

## 4.1 首页入口
- 步骤：
  - 点击“你的故事”
- 期望：
  - 跳转 `story-list`

## 4.2 故事列表页
- 步骤：
  - 首次进入、下拉刷新、关键词搜索、筛选切换
- 期望：
  - 列表渲染正确
  - 筛选条件实时生效
  - 空状态有创建入口

## 4.3 创建与编辑
- 步骤：
  - 选择图片 → 关联骑行记录 → 下一步编辑 → 发布
- 期望：
  - 骑行记录选择后，数据贴纸候选值更新
  - 编辑页正确带入 linkedRide
  - 发布成功并返回首页

## 4.4 详情页互动
- 步骤：
  - 打开 story-viewer，点赞、评论、查看评论列表
- 期望：
  - 互动状态刷新正确
  - 评论新增后即时可见

## 4.5 时间轴联动（基础版）
- 步骤：
  - 打开含 medias 的故事详情
  - 拖动时间轴 Slider、点击暂停/继续
- 期望：
  - 时间轴进度与故事进度同步
  - 活跃事件标签随时间变化

## 4.6 里程碑
- 步骤：
  - 在 story-list 点击“里程碑”
- 期望：
  - 若命中规则，生成新故事并出现在列表
  - 若未命中，提示“暂无可生成里程碑”

---

## 5. 异常与边界用例

- 无网络：
  - 请求失败时显示友好 toast
- 无骑行记录：
  - 创建页骑行选择器展示空态
- 权限不足：
  - 私密故事导出应被拒绝
- 极端输入：
  - 描述超长、空描述、特殊符号

---

## 6. 回归重点

- 首页故事入口不影响其他导航
- profile 的故事查看路径带 `storyId` 可正常打开
- story-viewer 分享路径使用 `storyId` 可回流
- 归档、删除不会破坏统计接口

---

## 7. 发布前检查清单

- [ ] Prisma schema 已同步数据库
- [ ] stories 全部接口联调通过
- [ ] story-list / story-create / story-edit / story-viewer 回归通过
- [ ] 弱网场景可用
- [ ] iOS/Android 主流机型验收通过

