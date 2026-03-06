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

function parseJSON<T>(value: string | null, fallback: T): T {
  if (!value) return fallback
  try {
    return JSON.parse(value) as T
  } catch {
    return fallback
  }
}

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const story = await db.story.findUnique({
      where: { id },
      include: {
        user: { select: { id: true, name: true } },
        medias: { orderBy: { createdAt: 'asc' } }
      }
    })
    if (!story) {
      return NextResponse.json(
        { success: false, error: '故事不存在' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: {
        id: story.id,
        userId: story.userId,
        userName: story.user?.name || '骑行用户',
        userEmoji: '🚴',
        type: story.type,
        url: story.medias[0]?.url || story.url,
        medias: story.medias,
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
        createdAt: story.createdAt
      }
    })
  } catch (error) {
    console.error('获取故事详情失败:', error)
    return NextResponse.json(
      { success: false, error: '获取故事详情失败' },
      { status: 500 }
    )
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const userId = getCurrentUserId()
    const body = await request.json()

    const existing = await db.story.findUnique({ where: { id } })
    if (!existing || existing.userId !== userId) {
      return NextResponse.json(
        { success: false, error: '无权限修改该故事' },
        { status: 403 }
      )
    }

    const updated = await db.story.update({
      where: { id },
      data: {
        title: body.title ?? existing.title,
        description: body.description ?? existing.description,
        overlays:
          body.overlays !== undefined
            ? JSON.stringify(body.overlays || [])
            : existing.overlays,
        filter: body.filter ?? existing.filter,
        mood: body.mood ?? existing.mood,
        weather: body.weather ?? existing.weather,
        temperature:
          body.temperature !== undefined ? body.temperature : existing.temperature,
        playlist: body.playlist ?? existing.playlist,
        reflection: body.reflection ?? existing.reflection,
        visibility:
          body.visibility || body.privacy
            ? VISIBILITY_MAP[String(body.visibility || body.privacy)] ||
              existing.visibility
            : existing.visibility
      }
    })

    return NextResponse.json({
      success: true,
      data: { story: updated }
    })
  } catch (error) {
    console.error('更新故事失败:', error)
    return NextResponse.json(
      { success: false, error: '更新故事失败' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const userId = getCurrentUserId()
    const story = await db.story.findUnique({ where: { id } })
    if (!story || story.userId !== userId) {
      return NextResponse.json(
        { success: false, error: '无权限删除该故事' },
        { status: 403 }
      )
    }

    await db.story.update({
      where: { id },
      data: { status: StoryStatus.ARCHIVED }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('删除故事失败:', error)
    return NextResponse.json(
      { success: false, error: '删除故事失败' },
      { status: 500 }
    )
  }
}

