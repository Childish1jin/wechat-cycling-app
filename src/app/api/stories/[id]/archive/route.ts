import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getCurrentUserId } from '@/lib/auth'
import { StoryStatus } from '@prisma/client'

export async function POST(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const userId = getCurrentUserId()
    const story = await db.story.findUnique({ where: { id } })
    if (!story || story.userId !== userId) {
      return NextResponse.json(
        { success: false, error: '无权限操作该故事' },
        { status: 403 }
      )
    }

    await db.story.update({
      where: { id },
      data: { status: StoryStatus.ARCHIVED }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('归档故事失败:', error)
    return NextResponse.json(
      { success: false, error: '归档故事失败' },
      { status: 500 }
    )
  }
}

