"use client";

import { useEffect, useState } from "react";
import { useAppStore } from "@/lib/store";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, MapPin, Clock, Heart, Plus, Grid3X3, LayoutList } from "lucide-react";

interface Route {
  id: string;
  name: string;
  description: string | null;
  distance: number;
  duration: number;
  difficulty: string;
  elevation: number;
  coverImage: string | null;
  viewCount: number;
  favoriteCount: number;
  checkInCount: number;
  createdAt: string;
  creator: { id: string; name: string | null; avatar: string | null; };
}

const difficultyConfig: Record<string, { label: string; gradient: string }> = {
  easy: { label: "简单", gradient: "from-[#0095F6] to-[#00C6FF]" },
  medium: { label: "中等", gradient: "from-[#F56040] to-[#FCAF45]" },
  hard: { label: "困难", gradient: "from-[#E1306C] to-[#FD1D1D]" },
};

export function RoutesModule() {
  const { setSelectedRouteId } = useAppStore();
  const [routes, setRoutes] = useState<Route[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [difficultyFilter, setDifficultyFilter] = useState<string>("all");
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  useEffect(() => { fetchRoutes(); }, [difficultyFilter]);

  const fetchRoutes = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (difficultyFilter !== "all") params.append("difficulty", difficultyFilter);
      if (searchQuery) params.append("search", searchQuery);
      params.append("limit", "20");
      const res = await fetch(`/api/routes?${params.toString()}`);
      const data = await res.json();
      if (data.success && data.data) setRoutes(data.data.list || []);
    } catch (error) {
      console.error("Failed to fetch routes:", error);
      setRoutes([]);
    } finally {
      setLoading(false);
    }
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}小时${mins > 0 ? mins + '分' : ''}` : `${mins}分钟`;
  };

  return (
    <div className="min-h-screen bg-white dark:bg-black pb-24">
      <header className="sticky top-0 z-20 bg-white dark:bg-black border-b border-[#DBDBDB] dark:border-[#363636]">
        <div className="px-4 pt-3 pb-2">
          <div className="flex items-center justify-between mb-3">
            <h1 className="text-xl font-bold bg-gradient-to-r from-[#833AB4] via-[#E1306C] to-[#F56040] bg-clip-text text-transparent">路线探索</h1>
            <div className="flex items-center gap-2">
              <button onClick={() => setViewMode(viewMode === "grid" ? "list" : "grid")} className="p-2 rounded-lg hover:bg-[#FAFAFA] dark:hover:bg-[#121212]">
                {viewMode === "grid" ? <LayoutList className="w-5 h-5 text-[#262626] dark:text-white" /> : <Grid3X3 className="w-5 h-5 text-[#262626] dark:text-white" />}
              </button>
              <Button size="sm" className="bg-gradient-to-r from-[#833AB4] to-[#E1306C] text-white border-0 rounded-lg font-semibold" onClick={() => setShowCreateDialog(true)}>
                <Plus className="w-4 h-4 mr-1" />创建
              </Button>
            </div>
          </div>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8E8E8E]" />
              <Input placeholder="搜索路线..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-9 h-10 bg-[#EFEFEF] dark:bg-[#262626] border-0 rounded-lg text-sm" />
            </div>
            <Select value={difficultyFilter} onValueChange={setDifficultyFilter}>
              <SelectTrigger className="w-24 h-10 text-sm bg-[#EFEFEF] dark:bg-[#262626] border-0 rounded-lg"><SelectValue placeholder="难度" /></SelectTrigger>
              <SelectContent className="rounded-xl">
                <SelectItem value="all">全部</SelectItem>
                <SelectItem value="easy">简单</SelectItem>
                <SelectItem value="medium">中等</SelectItem>
                <SelectItem value="hard">困难</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </header>

      <div className="p-2">
        {loading ? (
          <div className={viewMode === "grid" ? "grid grid-cols-2 gap-1" : "space-y-2"}>
            {[1, 2, 3, 4].map((i) => (<div key={i} className="animate-pulse"><div className={`${viewMode === "grid" ? "aspect-square" : "h-24"} bg-[#EFEFEF] dark:bg-[#262626] rounded-lg`} /></div>))}
          </div>
        ) : routes.length === 0 ? (
          <div className="px-2 py-12 text-center">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#833AB4] to-[#E1306C] mx-auto mb-3 flex items-center justify-center">
              <MapPin className="w-8 h-8 text-white" />
            </div>
            <p className="text-[#262626] dark:text-white font-semibold">暂无路线数据</p>
            <p className="text-sm text-[#8E8E8E] mt-1">创建第一条路线吧！</p>
            <Button className="mt-4 bg-[#0095F6] hover:bg-[#1877F2] text-white rounded-lg" onClick={() => setShowCreateDialog(true)}>
              <Plus className="w-4 h-4 mr-1" />创建路线
            </Button>
          </div>
        ) : viewMode === "grid" ? (
          <div className="grid grid-cols-2 gap-1">
            {routes.map((route) => {
              const diffStyle = difficultyConfig[route.difficulty] || difficultyConfig.easy;
              return (
                <button key={route.id} onClick={() => setSelectedRouteId(route.id)} className="relative aspect-square group overflow-hidden rounded-lg">
                  <div className={`absolute inset-0 bg-gradient-to-br ${diffStyle.gradient} opacity-80`} />
                  <div className="absolute inset-0 flex flex-col justify-end p-3 text-white">
                    <div className="absolute top-2 right-2 bg-white/20 backdrop-blur-sm rounded-full px-2 py-0.5 text-xs">{diffStyle.label}</div>
                    <h3 className="font-semibold text-sm truncate">{route.name}</h3>
                    <div className="flex items-center gap-2 mt-1 text-xs text-white/80"><span>{route.distance.toFixed(1)}km</span><span>·</span><span>{formatDuration(route.duration)}</span></div>
                    <div className="flex items-center gap-2 mt-1 text-xs"><Heart className="w-3 h-3" /><span>{route.favoriteCount}</span></div>
                  </div>
                </button>
              );
            })}
          </div>
        ) : (
          <div className="space-y-2">
            {routes.map((route) => {
              const diffStyle = difficultyConfig[route.difficulty] || difficultyConfig.easy;
              return (
                <button key={route.id} onClick={() => setSelectedRouteId(route.id)} className="w-full flex gap-3 p-3 rounded-xl bg-[#FAFAFA] dark:bg-[#121212] text-left">
                  <div className={`w-20 h-20 rounded-lg bg-gradient-to-br ${diffStyle.gradient} flex-shrink-0 flex items-center justify-center`}>
                    <MapPin className="w-8 h-8 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <h3 className="font-semibold text-[#262626] dark:text-white truncate">{route.name}</h3>
                      <span className={`text-xs px-2 py-0.5 rounded-full bg-gradient-to-r ${diffStyle.gradient} text-white`}>{diffStyle.label}</span>
                    </div>
                    <p className="text-xs text-[#8E8E8E] mt-0.5 line-clamp-1">{route.description || "暂无描述"}</p>
                    <div className="flex items-center gap-3 mt-2 text-xs text-[#262626] dark:text-white/80">
                      <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{route.distance.toFixed(1)}km</span>
                      <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{formatDuration(route.duration)}</span>
                      <span className="flex items-center gap-1"><Heart className="w-3 h-3" />{route.favoriteCount}</span>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {showCreateDialog && <CreateRouteDialog onClose={() => setShowCreateDialog(false)} />}
    </div>
  );
}

function CreateRouteDialog({ onClose }: { onClose: () => void }) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [difficulty, setDifficulty] = useState("easy");
  const [distance, setDistance] = useState("");
  const [duration, setDuration] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!name || !distance || !duration) return;
    setLoading(true);
    try {
      const res = await fetch("/api/routes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, description, difficulty, distance: parseFloat(distance), duration: parseInt(duration), elevation: 0, startLat: 0, startLng: 0, isPublic: true }),
      });
      const data = await res.json();
      if (data.success) { onClose(); window.location.reload(); }
    } catch (error) { console.error("Failed to create route:", error); }
    finally { setLoading(false); }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50" onClick={onClose}>
      <Card className="w-full max-w-lg rounded-t-3xl rounded-b-none bg-white dark:bg-black border-t border-[#DBDBDB] dark:border-[#363636]" onClick={(e) => e.stopPropagation()}>
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-[#262626] dark:text-white">创建新路线</h2>
            <Button variant="ghost" size="sm" onClick={onClose} className="text-[#262626] dark:text-white">取消</Button>
          </div>
          <div className="space-y-4">
            <div>
              <label className="text-xs font-medium text-[#262626] dark:text-white mb-1 block">路线名称 *</label>
              <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="例如：城市公园环线" className="h-11 bg-[#FAFAFA] dark:bg-[#121212] border-[#DBDBDB] dark:border-[#363636] rounded-lg" />
            </div>
            <div>
              <label className="text-xs font-medium text-[#262626] dark:text-white mb-1 block">路线描述</label>
              <Input value={description} onChange={(e) => setDescription(e.target.value)} placeholder="描述这条路线的特点..." className="h-11 bg-[#FAFAFA] dark:bg-[#121212] border-[#DBDBDB] dark:border-[#363636] rounded-lg" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-medium text-[#262626] dark:text-white mb-1 block">距离(km) *</label>
                <Input type="number" value={distance} onChange={(e) => setDistance(e.target.value)} placeholder="10.5" className="h-11 bg-[#FAFAFA] dark:bg-[#121212] border-[#DBDBDB] dark:border-[#363636] rounded-lg" />
              </div>
              <div>
                <label className="text-xs font-medium text-[#262626] dark:text-white mb-1 block">时长(分钟) *</label>
                <Input type="number" value={duration} onChange={(e) => setDuration(e.target.value)} placeholder="45" className="h-11 bg-[#FAFAFA] dark:bg-[#121212] border-[#DBDBDB] dark:border-[#363636] rounded-lg" />
              </div>
            </div>
            <div>
              <label className="text-xs font-medium text-[#262626] dark:text-white mb-1 block">难度</label>
              <Select value={difficulty} onValueChange={setDifficulty}>
                <SelectTrigger className="h-11 bg-[#FAFAFA] dark:bg-[#121212] border-[#DBDBDB] dark:border-[#363636] rounded-lg"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="easy">🟢 简单</SelectItem>
                  <SelectItem value="medium">🟡 中等</SelectItem>
                  <SelectItem value="hard">🔴 困难</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button className="w-full h-11 bg-gradient-to-r from-[#833AB4] to-[#E1306C] text-white font-semibold rounded-lg hover:opacity-90" onClick={handleSubmit} disabled={loading || !name || !distance || !duration}>
              {loading ? "创建中..." : "创建路线"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
