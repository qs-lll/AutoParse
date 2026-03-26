'use client'

import { useState } from 'react'

interface HomeViewProps {
  onSelectTask?: (taskId: string) => void
}

export function HomeView({ onSelectTask }: HomeViewProps) {
  const [inputValue, setInputValue] = useState('')

  const handleStartAnalysis = async () => {
    if (!inputValue.trim()) return

    try {
      const res = await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: inputValue.trim() })
      })

      if (res.ok) {
        const task = await res.json()
        setInputValue('')
        onSelectTask?.(task.id)
      }
    } catch (error) {
      console.error('Failed to create task:', error)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleStartAnalysis()
    }
  }

  const SparkleIcon = () => (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M11 0L13.5 8.5L22 11L13.5 13.5L11 22L8.5 13.5L0 11L8.5 8.5L11 0Z" fill="currentColor"/>
    </svg>
  )

  const ArrowIcon = () => (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M1 8H15M15 8L9 2M15 8L9 14" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )

  const UploadIcon = () => (
    <svg width="20" height="12.5" viewBox="0 0 20 12.5" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M10 7.5V0M10 7.5L6.5 4M10 7.5L13.5 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M1 9.5V12.5H19V9.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )

  return (
    <div className="h-full flex flex-col items-center justify-center p-6 bg-gradient-to-b from-[rgba(15,23,42,0)] to-[rgba(15,23,42,0.3)]">
      {/* AI标签 */}
      <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[rgba(139,92,246,0.1)] border border-[rgba(139,92,246,0.2)] mb-6">
        <span className="text-[#a78bfa]">
          <SparkleIcon />
        </span>
        <span className="text-[#a78bfa] text-xs font-bold uppercase tracking-[1.2px]">
          AI-Powered Video Intelligence
        </span>
      </div>

      {/* 主容器 */}
      <div className="w-full max-w-[896px] flex flex-col items-center gap-6">
        {/* 顶部文字 */}
        <div className="flex flex-col items-center gap-4 text-center">
          <h2 className="text-white text-5xl xl:text-6xl font-black leading-[1.2] tracking-[-1.5px]">
            Analyze any video with<br />
            <span className="bg-clip-text bg-gradient-to-r from-[#8b5cf6] text-transparent to-[#d946ef]">
              Etheric Intelligence
            </span>
          </h2>
          <p className="text-[#94a3b8] text-base xl:text-lg leading-relaxed max-w-[672px]">
            抖音/皮皮虾/火山/微视/最右/快手/全民小视频/皮皮搞笑/梨视频/西瓜/微博/虎牙/绿洲/好看/逗拍/美拍/新片场/A站/全民K歌/6间房
          </p>
        </div>

        {/* 输入卡片 */}
        <div className="w-full backdrop-blur-[20px] bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.1)] rounded-[32px] p-8 xl:p-12 shadow-[0px_25px_50px_-12px_rgba(0,0,0,0.25)] relative overflow-hidden mt-4">
          {/* 装饰背景 */}
          <div className="absolute bg-[rgba(139,92,246,0.1)] blur-[32px] w-[256px] h-[256px] rounded-full -top-[96px] -right-[96px] pointer-events-none" />
          <div className="absolute bg-[rgba(217,70,239,0.1)] blur-[32px] w-[256px] h-[256px] rounded-full -bottom-[96px] -left-[96px] pointer-events-none" />

          <div className="relative flex flex-col gap-8">
            {/* 输入框 */}
            <div className="relative">
              <div className="bg-[rgba(15,23,42,0.8)] border-2 border-[#1e293b] rounded-2xl px-6 xl:px-9 py-5 xl:py-7 flex items-center">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Paste S3 link, YouTube URL, or video path..."
                  className="flex-1 bg-transparent text-[#475569] text-lg xl:text-xl font-medium outline-none placeholder:text-[#475569]"
                />
              </div>

              {/* Browse Files按钮 */}
              <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2 px-3 py-1.5 bg-[#1e293b] border border-[#334155] rounded-lg cursor-pointer hover:bg-[#334155] transition-colors">
                <UploadIcon />
                <span className="text-[#94a3b8] text-xs font-bold uppercase tracking-[1px] hidden sm:inline">
                  Browse Files
                </span>
              </div>
            </div>

            {/* Start Deep Analysis按钮 */}
            <button
              onClick={handleStartAnalysis}
              className="flex items-center justify-center gap-2 px-8 xl:px-12 py-4 xl:py-5 rounded-2xl bg-gradient-to-br from-violet-600 to-violet-900 text-white text-lg xl:text-xl font-black shadow-lg shadow-violet-500/40 hover:shadow-violet-500/50 transition-shadow"
            >
              Start Deep Analysis
              <ArrowIcon />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
