import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getCurrentUserId } from '@/lib/auth'

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const userId = getCurrentUserId()
    const body = await request.json().catch(() => ({}))
    const format = String(body.format || 'IMAGE').toUpperCase()

    const story = await db.story.findUnique({ where: { id } })
    if (!story) {
      return NextResponse.json(
        { success: false, error: '故事不存在' },
        { status: 404 }
      )
    }

    if (story.userId !== userId && story.visibility === 'PRIVATE') {
      return NextResponse.json(
        { success: false, error: '无权限导出该故事' },
        { status: 403 }
      )
    }

    return NextResponse.json({
      success: true,
      data: {
        format,
        withWatermark: body.withWatermark !== false,
        url: story.url
      }
    })
  } catch (error) {
    console.error('导出故事失败:', error)
    return NextResponse.json(
      { success: false, error: '导出故事失败' },
      { status: 500 }
    )
  }
}

