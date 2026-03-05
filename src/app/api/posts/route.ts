import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getCurrentUserId } from '@/lib/auth'

// GET: 获取帖子列表
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const pageSize = parseInt(searchParams.get('pageSize') || '10')
    const type = searchParams.get('type')
    const authorId = searchParams.get('authorId')

    const skip = (page - 1) * pageSize

    // 构建查询条件
    const where: any = {}
    
    if (type) {
      where.type = type
    }
    
    if (authorId) {
      where.authorId = authorId
    }

    const [posts, total] = await Promise.all([
      db.communityPost.findMany({
        where,
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
          },
          _count: {
            select: {
              comments: true,
              likes: true,
            }
          }
        }
      }),
      db.communityPost.count({ where })
    ])

    // 解析 images
    const postsWithParsedImages = posts.map(post => ({
      ...post,
      images: post.images ? JSON.parse(post.images) : []
    }))

    return NextResponse.json({
      success: true,
      data: {
        list: postsWithParsedImages,
        pagination: {
          page,
          pageSize,
          total,
          totalPages: Math.ceil(total / pageSize)
        }
      }
    })
  } catch (error) {
    console.error('获取帖子列表失败:', error)
    return NextResponse.json(
      { success: false, error: '获取帖子列表失败' },
      { status: 500 }
    )
  }
}

// POST: 创建帖子
export async function POST(request: NextRequest) {
  try {
    const userId = getCurrentUserId()
    const body = await request.json()
    
    const { title, content, images, type } = body

    const post = await db.communityPost.create({
      data: {
        title,
        content,
        images: images ? JSON.stringify(images) : null,
        type: type || 'discussion',
        authorId: userId,
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

    return NextResponse.json({ success: true, data: post })
  } catch (error) {
    console.error('创建帖子失败:', error)
    return NextResponse.json(
      { success: false, error: '创建帖子失败' },
      { status: 500 }
    )
  }
}
