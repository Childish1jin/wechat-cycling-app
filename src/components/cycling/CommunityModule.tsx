"use client";

import { useEffect, useState } from "react";
import { useAppStore } from "@/lib/store";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Heart, MessageCircle, Send, Bookmark, Plus, Image, X, MoreHorizontal } from "lucide-react";

interface Post {
  id: string;
  title: string;
  content: string;
  images: string | null;
  type: string;
  viewCount: number;
  likeCount: number;
  createdAt: string;
  author: { id: string; name: string | null; avatar: string | null; };
}

const postTypeConfig: Record<string, { label: string; emoji: string }> = {
  ride_share: { label: "骑行分享", emoji: "🚴" },
  challenge: { label: "挑战", emoji: "🏆" },
  question: { label: "求助", emoji: "❓" },
  discussion: { label: "讨论", emoji: "💬" },
};

export function CommunityModule() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedType, setSelectedType] = useState<string>("all");
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [likedPosts, setLikedPosts] = useState<Set<string>>(new Set());

  useEffect(() => { fetchPosts(); }, [selectedType]);

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (selectedType !== "all") params.append("type", selectedType);
      params.append("limit", "20");
      const res = await fetch(`/api/posts?${params.toString()}`);
      const data = await res.json();
      if (data.success && data.data) setPosts(data.data.list || []);
    } catch (error) { console.error("Failed to fetch posts:", error); setPosts([]); }
    finally { setLoading(false); }
  };

  const handleLike = async (postId: string) => {
    setLikedPosts(prev => {
      const newSet = new Set(prev);
      if (newSet.has(postId)) newSet.delete(postId);
      else newSet.add(postId);
      return newSet;
    });
    setPosts(posts.map(post => post.id === postId ? { ...post, likeCount: likedPosts.has(postId) ? post.likeCount - 1 : post.likeCount + 1 } : post));
    try { await fetch(`/api/posts/${postId}/like`, { method: "POST" }); }
    catch (error) { console.error("Failed to like post:", error); }
  };

  const formatTime = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    if (diffMinutes < 60) return `${diffMinutes}分钟前`;
    if (diffMinutes < 24 * 60) return `${Math.floor(diffMinutes / 60)}小时前`;
    if (diffMinutes < 7 * 24 * 60) return `${Math.floor(diffMinutes / (24 * 60))}天前`;
    return `${date.getMonth() + 1}月${date.getDate()}日`;
  };

  const getTypeConfig = (type: string) => postTypeConfig[type] || postTypeConfig.discussion;

  return (
    <div className="min-h-screen bg-white dark:bg-black pb-24">
      <header className="sticky top-0 z-20 bg-white dark:bg-black border-b border-[#DBDBDB] dark:border-[#363636]">
        <div className="flex items-center justify-between px-4 py-3">
          <h1 className="text-xl font-bold bg-gradient-to-r from-[#833AB4] via-[#E1306C] to-[#F56040] bg-clip-text text-transparent">骑行社区</h1>
          <Button size="sm" className="bg-gradient-to-r from-[#833AB4] to-[#E1306C] text-white border-0 rounded-lg font-semibold" onClick={() => setShowCreateDialog(true)}>
            <Plus className="w-4 h-4 mr-1" />发布
          </Button>
        </div>
        <div className="flex gap-2 overflow-x-auto px-4 pb-3 hide-scrollbar">
          <button onClick={() => setSelectedType("all")} className={`flex-shrink-0 px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${selectedType === "all" ? "bg-[#262626] dark:bg-white text-white dark:text-black" : "bg-[#EFEFEF] dark:bg-[#262626] text-[#262626] dark:text-white"}`}>全部</button>
          {Object.entries(postTypeConfig).map(([key, config]) => (
            <button key={key} onClick={() => setSelectedType(key)} className={`flex-shrink-0 px-4 py-1.5 rounded-full text-sm font-medium transition-colors flex items-center gap-1 ${selectedType === key ? "bg-[#262626] dark:bg-white text-white dark:text-black" : "bg-[#EFEFEF] dark:bg-[#262626] text-[#262626] dark:text-white"}`}>
              <span>{config.emoji}</span>{config.label}
            </button>
          ))}
        </div>
      </header>

      <div className="divide-y divide-[#DBDBDB] dark:divide-[#262626]">
        {loading ? (
          <div className="space-y-4 p-4">{[1, 2, 3].map((i) => (<div key={i} className="animate-pulse"><div className="flex items-center gap-2 mb-3"><div className="w-8 h-8 rounded-full bg-[#EFEFEF] dark:bg-[#262626]" /><div className="h-4 w-24 bg-[#EFEFEF] dark:bg-[#262626] rounded" /></div><div className="aspect-square bg-[#EFEFEF] dark:bg-[#262626] rounded-lg" /></div>))}</div>
        ) : posts.length === 0 ? (
          <div className="p-8 text-center">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#833AB4] to-[#E1306C] mx-auto mb-3 flex items-center justify-center">
              <MessageCircle className="w-8 h-8 text-white" />
            </div>
            <p className="text-[#262626] dark:text-white font-semibold">暂无帖子</p>
            <p className="text-sm text-[#8E8E8E] mt-1">发布第一个帖子吧！</p>
          </div>
        ) : (
          posts.map((post) => {
            const typeConfig = getTypeConfig(post.type);
            const isLiked = likedPosts.has(post.id);
            return (
              <article key={post.id} className="py-3">
                <div className="flex items-center justify-between px-4 mb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#833AB4] to-[#E1306C] p-[2px]">
                      <div className="w-full h-full rounded-full bg-white dark:bg-black flex items-center justify-center">
                        <span className="text-xs">{typeConfig.emoji}</span>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-[#262626] dark:text-white">{post.author.name || "骑行爱好者"}</p>
                      <p className="text-[10px] text-[#8E8E8E]">{formatTime(post.createdAt)}</p>
                    </div>
                  </div>
                  <button className="text-[#262626] dark:text-white"><MoreHorizontal className="w-5 h-5" /></button>
                </div>
                <div className="px-4 mb-3">
                  <h3 className="font-semibold text-[#262626] dark:text-white mb-1">{post.title}</h3>
                  <p className="text-sm text-[#262626] dark:text-white/90">{post.content}</p>
                </div>
                <div className="px-4 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <button onClick={() => handleLike(post.id)} className="transition-transform active:scale-125">
                      <Heart className={`w-6 h-6 transition-colors ${isLiked ? 'text-[#ED4956] fill-[#ED4956]' : 'text-[#262626] dark:text-white'}`} />
                    </button>
                    <button><MessageCircle className="w-6 h-6 text-[#262626] dark:text-white" /></button>
                    <button><Send className="w-6 h-6 text-[#262626] dark:text-white" /></button>
                  </div>
                  <button><Bookmark className="w-6 h-6 text-[#262626] dark:text-white" /></button>
                </div>
                <div className="px-4 mt-2">
                  <p className="text-sm font-semibold text-[#262626] dark:text-white">{post.likeCount + (isLiked ? 1 : 0)} 次赞</p>
                </div>
              </article>
            );
          })
        )}
      </div>

      {showCreateDialog && <CreatePostDialog onClose={() => { setShowCreateDialog(false); fetchPosts(); }} />}
    </div>
  );
}

function CreatePostDialog({ onClose }: { onClose: () => void }) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [type, setType] = useState("ride_share");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!title.trim() || !content.trim()) return;
    setLoading(true);
    try {
      const res = await fetch("/api/posts", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ title, content, type }) });
      const data = await res.json();
      if (data.success) onClose();
    } catch (error) { console.error("Failed to create post:", error); }
    finally { setLoading(false); }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50" onClick={onClose}>
      <Card className="w-full max-w-lg rounded-t-3xl rounded-b-none bg-white dark:bg-black border-t border-[#DBDBDB] dark:border-[#363636] max-h-[80vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-[#262626] dark:text-white">发布动态</h2>
            <Button variant="ghost" size="sm" onClick={onClose} className="text-[#262626] dark:text-white"><X className="w-5 h-5" /></Button>
          </div>
          <div className="space-y-4">
            <div>
              <label className="text-xs font-medium text-[#262626] dark:text-white mb-1 block">动态类型</label>
              <div className="flex gap-2 flex-wrap">
                {Object.entries(postTypeConfig).map(([key, config]) => (
                  <button key={key} onClick={() => setType(key)} className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1 ${type === key ? "bg-[#262626] dark:bg-white text-white dark:text-black" : "bg-[#EFEFEF] dark:bg-[#262626] text-[#262626] dark:text-white"}`}>
                    <span>{config.emoji}</span>{config.label}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="text-xs font-medium text-[#262626] dark:text-white mb-1 block">标题 *</label>
              <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="给你的动态起个标题..." className="h-11 bg-[#FAFAFA] dark:bg-[#121212] border-[#DBDBDB] dark:border-[#363636] rounded-lg" />
            </div>
            <div>
              <label className="text-xs font-medium text-[#262626] dark:text-white mb-1 block">内容 *</label>
              <textarea value={content} onChange={(e) => setContent(e.target.value)} placeholder="分享你的骑行故事..." className="w-full h-32 px-4 py-3 rounded-xl border border-[#DBDBDB] dark:border-[#363636] bg-[#FAFAFA] dark:bg-[#121212] text-[#262626] dark:text-white resize-none focus:outline-none focus:ring-2 focus:ring-[#E1306C]" />
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" className="flex items-center gap-1 rounded-lg border-[#DBDBDB] dark:border-[#363636]"><Image className="w-4 h-4" />添加图片</Button>
            </div>
            <Button className="w-full h-11 bg-gradient-to-r from-[#833AB4] to-[#E1306C] text-white font-semibold rounded-lg" onClick={handleSubmit} disabled={loading || !title.trim() || !content.trim()}>
              {loading ? "发布中..." : "发布动态"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
