import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getCurrentUserId } from '@/lib/auth'

// GET: 获取路线详情
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const route = await db.route.findUnique({
      where: { id },
      include: {
        creator: {
          select: {
            id: true,
            name: true,
            avatar: true,
          }
        },
        points: {
          orderBy: { order: 'asc' }
        },
        _count: {
          select: {
            checkIns: true,
            favorites: true,
          }
        }
      }
    })

    if (!route) {
      return NextResponse.json(
        { success: false, error: '路线不存在' },
        { status: 404 }
      )
    }

    // 增加浏览量
    await db.route.update({
      where: { id },
      data: { viewCount: { increment: 1 } }
    })

    // 解析 tags
    const routeWithParsedTags = {
      ...route,
      tags: route.tags ? JSON.parse(route.tags) : []
    }

    return NextResponse.json({ success: true, data: routeWithParsedTags })
  } catch (error) {
    console.error('获取路线详情失败:', error)
    return NextResponse.json(
      { success: false, error: '获取路线详情失败' },
      { status: 500 }
    )
  }
}

// PUT: 更新路线
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const userId = getCurrentUserId()
    const { id } = await params
    const body = await request.json()

    // 检查路线是否存在且属于当前用户
    const existingRoute = await db.route.findUnique({
      where: { id }
    })

    if (!existingRoute) {
      return NextResponse.json(
        { success: false, error: '路线不存在' },
        { status: 404 }
      )
    }

    if (existingRoute.creatorId !== userId) {
      return NextResponse.json(
        { success: false, error: '无权修改此路线' },
        { status: 403 }
      )
    }

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

    // 如果有新的点位数据，先删除旧的点位
    if (points) {
      await db.routePoint.deleteMany({
        where: { routeId: id }
      })
    }

    const route = await db.route.update({
      where: { id },
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
        isPublic,
        coverImage,
        tags: tags ? JSON.stringify(tags) : null,
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
    console.error('更新路线失败:', error)
    return NextResponse.json(
      { success: false, error: '更新路线失败' },
      { status: 500 }
    )
  }
}

// DELETE: 删除路线
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const userId = getCurrentUserId()
    const { id } = await params

    // 检查路线是否存在且属于当前用户
    const existingRoute = await db.route.findUnique({
      where: { id }
    })

    if (!existingRoute) {
      return NextResponse.json(
        { success: false, error: '路线不存在' },
        { status: 404 }
      )
    }

    if (existingRoute.creatorId !== userId) {
      return NextResponse.json(
        { success: false, error: '无权删除此路线' },
        { status: 403 }
      )
    }

    await db.route.delete({
      where: { id }
    })

    return NextResponse.json({ success: true, message: '路线已删除' })
  } catch (error) {
    console.error('删除路线失败:', error)
    return NextResponse.json(
      { success: false, error: '删除路线失败' },
      { status: 500 }
    )
  }
}
