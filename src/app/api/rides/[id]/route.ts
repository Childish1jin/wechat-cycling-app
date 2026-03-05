import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getCurrentUserId } from '@/lib/auth'

// GET: 获取骑行详情
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const userId = getCurrentUserId()
    const { id } = await params

    const ride = await db.ride.findUnique({
      where: { id },
      include: {
        points: {
          orderBy: { timestamp: 'asc' }
        },
        route: {
          select: {
            id: true,
            name: true,
            description: true,
            difficulty: true,
            distance: true,
            elevation: true,
          }
        }
      }
    })

    if (!ride) {
      return NextResponse.json(
        { success: false, error: '骑行记录不存在' },
        { status: 404 }
      )
    }

    // 验证是否是用户自己的骑行记录
    if (ride.userId !== userId) {
      return NextResponse.json(
        { success: false, error: '无权访问此骑行记录' },
        { status: 403 }
      )
    }

    // 解析 photos
    const rideWithParsedPhotos = {
      ...ride,
      photos: ride.photos ? JSON.parse(ride.photos) : []
    }

    return NextResponse.json({ success: true, data: rideWithParsedPhotos })
  } catch (error) {
    console.error('获取骑行详情失败:', error)
    return NextResponse.json(
      { success: false, error: '获取骑行详情失败' },
      { status: 500 }
    )
  }
}
