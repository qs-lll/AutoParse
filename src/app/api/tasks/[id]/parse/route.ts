import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

const PARSE_SERVICE_URL = process.env.PARSE_SERVICE_URL || ''

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const task = await prisma.task.findUnique({ where: { id } })
    if (!task) {
      return NextResponse.json({ error: 'Task not found' }, { status: 404 })
    }

    // Update status to parsing
    await prisma.task.update({
      where: { id },
      data: { status: 'parsing' }
    })

    // Call parse service (GET request with URL query param)
    const parseUrl = new URL(PARSE_SERVICE_URL)
    parseUrl.searchParams.set('url', task.url)

    const response = await fetch(parseUrl.toString(), {
      method: 'GET',
      headers: {
        'Accept': 'application/json'
      }
    })

    if (!response.ok) {
      await prisma.task.update({
        where: { id },
        data: { status: 'failed', errorMsg: 'Parse service error' }
      })
      return NextResponse.json({ error: 'Parse service failed' }, { status: 500 })
    }

    const data = await response.json()

    if (data.code !== 200) {
      await prisma.task.update({
        where: { id },
        data: { status: 'failed', errorMsg: data.msg || 'Parse failed' }
      })
      return NextResponse.json({ error: data.msg || 'Parse failed' }, { status: 400 })
    }

    const { author, title, video_url, cover_url, images } = data.data || {}

    // Extract image URLs from the response
    const imageUrls = images ? images.map((img: { url: string }) => img.url).filter(Boolean) : []

    // Update task with parsed data
    const updatedTask = await prisma.task.update({
      where: { id },
      data: {
        title: title || '',
        authorName: author?.name || '',
        authorAvatar: author?.avatar || '',
        coverUrl: cover_url || '',
        videoUrl: video_url || '',
        images: JSON.stringify(imageUrls),
        status: 'pending'
      }
    })

    return NextResponse.json(updatedTask)
  } catch (error) {
    console.error('Error parsing task:', error)
    return NextResponse.json({ error: 'Failed to parse task' }, { status: 500 })
  }
}
