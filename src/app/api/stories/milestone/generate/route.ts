import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getCurrentUserId } from '@/lib/auth'
import { StoryVisibility } from '@prisma/client'

const RULES = [
  { key: 'FIRST_50KM', label: '首次破50km', check: (ride: any, total: number) => ride.distance >= 50 && total < 150 },
  { key: 'TOTAL_1000KM', label: '累计1000km', check: (_ride: any, total: number) => total >= 1000 },
  { key: 'CLIMB_500M', label: '首次爬升500m', check: (ride: any) => (ride.elevationGain || 0) >= 500 }
]

export async function POST(request: NextRequest) {
  try {
    const userId = getCurrentUserId()
    const body = await request.json().catch(() => ({}))
    const rideId = body.rideId as string | undefined

    const rides = await db.ride.findMany({
      where: { userId },
      orderBy: { startTime: 'desc' },
      take: 100
    })

    if (!rides.length) {
      return NextResponse.json(
        { success: false, error: '暂无骑行记录可生成里程碑故事' },
        { status: 400 }
      )
    }

    const targetRide = rideId
      ? rides.find((r) => r.id === rideId) || rides[0]
      : rides[0]

    const totalDistance = rides.reduce((sum, r) => sum + (r.distance || 0), 0)
    const triggered = RULES.find((rule) => rule.check(targetRide, totalDistance))

    if (!triggered) {
      return NextResponse.json({
        success: true,
        data: { generated: false, reason: '未命中里程碑规则' }
      })
    }

    const existed = await db.storyMilestone.findFirst({
      where: { userId, ruleCode: triggered.key, disabled: false }
    })
    if (existed) {
      return NextResponse.json({
        success: true,
        data: { generated: false, reason: '该里程碑已生成过' }
      })
    }

    const story = await db.story.create({
      data: {
        userId,
        rideId: targetRide.id,
        title: `🏅 ${triggered.label}`,
        description: `今天达成了${triggered.label}，总里程已达到 ${totalDistance.toFixed(1)} km，继续出发！`,
        type: 'image',
        url: '',
        overlays: JSON.stringify([]),
        visibility: StoryVisibility.PRIVATE,
        isMilestone: true,
        milestoneKey: triggered.key
      }
    })

    await db.storyMilestone.create({
      data: {
        userId,
        ruleCode: triggered.key,
        payload: JSON.stringify({
          rideId: targetRide.id,
          rideDistance: targetRide.distance,
          totalDistance
        }),
        storyId: story.id
      }
    })

    return NextResponse.json({
      success: true,
      data: {
        generated: true,
        storyId: story.id,
        ruleCode: triggered.key,
        title: story.title,
        description: story.description
      }
    })
  } catch (error) {
    console.error('生成里程碑故事失败:', error)
    return NextResponse.json(
      { success: false, error: '生成里程碑故事失败' },
      { status: 500 }
    )
  }
}

