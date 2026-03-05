"use client";

import { useEffect, useState } from "react";
import { useAppStore } from "@/lib/store";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Heart,
  MessageCircle,
  Send,
  Bookmark,
  MapPin,
  Clock,
  Flame,
  Plus,
  Bike,
  Zap
} from "lucide-react";

interface Stats {
  todayDistance: number;
  monthDistance: number;
  totalDistance: number;
  totalRides: number;
  totalDuration: number;
  totalCalories: number;
}

interface Ride {
  id: string;
  name: string | null;
  distance: number;
  duration: number;
  avgSpeed: number;
  calories: number | null;
  startTime: string;
  createdAt: string;
}

const stories = [
  { id: 1, name: "你的故事", isOwn: true, hasNew: false },
  { id: 2, name: "骑行达人", hasNew: true },
  { id: 3, name: "山地车手", hasNew: true },
  { id: 4, name: "城市骑手", hasNew: false },
  { id: 5, name: "长途骑行", hasNew: true },
];

export function HomeModule() {
  const { setActiveTab } = useAppStore();
  const [stats, setStats] = useState<Stats | null>(null);
  const [recentRides, setRecentRides] = useState<Ride[]>([]);
  const [loading, setLoading] = useState(true);
  const [likedPosts, setLikedPosts] = useState<Set<string>>(new Set());

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch("/api/stats");
        const data = await res.json();
        if (data.success && data.data) {
          setStats(data.data.overview || null);
        }
      } catch (error) {
        console.error("Failed to fetch stats:", error);
      }
    };

    const fetchRecentRides = async () => {
      try {
        const res = await fetch("/api/rides?limit=5");
        const data = await res.json();
        if (data.success && data.data) {
          setRecentRides(data.data.list || []);
        }
      } catch (error) {
        console.error("Failed to fetch rides:", error);
        setRecentRides([]);
      }
    };

    Promise.all([fetchStats(), fetchRecentRides()]).finally(() => setLoading(false));
  }, []);

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    if (hours > 0) return `${hours}小时${minutes}分`;
    return `${minutes}分钟`;
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    if (diffDays === 0) return `今天 ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
    if (diffDays === 1) return `昨天`;
    if (diffDays < 7) return `${diffDays}天前`;
    return `${date.getMonth() + 1}月${date.getDate()}日`;
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) return "早上好";
    if (hour >= 12 && hour < 18) return "下午好";
    return "晚上好";
  };

  const toggleLike = (id: string) => {
    setLikedPosts(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) newSet.delete(id);
      else newSet.add(id);
      return newSet;
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white dark:bg-black pb-20 animate-pulse">
        <div className="px-4 pt-4 pb-2"><div className="h-6 w-24 bg-gray-200 dark:bg-gray-800 rounded" /></div>
        <div className="px-4 py-2"><div className="h-20 bg-gray-200 dark:bg-gray-800 rounded-xl" /></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-black pb-24">
      {/* Header */}
      <header className="sticky top-0 z-20 bg-white dark:bg-black border-b border-[#DBDBDB] dark:border-[#363636]">
        <div className="flex items-center justify-between px-4 py-3">
          <h1 className="text-xl font-bold bg-gradient-to-r from-[#833AB4] via-[#E1306C] to-[#F56040] bg-clip-text text-transparent">骑行助手</h1>
          <button className="relative">
            <svg className="w-6 h-6 text-[#262626] dark:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
            <span className="absolute -top-1 -right-1 w-2 h-2 bg-[#E1306C] rounded-full"></span>
          </button>
        </div>
      </header>

      {/* Stories */}
      <div className="px-4 py-3 border-b border-[#EFEFEF] dark:border-[#262626]">
        <div className="flex gap-4 overflow-x-auto hide-scrollbar">
          {stories.map((story) => (
            <button key={story.id} className="flex flex-col items-center gap-1 flex-shrink-0">
              <div className={`w-16 h-16 rounded-full p-[2px] ${story.isOwn ? "bg-[#DBDBDB] dark:bg-[#363636]" : story.hasNew ? "bg-gradient-to-br from-[#F58529] via-[#DD2A7B] to-[#515BD4]" : "bg-[#DBDBDB] dark:bg-[#363636]"}`}>
                <div className="w-full h-full rounded-full bg-white dark:bg-black p-[2px]">
                  <div className="w-full h-full rounded-full bg-gradient-to-br from-[#833AB4] to-[#E1306C] flex items-center justify-center">
                    {story.isOwn ? <Plus className="w-6 h-6 text-white" /> : <Bike className="w-6 h-6 text-white" />}
                  </div>
                </div>
              </div>
              <span className="text-[10px] text-[#262626] dark:text-white truncate w-16 text-center">{story.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Stats Card */}
      <div className="px-4 py-4">
        <Card className="bg-gradient-to-br from-[#833AB4] via-[#E1306C] to-[#F56040] border-0 rounded-2xl overflow-hidden">
          <CardContent className="p-5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-white/80 text-sm">{getGreeting()} ☀️</p>
                <p className="text-white text-lg font-semibold mt-0.5">今天骑了吗？</p>
              </div>
              <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
                <Bike className="w-6 h-6 text-white" />
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4 mb-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-white">{stats?.totalRides || 0}</div>
                <div className="text-xs text-white/70 mt-0.5">骑行次数</div>
              </div>
              <div className="text-center border-x border-white/20">
                <div className="text-2xl font-bold text-white">{(stats?.totalDistance || 0).toFixed(0)}</div>
                <div className="text-xs text-white/70 mt-0.5">总里程(km)</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-white">{stats?.totalCalories || 0}</div>
                <div className="text-xs text-white/70 mt-0.5">消耗卡路里</div>
              </div>
            </div>
            <Button onClick={() => setActiveTab('record')} className="w-full h-12 bg-white text-[#E1306C] font-semibold rounded-xl hover:bg-white/90 transition-colors shadow-lg">
              <Zap className="w-5 h-5 mr-2" />开始骑行
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Quick Links */}
      <div className="px-4 py-2">
        <h2 className="text-sm font-semibold text-[#262626] dark:text-white mb-3">快捷入口</h2>
        <div className="grid grid-cols-4 gap-1">
          <button onClick={() => setActiveTab('routes')} className="aspect-square bg-gradient-to-br from-[#405DE6] to-[#5851DB] rounded-md flex items-center justify-center">
            <MapPin className="w-6 h-6 text-white" />
          </button>
          <button onClick={() => setActiveTab('community')} className="aspect-square bg-gradient-to-br from-[#833AB4] to-[#C13584] rounded-md flex items-center justify-center">
            <MessageCircle className="w-6 h-6 text-white" />
          </button>
          <button className="aspect-square bg-gradient-to-br from-[#E1306C] to-[#FD1D1D] rounded-md flex items-center justify-center">
            <Flame className="w-6 h-6 text-white" />
          </button>
          <button onClick={() => setActiveTab('profile')} className="aspect-square bg-gradient-to-br from-[#F56040] to-[#FCAF45] rounded-md flex items-center justify-center">
            <Clock className="w-6 h-6 text-white" />
          </button>
        </div>
      </div>

      {/* Recent Rides */}
      <div className="mt-4">
        <div className="flex items-center justify-between px-4 mb-3">
          <h2 className="text-sm font-semibold text-[#262626] dark:text-white">最近骑行</h2>
          <button onClick={() => setActiveTab('record')} className="text-sm text-[#0095F6] font-semibold">查看全部</button>
        </div>
        {recentRides.length === 0 ? (
          <div className="px-4">
            <div className="bg-[#FAFAFA] dark:bg-[#121212] rounded-xl p-8 text-center">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#833AB4] to-[#E1306C] mx-auto mb-3 flex items-center justify-center">
                <Bike className="w-8 h-8 text-white" />
              </div>
              <p className="text-[#262626] dark:text-white font-medium">还没有骑行记录</p>
              <p className="text-sm text-[#8E8E8E] mt-1">开始你的第一次骑行吧！</p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {recentRides.map((ride) => (
              <div key={ride.id} className="border-b border-[#EFEFEF] dark:border-[#262626] pb-4">
                <div className="flex items-center justify-between px-4 mb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#833AB4] to-[#E1306C] flex items-center justify-center">
                      <Bike className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-[#262626] dark:text-white">{ride.name || `骑行记录`}</p>
                      <p className="text-[10px] text-[#8E8E8E]">{formatDate(ride.startTime)}</p>
                    </div>
                  </div>
                  <button className="text-[#262626] dark:text-white">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><circle cx="12" cy="5" r="2" /><circle cx="12" cy="12" r="2" /><circle cx="12" cy="19" r="2" /></svg>
                  </button>
                </div>
                <div className="mx-4 bg-gradient-to-br from-[#FAFAFA] to-[#EFEFEF] dark:from-[#121212] dark:to-[#262626] rounded-xl p-6 mb-3">
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <div className="text-2xl font-bold text-[#262626] dark:text-white">{ride.distance.toFixed(1)}</div>
                      <div className="text-xs text-[#8E8E8E] mt-0.5">公里</div>
                    </div>
                    <div className="border-x border-[#DBDBDB] dark:border-[#363636]">
                      <div className="text-2xl font-bold text-[#262626] dark:text-white">{formatDuration(ride.duration)}</div>
                      <div className="text-xs text-[#8E8E8E] mt-0.5">时长</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-[#E1306C]">{ride.calories || 0}</div>
                      <div className="text-xs text-[#8E8E8E] mt-0.5">卡路里</div>
                    </div>
                  </div>
                </div>
                <div className="px-4 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <button onClick={() => toggleLike(ride.id)} className="transition-transform active:scale-125">
                      <Heart className={`w-6 h-6 ${likedPosts.has(ride.id) ? 'text-[#ED4956] fill-[#ED4956]' : 'text-[#262626] dark:text-white'}`} />
                    </button>
                    <button><MessageCircle className="w-6 h-6 text-[#262626] dark:text-white" /></button>
                    <button><Send className="w-6 h-6 text-[#262626] dark:text-white" /></button>
                  </div>
                  <button><Bookmark className="w-6 h-6 text-[#262626] dark:text-white" /></button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
