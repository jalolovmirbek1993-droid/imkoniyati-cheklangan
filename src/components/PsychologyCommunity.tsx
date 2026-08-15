import React, { useState, useEffect } from "react";
import { Heart, Volume2, PlusCircle, Sparkles, UserCheck, ShieldCheck, Send, CheckCircle2, User } from "lucide-react";
import { StoryRecord, PsychConsultation } from "../types";
import { useAccessibility } from "../context/AccessibilityContext";

export const PsychologyCommunity: React.FC = () => {
  const { speakText } = useAccessibility();
  const [stories, setStories] = useState<StoryRecord[]>([]);
  const [, setConsultations] = useState<PsychConsultation[]>([]);
  const [activeTab, setActiveTab] = useState<"stories" | "consultation">("stories");
  const [isLoading, setIsLoading] = useState(true);

  const [newTitle, setNewTitle] = useState("");
  const [newContent, setNewContent] = useState("");
  const [newStatus, setNewStatus] = useState<"blind" | "deaf" | "mute" | "none">("blind");

  const [consultTopic, setConsultTopic] = useState("");
  const [isAnonymous, setIsAnonymous] = useState(true);
  const [bookingSuccess, setBookingSuccess] = useState(false);

  const fetchCommunityData = async () => {
    setIsLoading(true);
    try {
      const [resStories, resConsults] = await Promise.all([
        fetch("/api/stories"),
        fetch("/api/psychology/consultations"),
      ]);
      const dataStories = await resStories.json();
      const dataConsults = await resConsults.json();
      setStories(dataStories.stories || []);
      setConsultations(dataConsults.consultations || []);
    } catch (err) {
      console.error("Fetch community error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCommunityData();
  }, []);

  const handleCreateStory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle || !newContent) return;
    try {
      const res = await fetch("/api/stories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          author_name: "[Foydalanuvchi_1]",
          author_status: newStatus,
          title: newTitle,
          content: newContent,
        }),
      });
      const data = await res.json();
      if (data.status === "success") {
        speakText(`Yangi motivatsion hikoyangiz ulashildi: ${newTitle}`);
        setNewTitle("");
        setNewContent("");
        fetchCommunityData();
      }
    } catch (err) {
      console.error("Create story error:", err);
    }
  };

  const handleBookConsultation = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/psychology/consultations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          client_name: "[Foydalanuvchi_1]",
          topic: consultTopic,
          is_anonymous: isAnonymous,
        }),
      });
      const data = await res.json();
      if (data.status === "success") {
        setBookingSuccess(true);
        speakText("Psixolog maslahatiga so'rovingiz qabul qilindi");
        setTimeout(() => {
          setBookingSuccess(false);
          setConsultTopic("");
          fetchCommunityData();
        }, 2000);
      }
    } catch (err) {
      console.error("Book consult error:", err);
    }
  };

  return (
    <div role="region" aria-label="13-Modul: Psixologiya va Jamiyat Xonasi" className="space-y-6 bg-[#1E293B] border border-slate-700 rounded-2xl p-5 md:p-8 shadow-xl text-slate-100">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-slate-700 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/30 text-xs font-bold font-mono">
              13-Modul: Psixologiya va Jamiyat
            </span>
          </div>
          <h2 className="text-2xl font-extrabold text-white mt-1 flex items-center gap-2">
            <Heart className="w-7 h-7 text-rose-400" aria-hidden="true" />
            Psixologik Qo'llab-quvvatlash va Jamiyat Xonasi
          </h2>
          <p className="text-sm text-slate-300 mt-1">
            Motivatsion hayotiy tajribalar va psixologlar bilan anonim maslahatlashuv.
          </p>
        </div>
        <div className="flex items-center gap-2 bg-slate-950 p-1.5 rounded-xl border border-slate-800">
          <button
            onClick={() => setActiveTab("stories")}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
              activeTab === "stories" ? "bg-rose-500 text-slate-950 shadow" : "text-slate-300 hover:text-white"
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>Hayotiy Hikoyalar</span>
          </button>
          <button
            onClick={() => setActiveTab("consultation")}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
              activeTab === "consultation" ? "bg-rose-500 text-slate-950 shadow" : "text-slate-300 hover:text-white"
            }`}
          >
            <UserCheck className="w-4 h-4" />
            <span>Psixolog Maslahati</span>
          </button>
        </div>
      </div>

      {activeTab === "stories" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-7 space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-rose-400" />
              Motivatsiya va Hayotiy Tajribalar
            </h3>
            {isLoading ? (
              <p className="text-slate-400 text-sm">Hikoyalar yuklanmoqda...</p>
            ) : (
              stories.map((story) => (
                <div key={story.id} className="bg-[#0F172A] border border-slate-700 rounded-xl p-5 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#38BDF8] flex items-center gap-1">
                      <User className="w-3.5 h-3.5" />
                      {story.author_name}
                    </span>
                    <span className="text-[11px] text-slate-500">{story.created_at}</span>
                  </div>
                  <h4 className="text-base font-bold text-white">{story.title}</h4>
                  <p className="text-xs text-slate-300 leading-relaxed">{story.content}</p>
                  <div className="pt-3 border-t border-slate-700/80 flex items-center justify-between">
                    <button
                      onClick={() => speakText(`Hikoya muallifi: ${story.author_name}. Sarlavha: ${story.title}. Matn: ${story.content}`, true)}
                      className="px-3 py-1.5 bg-[#1E293B] hover:bg-slate-700 text-rose-300 border border-slate-700 rounded-lg text-xs font-semibold flex items-center gap-1.5"
                    >
                      <Volume2 className="w-4 h-4" />
                      <span>Ovozli Tinglash</span>
                    </button>
                    <button
                      onClick={() => {
                        story.likes += 1;
                        setStories([...stories]);
                      }}
                      className="px-3 py-1.5 bg-[#1E293B] hover:bg-slate-700 text-rose-400 rounded-lg text-xs font-bold flex items-center gap-1"
                    >
                      <Heart className="w-4 h-4 fill-rose-500" />
                      <span>{story.likes}</span>
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="lg:col-span-5 bg-[#0F172A] border border-slate-700 rounded-xl p-5 space-y-4 h-fit">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <PlusCircle className="w-5 h-5 text-rose-400" />
              O'z Tajribangizni Ulashing
            </h3>
            <form onSubmit={handleCreateStory} className="space-y-3">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300">Sarlavha:</label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="Masalan: To'siqlardan qo'rqmang"
                  required
                  className="w-full bg-[#1E293B] border border-slate-700 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-rose-500"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300">Statusingiz:</label>
                <select
                  value={newStatus}
                  onChange={(e: any) => setNewStatus(e.target.value)}
                  className="w-full bg-[#1E293B] border border-slate-700 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-rose-500"
                >
                  <option value="blind">Ko'zi ojiz</option>
                  <option value="deaf">Eshitishda nuqsoni bor</option>
                  <option value="mute">Nutqida nuqsoni bor</option>
                  <option value="none">Ko'ngilli / Ustoz</option>
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300">Matn:</label>
                <textarea
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  rows={4}
                  placeholder="Boshqalarga ruh va motivatsiya beruvchi hayotiy hikoyangiz..."
                  required
                  className="w-full bg-[#1E293B] border border-slate-700 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-rose-500 resize-none"
                />
              </div>
              <button
                type="submit"
                className="w-full py-2.5 bg-rose-500 hover:bg-rose-400 text-slate-950 font-bold rounded-lg text-xs flex items-center justify-center gap-2 shadow"
              >
                <Send className="w-4 h-4" />
                <span>Chop Etish</span>
              </button>
            </form>
          </div>
        </div>
      )}

      {activeTab === "consultation" && (
        <div className="max-w-2xl mx-auto space-y-6">
          <div className="bg-[#0F172A] border border-slate-700 rounded-xl p-6 space-y-4">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <ShieldCheck className="w-6 h-6 text-emerald-400" />
              Sertifikatlangan Psixolog Bilan Anonim Bog'lanish
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Mutaxassis psixologlarimiz imkoniyati cheklangan shaxslar bilan ishlash bo'yicha maxsus tayyorgarlikka ega.
            </p>

            {bookingSuccess ? (
              <div className="p-6 bg-emerald-500/10 border border-emerald-500/40 rounded-xl text-center space-y-2">
                <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto" />
                <h4 className="text-base font-bold text-white">So'rovingiz Biriktirildi!</h4>
                <p className="text-xs text-slate-300">
                  Psixolog <span className="font-bold text-emerald-300">Dr. [Psixolog_1]</span> siz bilan tez orada bog'lanadi.
                </p>
              </div>
            ) : (
              <form onSubmit={handleBookConsultation} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-300">Murojaat Mavzusi:</label>
                  <textarea
                    value={consultTopic}
                    onChange={(e) => setConsultTopic(e.target.value)}
                    rows={3}
                    placeholder="Sizni bezovta qilayotgan masala haqida yozing..."
                    required
                    className="w-full bg-[#1E293B] border border-slate-700 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-rose-500 resize-none"
                  />
                </div>
                <div className="flex items-center gap-3 bg-[#1E293B] p-3 rounded-lg border border-slate-700">
                  <input
                    type="checkbox"
                    id="anonCheck"
                    checked={isAnonymous}
                    onChange={(e) => setIsAnonymous(e.target.checked)}
                    className="w-4 h-4 accent-rose-500 rounded"
                  />
                  <label htmlFor="anonCheck" className="text-xs font-medium text-slate-200 cursor-pointer">
                    Murojaatni mutlaqo anonim tarzda yuborish
                  </label>
                </div>
                <button
                  type="submit"
                  className="w-full py-3 bg-rose-500 hover:bg-rose-400 text-slate-950 font-bold rounded-lg text-xs flex items-center justify-center gap-2 shadow"
                >
                  <UserCheck className="w-4 h-4" />
                  <span>Psixolog So'rovini Yuborish</span>
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
