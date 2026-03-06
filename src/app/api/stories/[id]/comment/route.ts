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
    const body = await request.json()
    const content = String(body.content || '').trim()
    if (!content) {
      return NextResponse.json(
        { success: false, error: '评论内容不能为空' },
        { status: 400 }
      )
    }

    const comment = await db.$transaction(async (tx) => {
      const newComment = await tx.storyComment.create({
        data: {
          storyId: id,
          authorId: userId,
          content
        },
        include: {
          author: {
            select: { id: true, name: true }
          }
        }
      })

      await tx.story.update({
        where: { id },
        data: { comments: { increment: 1 } }
      })

      return newComment
    })

    return NextResponse.json({
      success: true,
      data: {
        id: comment.id,
        userName: comment.author.name || '骑行用户',
        userEmoji: '👤',
        content: comment.content,
        timeAgo: '刚刚',
        liked: false,
        createdAt: comment.createdAt
      }
    })
  } catch (error) {
    console.error('故事评论失败:', error)
    return NextResponse.json(
      { success: false, error: '故事评论失败' },
      { status: 500 }
    )
  }
}

