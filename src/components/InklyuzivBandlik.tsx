import React, { useState, useEffect } from "react";
import { Briefcase, Filter, PlusCircle, Send, Volume2, Building, Search, Sparkles } from "lucide-react";
import { JobRecord } from "../types";
import { useAccessibility } from "../context/AccessibilityContext";

export const InklyuzivBandlik: React.FC = () => {
  const { speakText } = useAccessibility();
  const [jobs, setJobs] = useState<JobRecord[]>([]);
  const [selectedAbility, setSelectedAbility] = useState<string>("all");
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"list" | "post">("list");

  // Yangi ish e'loni holati
  const [newTitle, setNewTitle] = useState("");
  const [newCategory, setNewCategory] = useState<"IT" | "Copywriting" | "Design" | "Translation" | "Voiceover" | "Support">("IT");
  const [newAbility, setNewAbility] = useState<"blind" | "deaf" | "mute" | "none" | "any">("any");
  const [newSalary, setNewSalary] = useState("Kelishuv asosida");
  const [newDesc, setNewDesc] = useState("");
  const [newContact] = useState("telegram: @[Admin_1]");

  const [applyingJob, setApplyingJob] = useState<JobRecord | null>(null);
  const [applicantNote, setApplicantNote] = useState("");
  const [appSubmitted, setAppSubmitted] = useState(false);

  const fetchJobs = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/jobs?ability=${selectedAbility}`);
      const data = await res.json();
      setJobs(data.jobs || []);
    } catch (err) {
      console.error("Fetch jobs error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, [selectedAbility]);

  const handlePostJob = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle || !newDesc) return;
    try {
      const res = await fetch("/api/jobs/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: newTitle,
          employer_name: "[Admin_1]",
          category: newCategory,
          required_ability: newAbility,
          salary_range: newSalary,
          description: newDesc,
          contact_info: newContact,
        }),
      });
      const data = await res.json();
      if (data.status === "success") {
        speakText(`Yangi frilanserlik vakansiyasi e'lon qilindi: ${newTitle}`);
        setNewTitle("");
        setNewDesc("");
        setActiveTab("list");
        fetchJobs();
      }
    } catch (err) {
      console.error("Post job error:", err);
    }
  };

  const handleApply = async () => {
    if (!applyingJob) return;
    try {
      const res = await fetch("/api/jobs/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          jobId: applyingJob.id,
          applicant_name: "[O'quvchi]",
        }),
      });
      const data = await res.json();
      if (data.status === "success") {
        setAppSubmitted(true);
        speakText("Vakansiyaga arizangiz muvaffaqiyatli yuborildi");
        setTimeout(() => {
          setApplyingJob(null);
          setAppSubmitted(false);
          fetchJobs();
        }, 1800);
      }
    } catch (err) {
      console.error("Apply job error:", err);
    }
  };

  const getAbilityLabel = (ability: string) => {
    switch (ability) {
      case "blind":
        return "👓 Ko'zi ojizlar uchun";
      case "deaf":
        return "👂 Eshitishda nuqsoni borlar uchun";
      case "mute":
        return "🗣️ Nutqida nuqsoni borlar uchun";
      case "any":
        return "🌟 Har qanday imkoniyatga mos";
      default:
        return "Barcha imkoniyatlar";
    }
  };

  return (
    <div role="region" aria-label="11-Modul: Inklyuziv Bandlik Markazi" className="space-y-6 bg-[#1E293B] border border-slate-700 rounded-2xl p-5 md:p-8 shadow-xl text-slate-100">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-slate-700 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-xs font-bold font-mono">
              11-Modul: Frilanserlik Markazi
            </span>
          </div>
          <h2 className="text-2xl font-extrabold text-white mt-1 flex items-center gap-2">
            <Briefcase className="w-7 h-7 text-emerald-400" aria-hidden="true" />
            Inklyuziv Bandlik va Frilanserlik Markazi
          </h2>
          <p className="text-sm text-slate-300 mt-1">
            Imkoniyat xususiyatiga moslashtirilgan masofaviy bo'sh ish o'rinlari birjasi.
          </p>
        </div>
        <div className="flex items-center gap-2 bg-slate-950 p-1.5 rounded-xl border border-slate-800">
          <button
            onClick={() => setActiveTab("list")}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
              activeTab === "list" ? "bg-emerald-500 text-slate-950 shadow" : "text-slate-300 hover:text-white"
            }`}
          >
            <Search className="w-4 h-4" />
            <span>Vakansiyalar ({jobs.length})</span>
          </button>
          <button
            onClick={() => setActiveTab("post")}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
              activeTab === "post" ? "bg-emerald-500 text-slate-950 shadow" : "text-slate-300 hover:text-white"
            }`}
          >
            <PlusCircle className="w-4 h-4" />
            <span>E'lon Joylash</span>
          </button>
        </div>
      </div>

      {activeTab === "list" && (
        <>
          <div className="flex flex-wrap items-center justify-between gap-3 bg-[#0F172A] p-3.5 rounded-xl border border-slate-700">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-300">
              <Filter className="w-4 h-4 text-emerald-400" />
              <span>Saralash:</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {[
                { id: "all", label: "Barchasi" },
                { id: "blind", label: "👓 Ko'zi ojiz" },
                { id: "deaf", label: "👂 Eshitishda nuqsoni bor" },
                { id: "any", label: "🌟 Masofaviy / Umumiy" },
              ].map((filter) => (
                <button
                  key={filter.id}
                  onClick={() => {
                    setSelectedAbility(filter.id);
                    speakText(`Filtr: ${filter.label}`);
                  }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition border ${
                    selectedAbility === filter.id
                      ? "bg-emerald-500/20 border-emerald-500 text-emerald-300 font-bold"
                      : "bg-[#1E293B] border-slate-700 text-slate-400 hover:text-slate-200"
                  }`}
                >
                  {filter.label}
                </button>
              ))}
            </div>
          </div>

          {isLoading ? (
            <div className="text-center py-12 text-slate-400 text-sm">Vakansiyalar yuklanmoqda...</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {jobs.map((job) => (
                <div key={job.id} className="bg-[#0F172A] border border-slate-700 rounded-xl p-5 space-y-3 flex flex-col justify-between">
                  <div className="space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="text-base font-bold text-white">{job.title}</h3>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#1E293B] border border-slate-700 text-[#38BDF8]">
                        {job.category}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-slate-400">
                      <span className="flex items-center gap-1">
                        <Building className="w-3.5 h-3.5" />
                        {job.employer_name}
                      </span>
                      <span className="text-emerald-400 font-bold">{job.salary_range}</span>
                    </div>
                    <div className="p-2 bg-[#1E293B] rounded text-xs text-amber-300">
                      {getAbilityLabel(job.required_ability)}
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed">{job.description}</p>
                  </div>
                  <div className="pt-3 border-t border-slate-700/80 flex items-center justify-between gap-2">
                    <button
                      onClick={() => {
                        const summary = `Vakansiya: ${job.title}. Ish beruvchi: ${job.employer_name}. Ish haqi: ${job.salary_range}. Tavsif: ${job.description}`;
                        speakText(summary, true);
                      }}
                      className="px-3 py-1.5 bg-[#1E293B] hover:bg-slate-700 text-slate-300 border border-slate-700 rounded-lg text-xs font-semibold flex items-center gap-1.5"
                    >
                      <Volume2 className="w-4 h-4 text-emerald-400" />
                      <span>Eshitish</span>
                    </button>
                    <button
                      onClick={() => setApplyingJob(job)}
                      className="px-4 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-lg text-xs flex items-center gap-1.5 shadow"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Ariza Topshirish</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {activeTab === "post" && (
        <form onSubmit={handlePostJob} className="bg-[#0F172A] border border-slate-700 rounded-xl p-6 space-y-4 max-w-2xl mx-auto">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <PlusCircle className="w-5 h-5 text-emerald-400" />
            Yangi Vakansiya Joylash
          </h3>
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-300">Vakansiya Nomi:</label>
            <input
              type="text"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="Masalan: Python Backend Dasturchi"
              required
              className="w-full bg-[#1E293B] border border-slate-700 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-emerald-500"
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300">Kategoriya:</label>
              <select
                value={newCategory}
                onChange={(e: any) => setNewCategory(e.target.value)}
                className="w-full bg-[#1E293B] border border-slate-700 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-emerald-500"
              >
                <option value="IT">IT va Dasturlash</option>
                <option value="Copywriting">Kopyrayting va Matn</option>
                <option value="Design">Grafik Dizayn</option>
                <option value="Voiceover">Audio va Ovozlashtirish</option>
                <option value="Translation">Tarjimonlik va Imo-ishora</option>
                <option value="Support">Qo'llab-quvvatlash xizmati</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300">Mos Imkoniyat Turi:</label>
              <select
                value={newAbility}
                onChange={(e: any) => setNewAbility(e.target.value)}
                className="w-full bg-[#1E293B] border border-slate-700 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-emerald-500"
              >
                <option value="any">Har qanday imkoniyatga mos</option>
                <option value="blind">Ko'zi ojizlar uchun</option>
                <option value="deaf">Eshitishda nuqsoni borlar uchun</option>
                <option value="mute">Nutqida nuqsoni borlar uchun</option>
              </select>
            </div>
          </div>
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-300">Ish Haqi:</label>
            <input
              type="text"
              value={newSalary}
              onChange={(e) => setNewSalary(e.target.value)}
              placeholder="Masalan: 4 000 000 UZS"
              className="w-full bg-[#1E293B] border border-slate-700 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-emerald-500"
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-300">Tavsif:</label>
            <textarea
              value={newDesc}
              onChange={(e) => setNewDesc(e.target.value)}
              rows={4}
              placeholder="Loyiha va mutaxassislar uchun yaratilgan sharoitlar..."
              required
              className="w-full bg-[#1E293B] border border-slate-700 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-emerald-500 resize-none"
            />
          </div>
          <button
            type="submit"
            className="w-full py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-lg text-xs flex items-center justify-center gap-2 shadow"
          >
            <Sparkles className="w-4 h-4" />
            <span>E'lonni Chop Etish</span>
          </button>
        </form>
      )}

      {applyingJob && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#1E293B] border border-slate-700 rounded-2xl p-6 max-w-md w-full space-y-4 shadow-2xl">
            {appSubmitted ? (
              <div className="text-center py-6 space-y-2">
                <h3 className="text-lg font-bold text-white">Arizangiz Qabul Qilindi!</h3>
                <p className="text-xs text-slate-300">Tez orada ish beruvchi siz bilan bog'lanadi.</p>
              </div>
            ) : (
              <>
                <h3 className="text-lg font-bold text-white">Ariza Topshirish</h3>
                <p className="text-xs text-slate-300">
                  <span className="font-bold text-[#38BDF8]">{applyingJob.title}</span> bo'yicha arizangiz{" "}
                  <span className="font-mono text-emerald-300">[O'quvchi]</span> nomidan yuboriladi.
                </p>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-300">Qo'shimcha Xabar:</label>
                  <textarea
                    value={applicantNote}
                    onChange={(e) => setApplicantNote(e.target.value)}
                    rows={3}
                    placeholder="O'zingiz haqida qisqacha ma'lumot..."
                    className="w-full bg-[#0F172A] border border-slate-700 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-emerald-500 resize-none"
                  />
                </div>
                <div className="flex items-center gap-2 pt-2">
                  <button
                    onClick={() => setApplyingJob(null)}
                    className="flex-1 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold rounded-lg text-xs"
                  >
                    Bekor qilish
                  </button>
                  <button
                    onClick={handleApply}
                    className="flex-1 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-lg text-xs shadow"
                  >
                    Yuborish
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
