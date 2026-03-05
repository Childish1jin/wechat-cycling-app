import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getCurrentUserId } from '@/lib/auth'

// GET: 获取路线列表（支持分页、筛选）
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const pageSize = parseInt(searchParams.get('pageSize') || '10')
    const difficulty = searchParams.get('difficulty')
    const minDistance = searchParams.get('minDistance')
    const maxDistance = searchParams.get('maxDistance')
    const search = searchParams.get('search')
    const isPublic = searchParams.get('isPublic')
    const creatorId = searchParams.get('creatorId')

    const skip = (page - 1) * pageSize

    // 构建查询条件
    const where: any = {}
    
    if (difficulty) {
      where.difficulty = difficulty
    }
    
    if (minDistance || maxDistance) {
      where.distance = {}
      if (minDistance) where.distance.gte = parseFloat(minDistance)
      if (maxDistance) where.distance.lte = parseFloat(maxDistance)
    }
    
    if (search) {
      where.OR = [
        { name: { contains: search } },
        { description: { contains: search } },
      ]
    }
    
    if (isPublic !== null) {
      where.isPublic = isPublic === 'true'
    }
    
    if (creatorId) {
      where.creatorId = creatorId
    }

    const [routes, total] = await Promise.all([
      db.route.findMany({
        where,
        skip,
        take: pageSize,
        orderBy: { createdAt: 'desc' },
        include: {
          creator: {
            select: {
              id: true,
              name: true,
              avatar: true,
            }
          },
          _count: {
            select: {
              checkIns: true,
              favorites: true,
            }
          }
        }
      }),
      db.route.count({ where })
    ])

    return NextResponse.json({
      success: true,
      data: {
        list: routes,
        pagination: {
          page,
          pageSize,
          total,
          totalPages: Math.ceil(total / pageSize)
        }
      }
    })
  } catch (error) {
    console.error('获取路线列表失败:', error)
    return NextResponse.json(
      { success: false, error: '获取路线列表失败' },
      { status: 500 }
    )
  }
}

// POST: 创建新路线
export async function POST(request: NextRequest) {
  try {
    const userId = getCurrentUserId()
    const body = await request.json()
    
    const {
      name,
      description,
      distance,
      duration,
      difficulty,
      elevation,
      startAddress,
      endAddress,
      startLat,
      startLng,
      endLat,
      endLng,
      isPublic,
      coverImage,
      tags,
      points
    } = body

    const route = await db.route.create({
      data: {
        name,
        description,
        distance,
        duration,
        difficulty,
        elevation,
        startAddress,
        endAddress,
        startLat,
        startLng,
        endLat,
        endLng,
        isPublic: isPublic ?? false,
        coverImage,
        tags: tags ? JSON.stringify(tags) : null,
        creatorId: userId,
        points: points ? {
          create: points.map((point: any, index: number) => ({
            order: index,
            lat: point.lat,
            lng: point.lng,
            elevation: point.elevation,
            name: point.name,
            description: point.description,
          }))
        } : undefined
      },
      include: {
        points: {
          orderBy: { order: 'asc' }
        },
        creator: {
          select: {
            id: true,
            name: true,
            avatar: true,
          }
        }
      }
    })

    return NextResponse.json({ success: true, data: route })
  } catch (error) {
    console.error('创建路线失败:', error)
    return NextResponse.json(
      { success: false, error: '创建路线失败' },
      { status: 500 }
    )
  }
}
