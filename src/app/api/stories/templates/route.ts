import { NextResponse } from 'next/server'

const templates = [
  { id: 't1', title: '新人初体验', mood: '轻松', content: '第一次认真骑完这一段路，节奏不快，但每一公里都让我更确定自己会继续骑下去。' },
  { id: 't2', title: '最难忘爬坡', mood: '励志', content: '坡很长，腿很酸，但每次想放弃时都告诉自己再坚持100米，最后顺利登顶。' },
  { id: 't3', title: '与好友的约定', mood: '轻松', content: '和好友一起出发，互相拉扯配速，聊一路、笑一路，这段路因为有人同行更难忘。' },
  { id: 't4', title: '治愈周末', mood: '文艺', content: '把烦恼留在起点，把风声收进耳机。城市边缘的这条线，刚好治愈这个周末。' },
  { id: 't5', title: '雨后慢骑', mood: '文艺', content: '路面还带着雨后的气味，速度放慢了一些，心却在这样的节奏里慢慢安静下来。' },
  { id: 't6', title: '晨骑唤醒日', mood: '励志', content: '闹钟响起的那一刻想赖床，但骑出去之后，整个人都被清晨的空气点亮。' },
  { id: 't7', title: '夜骑追风', mood: '轻松', content: '夜色把道路变得干净纯粹，路灯一盏盏后退，今天的疲惫也被风一起带走。' },
  { id: 't8', title: '挑战自我', mood: '励志', content: '这次把目标定得更高一点，过程很吃力，但看到数据突破的瞬间，一切都值了。' },
  { id: 't9', title: '城市探索', mood: '文艺', content: '在熟悉的城市里拐进陌生的小路，原来每一次偏离常规都可能遇见新的风景。' },
  { id: 't10', title: '恢复骑行日', mood: '轻松', content: '今天不追求速度，只做恢复。把呼吸和节奏找回来，就是最好的状态管理。' }
]

export async function GET() {
  return NextResponse.json({
    success: true,
    data: {
      list: templates
    }
  })
}

