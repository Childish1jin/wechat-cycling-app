"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { useAppStore } from "@/lib/store";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Play, Square, Pause, MapPin, Clock, Gauge, Flame, Check } from "lucide-react";

interface Ride {
  id: string;
  name: string | null;
  distance: number;
  duration: number;
  avgSpeed: number;
  calories: number | null;
  startTime: string;
}

export function RecordModule() {
  const { rideState, startRide, stopRide, updateRideData, resetRide } = useAppStore();
  const [recentRides, setRecentRides] = useState<Ride[]>([]);
  const [loading, setLoading] = useState(true);
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [rideName, setRideName] = useState("");
  const [saving, setSaving] = useState(false);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => { fetchRecentRides(); }, []);

  useEffect(() => {
    if (rideState.isRecording && rideState.startTime) {
      timerRef.current = setInterval(() => {
        const now = new Date();
        const duration = Math.floor((now.getTime() - new Date(rideState.startTime!).getTime()) / 1000);
        updateRideData({ duration });
      }, 1000);
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [rideState.isRecording, rideState.startTime]);

  const fetchRecentRides = async () => {
    try {
      const res = await fetch("/api/rides?limit=10");
      const data = await res.json();
      if (data.success && data.data) setRecentRides(data.data.list || []);
    } catch (error) { console.error("Failed to fetch rides:", error); setRecentRides([]); }
    finally { setLoading(false); }
  };

  const handleStartRide = () => startRide();
  const handlePauseRide = () => stopRide();
  const handleStopRide = () => { stopRide(); setShowSaveDialog(true); };

  const handleSaveRide = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/rides", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: rideName || `骑行 ${new Date().toLocaleDateString()}`,
          distance: rideState.distance,
          duration: rideState.duration,
          avgSpeed: rideState.avgSpeed,
          calories: rideState.calories,
          startTime: rideState.startTime,
          endTime: new Date(),
        }),
      });
      const data = await res.json();
      if (data.success) { setShowSaveDialog(false); resetRide(); fetchRecentRides(); }
    } catch (error) { console.error("Failed to save ride:", error); }
    finally { setSaving(false); }
  };

  const handleCancelSave = () => { setShowSaveDialog(false); resetRide(); };

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return hours > 0 ? `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}` : `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return `${date.getMonth() + 1}月${date.getDate()}日 ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
  };

  const simulateRide = useCallback(() => {
    if (rideState.isRecording) {
      const distance = rideState.distance + Math.random() * 0.01;
      const avgSpeed = distance > 0 ? (distance * 3600) / rideState.duration : 0;
      const calories = Math.floor(distance * 25);
      updateRideData({
        distance: parseFloat(distance.toFixed(2)),
        avgSpeed: parseFloat(avgSpeed.toFixed(1)),
        calories,
        currentSpeed: Math.random() * 10 + 15,
      });
    }
  }, [rideState.isRecording, rideState.distance, rideState.duration]);

  useEffect(() => {
    const interval = setInterval(simulateRide, 1000);
    return () => clearInterval(interval);
  }, [simulateRide]);

  return (
    <div className="min-h-screen bg-white dark:bg-black pb-24">
      <header className="sticky top-0 z-20 bg-white dark:bg-black border-b border-[#DBDBDB] dark:border-[#363636]">
        <div className="px-4 py-3">
          <h1 className="text-xl font-bold bg-gradient-to-r from-[#833AB4] via-[#E1306C] to-[#F56040] bg-clip-text text-transparent">骑行记录</h1>
        </div>
      </header>

      <div className={`px-4 pt-6 pb-8 ${rideState.isRecording ? 'bg-gradient-to-br from-[#833AB4] via-[#E1306C] to-[#F56040]' : ''}`}>
        <div className="text-center mb-8">
          <div className={`text-7xl font-bold ${rideState.isRecording ? 'text-white' : 'text-[#262626] dark:text-white'}`}>{rideState.distance.toFixed(1)}</div>
          <div className={`text-lg mt-1 ${rideState.isRecording ? 'text-white/80' : 'text-[#8E8E8E]'}`}>公里</div>
          {rideState.isRecording && (
            <div className="mt-2 inline-flex items-center gap-2 bg-white/20 rounded-full px-3 py-1">
              <span className="w-2 h-2 rounded-full bg-white animate-pulse"></span>
              <span className="text-white text-sm">骑行中</span>
            </div>
          )}
        </div>

        <div className="grid grid-cols-3 gap-3 mb-6">
          <div className={`text-center p-4 rounded-2xl ${rideState.isRecording ? 'bg-white/10' : 'bg-[#FAFAFA] dark:bg-[#121212]'}`}>
            <Clock className={`w-5 h-5 mx-auto mb-2 ${rideState.isRecording ? 'text-white/80' : 'text-[#8E8E8E]'}`} />
            <div className={`text-xl font-bold ${rideState.isRecording ? 'text-white' : 'text-[#262626] dark:text-white'}`}>{formatDuration(rideState.duration)}</div>
            <div className={`text-xs mt-1 ${rideState.isRecording ? 'text-white/60' : 'text-[#8E8E8E]'}`}>时长</div>
          </div>
          <div className={`text-center p-4 rounded-2xl ${rideState.isRecording ? 'bg-white/10' : 'bg-[#FAFAFA] dark:bg-[#121212]'}`}>
            <Gauge className={`w-5 h-5 mx-auto mb-2 ${rideState.isRecording ? 'text-white/80' : 'text-[#8E8E8E]'}`} />
            <div className={`text-xl font-bold ${rideState.isRecording ? 'text-white' : 'text-[#262626] dark:text-white'}`}>{rideState.avgSpeed.toFixed(1)}</div>
            <div className={`text-xs mt-1 ${rideState.isRecording ? 'text-white/60' : 'text-[#8E8E8E]'}`}>均速</div>
          </div>
          <div className={`text-center p-4 rounded-2xl ${rideState.isRecording ? 'bg-white/10' : 'bg-[#FAFAFA] dark:bg-[#121212]'}`}>
            <Flame className={`w-5 h-5 mx-auto mb-2 ${rideState.isRecording ? 'text-white/80' : 'text-[#E1306C]'}`} />
            <div className={`text-xl font-bold ${rideState.isRecording ? 'text-white' : 'text-[#262626] dark:text-white'}`}>{rideState.calories}</div>
            <div className={`text-xs mt-1 ${rideState.isRecording ? 'text-white/60' : 'text-[#8E8E8E]'}`}>卡路里</div>
          </div>
        </div>
      </div>

      <div className="px-4 -mt-4">
        {!rideState.isRecording && rideState.duration === 0 ? (
          <Button onClick={handleStartRide} className="w-full h-14 bg-gradient-to-r from-[#833AB4] via-[#E1306C] to-[#F56040] text-white rounded-2xl text-lg font-semibold shadow-lg shadow-[#E1306C]/30">
            <Play className="w-5 h-5 mr-2" />开始骑行
          </Button>
        ) : rideState.isRecording ? (
          <div className="flex gap-3">
            <Button onClick={handlePauseRide} variant="outline" className="flex-1 h-14 rounded-2xl border-[#DBDBDB] dark:border-[#363636] bg-white dark:bg-black text-[#262626] dark:text-white">
              <Pause className="w-5 h-5 mr-2" />暂停
            </Button>
            <Button onClick={handleStopRide} className="flex-1 h-14 bg-[#ED4956] hover:bg-[#C13584] text-white rounded-2xl">
              <Square className="w-5 h-5 mr-2" />结束
            </Button>
          </div>
        ) : (
          <div className="flex gap-3">
            <Button onClick={handleStartRide} className="flex-1 h-14 bg-gradient-to-r from-[#833AB4] to-[#E1306C] text-white rounded-2xl">
              <Play className="w-5 h-5 mr-2" />继续
            </Button>
            <Button onClick={handleStopRide} className="flex-1 h-14 bg-[#ED4956] hover:bg-[#C13584] text-white rounded-2xl">
              <Square className="w-5 h-5 mr-2" />结束
            </Button>
          </div>
        )}
      </div>

      <div className="px-4 mt-8">
        <h2 className="text-sm font-semibold text-[#262626] dark:text-white mb-3">历史记录</h2>
        {loading ? (
          <div className="space-y-2">{[1, 2, 3].map((i) => (<div key={i} className="animate-pulse h-20 bg-[#EFEFEF] dark:bg-[#262626] rounded-xl" />))}</div>
        ) : recentRides.length === 0 ? (
          <div className="bg-[#FAFAFA] dark:bg-[#121212] rounded-xl p-8 text-center">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#833AB4] to-[#E1306C] mx-auto mb-3 flex items-center justify-center">
              <MapPin className="w-6 h-6 text-white" />
            </div>
            <p className="text-[#262626] dark:text-white font-medium">还没有骑行记录</p>
            <p className="text-sm text-[#8E8E8E] mt-1">开始你的第一次骑行吧</p>
          </div>
        ) : (
          <div className="space-y-2 max-h-72 overflow-y-auto">
            {recentRides.map((ride) => (
              <div key={ride.id} className="flex items-center gap-3 p-4 bg-[#FAFAFA] dark:bg-[#121212] rounded-xl">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#833AB4] to-[#E1306C] flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-[#262626] dark:text-white truncate">{ride.name || `骑行 ${formatDate(ride.startTime)}`}</p>
                  <p className="text-xs text-[#8E8E8E]">{formatDate(ride.startTime)}</p>
                </div>
                <div className="text-right">
                  <div className="text-sm font-semibold text-[#262626] dark:text-white">{ride.distance.toFixed(1)} km</div>
                  <div className="text-xs text-[#8E8E8E]">{formatDuration(ride.duration)}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {showSaveDialog && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50">
          <Card className="w-full max-w-lg rounded-t-3xl rounded-b-none bg-white dark:bg-black border-t border-[#DBDBDB] dark:border-[#363636]">
            <CardContent className="p-6">
              <div className="text-center mb-6">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#833AB4] to-[#E1306C] flex items-center justify-center mx-auto mb-4">
                  <Check className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-xl font-bold text-[#262626] dark:text-white">骑行完成!</h2>
                <p className="text-[#8E8E8E] mt-1">骑行 {rideState.distance.toFixed(1)} 公里，消耗 {rideState.calories} 卡路里</p>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-medium text-[#262626] dark:text-white mb-1 block">骑行名称</label>
                  <input type="text" value={rideName} onChange={(e) => setRideName(e.target.value)} placeholder="给这次骑行起个名字..." className="w-full h-11 px-4 rounded-xl bg-[#FAFAFA] dark:bg-[#121212] border border-[#DBDBDB] dark:border-[#363636] text-[#262626] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#E1306C]" />
                </div>
                <div className="flex gap-3">
                  <Button variant="outline" className="flex-1 h-11 rounded-xl border-[#DBDBDB] dark:border-[#363636]" onClick={handleCancelSave}>放弃记录</Button>
                  <Button className="flex-1 h-11 bg-gradient-to-r from-[#833AB4] to-[#E1306C] text-white rounded-xl" onClick={handleSaveRide} disabled={saving}>{saving ? '保存中...' : '保存记录'}</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
