'use client'

import { HomeView } from './HomeView'
import { DetailView } from './DetailView'

interface MainContentProps {
  currentView: 'home' | 'detail'
  selectedTaskId: string | null
  onTaskSelect: (taskId: string) => void
  onHomeClick: () => void
}

export function MainContent({
  currentView,
  selectedTaskId,
  onTaskSelect,
  onHomeClick
}: MainContentProps) {
  if (currentView === 'detail' && selectedTaskId) {
    return (
      <main className="flex-1 bg-[#020617] overflow-auto">
        <DetailView
          taskId={selectedTaskId}
          onBack={onHomeClick}
        />
      </main>
    )
  }

  return (
    <main className="flex-1 bg-[#020617] overflow-auto">
      <HomeView
        onSelectTask={onTaskSelect}
      />
    </main>
  )
}
