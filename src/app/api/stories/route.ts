import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getCurrentUserId } from '@/lib/auth'
import { StoryStatus, StoryVisibility } from '@prisma/client'

const VISIBILITY_MAP: Record<string, StoryVisibility> = {
  public: StoryVisibility.PUBLIC,
  followers: StoryVisibility.FRIENDS,
  private: StoryVisibility.PRIVATE,
  PUBLIC: StoryVisibility.PUBLIC,
  FRIENDS: StoryVisibility.FRIENDS,
  PRIVATE: StoryVisibility.PRIVATE
}

async function ensureCurrentUser(userId: string) {
  const user = await db.user.findUnique({ where: { id: userId } })
  if (user) return user
  return db.user.create({
    data: {
      id: userId,
      email: `demo+${userId}@rider.com`,
      name: '骑行达人',
      avatar: null,
      bio: '热爱骑行，享受生活'
    }
  })
}

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

function toStoryDTO(story: any) {
  const primaryMedia = story.medias?.[0]
  return {
    id: story.id,
    userId: story.userId,
    userName: story.user?.name || '骑行用户',
    userEmoji: '🚴',
    type: primaryMedia?.type === 'VIDEO' ? 'video' : story.type || 'image',
    url: primaryMedia?.url || story.url,
    overlays: parseJSON(story.overlays, []),
    filter: story.filter || 'none',
    description: story.description || '',
    likes: story.likes || 0,
    comments: story.comments || 0,
    views: story.views || 0,
    visibility: story.visibility,
    mood: story.mood,
    weather: story.weather,
    temperature: story.temperature,
    playlist: story.playlist,
    reflection: story.reflection,
    createdAt: story.createdAt,
    timeAgo: formatTimeAgo(story.createdAt)
  }
}

export async function GET(request: NextRequest) {
  try {
    const userId = getCurrentUserId()
    await ensureCurrentUser(userId)
    const { searchParams } = new URL(request.url)
    const targetUserId = searchParams.get('userId')
    const where: any = {
      status: StoryStatus.PUBLISHED
    }

    if (targetUserId) {
      where.userId = targetUserId
    } else {
      where.OR = [
        { visibility: StoryVisibility.PUBLIC },
        { visibility: StoryVisibility.FRIENDS },
        { userId }
      ]
    }

    const stories = await db.story.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        user: { select: { id: true, name: true } },
        medias: {
          orderBy: { createdAt: 'asc' },
          take: 1
        }
      },
      take: 100
    })

    return NextResponse.json({
      success: true,
      data: stories.map(toStoryDTO)
    })
  } catch (error) {
    console.error('获取故事列表失败:', error)
    return NextResponse.json(
      { success: false, error: '获取故事列表失败' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const userId = getCurrentUserId()
    await ensureCurrentUser(userId)
    const body = await request.json()

    const visibility =
      VISIBILITY_MAP[String(body.privacy || body.visibility || 'private')] ||
      StoryVisibility.PRIVATE

    const rideId =
      body.linkedRide ||
      body.rideId ||
      null

    const created = await db.story.create({
      data: {
        userId,
        rideId,
        title:
          body.title ||
          `${new Date().getMonth() + 1}月${new Date().getDate()}日的骑行`,
        description: body.description || '',
        type: body.type || 'image',
        url: body.image || body.url || '',
        overlays: JSON.stringify(body.overlays || []),
        filter: body.filter || 'none',
        visibility,
        mood: body.mood || null,
        weather: body.weather || null,
        temperature:
          typeof body.temperature === 'number' ? body.temperature : null,
        playlist: body.playlist || null,
        reflection: body.reflection || null,
        medias:
          Array.isArray(body.medias) && body.medias.length
            ? {
                create: body.medias.map((m: any) => ({
                  type: m.type === 'video' ? 'VIDEO' : 'IMAGE',
                  url: m.url,
                  shotAt: m.shotAt ? new Date(m.shotAt) : null,
                  lat: typeof m.lat === 'number' ? m.lat : null,
                  lng: typeof m.lng === 'number' ? m.lng : null,
                  timelineSec:
                    typeof m.timelineSec === 'number' ? m.timelineSec : null
                }))
              }
            : undefined
      },
      include: {
        user: { select: { id: true, name: true } },
        medias: true
      }
    })

    return NextResponse.json({
      success: true,
      data: { story: toStoryDTO(created) }
    })
  } catch (error) {
    console.error('创建故事失败:', error)
    return NextResponse.json(
      { success: false, error: '创建故事失败' },
      { status: 500 }
    )
  }
}

