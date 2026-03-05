import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getCurrentUserId } from '@/lib/auth'

// POST: 评论帖子
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const userId = getCurrentUserId()
    const { id } = await params
    const body = await request.json()
    
    const { content } = body

    if (!content || content.trim() === '') {
      return NextResponse.json(
        { success: false, error: '评论内容不能为空' },
        { status: 400 }
      )
    }

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

    const comment = await db.comment.create({
      data: {
        content: content.trim(),
        authorId: userId,
        postId: id
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            avatar: true,
          }
        }
      }
    })

    return NextResponse.json({ success: true, data: comment })
  } catch (error) {
    console.error('创建评论失败:', error)
    return NextResponse.json(
      { success: false, error: '创建评论失败' },
      { status: 500 }
    )
  }
}

// GET: 获取帖子评论列表
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const pageSize = parseInt(searchParams.get('pageSize') || '20')

    const skip = (page - 1) * pageSize

    const [comments, total] = await Promise.all([
      db.comment.findMany({
        where: { postId: id },
        skip,
        take: pageSize,
        orderBy: { createdAt: 'desc' },
        include: {
          author: {
            select: {
              id: true,
              name: true,
              avatar: true,
            }
          }
        }
      }),
      db.comment.count({ where: { postId: id } })
    ])

    return NextResponse.json({
      success: true,
      data: {
        list: comments,
        pagination: {
          page,
          pageSize,
          total,
          totalPages: Math.ceil(total / pageSize)
        }
      }
    })
  } catch (error) {
    console.error('获取评论列表失败:', error)
    return NextResponse.json(
      { success: false, error: '获取评论列表失败' },
      { status: 500 }
    )
  }
}
