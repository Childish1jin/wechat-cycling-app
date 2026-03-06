import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getCurrentUserId } from '@/lib/auth'
import { StoryStatus } from '@prisma/client'

function formatTimeAgo(date: Date) {
  const diff = Date.now() - date.getTime()
  const minutes = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days = Math.floor(diff / 86400000)
  if (minutes < 1) return '刚刚'
  if (minutes < 60) return `${minutes}分钟前`
  if (hours < 24) return `${hours}小时前`
  if (days < 7) return `${days}天前`
  return `${Math.floor(days / 7)}周前`
}

function parseJSON<T>(value: string | null, fallback: T): T {
  if (!value) return fallback
  try {
    return JSON.parse(value) as T
  } catch {
    return fallback
  }
}

export async function GET() {
  try {
    const userId = getCurrentUserId()

    const stories = await db.story.findMany({
      where: {
        userId,
        status: { not: StoryStatus.ARCHIVED }
      },
      orderBy: { createdAt: 'desc' },
      include: {
        medias: {
          orderBy: { createdAt: 'asc' },
          take: 1
        }
      }
    })

    const list = stories.map((story) => ({
      id: story.id,
      userId: story.userId,
      userName: '我',
      userEmoji: '🚴',
      type: story.type || 'image',
      url: story.medias[0]?.url || story.url,
      overlays: parseJSON(story.overlays, []),
      filter: story.filter || 'none',
      description: story.description || '',
      likes: story.likes || 0,
      comments: story.comments || 0,
      views: story.views || 0,
      visibility: story.visibility,
      createdAt: story.createdAt,
      timeAgo: formatTimeAgo(story.createdAt)
    }))

    return NextResponse.json({
      success: true,
      data: { list }
    })
  } catch (error) {
    console.error('获取我的故事失败:', error)
    return NextResponse.json(
      { success: false, error: '获取我的故事失败' },
      { status: 500 }
    )
  }
}

