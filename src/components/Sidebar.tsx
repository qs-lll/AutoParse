'use client'

import { useState, useEffect } from 'react'

interface Task {
  id: string
  url: string
  type: string
  title: string | null
  authorName: string | null
  authorAvatar: string | null
  coverUrl: string | null
  videoUrl: string | null
  images: string
  prompt: string | null
  status: string
  errorMsg: string | null
  createdAt: string
  updatedAt: string
}

interface SidebarProps {
  onSelectTask?: (taskId: string) => void
  onHomeClick?: () => void
  selectedTaskId?: string | null
}

export function Sidebar({ onSelectTask, onHomeClick, selectedTaskId }: SidebarProps) {
  const [tasks, setTasks] = useState<Task[]>([])
  const [recentTasksExpanded, setRecentTasksExpanded] = useState(true)
  const [processingExpanded, setProcessingExpanded] = useState(false)
  const [collectionsExpanded, setCollectionsExpanded] = useState(false)
  const [archiveExpanded, setArchiveExpanded] = useState(false)

  useEffect(() => {
    fetchTasks()
  }, [])

  // 当返回首页时(selectedTaskId变为null)刷新任务列表
  useEffect(() => {
    if (selectedTaskId === null) {
      fetchTasks()
    }
  }, [selectedTaskId])

  const fetchTasks = async () => {
    try {
      const res = await fetch('/api/tasks')
      if (res.ok) {
        const data = await res.json()
        setTasks(data)
      }
    } catch (error) {
      console.error('Failed to fetch tasks:', error)
    }
  }

  const formatTime = (dateStr: string) => {
    const date = new Date(dateStr)
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(diff / 3600000)
    const days = Math.floor(diff / 86400000)

    if (minutes < 1) return '刚刚'
    if (minutes < 60) return `${minutes}分钟前`
    if (hours < 24) return `${hours}小时前`
    if (days < 7) return `${days}天前`
    return date.toLocaleDateString('zh-CN')
  }

  const LogoIcon = () => (
    <svg width="20" height="16" viewBox="0 0 20 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M10 0L0 6V10L10 16L20 10V6L10 0Z" fill="white"/>
    </svg>
  )

  const DashboardIcon = () => (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="1" y="1" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="1.5"/>
      <rect x="10" y="1" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="1.5"/>
      <rect x="1" y="10" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="1.5"/>
      <rect x="10" y="10" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="1.5"/>
    </svg>
  )

  const RecentTasksIcon = () => (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="10" cy="10" r="8" stroke="currentColor" strokeWidth="1.5"/>
      <path d="M10 5V10L13 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  )

  const ProcessingIcon = () => (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M8 1V3M8 13V15M1 8H3M13 8H15M3.05 3.05L4.46 4.46M11.54 11.54L12.95 12.95M3.05 12.95L4.46 11.54M11.54 4.46L12.95 3.05" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  )

  const CollectionsIcon = () => (
    <svg width="20" height="16" viewBox="0 0 20 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M1 1H7L9.5 5L12 2H19V14H1V1Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
    </svg>
  )

  const ArchiveIcon = () => (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="1" y="3" width="16" height="12" rx="1" stroke="currentColor" strokeWidth="1.5"/>
      <path d="M7 3V1H11V3" stroke="currentColor" strokeWidth="1.5"/>
      <path d="M1 7H17" stroke="currentColor" strokeWidth="1.5"/>
    </svg>
  )

  const ChevronIcon = ({ className = '' }: { className?: string }) => (
    <svg width="12" height="7.4" viewBox="0 0 12 7.4" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <path d="M1 1L6 6L11 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )

  const PlusIcon = () => (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M7 1V13M1 7H13" stroke="white" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  )

  const HelpIcon = () => (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="10" cy="10" r="8" stroke="currentColor" strokeWidth="1.5"/>
      <path d="M7 8C7 6.34315 8.34315 5 10 5C11.6569 5 13 6.34315 13 8C13 9.30622 12.1652 10.4174 11 10.8293V12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      <circle cx="10" cy="14.5" r="0.5" fill="currentColor"/>
    </svg>
  )

  const NewProjectButton = () => (
    <button
      onClick={onHomeClick}
      className="w-full py-3 px-4 rounded-full bg-gradient-to-br from-violet-600 to-violet-900 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-violet-500/20 hover:shadow-violet-500/30 transition-shadow"
    >
      <PlusIcon />
      New Project
    </button>
  )

  return (
    <aside className="w-[256px] bg-[#0f172a] flex flex-col py-4 shrink-0">
      {/* Logo区域 */}
      <div className="px-6 pb-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-violet-600 to-violet-900 flex items-center justify-center shrink-0">
            <LogoIcon />
          </div>
          <div className="flex flex-col">
            <span className="text-[#f8fafc] font-bold text-lg leading-none">Studio Director</span>
            <span className="text-[#a78bfa] text-xs uppercase tracking-[1.2px] mt-1">Premium Tier</span>
          </div>
        </div>
      </div>

      {/* 导航菜单 - 可滚动 */}
      <div className="flex-1 flex flex-col gap-1 px-2 overflow-y-auto scrollbar-thin scrollbar-thumb-[#334155] scrollbar-track-[#0f172a]">
        {/* Dashboard - 选中状态 */}
        <button
          onClick={onHomeClick}
          className={`flex items-center gap-3 px-4 py-2.5 rounded-lg w-full transition-colors ${
            selectedTaskId === null
              ? 'text-[#ddd6fe] bg-[rgba(76,29,149,0.3)]'
              : 'text-[#94a3b8] hover:bg-[#1e293b]'
          }`}
        >
          <DashboardIcon />
          <span className="text-sm font-medium">Dashboard</span>
        </button>

        {/* Recent Tasks - 可折叠 */}
        <div className="flex flex-col gap-1">
          <button
            onClick={() => setRecentTasksExpanded(!recentTasksExpanded)}
            className="flex items-center justify-between px-4 py-2.5 rounded-lg w-full text-[#94a3b8] hover:bg-[#1e293b] transition-colors"
          >
            <div className="flex items-center gap-3">
              <RecentTasksIcon />
              <span className="text-sm font-medium">Recent Tasks</span>
            </div>
            <ChevronIcon className={recentTasksExpanded ? '' : '-rotate-90'} />
          </button>

          {recentTasksExpanded && (
            <div className="flex flex-col pl-12 py-1.5 gap-1">
              {tasks.map((task) => (
                <button
                  key={task.id}
                  onClick={() => onSelectTask?.(task.id)}
                  className={`text-left py-1.5 text-xs font-medium rounded px-2 transition-colors ${
                    selectedTaskId === task.id
                      ? 'text-white bg-[rgba(139,92,246,0.3)]'
                      : 'text-[#94a3b8] hover:text-white hover:bg-[#1e293b]'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    {task.coverUrl && (
                      <img src={task.coverUrl} alt="" className="w-6 h-6 rounded object-cover shrink-0" />
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="truncate">{task.title || task.url || 'Untitled'}</div>
                      <div className="text-[10px] text-[#64748b] truncate">
                        {task.authorName || ''} · {formatTime(task.createdAt)}
                      </div>
                    </div>
                  </div>
                </button>
              ))}
              {tasks.length === 0 && (
                <div className="text-xs text-[#64748b] py-1.5">暂无任务</div>
              )}
            </div>
          )}
        </div>

        {/* Processing - 空置但可折叠 */}
        <button
          onClick={() => setProcessingExpanded(!processingExpanded)}
          className="flex items-center justify-between px-4 py-2.5 rounded-lg w-full text-[#94a3b8] hover:bg-[#1e293b] transition-colors"
        >
          <div className="flex items-center gap-3">
            <ProcessingIcon />
            <span className="text-sm font-medium">Processing</span>
          </div>
          <ChevronIcon className={processingExpanded ? '' : '-rotate-90'} />
        </button>

        {/* Collections - 空置但可折叠 */}
        <button
          onClick={() => setCollectionsExpanded(!collectionsExpanded)}
          className="flex items-center justify-between px-4 py-2.5 rounded-lg w-full text-[#94a3b8] hover:bg-[#1e293b] transition-colors"
        >
          <div className="flex items-center gap-3">
            <CollectionsIcon />
            <span className="text-sm font-medium">Collections</span>
          </div>
          <ChevronIcon className={collectionsExpanded ? '' : '-rotate-90'} />
        </button>

        {/* Archive - 空置但可折叠 */}
        <button
          onClick={() => setArchiveExpanded(!archiveExpanded)}
          className="flex items-center justify-between px-4 py-2.5 rounded-lg w-full text-[#94a3b8] hover:bg-[#1e293b] transition-colors"
        >
          <div className="flex items-center gap-3">
            <ArchiveIcon />
            <span className="text-sm font-medium">Archive</span>
          </div>
          <ChevronIcon className={archiveExpanded ? '' : '-rotate-90'} />
        </button>
      </div>

      {/* New Project按钮 */}
      <div className="px-4 pt-2">
        <NewProjectButton />
      </div>

      {/* Help */}
      <div className="border-t border-[#1e293b] mt-2 pt-4 px-2">
        <button className="flex items-center gap-3 px-4 py-2.5 rounded-lg w-full text-[#94a3b8] hover:bg-[#1e293b] transition-colors">
          <HelpIcon />
          <span className="text-sm font-medium">Help</span>
        </button>
      </div>
    </aside>
  )
}
