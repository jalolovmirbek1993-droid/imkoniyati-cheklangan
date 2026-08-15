import React, { useState, useEffect } from "react";
import { Volume2, Send, Heart, Sparkles, MessageSquare, Tag } from "lucide-react";
import { useAccessibility } from "../context/AccessibilityContext";
import { PostRecord } from "../types";

export const SocialFeed: React.FC = () => {
  const { speakText } = useAccessibility();
  const [posts, setPosts] = useState<PostRecord[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [newPostText, setNewPostText] = useState<string>("");
  const [newMediaUrl, setNewMediaUrl] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const fetchPosts = async () => {
    try {
      setIsLoading(true);
      const res = await fetch("/api/posts");
      if (res.ok) {
        const data = await res.json();
        setPosts(data.posts || []);
      }
    } catch (err) {
      console.error("Error fetching posts:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPostText.trim() && !newMediaUrl.trim()) return;
    try {
      setIsSubmitting(true);
      const res = await fetch("/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          author_name: "[O'quvchi]",
          text_content: newPostText,
          media_url: newMediaUrl,
        }),
      });
      if (res.ok) {
        setNewPostText("");
        setNewMediaUrl("");
        speakText("Yangi post va AI Alt Text yaratildi");
        await fetchPosts();
      }
    } catch (err) {
      console.error("Post creation error:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="bg-[#1E293B] border border-slate-700 rounded-2xl p-6 shadow-2xl space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0F172A] border border-slate-700 text-[#38BDF8] text-xs font-bold uppercase">
          <Sparkles className="w-4 h-4 text-[#38BDF8]" />
          Ijtimoiy Lenta va AI Tasvir Bayoni (Alt Text)
        </div>
        <h2 className="text-2xl font-bold text-slate-100">Inklyuziv Ijtimoiy Tarmoq</h2>
        <p className="text-xs md:text-sm text-slate-300">
          Joylangan rasmlar uchun AI avtomatik <strong className="text-[#38BDF8]">ai_alt_text</strong> yaratadi va ovozli o'qib beradi.
        </p>
      </div>

      <div className="bg-[#1E293B] border border-slate-700 rounded-2xl p-6 shadow-xl space-y-4">
        <h3 className="text-sm font-bold text-slate-200 uppercase flex items-center gap-2">
          <MessageSquare className="w-4 h-4 text-[#38BDF8]" />
          Yangi Post Ulashish
        </h3>
        <form onSubmit={handleCreatePost} className="space-y-3">
          <textarea
            value={newPostText}
            onChange={(e) => setNewPostText(e.target.value)}
            placeholder="Fikringiz yoki yangiligingizni yozing..."
            rows={3}
            className="w-full bg-[#0F172A] border border-slate-700 rounded-xl p-3 text-xs md:text-sm text-slate-100 focus:outline-none focus:border-[#38BDF8] resize-none"
          />
          <div className="flex flex-col sm:flex-row gap-2">
            <input
              type="url"
              value={newMediaUrl}
              onChange={(e) => setNewMediaUrl(e.target.value)}
              placeholder="Rasm havolasi (masalan: https://...)"
              className="flex-1 bg-[#0F172A] border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-[#38BDF8]"
            />
            <button
              type="submit"
              disabled={isSubmitting || (!newPostText.trim() && !newMediaUrl.trim())}
              className="px-6 py-2.5 rounded-xl bg-[#38BDF8] text-slate-950 font-bold text-xs flex items-center justify-center gap-2 hover:bg-[#0284c7] disabled:opacity-40"
            >
              <Send className="w-4 h-4" />
              <span>{isSubmitting ? "Joylanmoqda..." : "Ulashish"}</span>
            </button>
          </div>
        </form>
      </div>

      <div className="space-y-4" role="feed">
        {isLoading ? (
          <div className="p-8 text-center text-slate-400 text-xs animate-pulse">Lenta yuklanmoqda...</div>
        ) : (
          posts.map((post) => (
            <article key={post.id} className="bg-[#1E293B] border border-slate-700 rounded-2xl p-6 shadow-xl space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-[#38BDF8]/20 border border-[#38BDF8]/50 flex items-center justify-center text-[#38BDF8] font-bold text-xs">
                    {post.author_name.substring(1, 3).toUpperCase()}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-100">{post.author_name}</h4>
                    <span className="text-[11px] text-slate-400">{post.created_at}</span>
                  </div>
                </div>
              </div>

              {post.text_content && (
                <p className="text-xs md:text-sm text-slate-200 leading-relaxed">{post.text_content}</p>
              )}

              {post.media_url && (
                <div className="space-y-2">
                  <div className="rounded-xl overflow-hidden border border-slate-700 bg-[#0F172A] max-h-96">
                    <img src={post.media_url} alt={post.ai_alt_text || post.text_content} className="w-full h-full object-cover" />
                  </div>
                  {post.ai_alt_text && (
                    <div className="bg-[#0F172A] border border-slate-700 rounded-xl p-3 flex items-start justify-between gap-3">
                      <div className="space-y-1">
                        <div className="flex items-center gap-1 text-amber-400 text-xs font-bold uppercase">
                          <Tag className="w-3.5 h-3.5" />
                          <span>AI Tasvir Bayoni:</span>
                        </div>
                        <p className="text-xs text-slate-300 italic">"{post.ai_alt_text}"</p>
                      </div>
                      <button
                        onClick={() => speakText(`Post tasvir bayoni: ${post.ai_alt_text}`, true)}
                        className="px-3 py-1.5 rounded-lg bg-[#38BDF8]/10 text-[#38BDF8] border border-[#38BDF8]/30 hover:bg-[#38BDF8]/20 text-xs font-semibold flex items-center gap-1.5 shrink-0"
                      >
                        <Volume2 className="w-3.5 h-3.5" />
                        <span>Eshitish</span>
                      </button>
                    </div>
                  )}
                </div>
              )}

              <div className="pt-3 border-t border-slate-700/60 flex items-center justify-between text-xs text-slate-400">
                <div className="flex items-center gap-1.5">
                  <Heart className="w-4 h-4 text-rose-400" />
                  <span>{post.likes_count || 0} yoqdi</span>
                </div>
                <button
                  onClick={() => speakText(`Post muallifi: ${post.author_name}. Matn: ${post.text_content}. Tasvir: ${post.ai_alt_text || 'Rasm yoq'}`)}
                  className="text-slate-300 hover:text-[#38BDF8] underline font-medium"
                >
                  To'liq postni eshitish
                </button>
              </div>
            </article>
          ))
        )}
      </div>
    </div>
  );
};
