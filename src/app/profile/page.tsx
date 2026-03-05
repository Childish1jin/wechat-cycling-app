"use client";

import { BottomNav } from "@/components/cycling/BottomNav";

const menuItems = [
  { icon: "ride", label: "我的骑行", badge: "156次" },
  { icon: "route", label: "收藏路线", badge: "23条" },
  { icon: "medal", label: "成就徽章", badge: "12个" },
  { icon: "settings", label: "设置", badge: null },
  { icon: "help", label: "帮助与反馈", badge: null },
  { icon: "about", label: "关于我们", badge: null },
];

const icons: Record<string, React.ReactNode> = {
  ride: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <circle cx="6" cy="19" r="3" strokeWidth={2} />
      <path strokeWidth={2} d="M9 19h8.5a3.5 3.5 0 0 0 0-7h-11a3.5 3.5 0 0 1 0-7H15" />
      <circle cx="18" cy="5" r="3" strokeWidth={2} />
    </svg>
  ),
  route: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeWidth={2} d="M3 12a9 9 0 1 0 18 0 9 9 0 0 0-18 0z" />
      <path strokeWidth={2} d="M9 12l2 2 4-4" />
    </svg>
  ),
  medal: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeWidth={2} d="M12 15l-3.09 1.63.59-3.44-2.5-2.44 3.46-.5L12 7l1.54 3.25 3.46.5-2.5 2.44.59 3.44z" />
    </svg>
  ),
  settings: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
      <circle cx="12" cy="12" r="3" strokeWidth={2} />
    </svg>
  ),
  help: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="10" strokeWidth={2} />
      <path strokeWidth={2} d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3" />
      <path strokeWidth={2} d="M12 17h.01" />
    </svg>
  ),
  about: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="10" strokeWidth={2} />
      <path strokeWidth={2} d="M12 16v-4M12 8h.01" />
    </svg>
  ),
};

export default function ProfilePage() {
  return (
    <div className="min-h-screen bg-background pb-20">
      {/* 用户信息卡片 */}
      <header className="bg-gradient-to-br from-green-500 to-green-600 px-4 pt-8 pb-6 text-white">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-2xl font-bold border-2 border-white/30">
            骑
          </div>
          <div>
            <h1 className="text-xl font-bold">骑行爱好者</h1>
            <p className="text-green-100 text-sm">已骑行 1,234 公里</p>
          </div>
        </div>

        {/* 数据统计 */}
        <div className="grid grid-cols-3 gap-4 mt-6">
          <div className="text-center">
            <div className="text-2xl font-bold">156</div>
            <div className="text-xs text-green-100">骑行次数</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold">12</div>
            <div className="text-xs text-green-100">成就徽章</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold">48</div>
            <div className="text-xs text-green-100">关注骑友</div>
          </div>
        </div>
      </header>

      {/* 菜单列表 */}
      <section className="px-4 py-4">
        <div className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-sm border border-gray-100 dark:border-gray-700">
          {menuItems.map((item, index) => (
            <button
              key={item.icon}
              className={`w-full flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${
                index !== menuItems.length - 1 ? "border-b border-gray-100 dark:border-gray-700" : ""
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="text-gray-500 dark:text-gray-400">{icons[item.icon]}</span>
                <span className="font-medium">{item.label}</span>
              </div>
              <div className="flex items-center gap-2">
                {item.badge && (
                  <span className="text-sm text-gray-400">{item.badge}</span>
                )}
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </button>
          ))}
        </div>
      </section>

      <BottomNav />
    </div>
  );
}
