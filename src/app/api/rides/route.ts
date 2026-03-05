import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getCurrentUserId } from '@/lib/auth'

// GET: 获取骑行记录列表
export async function GET(request: NextRequest) {
  try {
    const userId = getCurrentUserId()
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const pageSize = parseInt(searchParams.get('pageSize') || '10')
    const routeId = searchParams.get('routeId')
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')

    const skip = (page - 1) * pageSize

    // 构建查询条件
    const where: any = { userId }
    
    if (routeId) {
      where.routeId = routeId
    }
    
    if (startDate || endDate) {
      where.startTime = {}
      if (startDate) where.startTime.gte = new Date(startDate)
      if (endDate) where.startTime.lte = new Date(endDate)
    }

    const [rides, total] = await Promise.all([
      db.ride.findMany({
        where,
        skip,
        take: pageSize,
        orderBy: { startTime: 'desc' },
        include: {
          route: {
            select: {
              id: true,
              name: true,
              difficulty: true,
            }
          }
        }
      }),
      db.ride.count({ where })
    ])

    // 解析 photos
    const ridesWithParsedPhotos = rides.map(ride => ({
      ...ride,
      photos: ride.photos ? JSON.parse(ride.photos) : []
    }))

    return NextResponse.json({
      success: true,
      data: {
        list: ridesWithParsedPhotos,
        pagination: {
          page,
          pageSize,
          total,
          totalPages: Math.ceil(total / pageSize)
        }
      }
    })
  } catch (error) {
    console.error('获取骑行记录失败:', error)
    return NextResponse.json(
      { success: false, error: '获取骑行记录失败' },
      { status: 500 }
    )
  }
}

// POST: 创建新骑行记录
export async function POST(request: NextRequest) {
  try {
    const userId = getCurrentUserId()
    const body = await request.json()
    
    const {
      name,
      distance,
      duration,
      avgSpeed,
      maxSpeed,
      calories,
      elevationGain,
      startLat,
      startLng,
      endLat,
      endLng,
      startTime,
      endTime,
      notes,
      photos,
      routeId,
      points
    } = body

    const ride = await db.ride.create({
      data: {
        name,
        distance,
        duration,
        avgSpeed,
        maxSpeed,
        calories,
        elevationGain,
        startLat,
        startLng,
        endLat,
        endLng,
        startTime: new Date(startTime),
        endTime: endTime ? new Date(endTime) : null,
        notes,
        photos: photos ? JSON.stringify(photos) : null,
        routeId,
        userId,
        points: points ? {
          create: points.map((point: any) => ({
            timestamp: new Date(point.timestamp),
            lat: point.lat,
            lng: point.lng,
            elevation: point.elevation,
            speed: point.speed,
            distance: point.distance,
          }))
        } : undefined
      },
      include: {
        points: {
          orderBy: { timestamp: 'asc' }
        },
        route: {
          select: {
            id: true,
            name: true,
            difficulty: true,
          }
        }
      }
    })

    return NextResponse.json({ success: true, data: ride })
  } catch (error) {
    console.error('创建骑行记录失败:', error)
    return NextResponse.json(
      { success: false, error: '创建骑行记录失败' },
      { status: 500 }
    )
  }
}
