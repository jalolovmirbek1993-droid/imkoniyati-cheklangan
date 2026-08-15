import React from "react";
import { useAccessibility } from "../context/AccessibilityContext";
import {
  MessageSquare,
  BookOpen,
  Volume2,
  Hand,
  Sparkles,
  Sun,
  Eye,
  Type,
  Rss,
  Camera,
  Briefcase,
  Heart,
  Award,
} from "lucide-react";

export type NavTab =
  | "chat"
  | "lenta"
  | "tayyorlov"
  | "ishora"
  | "ai-tutor"
  | "cv-sign"
  | "bandlik"
  | "live-assist"
  | "psixologiya"
  | "imtihon";

interface NavbarProps {
  activeTab: NavTab;
  setActiveTab: (tab: NavTab) => void;
  userName: string;
  isWsConnected: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({ activeTab, setActiveTab, userName, isWsConnected }) => {
  const { settings, setContrastTheme, setFontSize, toggleScreenReader, speakText } = useAccessibility();

  const handleTabChange = (tab: NavTab, label: string) => {
    setActiveTab(tab);
    speakText(`${label} bo'limiga o'tildi`);
  };

  return (
    <header
      role="banner"
      aria-label="Asosiy Navigatsiya Boshqaruvi"
      className="sticky top-0 z-40 w-full border-b border-slate-700 bg-[#1E293B] shadow-lg transition-colors"
    >
      {/* Tezkor Inklyuzivlik Paneli */}
      <div
        role="region"
        aria-label="Tezkor Sozlamalar"
        className="w-full bg-[#0F172A] px-6 py-2 text-xs border-b border-slate-800 flex flex-wrap items-center justify-between gap-3"
      >
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-2 font-medium text-slate-300" role="status">
            <span
              className={`h-2.5 w-2.5 rounded-full ${isWsConnected ? "bg-emerald-400 animate-pulse" : "bg-amber-400"}`}
              aria-hidden="true"
            />
            <span className="font-semibold text-slate-200">
              WebSocket: {isWsConnected ? "Onlayn" : "Ulanmoqda..."}
            </span>
          </span>
          <span className="text-slate-600">|</span>
          <span
            className="px-2.5 py-1 rounded bg-[#1E293B] border border-slate-700 text-[#38BDF8] font-mono font-semibold"
            role="status"
          >
            Siz: {userName}
          </span>
        </div>

        <div className="flex items-center flex-wrap gap-2" role="group" aria-label="Ekran va Ovoz sozlamalari">
          {/* Kontrast Rejimi */}
          <div className="flex items-center gap-1 bg-[#1E293B] p-1 rounded-md border border-slate-700">
            <button
              onClick={() => {
                const nextTheme = settings.contrastTheme === "slate-dark" ? "yellow-black" : "slate-dark";
                setContrastTheme(nextTheme);
                speakText(nextTheme === "yellow-black" ? "Sariq va qora kontrast yoqildi" : "Standard rejim yoqildi");
              }}
              aria-label="Kontrast rejimini o'zgartirish"
              className={`px-2.5 py-1 rounded text-xs font-semibold transition flex items-center gap-1 ${
                settings.contrastTheme === "yellow-black"
                  ? "bg-amber-400 text-slate-900 font-bold"
                  : "text-slate-300 hover:text-white"
              }`}
            >
              <Eye className="w-3.5 h-3.5" aria-hidden="true" />
              Kontrast
            </button>
            <button
              onClick={() => {
                setContrastTheme("high-light");
                speakText("Yorug' kontrast rejimi yoqildi");
              }}
              aria-label="Yorug' rejim"
              className={`px-2.5 py-1 rounded text-xs transition ${
                settings.contrastTheme === "high-light"
                  ? "bg-slate-200 text-slate-950 font-bold"
                  : "text-slate-300 hover:text-white"
              }`}
            >
              <Sun className="w-3.5 h-3.5" aria-hidden="true" />
              Yorug'
            </button>
          </div>

          {/* Shrift Masshtabi */}
          <div className="flex items-center gap-1 bg-[#1E293B] p-1 rounded-md border border-slate-700" role="group">
            <Type className="w-3.5 h-3.5 text-slate-400 ml-1" aria-hidden="true" />
            <button
              onClick={() => setFontSize("normal")}
              className={`px-2 py-0.5 text-xs rounded ${settings.fontSize === "normal" ? "bg-[#334155] font-bold text-white" : "text-slate-400"}`}
            >
              A
            </button>
            <button
              onClick={() => setFontSize("large")}
              className={`px-2 py-0.5 text-sm rounded ${settings.fontSize === "large" ? "bg-[#334155] font-bold text-white" : "text-slate-400"}`}
            >
              A+
            </button>
            <button
              onClick={() => setFontSize("extra-large")}
              className={`px-2 py-0.5 text-base rounded ${settings.fontSize === "extra-large" ? "bg-[#334155] font-bold text-white" : "text-slate-400"}`}
            >
              A++
            </button>
          </div>

          {/* Narrator (Ovozli Ekran O'quvchi) */}
          <button
            onClick={() => toggleScreenReader()}
            aria-pressed={settings.screenReaderEnabled}
            className={`px-3 py-1 rounded-md flex items-center gap-1.5 text-xs transition font-bold border ${
              settings.screenReaderEnabled
                ? "bg-emerald-500/20 border-emerald-500 text-emerald-300"
                : "bg-[#1E293B] border-slate-700 text-slate-300 hover:text-white"
            }`}
          >
            <Volume2 className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Narrator {settings.screenReaderEnabled ? "Faol" : "O'chiq"}</span>
          </button>
        </div>
      </div>

      {/* Asosiy Navigatsiya Menyusi */}
      <div className="max-w-7xl mx-auto px-6 py-3.5 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[#38BDF8] rounded-lg flex items-center justify-center text-[#0F172A] font-bold text-xl shadow" aria-hidden="true">
            AI
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-slate-100">Inklyuziv Muloqot Platformasi</h1>
            <p className="text-xs text-slate-400 font-medium">
              100% Onlayn real-vaqt muloqot va <span className="text-[#38BDF8] font-semibold">Tayyorlov kurslari</span>
            </p>
          </div>
        </div>

        <nav role="navigation" aria-label="Bo'limlar" className="flex items-center gap-2 flex-wrap">
          {[
            { id: "chat", label: "Real-Vaqt Chat", icon: MessageSquare },
            { id: "lenta", label: "Ijtimoiy Lenta", icon: Rss },
            { id: "tayyorlov", label: "Tayyorlov Kurslari", icon: BookOpen },
            { id: "ishora", label: "Ishora Lug'ati", icon: Hand },
            { id: "ai-tutor", label: "[AI_O'qituvchi]", icon: Sparkles },
            { id: "cv-sign", label: "CV Imo-ishora", icon: Camera },
            { id: "bandlik", label: "Ish Bor", icon: Briefcase },
            { id: "live-assist", label: "Mening Ko'zim", icon: Eye },
            { id: "psixologiya", label: "Psixologiya", icon: Heart },
            { id: "imtihon", label: "Imtihon Markazi", icon: Award },
          ].map((tab) => {
            const Icon = tab.icon;
            const isCurrent = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => handleTabChange(tab.id as NavTab, tab.label)}
                role="tab"
                aria-selected={isCurrent}
                className={`px-3.5 py-2 rounded-lg flex items-center gap-2 text-xs font-semibold transition-all ${
                  isCurrent
                    ? "bg-[#38BDF8] text-slate-950 font-bold shadow-[0_0_15px_rgba(56,189,248,0.2)]"
                    : "bg-[#0F172A] text-slate-300 border border-slate-700 hover:border-slate-600 hover:text-white"
                }`}
              >
                <Icon className="w-4 h-4" aria-hidden="true" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
};
