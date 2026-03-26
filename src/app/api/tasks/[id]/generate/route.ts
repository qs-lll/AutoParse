import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

const JIMENG_API_KEY = process.env.JIMENG_API_KEY || ''

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

    // Generate prompt from task data
    const prompt = generatePrompt(task)

    // Update task with prompt
    await prisma.task.update({
      where: { id },
      data: {
        prompt,
        status: 'generating'
      }
    })

    // Create initial image record
    const generatedImage = await prisma.generatedImage.create({
      data: {
        taskId: id,
        status: 'generating'
      }
    })

    // Call jimeng API to generate image
    const jimengResponse = await fetch('https://api.jimeng.com/v1/images/generations', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${JIMENG_API_KEY}`
      },
      body: JSON.stringify({
        model: 'jimeng-2.0',
        prompt,
        num_images: 4
      })
    })

    if (!jimengResponse.ok) {
      const errorData = await jimengResponse.json()
      await prisma.generatedImage.update({
        where: { id: generatedImage.id },
        data: { status: 'failed', errorMsg: JSON.stringify(errorData) }
      })
      await prisma.task.update({
        where: { id },
        data: { status: 'failed', errorMsg: 'Jimeng API error' }
      })
      return NextResponse.json({ error: 'Image generation failed' }, { status: 500 })
    }

    const result = await jimengResponse.json()

    // Update generated image with result
    await prisma.generatedImage.update({
      where: { id: generatedImage.id },
      data: {
        imageUrl: result.data?.[0]?.url || '',
        status: 'completed'
      }
    })

    // Update task status
    await prisma.task.update({
      where: { id },
      data: { status: 'completed' }
    })

    const updatedTask = await prisma.task.findUnique({
      where: { id },
      include: { generatedImages: true }
    })

    return NextResponse.json(updatedTask)
  } catch (error) {
    console.error('Error generating image:', error)
    return NextResponse.json({ error: 'Failed to generate image' }, { status: 500 })
  }
}

function generatePrompt(task: any): string {
  const parts: string[] = []

  if (task.title) parts.push(task.title)
  if (task.authorName) parts.push(`作者: ${task.authorName}`)

  const images = task.images ? JSON.parse(task.images) : []
  if (images.length > 0) {
    parts.push(`参考图片风格`)
  }

  // Default prompt template
  return parts.length > 0
    ? parts.join(', ') + ', 高质量，细节丰富'
    : '高质量图片，细节丰富，美丽'
}
