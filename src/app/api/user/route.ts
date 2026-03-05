import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getCurrentUserId } from '@/lib/auth'

// GET: 获取当前用户信息
export async function GET() {
  try {
    const userId = getCurrentUserId()
    
    const user = await db.user.findUnique({
      where: { id: userId },
      include: {
        _count: {
          select: {
            routes: true,
            rides: true,
            checkIns: true,
            posts: true,
          }
        }
      }
    })

    if (!user) {
      // 如果用户不存在，创建一个模拟用户
      const newUser = await db.user.create({
        data: {
          id: userId,
          email: 'demo@rider.com',
          name: '骑行达人',
          avatar: null,
          bio: '热爱骑行，享受生活',
        },
        include: {
          _count: {
            select: {
              routes: true,
              rides: true,
              checkIns: true,
              posts: true,
            }
          }
        }
      })
      return NextResponse.json({ success: true, data: newUser })
    }

    return NextResponse.json({ success: true, data: user })
  } catch (error) {
    console.error('获取用户信息失败:', error)
    return NextResponse.json(
      { success: false, error: '获取用户信息失败' },
      { status: 500 }
    )
  }
}

// PUT: 更新用户信息
export async function PUT(request: NextRequest) {
  try {
    const userId = getCurrentUserId()
    const body = await request.json()
    
    const { name, avatar, bio, phone, height, weight } = body

    const user = await db.user.update({
      where: { id: userId },
      data: {
        name,
        avatar,
        bio,
        phone,
        height,
        weight,
      }
    })

    return NextResponse.json({ success: true, data: user })
  } catch (error) {
    console.error('更新用户信息失败:', error)
    return NextResponse.json(
      { success: false, error: '更新用户信息失败' },
      { status: 500 }
    )
  }
}
