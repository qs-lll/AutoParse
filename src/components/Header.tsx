'use client'

interface HeaderProps {
  title?: string | null
}

export function Header({ title }: HeaderProps) {
  const NotificationIcon = () => (
    <svg width="16" height="20" viewBox="0 0 16 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M8 18C8 18 14 13 14 8V3L16 1V0H0V1L2 3V8C2 13 8 18 8 18Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
      <path d="M6 18C6 19.1046 6.89543 20 8 20C9.10457 20 10 19.1046 10 18" stroke="currentColor" strokeWidth="1.5"/>
    </svg>
  )

  const SettingsIcon = () => (
    <svg width="20.1" height="20" viewBox="0 0 20.1 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="10.05" cy="10.05" r="3.05" stroke="currentColor" strokeWidth="1.5"/>
      <path d="M10.05 1V3.05M10.05 16.95V19M18.95 10.05H16.9M3.15 10.05H1.1M16.24 3.86L14.56 5.54M5.54 14.56L3.86 16.24M16.24 16.24L14.56 14.56M5.54 5.54L3.86 3.86" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  )

  return (
    <header className="h-[80px] backdrop-blur-md bg-[rgba(2,6,23,0.5)] border-b border-[#0f172a] flex items-center justify-between px-8 shrink-0">
      {/* 左侧标题 */}
      <div>
        <h1 className="text-[#f8fafc] font-black text-xl tracking-[-1px]">
          {title || 'Curator AI'}
        </h1>
      </div>

      {/* 右侧图标 */}
      <div className="flex items-center gap-4">
        {/* 通知图标 */}
        <button className="relative p-2 text-[#94a3b8] hover:text-white transition-colors">
          <NotificationIcon />
          <span className="absolute top-2 right-2 w-2 h-2 bg-[#ba1a1a] rounded-full" />
        </button>

        {/* 设置图标 */}
        <button className="text-[#94a3b8] hover:text-white transition-colors">
          <SettingsIcon />
        </button>

        {/* 用户头像 */}
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-500 to-violet-700 shadow-[0_0_0_2px_rgba(139,92,246,0.2)] overflow-hidden">
          <div className="w-full h-full bg-[#e2e8f0]" />
        </div>
      </div>
    </header>
  )
}
