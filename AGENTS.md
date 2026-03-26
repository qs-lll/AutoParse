# PROJECT KNOWLEDGE BASE

**Generated:** 2026-03-18
**Commit:** 0e32129
**Branch:** (current)

## OVERVIEW
AI 图片生成控制台 - 接收社交媒体链接（抖音/小红书/快手），解析内容后生成提示词，再调用即梦(jimeng) API 生成图片。

## STRUCTURE
```
./
├── src/
│   ├── app/           # Next.js App Router (页面 + API)
│   ├── components/    # React 组件
│   └── lib/           # 工具函数
├── prisma/            # 数据库 schema
└── public/            # 静态资源
```

## WHERE TO LOOK
| Task | Location | Notes |
|------|----------|-------|
| 前端页面 | `src/app/page.tsx` | 主页面 |
| API 路由 | `src/app/api/tasks/` | 任务 CRUD API |
| 数据库模型 | `prisma/schema.prisma` | Task, GeneratedImage |
| 样式 | `src/app/globals.css` | Tailwind CSS |

## CODE MAP
| Symbol | Type | Location | Role |
|--------|------|----------|------|
| Task | Model | prisma/schema | 任务数据模型 |
| GeneratedImage | Model | prisma/schema | 生成图片模型 |

## CONVENTIONS
- **API**: RESTful 风格，App Router 方式
- **样式**: Tailwind CSS 4
- **数据库**: Prisma ORM + PostgreSQL
- **任务队列**: Bull + Redis

## ANTI-PATTERNS (THIS PROJECT)
- 禁止使用 `as any`, `@ts-ignore` 抑制类型错误
- 禁止空 catch 块 `catch(e) {}`
- 禁止删除测试来"通过"

## COMMANDS
```bash
npm run dev          # 开发服务器
npm run build        # 生产构建
npm run start        # 启动生产服务器
npm run lint         # ESLint 检查
```

## NOTES
- 依赖外部解析服务处理社交媒体链接
- 即梦 API 需要申请 API Key
- 任务队列支持并发控制
