"use client";

import { BottomNav } from "@/components/cycling/BottomNav";

const posts = [
  {
    id: 1,
    author: "骑行达人小王",
    avatar: "W",
    content: "今天完成了一次100公里的长途骑行，感觉太棒了！沿途风景如画，推荐给大家这条路线～",
    likes: 128,
    comments: 32,
    time: "2小时前",
  },
  {
    id: 2,
    author: "山地骑士",
    avatar: "M",
    content: "新入手了一辆碳纤维山地车，轻量化真的不一样，爬坡轻松多了！",
    likes: 256,
    comments: 48,
    time: "5小时前",
  },
  {
    id: 3,
    author: "城市通勤族",
    avatar: "C",
    content: "每天骑车上下班，既环保又锻炼身体，已经坚持了半年了，体重减了10斤！",
    likes: 89,
    comments: 15,
    time: "昨天",
  },
];

export default function CommunityPage() {
  return (
    <div className="min-h-screen bg-background pb-20">
      <header className="px-4 pt-6 pb-4">
        <h1 className="text-2xl font-bold">骑行社区</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          与骑友分享你的骑行故事
        </p>
      </header>

      {/* 发布按钮 */}
      <section className="px-4 mb-6">
        <button className="w-full bg-gray-100 dark:bg-gray-800 rounded-2xl p-4 flex items-center gap-3 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
          <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center text-white font-bold">
            你
          </div>
          <span className="text-gray-500 dark:text-gray-400">分享你的骑行故事...</span>
        </button>
      </section>

      {/* 帖子列表 */}
      <section className="px-4 space-y-4">
        {posts.map((post) => (
          <div
            key={post.id}
            className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-gray-700"
          >
            {/* 作者信息 */}
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center text-white font-bold">
                {post.avatar}
              </div>
              <div>
                <div className="font-medium">{post.author}</div>
                <div className="text-xs text-gray-400">{post.time}</div>
              </div>
            </div>

            {/* 内容 */}
            <p className="text-gray-700 dark:text-gray-300 mb-4">{post.content}</p>

            {/* 互动 */}
            <div className="flex items-center gap-6 text-gray-500 text-sm">
              <button className="flex items-center gap-1 hover:text-red-500 transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
                <span>{post.likes}</span>
              </button>
              <button className="flex items-center gap-1 hover:text-green-500 transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                <span>{post.comments}</span>
              </button>
            </div>
          </div>
        ))}
      </section>

      <BottomNav />
    </div>
  );
}
