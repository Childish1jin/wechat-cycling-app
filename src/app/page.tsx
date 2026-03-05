"use client";

import { useAppStore } from "@/lib/store";
import { BottomNav } from "@/components/cycling/BottomNav";
import { HomeModule } from "@/components/cycling/HomeModule";
import { RoutesModule } from "@/components/cycling/RoutesModule";
import { RecordModule } from "@/components/cycling/RecordModule";
import { CommunityModule } from "@/components/cycling/CommunityModule";
import { ProfileModule } from "@/components/cycling/ProfileModule";
import { useEffect } from "react";

export default function CyclingApp() {
  const { activeTab, setUserId } = useAppStore();

  // 初始化用户 ID
  useEffect(() => {
    const initUser = async () => {
      try {
        const res = await fetch("/api/user");
        const data = await res.json();
        if (data.success && data.data.user) {
          setUserId(data.data.user.id);
        }
      } catch (error) {
        console.error("Failed to initialize user:", error);
      }
    };
    initUser();
  }, [setUserId]);

  // 根据当前选中的标签渲染对应的模块
  const renderModule = () => {
    switch (activeTab) {
      case "home":
        return <HomeModule />;
      case "routes":
        return <RoutesModule />;
      case "record":
        return <RecordModule />;
      case "community":
        return <CommunityModule />;
      case "profile":
        return <ProfileModule />;
      default:
        return <HomeModule />;
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {renderModule()}
      <BottomNav />
    </main>
  );
}
