"use client";

import { BottomNav } from "@/components/cycling/BottomNav";

const routes = [
  {
    id: 1,
    name: "城市绿道环线",
    distance: "18.5km",
    elevation: "120m",
    difficulty: "简单",
    rating: 4.8,
    rides: 1256,
  },
  {
    id: 2,
    name: "山地挑战路线",
    distance: "32.0km",
    elevation: "580m",
    difficulty: "困难",
    rating: 4.5,
    rides: 432,
  },
  {
    id: 3,
    name: "滨河风光带",
    distance: "12.8km",
    elevation: "50m",
    difficulty: "简单",
    rating: 4.9,
    rides: 2890,
  },
];

export default function RoutesPage() {
  return (
    <div className="min-h-screen bg-background pb-20">
      <header className="px-4 pt-6 pb-4">
        <h1 className="text-2xl font-bold">发现路线</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          探索附近热门骑行路线
        </p>
      </header>

      {/* 搜索栏 */}
      <section className="px-4 mb-6">
        <div className="relative">
          <input
            type="text"
            placeholder="搜索路线..."
            className="w-full h-12 pl-12 pr-4 rounded-2xl bg-gray-100 dark:bg-gray-800 border-0 focus:ring-2 focus:ring-green-500 outline-none"
          />
          <svg
            className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <circle cx="11" cy="11" r="8" strokeWidth={2} />
            <path strokeWidth={2} d="M21 21l-4.35-4.35" />
          </svg>
        </div>
      </section>

      {/* 路线列表 */}
      <section className="px-4 space-y-4">
        {routes.map((route) => (
          <div
            key={route.id}
            className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-gray-700"
          >
            <div className="flex justify-between items-start mb-3">
              <div>
                <h3 className="font-semibold text-lg">{route.name}</h3>
                <div className="flex items-center gap-2 mt-1">
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full ${
                      route.difficulty === "简单"
                        ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                        : route.difficulty === "困难"
                        ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                        : "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400"
                    }`}
                  >
                    {route.difficulty}
                  </span>
                  <span className="text-sm text-gray-500">{route.distance}</span>
                </div>
              </div>
              <div className="flex items-center gap-1 text-amber-500">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
                <span className="font-medium">{route.rating}</span>
              </div>
            </div>
            <div className="flex items-center justify-between text-sm text-gray-500">
              <span>海拔上升 {route.elevation}</span>
              <span>{route.rides} 次骑行</span>
            </div>
          </div>
        ))}
      </section>

      <BottomNav />
    </div>
  );
}
