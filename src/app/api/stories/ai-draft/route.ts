import { NextRequest, NextResponse } from 'next/server'

type Tone = '励志' | '轻松' | '文艺'
type Language = 'zh' | 'en'

const toneLexicon: Record<Tone, { opening: string; closing: string }> = {
  励志: {
    opening: '今天的每一公里都在证明，强大来自一次次坚持。',
    closing: '下一段路，继续把风景和成长都踩进脚下。'
  },
  轻松: {
    opening: '今天骑得很舒服，风刚刚好，节奏也刚刚好。',
    closing: '记录一下这份轻松，下一次再出发。'
  },
  文艺: {
    opening: '车轮划过晨光，城市在耳边慢慢苏醒。',
    closing: '把这段路写进记忆，留给未来的自己重读。'
  }
}

function buildZhDraft(input: {
  tone: Tone
  summary: string
  distance?: number
  duration?: number
  elevation?: number
  calories?: number
}) {
  const tone = toneLexicon[input.tone]
  const highlights = [
    typeof input.distance === 'number' ? `里程 ${input.distance.toFixed(1)} km` : '',
    typeof input.duration === 'number' ? `时长 ${Math.max(1, Math.round(input.duration / 60))} 分钟` : '',
    typeof input.elevation === 'number' ? `爬升 ${Math.round(input.elevation)} m` : '',
    typeof input.calories === 'number' ? `消耗 ${Math.round(input.calories)} kcal` : ''
  ].filter(Boolean)

  return [
    tone.opening,
    input.summary ? `今天的故事关键词：${input.summary}。` : '今天把注意力放在节奏和呼吸上。',
    highlights.length ? `数据亮点：${highlights.join('，')}。` : '数据亮点：保持了稳定输出和顺畅配速。',
    tone.closing
  ].join('\n')
}

function buildEnDraft(input: {
  tone: Tone
  summary: string
  distance?: number
  duration?: number
  elevation?: number
  calories?: number
}) {
  const styleMap: Record<Tone, string> = {
    励志: 'Today proved that consistency builds strength.',
    轻松: 'Today felt smooth and easy, with a perfect rhythm.',
    文艺: 'The wheels cut through light, and the city woke up slowly.'
  }
  const highlights = [
    typeof input.distance === 'number' ? `Distance ${input.distance.toFixed(1)} km` : '',
    typeof input.duration === 'number' ? `Duration ${Math.max(1, Math.round(input.duration / 60))} min` : '',
    typeof input.elevation === 'number' ? `Climb ${Math.round(input.elevation)} m` : '',
    typeof input.calories === 'number' ? `Calories ${Math.round(input.calories)} kcal` : ''
  ].filter(Boolean)

  return [
    styleMap[input.tone],
    input.summary ? `Story keyword: ${input.summary}.` : 'Story keyword: steady pace and calm focus.',
    highlights.length ? `Highlights: ${highlights.join(', ')}.` : 'Highlights: consistent output and clean pacing.',
    'Save this ride, and keep rolling into the next one.'
  ].join('\n')
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}))
    const tone = (body.tone || '励志') as Tone
    const language = (body.language || 'zh') as Language
    const summary = String(body.summary || '').trim()
    const distance = typeof body.distance === 'number' ? body.distance : undefined
    const duration = typeof body.duration === 'number' ? body.duration : undefined
    const elevation = typeof body.elevation === 'number' ? body.elevation : undefined
    const calories = typeof body.calories === 'number' ? body.calories : undefined

    const draft =
      language === 'en'
        ? buildEnDraft({ tone, summary, distance, duration, elevation, calories })
        : buildZhDraft({ tone, summary, distance, duration, elevation, calories })

    return NextResponse.json({
      success: true,
      data: {
        draft,
        tone,
        language
      }
    })
  } catch (error) {
    console.error('AI初稿生成失败:', error)
    return NextResponse.json(
      { success: false, error: 'AI初稿生成失败' },
      { status: 500 }
    )
  }
}

