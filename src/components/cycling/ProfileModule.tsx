"use client";

import { useEffect, useState } from "react";
import { useAppStore } from "@/lib/store";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Settings, Bike, Flame, Medal, Target, Grid3X3, Bookmark, ChevronRight } from "lucide-react";

interface UserProfile {
  id: string;
  name: string | null;
  email: string;
  avatar: string | null;
  bio: string | null;
  height: number | null;
  weight: number | null;
  createdAt: string;
}

interface UserStats {
  totalRides: number;
  totalDistance: number;
  totalDuration: number;
  totalCalories: number;
}

export function ProfileModule() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [stats, setStats] = useState<UserStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [activeTab, setActiveTab] = useState<"grid" | "saved">("grid");

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    try {
      const [userRes, statsRes] = await Promise.all([fetch("/api/user"), fetch("/api/stats")]);
      const userData = await userRes.json();
      const statsData = await statsRes.json();
      if (userData.success && userData.data) setUser(userData.data.user || null);
      if (statsData.success && statsData.data) setStats(statsData.data.overview || null);
    } catch (error) { console.error("Failed to fetch data:", error); }
    finally { setLoading(false); }
  };

  const getLevel = (distance: number) => {
    if (distance < 100) return { level: 1, name: "骑行新手", progress: distance, target: 100 };
    if (distance < 500) return { level: 2, name: "骑行爱好者", progress: distance - 100, target: 400 };
    if (distance < 1000) return { level: 3, name: "骑行达人", progress: distance - 500, target: 500 };
    if (distance < 2000) return { level: 4, name: "骑行高手", progress: distance - 1000, target: 1000 };
    if (distance < 5000) return { level: 5, name: "骑行专家", progress: distance - 2000, target: 3000 };
    return { level: 6, name: "骑行大师", progress: distance - 5000, target: distance };
  };

  const levelInfo = stats ? getLevel(stats.totalDistance) : { level: 1, name: "骑行新手", progress: 0, target: 100 };
  const progressPercent = Math.min((levelInfo.progress / levelInfo.target) * 100, 100);

  if (loading) {
    return (
      <div className="min-h-screen bg-white dark:bg-black pb-24 animate-pulse">
        <div className="px-4 py-8"><div className="flex items-center gap-6 mb-6"><div className="w-20 h-20 rounded-full bg-[#EFEFEF] dark:bg-[#262626]" /><div className="flex-1"><div className="h-6 w-24 bg-[#EFEFEF] dark:bg-[#262626] rounded mb-2" /><div className="h-4 w-32 bg-[#EFEFEF] dark:bg-[#262626] rounded" /></div></div></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-black pb-24">
      <header className="sticky top-0 z-20 bg-white dark:bg-black border-b border-[#DBDBDB] dark:border-[#363636]">
        <div className="flex items-center justify-between px-4 py-3">
          <h1 className="text-xl font-bold bg-gradient-to-r from-[#833AB4] via-[#E1306C] to-[#F56040] bg-clip-text text-transparent">{user?.name || "我的"}</h1>
          <div className="flex items-center gap-4">
            <button onClick={() => setShowEditDialog(true)}>
              <svg className="w-6 h-6 text-[#262626] dark:text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="4" y1="21" x2="4" y2="14" /><line x1="4" y1="10" x2="4" y2="3" /><line x1="12" y1="21" x2="12" y2="12" /><line x1="12" y1="8" x2="12" y2="3" /><line x1="20" y1="21" x2="20" y2="16" /><line x1="20" y1="12" x2="20" y2="3" />
                <line x1="1" y1="14" x2="7" y2="14" /><line x1="9" y1="8" x2="15" y2="8" /><line x1="17" y1="16" x2="23" y2="16" />
              </svg>
            </button>
            <button><Settings className="w-6 h-6 text-[#262626] dark:text-white" /></button>
          </div>
        </div>
      </header>

      <div className="px-4 py-6">
        <div className="flex items-center gap-6 mb-6">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#833AB4] via-[#E1306C] to-[#F56040] p-[3px]">
            <div className="w-full h-full rounded-full bg-white dark:bg-black p-[2px]">
              <Avatar className="w-full h-full">
                <AvatarImage src={user?.avatar || undefined} />
                <AvatarFallback className="bg-gradient-to-br from-[#833AB4] to-[#E1306C] text-white text-2xl font-bold">{user?.name?.[0] || "骑"}</AvatarFallback>
              </Avatar>
            </div>
          </div>
          <div className="flex-1 grid grid-cols-3 gap-4 text-center">
            <div><div className="text-xl font-bold text-[#262626] dark:text-white">{stats?.totalRides || 0}</div><div className="text-xs text-[#8E8E8E]">骑行</div></div>
            <div><div className="text-xl font-bold text-[#262626] dark:text-white">{(stats?.totalDistance || 0).toFixed(0)}</div><div className="text-xs text-[#8E8E8E]">公里</div></div>
            <div><div className="text-xl font-bold text-[#262626] dark:text-white">{stats?.totalCalories || 0}</div><div className="text-xs text-[#8E8E8E]">卡路里</div></div>
          </div>
        </div>

        <div className="mb-4">
          <h2 className="font-semibold text-[#262626] dark:text-white">{user?.name || "骑行爱好者"}</h2>
          <p className="text-sm text-[#262626] dark:text-white/80 mt-0.5">{user?.bio || "热爱骑行，享受自由 🚴"}</p>
        </div>

        <div className="bg-[#FAFAFA] dark:bg-[#121212] rounded-xl p-4 mb-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#833AB4] to-[#E1306C] flex items-center justify-center"><Medal className="w-4 h-4 text-white" /></div>
              <div><span className="text-sm font-semibold text-[#262626] dark:text-white">Lv.{levelInfo.level}</span><span className="text-xs text-[#8E8E8E] ml-1">{levelInfo.name}</span></div>
            </div>
            <span className="text-xs text-[#8E8E8E]">{levelInfo.progress.toFixed(0)}/{levelInfo.target} km</span>
          </div>
          <Progress value={progressPercent} className="h-1.5 bg-[#EFEFEF] dark:bg-[#262626]" />
        </div>

        <div className="flex gap-2">
          <Button className="flex-1 h-9 bg-gradient-to-r from-[#833AB4] to-[#E1306C] text-white text-sm font-semibold rounded-lg" onClick={() => setShowEditDialog(true)}>编辑资料</Button>
          <Button variant="outline" className="h-9 px-4 border-[#DBDBDB] dark:border-[#363636] rounded-lg">分享主页</Button>
        </div>
      </div>

      <div className="px-4 py-4 border-y border-[#DBDBDB] dark:border-[#262626]">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-[#262626] dark:text-white">成就徽章</h3>
          <button className="text-xs text-[#0095F6] font-semibold">查看全部</button>
        </div>
        <div className="flex gap-4 overflow-x-auto hide-scrollbar">
          <div className="flex flex-col items-center gap-1 flex-shrink-0">
            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#833AB4] to-[#E1306C] flex items-center justify-center"><Bike className="w-7 h-7 text-white" /></div>
            <span className="text-[10px] text-[#262626] dark:text-white">首次骑行</span>
          </div>
          <div className="flex flex-col items-center gap-1 flex-shrink-0">
            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#405DE6] to-[#5851DB] flex items-center justify-center"><Target className="w-7 h-7 text-white" /></div>
            <span className="text-[10px] text-[#262626] dark:text-white">百公里</span>
          </div>
          <div className="flex flex-col items-center gap-1 flex-shrink-0">
            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#F56040] to-[#FCAF45] flex items-center justify-center"><Flame className="w-7 h-7 text-white" /></div>
            <span className="text-[10px] text-[#262626] dark:text-white">燃脂达人</span>
          </div>
          <div className="flex flex-col items-center gap-1 flex-shrink-0 opacity-40">
            <div className="w-14 h-14 rounded-full bg-[#EFEFEF] dark:bg-[#262626] flex items-center justify-center"><Medal className="w-7 h-7 text-[#8E8E8E]" /></div>
            <span className="text-[10px] text-[#8E8E8E]">未解锁</span>
          </div>
        </div>
      </div>

      <div className="flex border-b border-[#DBDBDB] dark:border-[#262626]">
        <button onClick={() => setActiveTab("grid")} className={`flex-1 py-3 flex justify-center ${activeTab === "grid" ? "border-b-2 border-[#262626] dark:border-white" : ""}`}>
          <Grid3X3 className={`w-5 h-5 ${activeTab === "grid" ? "text-[#262626] dark:text-white" : "text-[#8E8E8E]"}`} />
        </button>
        <button onClick={() => setActiveTab("saved")} className={`flex-1 py-3 flex justify-center ${activeTab === "saved" ? "border-b-2 border-[#262626] dark:border-white" : ""}`}>
          <Bookmark className={`w-5 h-5 ${activeTab === "saved" ? "text-[#262626] dark:text-white" : "text-[#8E8E8E]"}`} />
        </button>
      </div>

      {activeTab === "grid" ? (
        <div className="grid grid-cols-3 gap-0.5 p-0.5">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="aspect-square bg-gradient-to-br from-[#FAFAFA] to-[#EFEFEF] dark:from-[#121212] dark:to-[#262626] flex items-center justify-center">
              <Bike className="w-8 h-8 text-[#DBDBDB] dark:text-[#363636]" />
            </div>
          ))}
        </div>
      ) : (
        <div className="p-8 text-center">
          <Bookmark className="w-12 h-12 text-[#DBDBDB] dark:text-[#363636] mx-auto mb-2" />
          <p className="text-[#8E8E8E]">还没有收藏的内容</p>
        </div>
      )}

      {showEditDialog && <EditProfileDialog user={user} onClose={() => setShowEditDialog(false)} onUpdate={(updatedUser) => { setUser(updatedUser); setShowEditDialog(false); }} />}
    </div>
  );
}

function EditProfileDialog({ user, onClose, onUpdate }: { user: UserProfile | null; onClose: () => void; onUpdate: (user: UserProfile) => void }) {
  const [name, setName] = useState(user?.name || "");
  const [bio, setBio] = useState(user?.bio || "");
  const [height, setHeight] = useState(user?.height?.toString() || "");
  const [weight, setWeight] = useState(user?.weight?.toString() || "");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/user", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, bio, height: height ? parseFloat(height) : null, weight: weight ? parseFloat(weight) : null }),
      });
      const data = await res.json();
      if (data.success) onUpdate(data.data.user);
    } catch (error) { console.error("Failed to update profile:", error); }
    finally { setLoading(false); }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50" onClick={onClose}>
      <Card className="w-full max-w-lg rounded-t-3xl rounded-b-none bg-white dark:bg-black border-t border-[#DBDBDB] dark:border-[#363636]" onClick={(e) => e.stopPropagation()}>
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-[#262626] dark:text-white">编辑资料</h2>
            <Button variant="ghost" size="sm" onClick={onClose} className="text-[#262626] dark:text-white">取消</Button>
          </div>
          <div className="space-y-4">
            <div className="flex justify-center">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#833AB4] via-[#E1306C] to-[#F56040] p-[3px]">
                <div className="w-full h-full rounded-full bg-white dark:bg-black p-[2px] flex items-center justify-center">
                  <span className="text-2xl font-bold text-[#E1306C]">{name?.[0] || "骑"}</span>
                </div>
              </div>
            </div>
            <div>
              <label className="text-xs font-medium text-[#262626] dark:text-white mb-1 block">昵称</label>
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="输入昵称" className="w-full h-11 px-4 rounded-xl border border-[#DBDBDB] dark:border-[#363636] bg-[#FAFAFA] dark:bg-[#121212] text-[#262626] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#E1306C]" />
            </div>
            <div>
              <label className="text-xs font-medium text-[#262626] dark:text-white mb-1 block">个人简介</label>
              <textarea value={bio} onChange={(e) => setBio(e.target.value)} placeholder="介绍一下自己..." className="w-full h-20 px-4 py-3 rounded-xl border border-[#DBDBDB] dark:border-[#363636] bg-[#FAFAFA] dark:bg-[#121212] text-[#262626] dark:text-white resize-none focus:outline-none focus:ring-2 focus:ring-[#E1306C]" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-medium text-[#262626] dark:text-white mb-1 block">身高(cm)</label>
                <input type="number" value={height} onChange={(e) => setHeight(e.target.value)} placeholder="170" className="w-full h-11 px-4 rounded-xl border border-[#DBDBDB] dark:border-[#363636] bg-[#FAFAFA] dark:bg-[#121212] text-[#262626] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#E1306C]" />
              </div>
              <div>
                <label className="text-xs font-medium text-[#262626] dark:text-white mb-1 block">体重(kg)</label>
                <input type="number" value={weight} onChange={(e) => setWeight(e.target.value)} placeholder="65" className="w-full h-11 px-4 rounded-xl border border-[#DBDBDB] dark:border-[#363636] bg-[#FAFAFA] dark:bg-[#121212] text-[#262626] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#E1306C]" />
              </div>
            </div>
            <Button className="w-full h-11 bg-gradient-to-r from-[#833AB4] to-[#E1306C] text-white font-semibold rounded-lg" onClick={handleSubmit} disabled={loading}>
              {loading ? "保存中..." : "保存修改"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
