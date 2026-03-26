'use client'

import { useState } from 'react'
import { Sidebar } from './Sidebar'
import { Header } from './Header'
import { MainContent } from './MainContent'

export function AppShell() {
  const [currentView, setCurrentView] = useState<'home' | 'detail'>('home')
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null)
  const [headerTitle, setHeaderTitle] = useState<string | null>(null)

  const handleSelectTask = (taskId: string) => {
    setSelectedTaskId(taskId)
    setCurrentView('detail')
    // 获取任务标题用于Header显示
    fetch(`/api/tasks/${taskId}`)
      .then(res => res.json())
      .then(task => {
        setHeaderTitle(task.title)
      })
      .catch(console.error)
  }

  const handleHomeClick = () => {
    setCurrentView('home')
    setSelectedTaskId(null)
    setHeaderTitle(null)
  }

  return (
    <div className="flex h-screen bg-[#020617]">
      {/* 左侧边栏 */}
      <Sidebar
        onSelectTask={handleSelectTask}
        onHomeClick={handleHomeClick}
        selectedTaskId={selectedTaskId}
      />
      {/* 右侧主区域 */}
      <div className="flex flex-col flex-1 min-w-0">
        {/* 顶部Header */}
        <Header title={headerTitle} />
        {/* 主内容区 - 动态切换 */}
        <MainContent
          currentView={currentView}
          selectedTaskId={selectedTaskId}
          onTaskSelect={handleSelectTask}
          onHomeClick={handleHomeClick}
        />
      </div>
    </div>
  )
}
