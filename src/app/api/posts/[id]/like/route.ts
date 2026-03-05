import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getCurrentUserId } from '@/lib/auth'

// POST: 点赞帖子
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const userId = getCurrentUserId()
    const { id } = await params

    // 检查帖子是否存在
    const post = await db.communityPost.findUnique({
      where: { id }
    })

    if (!post) {
      return NextResponse.json(
        { success: false, error: '帖子不存在' },
        { status: 404 }
      )
    }

    // 检查是否已经点赞
    const existingLike = await db.like.findUnique({
      where: {
        userId_postId: {
          userId,
          postId: id
        }
      }
    })

    if (existingLike) {
      // 取消点赞
      await db.like.delete({
        where: { id: existingLike.id }
      })
      
      // 更新帖子点赞数
      await db.communityPost.update({
        where: { id },
        data: { likeCount: { decrement: 1 } }
      })

      return NextResponse.json({ 
        success: true, 
        data: { liked: false },
        message: '取消点赞成功' 
      })
    }

    // 点赞
    await db.like.create({
      data: {
        userId,
        postId: id
      }
    })

    // 更新帖子点赞数
    await db.communityPost.update({
      where: { id },
      data: { likeCount: { increment: 1 } }
    })

    return NextResponse.json({ 
      success: true, 
      data: { liked: true },
      message: '点赞成功' 
    })
  } catch (error) {
    console.error('点赞操作失败:', error)
    return NextResponse.json(
      { success: false, error: '点赞操作失败' },
      { status: 500 }
    )
  }
}
