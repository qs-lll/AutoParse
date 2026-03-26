'use client'

import { useState, useEffect, useCallback, useRef } from 'react'

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
  generatedImages: GeneratedImage[]
  comments: Comment[]
}

interface GeneratedImage {
  id: string
  taskId: string
  imageUrl: string | null
  status: string
}

interface Comment {
  id: string
  taskId: string
  content: string
  imageUrl: string | null
  device: string | null
  ip: string | null
  location: string | null
  createdAt: string
}

interface DetailViewProps {
  taskId: string
  onBack?: () => void
}

// 图片预览 Modal 组件
function ImageModal({
  images,
  currentIndex,
  groupName,
  onClose,
  onPrev,
  onNext,
  onGeneratePrompt
}: {
  images: string[]
  currentIndex: number
  groupName: string
  onClose: () => void
  onPrev: () => void
  onNext: () => void
  onGeneratePrompt?: (imageUrl: string) => void
}) {
  const [isGenerating, setIsGenerating] = useState(false)

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      } else if (e.key === 'ArrowLeft') {
        onPrev()
      } else if (e.key === 'ArrowRight') {
        onNext()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [onClose, onPrev, onNext])

  const currentImage = images[currentIndex]

  const handleGeneratePrompt = () => {
    if (!onGeneratePrompt || isGenerating) return
    setIsGenerating(true)
    onGeneratePrompt(currentImage)
    setTimeout(() => setIsGenerating(false), 1000)
  }

  return (
    <div
      className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <button
        className="absolute top-4 right-4 text-white text-2xl w-10 h-10 flex items-center justify-center hover:bg-white/20 rounded-full z-10"
        onClick={onClose}
      >
        ×
      </button>

      <div className="absolute top-4 left-4 flex items-center gap-2">
        <div className="text-white text-sm bg-black/50 px-3 py-1 rounded-full">
          {groupName}
        </div>
        {onGeneratePrompt && (
          <button
            onClick={handleGeneratePrompt}
            disabled={isGenerating}
            className="text-white text-sm bg-purple-600 hover:bg-purple-700 px-3 py-1 rounded-full disabled:opacity-50"
          >
            {isGenerating ? '生成中...' : '✨ 生成提示词'}
          </button>
        )}
      </div>

      {images.length > 1 && currentIndex > 0 && (
        <button
          className="absolute left-4 text-white text-3xl w-12 h-12 flex items-center justify-center hover:bg-white/20 rounded-full bg-black/30"
          onClick={(e) => {
            e.stopPropagation()
            onPrev()
          }}
        >
          ‹
        </button>
      )}

      {images.length > 1 && currentIndex < images.length - 1 && (
        <button
          className="absolute right-4 text-white text-3xl w-12 h-12 flex items-center justify-center hover:bg-white/20 rounded-full bg-black/30"
          onClick={(e) => {
            e.stopPropagation()
            onNext()
          }}
        >
          ›
        </button>
      )}

      <img
        src={currentImage}
        alt={`preview ${currentIndex + 1}`}
        className="max-w-full max-h-full object-contain"
        onClick={(e) => e.stopPropagation()}
      />

      {images.length > 1 && (
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white text-sm bg-black/50 px-3 py-1 rounded-full">
          {currentIndex + 1} / {images.length}
        </div>
      )}
    </div>
  )
}

// 视频预览 Modal
function VideoModal({
  videoUrl,
  coverUrl,
  onClose
}: {
  videoUrl: string
  coverUrl: string
  onClose: () => void
}) {
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [onClose])

  const handleDownload = () => {
    const link = document.createElement('a')
    link.href = videoUrl
    link.download = 'video.mp4'
    link.target = '_blank'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div
      className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <button
        className="absolute top-4 right-4 text-white text-2xl w-10 h-10 flex items-center justify-center hover:bg-white/20 rounded-full z-10"
        onClick={onClose}
      >
        ×
      </button>

      <div className="absolute top-4 left-4 flex gap-2">
        <div className="text-white text-sm bg-black/50 px-3 py-1 rounded-full">
          📹 视频预览
        </div>
        <button
          onClick={handleDownload}
          className="text-white text-sm bg-black/50 px-3 py-1 rounded-full hover:bg-white/20"
        >
          ⬇️ 下载
        </button>
      </div>

      <video
        ref={videoRef}
        src={videoUrl}
        poster={coverUrl}
        controls
        autoPlay
        className="max-w-full max-h-full"
        onClick={(e) => e.stopPropagation()}
      />
    </div>
  )
}

// 评论组件
function CommentSection({
  comments,
  onAddComment
}: {
  comments: Comment[]
  onAddComment: (content: string) => void
}) {
  const [newComment, setNewComment] = useState('')
  const [showInput, setShowInput] = useState(false)

  const handleSubmit = () => {
    if (newComment.trim()) {
      onAddComment(newComment.trim())
      setNewComment('')
      setShowInput(false)
    }
  }

  const formatCommentDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleString('zh-CN', {
      month: 'numeric',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between mb-3 px-4 pt-4">
        <h3 className="text-sm font-medium text-gray-500">评论 ({comments.length})</h3>
        <button
          onClick={() => setShowInput(!showInput)}
          className="text-sm text-blue-500 hover:text-blue-600"
        >
          {showInput ? '取消' : '添加评论'}
        </button>
      </div>

      {showInput && (
        <div className="mb-3 px-4 flex gap-2">
          <input
            type="text"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="输入评论内容..."
            className="flex-1 px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
          />
          <button
            onClick={handleSubmit}
            disabled={!newComment.trim()}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg text-sm hover:bg-blue-600 disabled:opacity-50"
          >
            提交
          </button>
        </div>
      )}

      <div className="flex-1 overflow-y-auto px-4 pb-4">
        {comments.map((comment, index) => (
          <div key={`${comment.id}-${index}`} className="border-b pb-3 mb-3 last:border-0">
            {comment.imageUrl && (
              <div className="mb-2">
                <img
                  src={comment.imageUrl}
                  alt="comment"
                  className="w-32 h-32 object-cover rounded-lg"
                />
              </div>
            )}
            <div className="text-sm text-gray-800 whitespace-pre-wrap">{comment.content}</div>
            <div className="flex items-center gap-3 mt-1 text-xs text-gray-400">
              <span>{formatCommentDate(comment.createdAt)}</span>
              {comment.device && <span>📱 {comment.device}</span>}
              {comment.location && <span>📍 {comment.location}</span>}
              {comment.ip && <span>🌐 {comment.ip}</span>}
            </div>
          </div>
        ))}
        {comments.length === 0 && (
          <div className="text-center text-gray-400 py-4 text-sm">
            暂无评论
          </div>
        )}
      </div>
    </div>
  )
}

export function DetailView({ taskId, onBack }: DetailViewProps) {
  const [task, setTask] = useState<Task | null>(null)
  const [loading, setLoading] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // AI 创作参数状态
  const [aspectRatio, setAspectRatio] = useState('9:16')
  const [model, setModel] = useState('图片5.0')

  // 上传图片状态（最多5张）
  const [uploadedImages, setUploadedImages] = useState<string[]>([])
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null)
  const [isDraggingOver, setIsDraggingOver] = useState(false)

  // 处理外部拖拽文件
  const handleFileDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDraggingOver(true)
  }

  const handleFileDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDraggingOver(false)
  }

  const handleFileDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDraggingOver(false)

    const files = Array.from(e.dataTransfer.files)
    const imageFiles = files.filter(f => f.type.startsWith('image/'))

    if (imageFiles.length > 0) {
      imageFiles.forEach(file => {
        if (uploadedImages.length >= 5) return
        const reader = new FileReader()
        reader.onload = (ev) => {
          const result = ev.target?.result as string
          setUploadedImages(prev => {
            if (prev.length >= 5) return prev
            return [...prev, result]
          })
        }
        reader.readAsDataURL(file)
      })
      return
    }

    const imageUrl = e.dataTransfer.getData('text/uri-list') || e.dataTransfer.getData('text/plain')
    if (imageUrl && (imageUrl.startsWith('http') || imageUrl.startsWith('data:image'))) {
      if (!uploadedImages.includes(imageUrl) && uploadedImages.length < 5) {
        setUploadedImages(prev => [...prev, imageUrl])
      }
    }
  }
  const uploadInputRef = useRef<HTMLInputElement>(null)

  // 处理本地上传
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files) {
      Array.from(files).forEach(file => {
        if (uploadedImages.length >= 5) return
        const reader = new FileReader()
        reader.onload = (e) => {
          const result = e.target?.result as string
          setUploadedImages(prev => {
            if (prev.length >= 5) return prev
            return [...prev, result]
          })
        }
        reader.readAsDataURL(file)
      })
    }
    if (uploadInputRef.current) {
      uploadInputRef.current.value = ''
    }
  }

  // 移除图片
  const removeImage = (index: number) => {
    setUploadedImages(prev => prev.filter((_, i) => i !== index))
  }

  // 拖拽排序
  const handleImageDragStart = (index: number) => {
    setDraggedIndex(index)
  }

  const handleImageDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault()
    if (draggedIndex === null || draggedIndex === index) return
  }

  const handleImageDrop = (e: React.DragEvent, index: number) => {
    e.preventDefault()
    if (draggedIndex === null || draggedIndex === index) return
    const newImages = [...uploadedImages]
    const draggedImage = newImages[draggedIndex]
    newImages.splice(draggedIndex, 1)
    newImages.splice(index, 0, draggedImage)
    setUploadedImages(newImages)
    setDraggedIndex(null)
  }

  const handleImageDragEnd = () => {
    setDraggedIndex(null)
  }

  // 比例选项
  const aspectRatios = ['21:9', '16:9', '3:2', '4:3', '1:1', '3:4', '2:3', '9:16']

  // 模型选项
  const modelOptions = [
    { value: '图片5.0', label: '图片5.0', desc: '最新旗舰模型，更精准更智能', tag: '' },
    { value: '图片5.0 Lite', label: '图片5.0 Lite', desc: '指令响应更精准，生成效果更智能', tag: 'New' },
    { value: '图片4.6', label: '图片4.6', desc: '人像一致性保持更好，性价比更高', tag: 'New' },
    { value: '图片4.5', label: '图片4.5', desc: '强化一致性、风格与图文响应', tag: '' },
    { value: '图片4.1', label: '图片4.1', desc: '更专业的创意、美学和一致性保持', tag: '' },
    { value: '图片4.0', label: '图片4.0', desc: '支持多参考图、系列组图生成', tag: '' },
    { value: '图片3.1', label: '图片3.1', desc: '丰富的美学多样性，画面更鲜明生动', tag: '' },
    { value: '图片3.0', label: '图片3.0', desc: '影视质感，文字更准，直出2k高清图', tag: '' },
  ]

  // 保存设置到 localStorage
  useEffect(() => {
    const saved = localStorage.getItem('aiSettings')
    if (saved) {
      const { aspectRatio: savedRatio, model: savedModel } = JSON.parse(saved)
      if (savedRatio) setAspectRatio(savedRatio)
      if (savedModel) setModel(savedModel)
    }
  }, [])

  const saveSettings = (ratio: string, modelValue: string) => {
    localStorage.setItem('aiSettings', JSON.stringify({ aspectRatio: ratio, model: modelValue }))
  }

  const handleAspectRatioChange = (ratio: string) => {
    setAspectRatio(ratio)
    saveSettings(ratio, model)
  }

  const handleModelChange = (modelValue: string) => {
    setModel(modelValue)
    saveSettings(aspectRatio, modelValue)
  }

  // 预览状态
  const [previewImages, setPreviewImages] = useState<string[]>([])
  const [previewIndex, setPreviewIndex] = useState(0)
  const [previewGroupName, setPreviewGroupName] = useState('')

  // 视频预览状态
  const [videoPreview, setVideoPreview] = useState<{ url: string; cover: string } | null>(null)

  useEffect(() => {
    fetchTask()
  }, [taskId])

  const fetchTask = async () => {
    try {
      const res = await fetch(`/api/tasks/${taskId}`)
      const data = await res.json()
      setTask(data)
    } catch (error) {
      console.error('Failed to fetch task:', error)
    }
  }

  // 解析任务
  const parseTask = async () => {
    if (!task) return
    setLoading(true)
    try {
      const res = await fetch(`/api/tasks/${task.id}/parse`, { method: 'POST' })
      const updatedTask = await res.json()
      setTask(updatedTask)
    } catch (error) {
      console.error('Failed to parse task:', error)
    }
    setLoading(false)
  }

  // 生成图片
  const generateImage = async () => {
    if (!task) return
    setLoading(true)
    try {
      const res = await fetch(`/api/tasks/${task.id}/generate`, { method: 'POST' })
      const updatedTask = await res.json()
      setTask(updatedTask)
    } catch (error) {
      console.error('Failed to generate image:', error)
    }
    setLoading(false)
  }

  // 删除任务
  const deleteTask = async () => {
    if (!task) return
    try {
      await fetch(`/api/tasks/${task.id}`, { method: 'DELETE' })
      onBack?.()
    } catch (error) {
      console.error('Failed to delete task:', error)
    }
  }

  // 添加评论
  const addComment = async (content: string) => {
    if (!task) return

    try {
      const clientInfoRes = await fetch('/api/client-info')
      const clientInfo = await clientInfoRes.json()
      const deviceInfo = `${clientInfo.os} ${clientInfo.browser} / ${window.screen.width}x${window.screen.height}`

      const res = await fetch(`/api/tasks/${task.id}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content,
          device: deviceInfo,
          ip: clientInfo.ip || null,
          location: null
        })
      })

      const newComment = await res.json()

      const updatedTask = {
        ...task,
        comments: [newComment, ...(task.comments || [])]
      }

      setTask(updatedTask)
    } catch (error) {
      console.error('Failed to add comment:', error)
    }
  }

  // 从输入框生成提示词
  const handleGeneratePromptFromInput = async () => {
    const input = document.querySelector('input[placeholder="输入提示词生成图片..."]') as HTMLInputElement
    if (!input?.value.trim() || !task) return
    console.log('生成提示词:', input.value)
    input.value = ''
  }

  // 打开预览 - 分组
  const openPreview = (images: string[], groupName: string, index: number = 0) => {
    setPreviewImages(images)
    setPreviewIndex(index)
    setPreviewGroupName(groupName)
  }

  const closePreview = () => {
    setPreviewImages([])
    setPreviewIndex(0)
    setPreviewGroupName('')
  }

  // 从图片生成提示词并保存为评论
  const generatePromptFromImage = async (imageUrl: string) => {
    if (!task) return

    try {
      const mockPrompts = [
        '一个美丽的风景画，蓝天白云，绿色草地，远处的山脉',
        '现代城市夜景，霓虹灯闪烁，车流光轨',
        '复古风格的咖啡馆，温暖的灯光，木质家具',
        '抽象艺术作品，鲜艳的色彩，流畅的线条',
        '自然风光，日出时分，金色的阳光洒在海面上'
      ]
      const randomPrompt = mockPrompts[Math.floor(Math.random() * mockPrompts.length)]

      const clientInfoRes = await fetch('/api/client-info')
      const clientInfo = await clientInfoRes.json()
      const deviceInfo = `${clientInfo.os} ${clientInfo.browser} / ${window.screen.width}x${window.screen.height}`

      const commentContent = `🖼️ [图片提示词]\n\n${randomPrompt}`

      const res = await fetch(`/api/tasks/${task.id}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: commentContent,
          imageUrl: imageUrl,
          device: deviceInfo,
          ip: clientInfo.ip || null,
          location: null
        })
      })

      const newComment = await res.json()

      const updatedTask = {
        ...task,
        comments: [newComment, ...(task.comments || [])]
      }

      setTask(updatedTask)
      closePreview()
    } catch (error) {
      console.error('Failed to generate prompt:', error)
    }
  }

  const goToPrev = useCallback(() => {
    setPreviewIndex(i => Math.max(0, i - 1))
  }, [])

  const goToNext = useCallback(() => {
    setPreviewIndex(i => Math.min(previewImages.length - 1, i + 1))
  }, [previewImages.length])

  // 拖拽处理
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)

    const files = Array.from(e.dataTransfer.files)
    const imageFiles = files.filter(f => f.type.startsWith('image/'))

    for (const file of imageFiles) {
      await uploadFile(file)
    }
  }

  // 上传本地图片
  const uploadFile = async (file: File) => {
    try {
      const formData = new FormData()
      formData.append('file', file)

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      })

      if (!res.ok) {
        throw new Error('Upload failed')
      }

      const data = await res.json()
      // 不创建新任务，直接添加到上传图片列表
    } catch (error) {
      console.error('Failed to upload file:', error)
    }
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files) {
      const imageFiles = Array.from(files).filter(f => f.type.startsWith('image/'))
      for (const file of imageFiles) {
        uploadFile(file)
      }
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-500'
      case 'failed': return 'bg-red-500'
      case 'parsing':
      case 'generating': return 'bg-yellow-500'
      default: return 'bg-gray-400'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed': return '已完成'
      case 'failed': return '失败'
      case 'parsing': return '解析中'
      case 'generating': return '生成中'
      default: return '待处理'
    }
  }

  const parsedImages = task?.images ? JSON.parse(task.images) : []
  const generatedImages = task?.generatedImages?.filter(img => img.imageUrl).map(img => img.imageUrl!) || []
  const isUploadTask = task?.type === 'upload'

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleString('zh-CN', {
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    })
  }

  return (
    <>
      {/* 图片预览 Modal */}
      {previewImages.length > 0 && (
        <ImageModal
          images={previewImages}
          currentIndex={previewIndex}
          groupName={previewGroupName}
          onClose={closePreview}
          onPrev={goToPrev}
          onNext={goToNext}
          onGeneratePrompt={generatePromptFromImage}
        />
      )}

      {/* 视频预览 Modal */}
      {videoPreview && (
        <VideoModal
          videoUrl={videoPreview.url}
          coverUrl={videoPreview.cover}
          onClose={() => setVideoPreview(null)}
        />
      )}

      {/* 主内容区 + 右侧列 */}
      <div className="flex flex-1 h-full">
        {/* 中间主内容区 */}
        <div className="flex-1 overflow-y-auto p-6 pb-24 bg-gray-50">
          {task ? (
          <div className="max-w-4xl mx-auto">
            {/* 本地图片模式 */}
            {isUploadTask ? (
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <div className="flex gap-2 mb-4">
                  {(task.status === 'pending' || task.status === 'failed') && task.coverUrl && (
                    <button
                      onClick={generateImage}
                      disabled={loading}
                      className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600 disabled:opacity-50"
                    >
                      生成图片
                    </button>
                  )}
                  {task.status === 'generating' && (
                    <button disabled className="px-4 py-2 bg-yellow-500 text-white rounded">
                      生成中...
                    </button>
                  )}
                  <button
                    onClick={deleteTask}
                    className="px-4 py-2 bg-red-100 text-red-600 rounded hover:bg-red-200"
                  >
                    删除
                  </button>
                </div>

                {task.coverUrl && (
                  <div className="mb-4">
                    <div className="text-sm font-medium text-gray-500 mb-2">
                      {task.videoUrl && task.videoUrl.length > 0 ? '封面视频' : '封面图'}
                    </div>
                    <div
                      className={`inline-block rounded-lg overflow-hidden cursor-pointer hover:opacity-80 border-2 border-blue-200 relative ${task.videoUrl && task.videoUrl.length > 0 ? 'cursor-play' : ''}`}
                      onClick={() => {
                        if (task.videoUrl && task.videoUrl.length > 0) {
                          setVideoPreview({ url: task.videoUrl, cover: task.coverUrl! })
                        } else {
                          openPreview([task.coverUrl!], '封面图', 0)
                        }
                      }}
                      title={task.videoUrl && task.videoUrl.length > 0 ? '点击播放视频 - 拖拽到AI创作模式添加' : '封面图 - 拖拽到AI创作模式添加'}
                      draggable
                      onDragStart={(e) => {
                        e.dataTransfer.setData('text/uri-list', task.coverUrl!)
                        e.dataTransfer.setData('text/plain', task.coverUrl!)
                      }}
                    >
                      <img
                        src={task.coverUrl}
                        alt="cover"
                        className="max-w-full max-h-96 object-contain"
                      />
                      {task.videoUrl && task.videoUrl.length > 0 && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                          <div className="w-16 h-16 bg-white/90 rounded-full flex items-center justify-center">
                            <span className="text-3xl">▶️</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                <div className="text-xs text-gray-400 space-y-1">
                  <div>创建时间: {formatDate(task.createdAt)}</div>
                </div>
              </div>
            ) : (
              /* 社交链接模式 */
              <div className="bg-white rounded-lg p-4 mb-4 shadow-sm">
                {task.title ? (
                  <a
                    href={task.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-lg font-medium text-blue-600 hover:text-blue-800 hover:underline block mb-3"
                  >
                    {task.title}
                  </a>
                ) : (
                  <h2 className="text-lg font-medium mb-3 text-gray-400">
                    未获取标题
                  </h2>
                )}

                {task.authorName && (
                  <div className="flex items-center gap-3 mb-3">
                    {task.authorAvatar ? (
                      <img
                        src={task.authorAvatar}
                        alt="avatar"
                        className="w-8 h-8 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                        <span className="text-gray-400">?</span>
                      </div>
                    )}
                    <span className="text-sm text-gray-600">{task.authorName}</span>
                  </div>
                )}

                <div className="flex items-center gap-2 mb-3 text-sm">
                  {task.videoUrl && task.videoUrl.length > 0 ? (
                    <span className="px-2 py-0.5 bg-red-100 text-red-600 rounded">📹 视频</span>
                  ) : parsedImages.length > 0 ? (
                    <span className="px-2 py-0.5 bg-blue-100 text-blue-600 rounded">🖼️ 图片 ({parsedImages.length}张)</span>
                  ) : (
                    <span className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded">📋 待解析</span>
                  )}
                  <span className={`px-2 py-0.5 rounded ${getStatusColor(task.status)} text-white`}>
                    {getStatusText(task.status)}
                  </span>
                </div>

                <div className="text-xs text-gray-400 mb-4 break-all">
                  {task.url}
                </div>

                {task.coverUrl && (
                  <div className="mb-4">
                    <div className="text-sm font-medium text-gray-500 mb-2">封面图</div>
                    <div
                      className="inline-block w-32 h-32 rounded-lg overflow-hidden cursor-move hover:opacity-80 border-2 border-blue-200"
                      onClick={() => openPreview([task.coverUrl!], '封面图', 0)}
                      title="封面图 - 拖拽到AI创作模式添加"
                      draggable
                      onDragStart={(e) => {
                        e.dataTransfer.setData('text/uri-list', task.coverUrl!)
                        e.dataTransfer.setData('text/plain', task.coverUrl!)
                      }}
                    >
                      <img
                        src={task.coverUrl}
                        alt="cover"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                )}

                {parsedImages.length > 0 && (
                  <div className="mb-4">
                    <div className="text-sm font-medium text-gray-500 mb-2">原文图片 ({parsedImages.length}张)</div>
                    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin">
                      {parsedImages.map((imgUrl: string, index: number) => (
                        <div
                          key={`parsed-${index}`}
                          className="flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden cursor-move hover:opacity-80"
                          onClick={() => openPreview(parsedImages, '原文图片', index)}
                          title={`图片 ${index + 1} - 拖拽到AI创作模式添加`}
                          draggable
                          onDragStart={(e) => {
                            e.dataTransfer.setData('text/uri-list', imgUrl)
                            e.dataTransfer.setData('text/plain', imgUrl)
                          }}
                        >
                          <img
                            src={imgUrl}
                            alt={`原文图片 ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 原文视频 */}
                {task.videoUrl && task.videoUrl.length > 0 && (
                  <div className="mb-4">
                    <div className="text-sm font-medium text-gray-500 mb-2">原文视频</div>
                    <a
                      href={task.videoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block rounded-lg overflow-hidden cursor-pointer hover:opacity-80 border-2 border-red-200 relative"
                      title="点击播放视频 - 拖拽到AI创作模式添加"
                      draggable
                      onDragStart={(e) => {
                        if (task.coverUrl) {
                          e.dataTransfer.setData('text/uri-list', task.coverUrl)
                          e.dataTransfer.setData('text/plain', task.coverUrl)
                        }
                      }}
                    >
                      {task.coverUrl && (
                        <img
                          src={task.coverUrl}
                          alt="原文视频"
                          className="w-48 h-32 object-cover"
                        />
                      )}
                      <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                        <div className="w-12 h-12 bg-white/90 rounded-full flex items-center justify-center">
                          <span className="text-2xl">▶️</span>
                        </div>
                      </div>
                    </a>
                  </div>
                )}

                {task.errorMsg && (
                  <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
                    错误: {task.errorMsg}
                  </div>
                )}

                <div className="mb-4 text-xs text-gray-400 space-y-1">
                  <div>创建时间: {formatDate(task.createdAt)}</div>
                  <div>更新时间: {formatDate(task.updatedAt)}</div>
                </div>

                <div className="flex gap-2 pt-3 border-t">
                  {task.status === 'pending' && !task.title && (
                    <button
                      onClick={parseTask}
                      disabled={loading}
                      className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
                    >
                      解析内容
                    </button>
                  )}
                  {task.title && (
                    <button
                      onClick={parseTask}
                      disabled={loading || task.status === 'parsing'}
                      className="px-4 py-2 text-white rounded disabled:opacity-50"
                      style={{ backgroundColor: '#f97316' }}
                    >
                      重新解析
                    </button>
                  )}
                  {task.status === 'parsing' && (
                    <button disabled className="px-4 py-2 bg-yellow-500 text-white rounded">
                      解析中...
                    </button>
                  )}
                  {(task.status === 'pending' || task.status === 'failed') && task.title && (
                    <button
                      onClick={generateImage}
                      disabled={loading}
                      className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600 disabled:opacity-50"
                    >
                      生成图片
                    </button>
                  )}
                  {task.status === 'generating' && (
                    <button disabled className="px-4 py-2 bg-yellow-500 text-white rounded">
                      生成中...
                    </button>
                  )}
                  <button
                    onClick={deleteTask}
                    className="px-4 py-2 bg-red-100 text-red-600 rounded hover:bg-red-200"
                  >
                    删除
                  </button>
                </div>
              </div>
            )}

            {/* 提示词信息 */}
            {task.prompt && (
              <div className="bg-white rounded-lg p-4 mb-4 shadow-sm">
                <h3 className="text-sm font-medium text-gray-500 mb-2">提示词</h3>
                <p className="text-gray-800">{task.prompt}</p>
              </div>
            )}

            {/* 瀑布流：AI生成图片 */}
            {generatedImages.length > 0 && (
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <h3 className="text-sm font-medium text-gray-500 mb-4">AI 生成结果 ({generatedImages.length}张)</h3>
                <div className="columns-2 md:columns-3 lg:columns-4 gap-4">
                  {generatedImages.map((imgUrl, idx) => (
                    <div
                      key={`generated-${idx}`}
                      className="mb-4 break-inside-avoid cursor-move hover:opacity-80 transition-opacity"
                      onClick={() => openPreview(generatedImages, 'AI生成图片', idx)}
                      title={`AI图片 ${idx + 1} - 拖拽到AI创作模式添加`}
                      draggable
                      onDragStart={(e) => {
                        e.dataTransfer.setData('text/uri-list', imgUrl)
                        e.dataTransfer.setData('text/plain', imgUrl)
                      }}
                    >
                      <img
                        src={imgUrl}
                        alt={`AI生成 ${idx + 1}`}
                        className="w-full rounded-lg"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {task.status === 'completed' && generatedImages.length === 0 && (
              <div className="bg-white rounded-lg p-8 text-center text-gray-400">
                未生成图片
              </div>
            )}
          </div>
        ) : (
          <div className="flex items-center justify-center h-full text-gray-400">
            <div className="text-center">
              <div className="text-6xl mb-4">Loading...</div>
              <div>加载任务详情中...</div>
            </div>
          </div>
        )}
      </div>

      {/* 右侧列：AI提示词 + 评论 */}
      <div className="w-80 bg-white border-l shadow-lg flex flex-col">
        {/* 上半部分：AI提示词 - 支持拖拽添加图片 */}
        <div
          className={`rounded-xl shadow-sm border border-gray-100 m-3 overflow-hidden ${isDraggingOver ? 'ring-2 ring-blue-400 ring-offset-2' : ''}`}
          onDragOver={handleFileDragOver}
          onDragLeave={handleFileDragLeave}
          onDrop={handleFileDrop}
        >
          {/* 顶部标题栏 */}
          <div className="bg-blue-50 px-4 py-2 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-lg">🎬</span>
              <span className="text-sm font-medium text-gray-700">AI 创作模式</span>
            </div>
            <a href="#" className="text-sm text-blue-500 hover:text-blue-600">试一试 →</a>
          </div>

          {/* 中间输入区 */}
          <div className="p-4 bg-white">
            <div className="flex gap-3">
              {/* 左侧图片上传区域 - 支持拖拽添加 */}
              <div
                className={`relative ${isDraggingOver ? 'ring-2 ring-blue-400 ring-offset-2 rounded-lg' : ''}`}
                onDragOver={handleFileDragOver}
                onDragLeave={handleFileDragLeave}
                onDrop={handleFileDrop}
              >
                {/* 已上传的图片 + 上传按钮 */}
                <div className="flex gap-1 flex-wrap max-w-[88px]">
                  {/* 已上传的图片（可拖拽排序和预览） */}
                  {uploadedImages.map((img, index) => (
                    <div
                      key={index}
                      draggable
                      onDragStart={() => handleImageDragStart(index)}
                      onDragOver={(e) => handleImageDragOver(e, index)}
                      onDrop={(e) => handleImageDrop(e, index)}
                      onDragEnd={handleImageDragEnd}
                      onClick={() => openPreview(uploadedImages, '上传图片', index)}
                      className={`relative w-14 h-14 rounded-lg overflow-hidden cursor-pointer hover:opacity-80 ${
                        draggedIndex === index ? 'opacity-50' : ''
                      }`}
                      title={`上传图片 ${index + 1} - 点击预览`}
                    >
                      <img src={img} alt={`上传${index + 1}`} className="w-full h-full object-cover" />
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          removeImage(index)
                        }}
                        className="absolute top-0 right-0 w-4 h-4 bg-red-500 text-white text-xs flex items-center justify-center"
                      >
                        ×
                      </button>
                    </div>
                  ))}

                  {/* 上传按钮 */}
                  {uploadedImages.length < 5 && (
                    <>
                      {/* 本地上传 */}
                      <div
                        onClick={() => uploadInputRef.current?.click()}
                        className="w-14 h-14 rounded-lg bg-gray-100 border-2 border-dashed border-gray-300 flex items-center justify-center cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition-colors"
                        title="上传本地图片"
                      >
                        <span className="text-xl text-gray-400">+</span>
                      </div>
                    </>
                  )}
                </div>

                {/* 数量提示 */}
                <div className="text-xs text-gray-400 mt-1">
                  {uploadedImages.length}/5 张
                </div>

                <input
                  ref={uploadInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={handleImageUpload}
                />
              </div>

              {/* 右侧文本输入 */}
              <div className="flex-1">
                <textarea
                  placeholder="请描述你想生成的图片..."
                  className="w-full h-20 px-3 py-2 border border-gray-200 rounded-lg text-sm resize-none focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && e.ctrlKey) {
                      handleGeneratePromptFromInput()
                    }
                  }}
                />
              </div>
            </div>
          </div>

          {/* 底部控制条 */}
          <div className="px-4 py-3 bg-gray-50 border-t">
            {/* 比例和模型选择 */}
            <div className="flex items-center gap-3 mb-3">
              {/* 比例选择 */}
              <div className="relative">
                <select
                  value={aspectRatio}
                  onChange={(e) => handleAspectRatioChange(e.target.value)}
                  className="appearance-none px-3 py-1.5 pr-7 bg-white border border-gray-200 rounded-lg text-xs text-gray-700 cursor-pointer focus:outline-none focus:border-blue-400"
                >
                  {aspectRatios.map((ratio) => (
                    <option key={ratio} value={ratio}>{ratio}</option>
                  ))}
                </select>
                <span className="absolute right-2 top-1/2 -translate-y-1/2 text-xs pointer-events-none">▼</span>
              </div>

              {/* 模型选择 */}
              <div className="relative flex-1">
                <select
                  value={model}
                  onChange={(e) => handleModelChange(e.target.value)}
                  className="w-full appearance-none px-3 py-1.5 pr-7 bg-white border border-gray-200 rounded-lg text-xs text-gray-700 cursor-pointer focus:outline-none focus:border-blue-400"
                >
                  {modelOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label} {opt.tag}
                    </option>
                  ))}
                </select>
                <span className="absolute right-2 top-1/2 -translate-y-1/2 text-xs pointer-events-none">▼</span>
              </div>
            </div>

            {/* 按钮和额度 */}
            <div className="flex items-center justify-between">
              <div className="text-xs text-gray-500">
                ✦ 0 / 张
              </div>
              {/* 右侧生成按钮 */}
              <button
                onClick={handleGeneratePromptFromInput}
                className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white shadow-lg hover:opacity-90 transition-opacity"
              >
                <span className="text-lg">↑</span>
              </button>
            </div>
          </div>
        </div>

        {/* 下半部分：评论 */}
        <div className="flex-1 overflow-hidden">
          <CommentSection
            comments={task?.comments || []}
            onAddComment={addComment}
          />
        </div>
      </div>
      </div>
    </>
  )
}
