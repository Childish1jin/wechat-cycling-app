import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getCurrentUserId } from '@/lib/auth'

// GET: 获取打卡记录
export async function GET(request: NextRequest) {
  try {
    const userId = getCurrentUserId()
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const pageSize = parseInt(searchParams.get('pageSize') || '10')
    const routeId = searchParams.get('routeId')

    const skip = (page - 1) * pageSize

    // 构建查询条件
    const where: any = { userId }
    
    if (routeId) {
      where.routeId = routeId
    }

    const [checkIns, total] = await Promise.all([
      db.checkIn.findMany({
        where,
        skip,
        take: pageSize,
        orderBy: { createdAt: 'desc' },
        include: {
          route: {
            select: {
              id: true,
              name: true,
              distance: true,
              difficulty: true,
              coverImage: true,
            }
          }
        }
      }),
      db.checkIn.count({ where })
    ])

    // 解析 photos
    const checkInsWithParsedPhotos = checkIns.map(checkIn => ({
      ...checkIn,
      photos: checkIn.photos ? JSON.parse(checkIn.photos) : []
    }))

    return NextResponse.json({
      success: true,
      data: {
        list: checkInsWithParsedPhotos,
        pagination: {
          page,
          pageSize,
          total,
          totalPages: Math.ceil(total / pageSize)
        }
      }
    })
  } catch (error) {
    console.error('获取打卡记录失败:', error)
    return NextResponse.json(
      { success: false, error: '获取打卡记录失败' },
      { status: 500 }
    )
  }
}

// POST: 创建打卡
export async function POST(request: NextRequest) {
  try {
    const userId = getCurrentUserId()
    const body = await request.json()
    
    const { routeId, duration, notes, photos } = body

    // 检查路线是否存在
    const route = await db.route.findUnique({
      where: { id: routeId }
    })

    if (!route) {
      return NextResponse.json(
        { success: false, error: '路线不存在' },
        { status: 404 }
      )
    }

    const checkIn = await db.checkIn.create({
      data: {
        duration,
        notes,
        photos: photos ? JSON.stringify(photos) : null,
        routeId,
        userId,
      },
      include: {
        route: {
          select: {
            id: true,
            name: true,
            distance: true,
            difficulty: true,
            coverImage: true,
          }
        }
      }
    })

    // 更新路线打卡数
    await db.route.update({
      where: { id: routeId },
      data: { checkInCount: { increment: 1 } }
    })

    return NextResponse.json({ success: true, data: checkIn })
  } catch (error) {
    console.error('创建打卡失败:', error)
    return NextResponse.json(
      { success: false, error: '创建打卡失败' },
      { status: 500 }
    )
  }
}
