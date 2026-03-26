# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**image-flow** - AI 图片生成控制台

接收社交媒体链接（抖音/小红书/快手），解析内容后生成提示词，再调用即梦(jimeng) API 生成图片，最终展示和保存结果。

## Tech Stack

- **Frontend**: React + Next.js 16 + Tailwind CSS 4
- **Backend**: Next.js API Routes (App Router)
- **Database**: Prisma + PostgreSQL
- **Task Queue**: Redis + Bull
- **Deployment**: Vercel / Railway

## Commands

```bash
# 开发
npm run dev          # 启动开发服务器

# 构建
npm run build        # 生产构建
npm run start        # 启动生产服务器

# 代码检查
npm run lint         # ESLint 检查
```

## Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    Frontend (Next.js)                   │
│  ┌─────────────────┐    ┌───────────────────────────┐  │
│  │  侧边栏任务列表   │    │       详情内容区           │  │
│  │  (邮箱样式)      │    │  标题/作者/类型/链接       │  │
│  │                 │    │  提示词信息                 │  │
│  │                 │    │  瀑布流图片展示             │  │
│  └─────────────────┘    └───────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────┐
│                    API Routes                           │
│  POST /api/tasks          - 创建任务                    │
│  GET  /api/tasks          - 获取任务列表                │
│  GET  /api/tasks/:id      - 获取任务详情                │
│  POST /api/tasks/:id/parse - 解析链接                   │
│  POST /api/tasks/:id/generate - 生成图片               │
└─────────────────────────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────┐
│                    Worker (Bull)                        │
│  1. parse-job      - 解析社交链接 (第三方服务)           │
│  2. prompt-job     - 生成提示词                          │
│  3. image-job      - 调用 jimeng-api 生成图片            │
└─────────────────────────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────┐
│                    Database (Prisma)                   │
│  Task: id, url, title, author, coverUrl, videoUrl,     │
│        images[], prompt, status, createdAt, updatedAt  │
│  GeneratedImage: id, taskId, imageUrl, status           │
└─────────────────────────────────────────────────────────┘
```

## Data Models

### Task (任务)
```typescript
{
  id: string
  url: string                    // 原始链接
  title: string                  // 解析出的标题
  author: {                      // 作者信息
    name: string
    avatar: string
  }
  coverUrl: string               // 封面图
  videoUrl: string               // 视频地址
  images: string[]               // 图片列表
  prompt: string                 // 生成的提示词
  status: 'pending' | 'parsing' | 'generating' | 'completed' | 'failed'
  createdAt: DateTime
  updatedAt: DateTime
}
```

### GeneratedImage (生成的图片)
```typescript
{
  id: string
  taskId: string
  imageUrl: string
  status: 'pending' | 'generating' | 'completed' | 'failed'
  createdAt: DateTime
}
```

## Environment Variables

```env
# Database
DATABASE_URL=postgresql://...

# Redis
REDIS_URL=redis://...

# API Keys
JIMENG_API_KEY=your-api-key
PARSE_SERVICE_URL=your-parse-service
PARSE_SERVICE_KEY=your-service-key
```

## Development Tips

1. **前端布局**: 左侧固定宽度任务列表，右侧自适应内容区
2. **第三方解析**: 使用外部解析服务，响应格式参考 PRD
3. **jimeng-api**: 即梦 AI 生图 API，需要申请 API Key
4. **任务队列**: 使用 Bull 处理异步任务，支持并发控制
