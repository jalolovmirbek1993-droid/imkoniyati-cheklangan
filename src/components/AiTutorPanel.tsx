import React, { useState } from "react";
import { useAccessibility } from "../context/AccessibilityContext";
import { Sparkles, Send, Volume2 } from "lucide-react";

export const AiTutorPanel: React.FC = () => {
  const { speakText } = useAccessibility();
  const [messages, setMessages] = useState<{ sender: "user" | "ai"; text: string; timestamp: string }[]>([
    {
      sender: "ai",
      text: "Assalomu alaykum! Men [AI_O'qituvchi] va inklyuziv yordamchingizman. Tayyorlov kurslari, ishora tili yoki ovozli navigatsiya bo'yicha qanday savolingiz bor?",
      timestamp: new Date().toLocaleTimeString("uz-UZ", { hour: "2-digit", minute: "2-digit" }),
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    const userText = input.trim();
    const timeStr = new Date().toLocaleTimeString("uz-UZ", { hour: "2-digit", minute: "2-digit" });
    setMessages((prev) => [...prev, { sender: "user", text: userText, timestamp: timeStr }]);
    setInput("");
    setIsLoading(true);
    speakText("Savolingiz AI O'qituvchiga yuborildi");
    try {
      const res = await fetch("/api/ai/tayyorlov-tutor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: userText }),
      });
      const data = await res.json();
      const reply = data.answer || "Savolingiz uchun tashakkur!";
      setMessages((prev) => [...prev, { sender: "ai", text: reply, timestamp: timeStr }]);
      speakText(`AI O'qituvchi javobi: ${reply}`);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          sender: "ai",
          text: "Xatolik yuz berdi. Iltimos qaytadan urinib ko'ring.",
          timestamp: timeStr,
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div role="region" aria-label="AI Inklyuziv O'qituvchi" className="space-y-6 max-w-4xl mx-auto">
      <div className="bg-[#1E293B] border border-slate-700 rounded-2xl p-6 shadow-2xl space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0F172A] border border-slate-700 text-amber-400 text-xs font-bold uppercase">
          <Sparkles className="w-4 h-4 text-amber-400" />
          Sun'iy Intellekt O'qituvchi
        </div>
        <h2 className="text-2xl font-bold text-slate-100">[AI_O'qituvchi] Inklyuziv Ta'lim Moduli</h2>
        <p className="text-xs text-slate-300">
          Imkoniyati cheklangan o'quvchilar bilan sodda va tushunarli o'zbek tilida muloqot qiladi.
        </p>
      </div>

      <div className="bg-[#1E293B] border border-slate-700 rounded-2xl p-6 shadow-xl space-y-4">
        <div role="log" aria-live="polite" className="space-y-4 max-h-[440px] overflow-y-auto p-2">
          {messages.map((m, idx) => {
            const isUser = m.sender === "user";
            return (
              <div key={idx} className={`flex flex-col gap-1 ${isUser ? "items-end" : "items-start"}`} role="article">
                <span className="text-[10px] uppercase font-bold text-slate-400">
                  {isUser ? "[O'quvchi]" : "[AI_O'qituvchi]"} &bull; {m.timestamp}
                </span>
                <div
                  className={`max-w-[85%] p-4 text-xs md:text-sm rounded-2xl ${
                    isUser
                      ? "bg-[#38BDF8] text-slate-950 font-medium rounded-tr-none"
                      : "bg-[#334155] border-l-4 border-amber-400 text-slate-100 rounded-tl-none"
                  }`}
                >
                  <p className="leading-relaxed">{m.text}</p>
                  {!isUser && (
                    <div className="mt-2 pt-2 border-t border-slate-600 flex justify-end">
                      <button
                        onClick={() => speakText(`AI O'qituvchi javobi: ${m.text}`, true)}
                        className="px-2 py-0.5 rounded bg-[#0F172A] text-xs text-[#38BDF8] flex items-center gap-1"
                      >
                        <Volume2 className="w-3.5 h-3.5" />
                        <span>Tinglash</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <form onSubmit={handleSubmit} className="flex gap-2 pt-3 border-t border-slate-700">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="[AI_O'qituvchi]ga savolingizni yozing..."
            className="flex-1 bg-[#0F172A] border border-slate-600 rounded-xl px-4 py-3 text-xs md:text-sm text-slate-100 focus:outline-none focus:border-[#38BDF8]"
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="px-5 py-3 rounded-xl bg-[#38BDF8] text-slate-950 hover:bg-[#0284c7] disabled:opacity-40 font-bold text-xs flex items-center gap-2"
          >
            <Send className="w-4 h-4" />
            <span className="hidden sm:inline">Yuborish</span>
          </button>
        </form>
      </div>
    </div>
  );
};
