import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getCurrentUserId } from '@/lib/auth'

// GET: 获取用户统计数据
export async function GET(request: NextRequest) {
  try {
    const userId = getCurrentUserId()
    const { searchParams } = new URL(request.url)
    const period = searchParams.get('period') || 'all' // all, week, month, year

    // 计算时间范围
    let startDate: Date | null = null
    const now = new Date()
    
    switch (period) {
      case 'week':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
        break
      case 'month':
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
        break
      case 'year':
        startDate = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000)
        break
    }

    // 构建时间筛选条件
    const timeFilter = startDate ? { startTime: { gte: startDate } } : {}

    // 获取骑行统计
    const rides = await db.ride.findMany({
      where: {
        userId,
        ...timeFilter
      },
      select: {
        distance: true,
        duration: true,
        calories: true,
        avgSpeed: true,
        startTime: true,
      }
    })

    // 计算总计数据
    const totalDistance = rides.reduce((sum, ride) => sum + ride.distance, 0)
    const totalDuration = rides.reduce((sum, ride) => sum + ride.duration, 0)
    const totalCalories = rides.reduce((sum, ride) => sum + (ride.calories || 0), 0)
    const avgSpeed = rides.length > 0 
      ? rides.reduce((sum, ride) => sum + ride.avgSpeed, 0) / rides.length 
      : 0

    // 获取打卡统计
    const checkInCount = await db.checkIn.count({
      where: {
        userId,
        ...(startDate ? { createdAt: { gte: startDate } } : {})
      }
    })

    // 获取路线统计
    const routeCount = await db.route.count({
      where: { creatorId: userId }
    })

    // 获取帖子统计
    const postCount = await db.communityPost.count({
      where: { authorId: userId }
    })

    // 按日期分组统计（最近30天）
    const dailyStats = await getDailyStats(userId, 30)

    // 按月份分组统计（最近12个月）
    const monthlyStats = await getMonthlyStats(userId, 12)

    // 获取难度分布
    const difficultyDistribution = await db.ride.groupBy({
      by: ['routeId'],
      where: {
        userId,
        routeId: { not: null },
        ...timeFilter
      },
      _count: true
    })

    // 获取路线难度统计
    const routeDifficultyStats = await db.route.groupBy({
      by: ['difficulty'],
      where: {
        rides: {
          some: { userId }
        }
      },
      _count: true
    })

    return NextResponse.json({
      success: true,
      data: {
        overview: {
          totalRides: rides.length,
          totalDistance: Math.round(totalDistance * 100) / 100,
          totalDuration, // 秒
          totalDurationHours: Math.round(totalDuration / 3600 * 10) / 10,
          totalCalories,
          avgSpeed: Math.round(avgSpeed * 100) / 100,
          checkInCount,
          routeCount,
          postCount,
        },
        dailyStats,
        monthlyStats,
        difficultyDistribution: routeDifficultyStats.map(item => ({
          difficulty: item.difficulty,
          count: item._count
        })),
        period
      }
    })
  } catch (error) {
    console.error('获取统计数据失败:', error)
    return NextResponse.json(
      { success: false, error: '获取统计数据失败' },
      { status: 500 }
    )
  }
}

// 获取每日统计数据
async function getDailyStats(userId: string, days: number) {
  const stats = []
  const now = new Date()
  
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(now)
    date.setDate(date.getDate() - i)
    date.setHours(0, 0, 0, 0)
    
    const nextDate = new Date(date)
    nextDate.setDate(nextDate.getDate() + 1)
    
    const rides = await db.ride.findMany({
      where: {
        userId,
        startTime: {
          gte: date,
          lt: nextDate
        }
      },
      select: {
        distance: true,
        duration: true,
      }
    })
    
    stats.push({
      date: date.toISOString().split('T')[0],
      rides: rides.length,
      distance: Math.round(rides.reduce((sum, r) => sum + r.distance, 0) * 100) / 100,
      duration: rides.reduce((sum, r) => sum + r.duration, 0)
    })
  }
  
  return stats
}

// 获取每月统计数据
async function getMonthlyStats(userId: string, months: number) {
  const stats = []
  const now = new Date()
  
  for (let i = months - 1; i >= 0; i--) {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1)
    const nextMonth = new Date(now.getFullYear(), now.getMonth() - i + 1, 1)
    
    const rides = await db.ride.findMany({
      where: {
        userId,
        startTime: {
          gte: date,
          lt: nextMonth
        }
      },
      select: {
        distance: true,
        duration: true,
      }
    })
    
    stats.push({
      month: `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`,
      rides: rides.length,
      distance: Math.round(rides.reduce((sum, r) => sum + r.distance, 0) * 100) / 100,
      duration: rides.reduce((sum, r) => sum + r.duration, 0)
    })
  }
  
  return stats
}
