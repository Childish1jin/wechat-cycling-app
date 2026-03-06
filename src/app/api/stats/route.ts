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
  const now = new Date()
  const startDate = new Date(now)
  startDate.setDate(now.getDate() - (days - 1))
  startDate.setHours(0, 0, 0, 0)
  
  const endDate = new Date(now)
  endDate.setDate(now.getDate() + 1)
  endDate.setHours(0, 0, 0, 0)

  const rides = await db.ride.findMany({
    where: {
      userId,
      startTime: {
        gte: startDate,
        lt: endDate
      }
    },
    select: {
      startTime: true,
      distance: true,
      duration: true,
    }
  })

  // 按日期分组
  const bucket = new Map<string, { rides: number; distance: number; duration: number }>()
  
  for (const r of rides) {
    const d = new Date(r.startTime)
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
    
    const cur = bucket.get(key) || { rides: 0, distance: 0, duration: 0 }
    cur.rides += 1
    cur.distance += r.distance
    cur.duration += r.duration
    bucket.set(key, cur)
  }

  const stats = []
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(now)
    d.setDate(d.getDate() - i)
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
    
    const agg = bucket.get(key) || { rides: 0, distance: 0, duration: 0 }
    
    stats.push({
      date: key,
      rides: agg.rides,
      distance: Math.round(agg.distance * 100) / 100,
      duration: agg.duration
    })
  }
  
  return stats
}

// 获取每月统计数据
async function getMonthlyStats(userId: string, months: number) {
  const now = new Date()
  const startMonth = new Date(now.getFullYear(), now.getMonth() - (months - 1), 1)
  const endMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1)
  
  const rides = await db.ride.findMany({
    where: {
      userId,
      startTime: {
        gte: startMonth,
        lt: endMonth
      }
    },
    select: {
      startTime: true,
      distance: true,
      duration: true,
    }
  })
  
  const bucket = new Map<string, { rides: number; distance: number; duration: number }>()
  
  for (const r of rides) {
    const d = new Date(r.startTime)
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
    
    const cur = bucket.get(key) || { rides: 0, distance: 0, duration: 0 }
    cur.rides += 1
    cur.distance += r.distance
    cur.duration += r.duration
    bucket.set(key, cur)
  }
  
  const stats = []
  for (let i = months - 1; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
    
    const agg = bucket.get(key) || { rides: 0, distance: 0, duration: 0 }
    
    stats.push({
      month: key,
      rides: agg.rides,
      distance: Math.round(agg.distance * 100) / 100,
      duration: agg.duration
    })
  }
  
  return stats
}
