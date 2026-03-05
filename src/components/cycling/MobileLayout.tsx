"use client";

import * as React from "react";
import { BottomNav } from "./BottomNav";

interface MobileLayoutProps {
  children: React.ReactNode;
  /** 是否显示底部导航，默认 true */
  showBottomNav?: boolean;
  /** 是否启用移动端最大宽度限制，默认 true */
  constrainWidth?: boolean;
  /** 自定义类名 */
  className?: string;
}

/**
 * 移动端主布局组件
 * - 响应式设计，移动端优先
 * - 自动适配底部导航栏高度
 * - 支持安全区域（刘海屏、底部横条）
 */
export function MobileLayout({
  children,
  showBottomNav = true,
  constrainWidth = true,
  className,
}: MobileLayoutProps) {
  return (
    <div
      className={cn(
        "min-h-screen bg-background",
        // 底部导航栏的高度适配
        showBottomNav && "pb-[calc(4rem+env(safe-area-inset-bottom))]",
        constrainWidth && "max-w-lg mx-auto",
        "relative",
        className
      )}
    >
      {/* 主内容区域 */}
      <main className="flex flex-col min-h-full">
        {children}
      </main>

      {/* 底部导航栏 */}
      {showBottomNav && <BottomNav />}
    </div>
  );
}

// 工具函数：合并类名
function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}

export default MobileLayout;
