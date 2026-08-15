import React, { useState, useEffect } from "react";
import { PlusCircle, BookOpen, Users, Briefcase, Award, Sparkles, CheckCircle2 } from "lucide-react";
import { useAccessibility } from "../context/AccessibilityContext";

export const AdminPanel: React.FC = () => {
  const { speakText } = useAccessibility();
  const [courseTitle, setCourseTitle] = useState("");
  const [courseDesc, setCourseDesc] = useState("");
  const [courseCategory, setCourseCategory] = useState<"IT" | "Languages" | "Sign_Language">("IT");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  const handleAddCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!courseTitle || !courseDesc) return;
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/admin/add_course", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: courseTitle,
          description: courseDesc,
          category: courseCategory,
          author: "[Admin_1]",
        }),
      });
      const data = await res.json();
      if (data.status === "success") {
        setSuccessMsg(`Yangi Tayyorlov kursi yuklandi: ${courseTitle}`);
        speakText(`Yangi Tayyorlov kursi tizimga qo'shildi: ${courseTitle}`);
        setCourseTitle("");
        setCourseDesc("");
        setTimeout(() => setSuccessMsg(""), 3000);
      }
    } catch (err) {
      console.error("Admin add course error:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div role="region" aria-label="Administrator va Kurslar Boshqaruv Paneli" className="space-y-6 max-w-4xl mx-auto">
      <div className="bg-[#1E293B] border border-slate-700 rounded-2xl p-6 shadow-2xl space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0F172A] border border-slate-700 text-amber-400 text-xs font-bold uppercase">
          <Sparkles className="w-4 h-4 text-amber-400" />
          Tizim Boshqaruvi
        </div>
        <h2 className="text-2xl font-bold text-slate-100">Tayyorlov Kurslari va Modullarni Boshqarish</h2>
        <p className="text-xs text-slate-300">
          Administratorlar uchun yangi o'quv modullari qo'shish va inklyuziv ta'lim statistikasini ko'rish bo'limi.
        </p>
      </div>

      {/* Statistika Kartochkalari */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-[#0F172A] border border-slate-700 rounded-xl p-4 flex items-center gap-3">
          <div className="p-3 bg-[#38BDF8]/10 rounded-lg text-[#38BDF8]">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-slate-400 font-bold">Faol Kurslar</span>
            <h4 className="text-lg font-bold text-white">4 ta Modul</h4>
          </div>
        </div>
        <div className="bg-[#0F172A] border border-slate-700 rounded-xl p-4 flex items-center gap-3">
          <div className="p-3 bg-emerald-500/10 rounded-lg text-emerald-400">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-slate-400 font-bold">O'quvchilar</span>
            <h4 className="text-lg font-bold text-white">120+ Faol</h4>
          </div>
        </div>
        <div className="bg-[#0F172A] border border-slate-700 rounded-xl p-4 flex items-center gap-3">
          <div className="p-3 bg-amber-400/10 rounded-lg text-amber-400">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-slate-400 font-bold">Sertifikatlar</span>
            <h4 className="text-lg font-bold text-white">85 Berilgan</h4>
          </div>
        </div>
      </div>

      {/* Yangi Kurs Qo'shish Formasi */}
      <div className="bg-[#1E293B] border border-slate-700 rounded-2xl p-6 shadow-xl space-y-4">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <PlusCircle className="w-5 h-5 text-[#38BDF8]" />
          Yangi Tayyorlov Kursi Qo'shish
        </h3>

        {successMsg && (
          <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl flex items-center gap-2 text-xs text-emerald-300 font-bold">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>{successMsg}</span>
          </div>
        )}

        <form onSubmit={handleAddCourse} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-300">Kurs Sarlavhasi (Tayyorlov):</label>
            <input
              type="text"
              value={courseTitle}
              onChange={(e) => setCourseTitle(e.target.value)}
              placeholder="Masalan: Web Dasturlash Boshlang'ich Tayyorlov Kursi"
              required
              className="w-full bg-[#0F172A] border border-slate-700 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-[#38BDF8]"
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-300">Kategoriya:</label>
            <select
              value={courseCategory}
              onChange={(e: any) => setCourseCategory(e.target.value)}
              className="w-full bg-[#0F172A] border border-slate-700 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-[#38BDF8]"
            >
              <option value="IT">IT va Raqamli Texnologiyalar</option>
              <option value="Sign_Language">Ishora Tili va Muloqot</option>
              <option value="Languages">Tillar va Grammatika</option>
            </select>
          </div>
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-300">Kurs Tavsifi:</label>
            <textarea
              value={courseDesc}
              onChange={(e) => setCourseDesc(e.target.value)}
              rows={3}
              placeholder="Kursning maqsadli auditoriyasi va ta'lim mazmuni haqida..."
              required
              className="w-full bg-[#0F172A] border border-slate-700 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-[#38BDF8] resize-none"
            />
          </div>
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 bg-[#38BDF8] hover:bg-[#0284c7] disabled:opacity-50 text-slate-950 font-bold rounded-lg text-xs flex items-center justify-center gap-2 shadow"
          >
            <PlusCircle className="w-4 h-4" />
            <span>{isSubmitting ? "Yuklanmoqda..." : "Kursni Saqlash va Faollashtirish"}</span>
          </button>
        </form>
      </div>
    </div>
  );
};
