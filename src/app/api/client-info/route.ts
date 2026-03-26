import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  // 获取 IP 地址
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
    || request.headers.get('x-real-ip')
    || request.headers.get('cf-connecting-ip')
    || 'unknown'

  // 获取 User-Agent
  const userAgent = request.headers.get('user-agent') || ''

  // 解析设备信息
  let os = 'Unknown'
  let browser = 'Unknown'
  let device = 'Desktop'

  // OS 解析
  if (userAgent.includes('Mac')) {
    os = 'macOS'
    // 尝试获取 Mac 版本
    const match = userAgent.match(/Mac OS X ([\d_]+)/)
    if (match) os = `macOS ${match[1].replace(/_/g, '.')}`
  }
  else if (userAgent.includes('Windows')) os = 'Windows'
  else if (userAgent.includes('Linux')) os = 'Linux'
  else if (userAgent.includes('Android')) {
    os = 'Android'
    const match = userAgent.match(/Android ([\d.]+)/)
    if (match) os = `Android ${match[1]}`
  }
  else if (userAgent.includes('iPhone')) {
    os = 'iPhone'
    const match = userAgent.match(/iPhone OS ([\d_]+)/)
    if (match) os = `iPhone ${match[1].replace(/_/g, '.')}`
  }
  else if (userAgent.includes('iPad')) {
    os = 'iPad'
    const match = userAgent.match(/OS ([\d_]+)/)
    if (match) os = `iPadOS ${match[1].replace(/_/g, '.')}`
  }

  // 浏览器解析
  if (userAgent.includes('Edg/')) {
    browser = 'Edge'
    const match = userAgent.match(/Edg\/([\d.]+)/)
    if (match) browser = `Edge ${match[1]}`
  }
  else if (userAgent.includes('Chrome')) {
    browser = 'Chrome'
    const match = userAgent.match(/Chrome\/([\d.]+)/)
    if (match) browser = `Chrome ${match[1]}`
  }
  else if (userAgent.includes('Firefox')) {
    browser = 'Firefox'
    const match = userAgent.match(/Firefox\/([\d.]+)/)
    if (match) browser = `Firefox ${match[1]}`
  }
  else if (userAgent.includes('Safari') && !userAgent.includes('Chrome')) {
    browser = 'Safari'
    const match = userAgent.match(/Version\/([\d.]+)/)
    if (match) browser = `Safari ${match[1]}`
  }

  // 设备类型
  if (userAgent.includes('Mobile') || userAgent.includes('Android') || userAgent.includes('iPhone')) {
    device = 'Mobile'
  }
  if (userAgent.includes('iPad') || userAgent.includes('Tablet')) {
    device = 'Tablet'
  }

  return NextResponse.json({
    ip,
    userAgent,
    os,
    browser,
    device,
    fullInfo: `${os} / ${browser} / ${device}`
  })
}
