import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const url = searchParams.get('url')

  if (!url) {
    return NextResponse.json({ error: 'URL is required' }, { status: 400 })
  }

  try {
    // 使用空的 Referer 来避免携带当前页面的 Referer
    const response = await fetch(url, {
      headers: {
        'Referer': ''
      }
    })

    if (!response.ok) {
      return NextResponse.json({ error: 'Failed to fetch video' }, { status: response.status })
    }

    const headers = new Headers()
    headers.set('Content-Type', response.headers.get('Content-Type') || 'video/mp4')
    headers.set('Content-Length', response.headers.get('Content-Length') || '')
    // 不设置 Content-Disposition，让浏览器直接播放

    return new NextResponse(response.body, {
      status: 200,
      headers
    })
  } catch (error) {
    console.error('Error proxying video:', error)
    return NextResponse.json({ error: 'Failed to proxy video' }, { status: 500 })
  }
}
