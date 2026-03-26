# Image-Flow 产品需求文档 (PRD)

## 1. 产品概述

**产品名称**: Image-Flow - AI 图片生成控制台

**核心功能**: 接收社交媒体链接（抖音/小红书/快手）或本地上传图片，解析内容后生成提示词，再调用即梦(jimeng) API 生成图片，最终展示和保存结果。

**目标用户**: 设计师、内容创作者、需要 AI 生成类似风格图片的用户

---

## 2. 功能列表

### 2.1 任务管理

- [x] **添加任务 - 链接模式**: 输入社交媒体链接，自动解析内容
- [x] **添加任务 - 纯文字模式**: 输入纯文字作为标题，使用随机占位图
- [x] **添加任务 - 本地上传**: 上传本地图片作为参考
- [x] **任务列表**: 展示所有任务，支持选择查看详情
- [x] **任务删除**: 删除指定任务
- [x] **重新解析**: 手动重新解析已存在的任务（适用于图片/视频过期）

### 2.2 内容解析

- [x] **链接解析**: 解析社交媒体链接，获取标题、作者、封面图、视频/图片列表
- [x] **状态流转**: pending → parsing → generating → completed / failed

### 2.3 AI 创作

- [x] **提示词输入**: 自定义 AI 生成提示词
- [x] **参考图片上传**: 支持拖拽或选择界面图片、最多数量5张
- [x] **图片预览**: 上传的图片支持预览
- [x] **比例选择**: 支持 21:9, 16:9, 3:2, 4:3, 1:1, 3:4, 2:3, 9:16
- [x] **模型选择**: 支持 图片5.0, 图片5.0 Lite New, 图片4.6 New, 图片4.5, 图片4.1, 图片4.0, 图片3.1, 图片3.0
- [x] **状态保存**: 比例和模型选择保存到 localStorage
- [x] **生成图片**: 调用 jimeng API 生成图片

### 2.4 内容展示

- [x] **封面图展示**: 展示任务封面图，支持拖拽到 AI 创作区
- [x] **原文图片**: 展示解析出的所有图片，支持点击预览、拖拽
- [x] **原文视频**: 展示视频封面，点击可下载或在新标签页播放
- [x] **分享链接**: 完整显示原始链接（break-all）

### 2.5 评论系统

- [x] **查看评论**: 查看任务的所有评论
- [x] **添加评论**: 添加新评论，支持上传图片
- [x] **自动记录**: 自动记录评论者的设备、IP、位置信息

---

## 3. UI/UX 设计

### 3.1 布局结构

```
┌─────────────────────────────────────────────────────────────────┐
│                         顶部 Header                              │
├──────────────┬──────────────────────────────────────────────────┤
│              │                                                   │
│   左侧边栏    │                  主内容区                         │
│  (任务列表)   │                                                   │
│              │   ┌─────────────────┬─────────────────────────┐  │
│  - 任务卡片   │   │                 │                         │  │
│  - 添加输入框  │   │   内容详情区     │    右侧面板            │  │
│  - 上传按钮   │   │                 │    - AI 提示词          │  │
│              │   │  标题/作者/链接   │    - 评论列表           │  │
│              │   │  封面图/原文图片   │                         │  │
│              │   │  原文视频         │                         │  │
│              │   │                   │                         │  │
│              │   └─────────────────┴─────────────────────────┘  │
└──────────────┴──────────────────────────────────────────────────┘
```

### 3.2 页面区域

#### 左侧边栏 (固定宽度)
- 顶部：Logo + 标题
- 任务列表：邮箱样式卡片，展示任务标题/封面/状态
- 底部：输入框 + 添加按钮 + 上传图片按钮

#### 主内容区
- **内容详情** (左侧/上方)
  - 标题 (可点击跳转原链接)
  - 作者信息 (头像+名称)
  - 类型标签 + 状态标签
  - 分享链接 (完整显示)
  - 封面图 (可拖拽)
  - 原文图片 (瀑布流，可点击预览)
  - 原文视频 (封面+播放按钮)
  - 操作按钮：解析/重新解析/生成图片/删除

- **右侧面板** (固定宽度)
  - AI 提示词输入区 (上半部分)
  - 评论列表 (下半部分，可滚动)

### 3.3 交互设计

- 点击封面图/原文图片：打开预览 Modal
- 拖拽图片到 AI 创作区：自动填充到参考图
- 点击原文视频：新标签页打开视频
- 状态按钮：根据任务状态显示不同操作

---

## 4. 数据模型

### Task (任务)
| 字段 | 类型 | 说明 |
|------|------|------|
| id | UUID | 主键 |
| url | String | 原始链接或标题 |
| type | String | url/upload/title |
| title | String? | 解析出的标题 |
| authorName | String? | 作者名称 |
| authorAvatar | String? | 作者头像 |
| coverUrl | String? | 封面图 URL |
| videoUrl | String? | 视频 URL |
| images | String | JSON 字符串数组 |
| prompt | String? | AI 提示词 |
| status | String | pending/parsing/generating/completed/failed |
| errorMsg | String? | 错误信息 |
| createdAt | DateTime | 创建时间 |
| updatedAt | DateTime | 更新时间 |

### GeneratedImage (生成的图片)
| 字段 | 类型 | 说明 |
|------|------|------|
| id | UUID | 主键 |
| taskId | UUID | 关联任务 |
| imageUrl | String? | 图片 URL |
| status | String | pending/generating/completed/failed |
| errorMsg | String? | 错误信息 |
| createdAt | DateTime | 创建时间 |
| updatedAt | DateTime | 更新时间 |

### Comment (评论)
| 字段 | 类型 | 说明 |
|------|------|------|
| id | UUID | 主键 |
| taskId | UUID | 关联任务 |
| content | String | 评论内容 |
| imageUrl | String? | 评论配图 |
| device | String? | 设备信息 |
| ip | String? | IP 地址 |
| location | String? | 地理位置 |
| createdAt | DateTime | 创建时间 |

---

## 5. API 接口

### Tasks

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | /api/tasks | 获取所有任务 |
| POST | /api/tasks | 创建新任务 |
| GET | /api/tasks/:id | 获取任务详情 |
| PUT | /api/tasks/:id | 更新任务 |
| DELETE | /api/tasks/:id | 删除任务 |
| POST | /api/tasks/:id/parse | 解析任务 |
| POST | /api/tasks/:id/generate | 生成图片 |

### Comments

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | /api/tasks/:id/comments | 获取任务评论 |
| POST | /api/tasks/:id/comments | 添加评论 |

### Other

| 方法 | 路径 | 说明 |
|------|------|------|
| POST | /api/upload | 上传图片 |
| GET | /api/client-info | 获取客户端信息 |
| GET | /api/proxy-video | 视频代理 (解决跨域) |

---

## 6. 技术栈

- **Frontend**: React + Next.js 16 + Tailwind CSS 4 + TypeScript
- **Backend**: Next.js API Routes (App Router)
- **Database**: Prisma + SQLite
- **Deployment**: Vercel

---

## 7. 环境变量

```env
# Database
DATABASE_URL=file:./dev.db

# API Keys (可选)
JIMENG_API_KEY=your-api-key
PARSE_SERVICE_URL=your-parse-service
PARSE_SERVICE_KEY=your-service-key
```

---

## 8. 页面组件

### 组件列表
- `ImageModal`: 图片预览 Modal，支持左右切换、键盘操作
- `VideoModal`: 视频预览 Modal (已废弃，改为新标签页打开)
- `CommentSection`: 评论列表组件
- 任务卡片、输入框、按钮等基础组件

### 状态管理
- `tasks`: 任务列表
- `selectedTask`: 当前选中的任务
- `loading`: 加载状态
- `newUrl`: 新任务输入
- `aspectRatio`: 选中的图片比例
- `model`: 选中的模型
- `uploadedImages`: 上传的图片列表 (最多5张)
- `comments`: 评论列表

---

## 9. 迭代记录

### v1.0 (当前版本)
- 基础任务管理功能
- 链接解析和本地上传
- AI 提示词和图片生成
- 评论系统
- 比例和模型选择
- 重新解析功能
- 纯文字任务创建
