import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getCurrentUserId } from '@/lib/auth'
import { StoryStatus } from '@prisma/client'

export async function GET() {
  try {
    const userId = getCurrentUserId()
    const list = await db.story.findMany({
      where: {
        userId,
        status: StoryStatus.ARCHIVED
      },
      orderBy: { updatedAt: 'desc' },
      include: {
        medias: {
          orderBy: { createdAt: 'asc' },
          take: 1
        }
      }
    })

    return NextResponse.json({
      success: true,
      data: {
        list: list.map((story) => ({
          id: story.id,
          title: story.title,
          description: story.description,
          url: story.medias[0]?.url || story.url,
          updatedAt: story.updatedAt
        }))
      }
    })
  } catch (error) {
    console.error('获取归档故事失败:', error)
    return NextResponse.json(
      { success: false, error: '获取归档故事失败' },
      { status: 500 }
    )
  }
}

