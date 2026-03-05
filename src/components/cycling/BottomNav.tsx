"use client";

import * as React from "react";
import { useAppStore, TabType } from "@/lib/store";
import { cn } from "@/lib/utils";

// 图标组件 - INS 风格线条图标
const Icons = {
  Home: ({ className, filled }: { className?: string; filled?: boolean }) => (
    filled ? (
      <svg className={className} viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2.5c-5.31 0-9.71 4.08-10.23 9.25-.03.26-.04.52-.04.78 0 .16 0 .31.01.47.24 5.32 4.64 9.5 9.97 9.5h.58c5.33 0 9.73-4.18 9.97-9.5.01-.16.01-.31.01-.47 0-.26-.01-.52-.04-.78C21.71 6.58 17.31 2.5 12 2.5zm0 14.5c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5z"/>
      </svg>
    ) : (
      <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <circle cx="12" cy="12" r="3" />
      </svg>
    )
  ),
  Route: ({ className, filled }: { className?: string; filled?: boolean }) => (
    filled ? (
      <svg className={className} viewBox="0 0 24 24" fill="currentColor">
        <path d="M19.5 12c0-1.93-1.57-3.5-3.5-3.5h-1.5c-.28 0-.5-.22-.5-.5V6.5c0-1.93-1.57-3.5-3.5-3.5S7 4.57 7 6.5V8c0 .28-.22.5-.5.5H5c-1.93 0-3.5 1.57-3.5 3.5s1.57 3.5 3.5 3.5h1.5c.28 0 .5.22.5.5v1.5c0 1.93 1.57 3.5 3.5 3.5s3.5-1.57 3.5-3.5V16c0-.28.22-.5.5-.5H16c1.93 0 3.5-1.57 3.5-3.5z"/>
      </svg>
    ) : (
      <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="6" cy="19" r="3" />
        <path d="M9 19h8.5a3.5 3.5 0 0 0 0-7h-11a3.5 3.5 0 0 1 0-7H15" />
        <circle cx="18" cy="5" r="3" />
      </svg>
    )
  ),
  Record: ({ className }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <polygon points="10 8 16 12 10 16 10 8" fill="currentColor" />
    </svg>
  ),
  Community: ({ className, filled }: { className?: string; filled?: boolean }) => (
    filled ? (
      <svg className={className} viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 3.5c-4.69 0-8.5 3.81-8.5 8.5 0 1.64.47 3.17 1.28 4.47l-.84 2.87c-.13.44.27.84.71.71l2.87-.84c1.3.81 2.83 1.28 4.47 1.28 4.69 0 8.5-3.81 8.5-8.5S16.69 3.5 12 3.5z"/>
      </svg>
    ) : (
      <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
      </svg>
    )
  ),
  Profile: ({ className, filled }: { className?: string; filled?: boolean }) => (
    filled ? (
      <svg className={className} viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"/>
      </svg>
    ) : (
      <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
        <circle cx="12" cy="7" r="4" />
      </svg>
    )
  ),
};

// 导航项配置
const navItems: {
  label: string;
  tab: TabType;
  icon: ({ className, filled }: { className?: string; filled?: boolean }) => JSX.Element;
  isMain?: boolean;
}[] = [
  {
    label: "首页",
    tab: "home",
    icon: Icons.Home,
  },
  {
    label: "路线",
    tab: "routes",
    icon: Icons.Route,
  },
  {
    label: "",
    tab: "record",
    icon: Icons.Record,
    isMain: true,
  },
  {
    label: "社区",
    tab: "community",
    icon: Icons.Community,
  },
  {
    label: "我的",
    tab: "profile",
    icon: Icons.Profile,
  },
];

export function BottomNav() {
  const { activeTab, setActiveTab } = useAppStore();

  return (
    <nav
      className={cn(
        "fixed bottom-0 left-0 right-0 z-50",
        "bg-white/95 dark:bg-black/95 backdrop-blur-md border-t border-[#DBDBDB] dark:border-[#363636]",
        "transition-all duration-200",
        "pb-[env(safe-area-inset-bottom)]"
      )}
      role="navigation"
      aria-label="主导航"
    >
      <div className="flex items-center justify-around h-[50px] max-w-lg mx-auto px-4">
        {navItems.map((item) => {
          const isActive = activeTab === item.tab;
          const Icon = item.icon;

          // 主要操作按钮（中间的录制按钮）
          if (item.isMain) {
            return (
              <button
                key={item.tab}
                onClick={() => setActiveTab(item.tab)}
                className={cn(
                  "relative flex items-center justify-center",
                  "w-[48px] h-[48px] rounded-full",
                  "bg-gradient-to-br from-[#833AB4] via-[#E1306C] to-[#F56040]",
                  "shadow-lg shadow-[#E1306C]/30",
                  "transition-all duration-200",
                  "hover:shadow-xl hover:shadow-[#E1306C]/40 hover:scale-105",
                  "active:scale-95",
                  "-mt-5"
                )}
                aria-label="开始骑行"
              >
                <Icon className="w-6 h-6 text-white" />
              </button>
            );
          }

          // 普通导航项
          return (
            <button
              key={item.tab}
              onClick={() => setActiveTab(item.tab)}
              className={cn(
                "flex flex-col items-center justify-center",
                "min-w-[44px] h-[44px]",
                "transition-all duration-200",
                "rounded-lg",
              )}
              aria-label={item.label}
              aria-current={isActive ? "page" : undefined}
            >
              <Icon
                className={cn(
                  "w-6 h-6 transition-all duration-200",
                  isActive ? "text-[#262626] dark:text-white" : "text-[#262626]/60 dark:text-white/60"
                )}
                filled={isActive}
              />
              <span
                className={cn(
                  "text-[10px] mt-0.5 font-medium",
                  "transition-all duration-200",
                  isActive ? "text-[#262626] dark:text-white" : "text-[#8E8E8E]"
                )}
              >
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}

export default BottomNav;
