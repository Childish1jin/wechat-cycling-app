"use client";

import { BottomNav } from "@/components/cycling/BottomNav";

export default function RecordPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-green-500 to-green-600 pb-20">
      <header className="px-4 pt-8 pb-6 text-center text-white">
        <h1 className="text-3xl font-bold">开始骑行</h1>
        <p className="text-green-100 mt-2">准备好开始你的旅程了吗？</p>
      </header>

      <main className="px-4">
        {/* 大型计时器/里程显示 */}
        <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-8 text-center text-white mb-6">
          <div className="text-6xl font-bold mb-2">0.00</div>
          <div className="text-green-100">公里</div>
        </div>

        {/* 实时数据 */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 text-center text-white">
            <div className="text-2xl font-bold">0:00</div>
            <div className="text-xs text-green-100 mt-1">时长</div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 text-center text-white">
            <div className="text-2xl font-bold">0.0</div>
            <div className="text-xs text-green-100 mt-1">时速 km/h</div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 text-center text-white">
            <div className="text-2xl font-bold">0</div>
            <div className="text-xs text-green-100 mt-1">卡路里</div>
          </div>
        </div>

        {/* 开始按钮 */}
        <button className="w-full bg-white text-green-600 font-bold text-xl py-5 rounded-full shadow-xl shadow-black/20 hover:shadow-2xl active:scale-95 transition-all">
          开始记录
        </button>

        {/* 提示 */}
        <p className="text-center text-green-100 text-sm mt-6">
          请确保 GPS 定位已开启
        </p>
      </main>

      <BottomNav />
    </div>
  );
}
