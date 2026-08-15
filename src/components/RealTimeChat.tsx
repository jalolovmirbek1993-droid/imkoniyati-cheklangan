import React, { useState, useRef, useEffect } from "react";
import { ChatMessage, OnlineUser } from "../types";
import { useAccessibility } from "../context/AccessibilityContext";
import {
  Send,
  Mic,
  MicOff,
  Sparkles,
  Volume2,
  Hand,
  CheckCircle2,
  Users,
  MessageSquare,
  Wand2,
  VolumeX,
} from "lucide-react";

interface RealTimeChatProps {
  messages: ChatMessage[];
  onlineUsers: OnlineUser[];
  currentUserId: string;
  currentUserName: string;
  onSendMessage: (text: string, autoCorrect: boolean, generateSignGestures: boolean) => void;
  onJoinRoom: (room: string) => void;
  currentRoom: string;
}

export const RealTimeChat: React.FC<RealTimeChatProps> = ({
  messages,
  onlineUsers,
  currentUserId,
  currentUserName,
  onSendMessage,
  onJoinRoom,
  currentRoom,
}) => {
  const { speakText, settings, isSpeaking, stopSpeaking } = useAccessibility();
  const [inputText, setInputText] = useState("");
  const [autoCorrect, setAutoCorrect] = useState(false);
  const [generateSignGestures, setGenerateSignGestures] = useState(true);
  const [isListening, setIsListening] = useState(false);
  const [isAiCorrecting, setIsAiCorrecting] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    if (messages.length > 0 && settings.autoSpeakMessages) {
      const lastMsg = messages[messages.length - 1];
      if (lastMsg.senderId !== currentUserId) {
        speakText(`${lastMsg.senderName} yozdi: ${lastMsg.correctedText || lastMsg.text}`);
      }
    }
  }, [messages, settings.autoSpeakMessages, currentUserId, speakText]);

  const toggleSpeechRecognition = () => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      speakText("Brauzeringiz nutqni tanib olishni qo'llab-quvvatlamaydi");
      return;
    }

    if (isListening) {
      if (recognitionRef.current) recognitionRef.current.stop();
      setIsListening(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognitionRef.current = recognition;
      recognition.lang = "uz-UZ";
      recognition.interimResults = true;

      recognition.onstart = () => {
        setIsListening(true);
        speakText("Nutqingiz eshitilmoqda...");
      };

      recognition.onresult = (event: any) => {
        const transcript = Array.from(event.results)
          .map((res: any) => res[0].transcript)
          .join("");
        setInputText(transcript);
      };

      recognition.onerror = () => setIsListening(false);
      recognition.onend = () => setIsListening(false);
      recognition.start();
    } catch {
      setIsListening(false);
    }
  };

  const handleAiCorrectText = async () => {
    if (!inputText.trim()) return;
    setIsAiCorrecting(true);
    speakText("Matn AI orqali tekshirilmoqda");
    try {
      const res = await fetch("/api/ai/correct-text", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: inputText }),
      });
      const data = await res.json();
      if (data.correctedText) {
        setInputText(data.correctedText);
        speakText(`To'g'rilangan shakl: ${data.correctedText}`);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsAiCorrecting(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    onSendMessage(inputText.trim(), autoCorrect, generateSignGestures);
    setInputText("");
  };

  return (
    <div role="region" aria-label="Chat Interfeysi" className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      {/* Xonalar va Foydalanuvchilar Paneli */}
      <aside role="complementary" className="lg:col-span-1 space-y-6">
        <div className="bg-[#1E293B] border border-slate-700 rounded-xl p-5 shadow-lg">
          <h2 className="text-sm font-bold text-amber-400 mb-3 flex items-center gap-2 uppercase">
            <MessageSquare className="w-4 h-4 text-[#38BDF8]" aria-hidden="true" />
            <span>Muloqot Xonalari</span>
          </h2>
          <div className="space-y-2" role="radiogroup">
            {[
              { id: "main", label: "Asosiy Xona" },
              { id: "tayyorlov", label: "Tayyorlov Kurslari" },
              { id: "it-dasturlash", label: "IT va Dasturlash" },
              { id: "ishora", label: "Ishora Tili Xonasi" },
            ].map((room) => (
              <button
                key={room.id}
                onClick={() => {
                  onJoinRoom(room.id);
                  speakText(`${room.label} xonasiga ulandingiz`);
                }}
                role="radio"
                aria-checked={currentRoom === room.id}
                className={`w-full text-left px-3.5 py-2.5 rounded-lg text-xs font-bold transition-all ${
                  currentRoom === room.id
                    ? "bg-[#38BDF8] text-slate-950 shadow-[0_0_15px_rgba(56,189,248,0.2)]"
                    : "bg-[#0F172A] text-slate-300 border border-slate-700 hover:border-slate-600"
                }`}
              >
                {room.label}
              </button>
            ))}
          </div>
        </div>

        <div className="bg-[#1E293B] border border-slate-700 rounded-xl p-5 shadow-lg">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-bold text-slate-200 flex items-center gap-2">
              <Users className="w-4 h-4 text-emerald-400" aria-hidden="true" />
              <span>Ishtirokchilar</span>
            </h2>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 font-mono font-bold">
              {onlineUsers.length}
            </span>
          </div>
          <div className="space-y-2 max-h-56 overflow-y-auto" role="list">
            {onlineUsers.map((user) => (
              <div
                key={user.id}
                role="listitem"
                className="flex items-center justify-between p-2 rounded bg-[#0F172A] border border-slate-700 text-xs"
              >
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-emerald-400" aria-hidden="true" />
                  <span className="font-mono text-[#38BDF8]">{user.name}</span>
                  {user.name === currentUserName && <span className="text-[10px] text-emerald-400 font-bold">(Siz)</span>}
                </div>
                <span className="text-[10px] text-slate-400">{user.role}</span>
              </div>
            ))}
          </div>
        </div>
      </aside>

      {/* Asosiy Xabarlar Oqimi */}
      <main role="main" className="lg:col-span-3 flex flex-col bg-[#0F172A] border border-slate-700 rounded-xl shadow-xl overflow-hidden min-h-[580px]">
        <div className="bg-[#1E293B] px-6 py-4 border-b border-slate-700 flex items-center justify-between">
          <div>
            <h2 className="font-bold text-slate-100 text-base">Xona: {currentRoom}</h2>
            <p className="text-xs text-slate-400">Audio (TTS), Ishora va AI Grammar qo'llab-quvvatlanadi.</p>
          </div>
          {isSpeaking && (
            <button
              onClick={stopSpeaking}
              className="px-3 py-1.5 rounded-lg bg-rose-500/20 border border-rose-500 text-rose-300 text-xs font-bold flex items-center gap-1.5 animate-pulse"
            >
              <VolumeX className="w-4 h-4" />
              Ovozni to'xtatish
            </button>
          )}
        </div>

        <div role="log" aria-live="polite" className="flex-1 p-6 overflow-y-auto space-y-4 max-h-[460px]">
          {messages.map((msg) => {
            const isSelf = msg.senderId === currentUserId;
            return (
              <div key={msg.id} className={`flex flex-col gap-1 ${isSelf ? "items-end" : "items-start"}`} role="article">
                <span className="text-[10px] uppercase font-bold text-slate-500">
                  {msg.senderName} &bull; {msg.timestamp}
                </span>
                <div
                  className={`max-w-[85%] md:max-w-[75%] p-4 text-sm rounded-2xl ${
                    msg.isAi
                      ? "bg-[#1E293B] border border-amber-400/60 text-slate-100"
                      : isSelf
                      ? "bg-[#38BDF8] text-slate-950 font-medium rounded-tr-none"
                      : "bg-[#334155] text-slate-100 rounded-tl-none border-l-4 border-[#38BDF8]"
                  }`}
                >
                  <p className="leading-relaxed">{msg.correctedText || msg.text}</p>
                  {msg.correctedText && (
                    <div className="mt-2 text-xs pt-1.5 border-t border-slate-600/40 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" aria-hidden="true" />
                      <span>AI grammatikani to'g'riladi</span>
                    </div>
                  )}
                  {msg.signLanguageGestures && msg.signLanguageGestures.length > 0 && (
                    <div className="mt-2.5 pt-2 border-t border-slate-600/40 flex flex-wrap gap-1">
                      <span className="text-[10px] font-bold w-full text-amber-300 flex items-center gap-1">
                        <Hand className="w-3 h-3" aria-hidden="true" /> Ishora belgilari:
                      </span>
                      {msg.signLanguageGestures.map((gesture, idx) => (
                        <span key={idx} className="px-2 py-0.5 rounded text-[10px] font-mono bg-slate-900 text-amber-200 border border-slate-700">
                          {gesture}
                        </span>
                      ))}
                    </div>
                  )}
                  <div className="mt-2 flex justify-end">
                    <button
                      onClick={() => speakText(`${msg.senderName}: ${msg.correctedText || msg.text}`, true)}
                      className="px-2 py-0.5 rounded text-xs flex items-center gap-1 hover:bg-black/10 transition"
                    >
                      <Volume2 className="w-3.5 h-3.5" aria-hidden="true" />
                      <span>Tinglash</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>

        {/* Input qismi */}
        <form onSubmit={handleSubmit} className="p-4 bg-[#1E293B] border-t border-slate-700 space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2 text-xs bg-[#0F172A] p-2.5 rounded-lg border border-slate-700">
            <div className="flex items-center gap-4">
              <label className="flex items-center gap-1.5 cursor-pointer text-slate-300">
                <input
                  type="checkbox"
                  checked={autoCorrect}
                  onChange={(e) => setAutoCorrect(e.target.checked)}
                  className="rounded bg-[#1E293B] text-[#38BDF8]"
                />
                <span className="flex items-center gap-1 font-semibold">
                  <Wand2 className="w-3.5 h-3.5 text-[#38BDF8]" /> AI Avto-tahrir
                </span>
              </label>
              <label className="flex items-center gap-1.5 cursor-pointer text-slate-300">
                <input
                  type="checkbox"
                  checked={generateSignGestures}
                  onChange={(e) => setGenerateSignGestures(e.target.checked)}
                  className="rounded bg-[#1E293B] text-amber-400"
                />
                <span className="flex items-center gap-1 font-semibold">
                  <Hand className="w-3.5 h-3.5 text-amber-400" /> Ishora belgisi
                </span>
              </label>
            </div>
            <button
              type="button"
              onClick={handleAiCorrectText}
              disabled={isAiCorrecting || !inputText.trim()}
              className="px-3 py-1 bg-[#334155] rounded text-xs text-[#38BDF8] font-bold flex items-center gap-1 disabled:opacity-40"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>{isAiCorrecting ? "AI..." : "AI Tahriri"}</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={toggleSpeechRecognition}
              aria-pressed={isListening}
              className={`w-12 h-12 rounded-full flex items-center justify-center text-white shrink-0 transition ${
                isListening ? "bg-rose-600 animate-pulse" : "bg-rose-500 hover:bg-rose-600"
              }`}
            >
              {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
            </button>
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Xabar yozing yoki ovozli gapiring..."
              className="flex-1 bg-[#0F172A] border border-slate-600 rounded-xl px-4 py-3 text-sm text-slate-100 focus:outline-none focus:border-[#38BDF8]"
            />
            <button
              type="submit"
              disabled={!inputText.trim()}
              className="px-5 py-3 rounded-xl bg-[#38BDF8] text-slate-950 font-bold hover:bg-[#0284c7] disabled:opacity-40 flex items-center gap-1.5"
            >
              <Send className="w-4 h-4" />
              <span className="hidden sm:inline">Yuborish</span>
            </button>
          </div>
        </form>
      </main>
    </div>
  );
};
