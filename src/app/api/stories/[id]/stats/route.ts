import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const story = await db.story.findUnique({
      where: { id },
      select: {
        views: true,
        likes: true,
        comments: true
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
        views: story.views || 0,
        likes: story.likes || 0,
        comments: story.comments || 0,
        shares: 0
      }
    })
  } catch (error) {
    console.error('获取故事统计失败:', error)
    return NextResponse.json(
      { success: false, error: '获取故事统计失败' },
      { status: 500 }
    )
  }
}

