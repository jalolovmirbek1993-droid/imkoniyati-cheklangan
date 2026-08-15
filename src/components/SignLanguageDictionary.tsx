import React, { useState } from "react";
import { SIGN_DICTIONARY } from "../data/tayyorlovCoursesData";
import { useAccessibility } from "../context/AccessibilityContext";
import { Hand, Search, Volume2, Sparkles, Wand2 } from "lucide-react";

export const SignLanguageDictionary: React.FC = () => {
  const { speakText } = useAccessibility();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Barchasi");
  const [customText, setCustomText] = useState("");
  const [aiGestures, setAiGestures] = useState<{ word: string; description: string; emoji?: string }[]>([]);
  const [isLoadingAi, setIsLoadingAi] = useState(false);

  const categories = ["Barchasi", "Muloqot", "Tushuncha", "Ta'lim", "Yordam", "Texnologiya"];

  const filteredDictionary = SIGN_DICTIONARY.filter((item) => {
    const matchesSearch =
      item.word.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCat = selectedCategory === "Barchasi" || item.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  const handleGenerateAiSign = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customText.trim()) return;
    setIsLoadingAi(true);
    speakText("Ishora tili AI tomonidan yaratilmoqda");
    try {
      const res = await fetch("/api/ai/sign-language", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: customText }),
      });
      const data = await res.json();
      setAiGestures(data.gestures || []);
      speakText("AI kiritilgan matn uchun ishora harakatlarini yaratdi.");
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoadingAi(false);
    }
  };

  return (
    <div role="region" aria-label="Ishora Tili Lug'ati" className="space-y-8">
      <div className="bg-[#1E293B] border border-slate-700 rounded-2xl p-6 md:p-8 shadow-2xl">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0F172A] border border-slate-700 text-amber-400 text-xs font-bold uppercase">
          <Hand className="w-4 h-4 text-amber-400" />
          Eshitish va Gapirish Nuqsoni Bor Insonlar Uchun
        </div>
        <h2 className="text-2xl md:text-3xl font-bold text-slate-100 mt-2">
          Ishora Tili Vizual Lug'ati va AI Generator
        </h2>
        <p className="text-sm text-slate-300 mt-1">
          Qo'l harakatlari, alifbo va iboralarning to'liq vizual tavsifi.
        </p>
      </div>

      {/* AI Generator */}
      <div className="bg-[#1E293B] border border-slate-700 rounded-2xl p-6 shadow-xl space-y-4">
        <div className="flex items-center gap-2 text-amber-400">
          <Wand2 className="w-5 h-5" />
          <h3 className="font-bold text-base text-slate-100">Matnni Ishora Tiliga Aylantirish (AI)</h3>
        </div>
        <form onSubmit={handleGenerateAiSign} className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            value={customText}
            onChange={(e) => setCustomText(e.target.value)}
            placeholder="Ixtiyoriy so'z yoki jumla yozing..."
            className="flex-1 bg-[#0F172A] border border-slate-600 rounded-xl px-4 py-3 text-sm text-slate-100 focus:outline-none focus:border-[#38BDF8]"
          />
          <button
            type="submit"
            disabled={isLoadingAi || !customText.trim()}
            className="px-6 py-3 rounded-xl bg-amber-400 hover:bg-amber-300 disabled:opacity-40 text-slate-950 font-bold text-sm flex items-center justify-center gap-2 shrink-0"
          >
            <Sparkles className="w-4 h-4" />
            <span>{isLoadingAi ? "Yaratilmoqda..." : "Ishoraga Aylantirish"}</span>
          </button>
        </form>

        {aiGestures.length > 0 && (
          <div className="pt-4 border-t border-slate-700 space-y-3">
            <h4 className="text-xs font-bold text-amber-400 uppercase">AI Ishora Harakatlari:</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {aiGestures.map((g, idx) => (
                <div key={idx} className="bg-[#0F172A] border border-slate-700 rounded-xl p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-base font-bold text-amber-300">{g.emoji || "✋"} {g.word}</span>
                    <button
                      onClick={() => speakText(`${g.word} ishorasi: ${g.description}`, true)}
                      className="p-1 rounded bg-[#1E293B] text-slate-300 hover:text-white"
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">{g.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Qidiruv va Filter */}
      <div className="bg-[#1E293B] border border-slate-700 rounded-2xl p-6 md:p-8 shadow-xl space-y-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Ishoralar ichidan qidirish..."
              className="w-full bg-[#0F172A] border border-slate-600 rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-[#38BDF8]"
            />
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-2 rounded-lg text-xs font-bold transition ${
                  selectedCategory === cat
                    ? "bg-[#38BDF8] text-slate-950"
                    : "bg-[#0F172A] text-slate-300 border border-slate-700"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6" role="list">
          {filteredDictionary.map((item, idx) => (
            <div key={idx} role="listitem" className="bg-[#0F172A] border border-slate-700 rounded-xl p-5 space-y-3 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-base font-bold text-amber-300">{item.emoji} {item.word}</span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-[#1E293B] border border-slate-700 text-[#38BDF8] font-bold">
                    {item.category}
                  </span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">{item.description}</p>
              </div>
              <div className="pt-3 border-t border-slate-700 flex justify-end">
                <button
                  onClick={() => speakText(`${item.word} ishorasi: ${item.description}`, true)}
                  className="px-2.5 py-1 rounded bg-[#1E293B] hover:bg-slate-700 text-xs text-[#38BDF8] flex items-center gap-1 border border-slate-700"
                >
                  <Volume2 className="w-3.5 h-3.5" />
                  <span>Ovozli eshitish</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
