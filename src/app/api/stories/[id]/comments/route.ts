import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

function formatTimeAgo(date: Date) {
  const diff = Date.now() - date.getTime()
  const minutes = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days = Math.floor(diff / 86400000)
  if (minutes < 1) return '刚刚'
  if (minutes < 60) return `${minutes}分钟前`
  if (hours < 24) return `${hours}小时前`
  if (days < 7) return `${days}天前`
  return `${Math.floor(days / 7)}周前`
}

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const comments = await db.storyComment.findMany({
      where: { storyId: id },
      orderBy: { createdAt: 'desc' },
      include: {
        author: { select: { id: true, name: true } }
      }
    })

    return NextResponse.json({
      success: true,
      data: comments.map((item) => ({
        id: item.id,
        userName: item.author.name || '骑行用户',
        userEmoji: '👤',
        content: item.content,
        timeAgo: formatTimeAgo(item.createdAt),
        liked: false,
        createdAt: item.createdAt
      }))
    })
  } catch (error) {
    console.error('获取故事评论失败:', error)
    return NextResponse.json(
      { success: false, error: '获取故事评论失败' },
      { status: 500 }
    )
  }
}

