import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getCurrentUserId } from '@/lib/auth'

export async function POST(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const userId = getCurrentUserId()

    const existing = await db.storyLike.findUnique({
      where: { storyId_userId: { storyId: id, userId } }
    })

    if (existing) {
      await db.$transaction([
        db.storyLike.delete({ where: { id: existing.id } }),
        db.story.update({
          where: { id },
          data: { likes: { decrement: 1 } }
        })
      ])
      return NextResponse.json({ success: true, data: { liked: false } })
    }

    await db.$transaction([
      db.storyLike.create({
        data: { storyId: id, userId }
      }),
      db.story.update({
        where: { id },
        data: { likes: { increment: 1 } }
      })
    ])

    return NextResponse.json({ success: true, data: { liked: true } })
  } catch (error) {
    console.error('故事点赞失败:', error)
    return NextResponse.json(
      { success: false, error: '故事点赞失败' },
      { status: 500 }
    )
  }
}

