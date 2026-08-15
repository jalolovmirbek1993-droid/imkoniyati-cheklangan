import React, { useState } from "react";
import { TAYYORLOV_COURSES } from "../data/tayyorlovCoursesData";
import { TayyorlovCourse, QuizItem } from "../types";
import { useAccessibility } from "../context/AccessibilityContext";
import {
  Volume2,
  Hand,
  Sparkles,
  CheckCircle,
  ArrowRight,
  Play,
  Award,
  BookMarked,
  Layers,
} from "lucide-react";

export const TayyorlovKurslari: React.FC = () => {
  const { speakText, stopSpeaking, isSpeaking } = useAccessibility();
  const [selectedCourse, setSelectedCourse] = useState<TayyorlovCourse>(TAYYORLOV_COURSES[0]);
  const [activeModuleIndex, setActiveModuleIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({});
  const [showQuizResults, setShowQuizResults] = useState<Record<string, boolean>>({});
  const [tutorQuestion, setTutorQuestion] = useState("");
  const [tutorAnswer, setTutorAnswer] = useState("");
  const [isLoadingTutor, setIsLoadingTutor] = useState(false);

  const currentModule = selectedCourse.modules[activeModuleIndex] || selectedCourse.modules[0];

  const handleSelectCourse = (course: TayyorlovCourse) => {
    setSelectedCourse(course);
    setActiveModuleIndex(0);
    setSelectedAnswers({});
    setShowQuizResults({});
    setTutorAnswer("");
    speakText(`${course.title} tanlandi.`);
  };

  const handlePlayAudioLecture = () => {
    if (isSpeaking) {
      stopSpeaking();
    } else {
      speakText(`Tayyorlov kursi audiodarsi: ${currentModule.title}. ${currentModule.audioLectureText}`, true);
    }
  };

  const handleCheckQuiz = (quiz: QuizItem) => {
    const isCorrect = selectedAnswers[quiz.id] === quiz.correctAnswer;
    setShowQuizResults((prev) => ({ ...prev, [quiz.id]: true }));
    if (isCorrect) {
      speakText(`Barakalla! Javobingiz to'g'ri. ${quiz.explanation}`);
    } else {
      speakText(`Javob xato bo'ldi. To'g'ri javob: ${quiz.options[quiz.correctAnswer]}. ${quiz.explanation}`);
    }
  };

  const handleAskAiTutor = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!tutorQuestion.trim()) return;
    setIsLoadingTutor(true);
    speakText("Savolingiz AI O'qituvchiga yuborilmoqda");
    try {
      const res = await fetch("/api/ai/tayyorlov-tutor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question: tutorQuestion,
          courseType: selectedCourse.title,
        }),
      });
      const data = await res.json();
      const reply = data.answer || "Savolingiz uchun tashakkur!";
      setTutorAnswer(reply);
      speakText(`AI O'qituvchi javobi: ${reply}`);
    } catch {
      setTutorAnswer("Xatolik yuz berdi. Iltimos qaytadan urinib ko'ring.");
    } finally {
      setIsLoadingTutor(false);
    }
  };

  return (
    <div role="region" aria-label="Tayyorlov Kurslari Platformasi" className="space-y-8">
      {/* Banner */}
      <div className="bg-[#1E293B] border border-slate-700 rounded-2xl p-6 md:p-8 shadow-2xl">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0F172A] border border-slate-700 text-[#38BDF8] text-xs font-bold uppercase">
          <BookMarked className="w-4 h-4 text-[#38BDF8]" aria-hidden="true" />
          100% Onlayn Inklyuziv Ta'lim
        </div>
        <h2 className="text-2xl md:text-3xl font-bold text-slate-100 mt-2">
          Tayyorlov Kurslari va Maxsus Modullar
        </h2>
        <p className="text-sm text-slate-300 mt-1">
          Ishora tili, Screen Reader va AI matn tahriri bo'yicha interaktiv darsliklar.
        </p>
      </div>

      {/* Kurslar Ro'yxati */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6" role="list">
        {TAYYORLOV_COURSES.map((course, idx) => {
          const isSelected = selectedCourse.id === course.id;
          return (
            <div
              key={course.id}
              role="listitem"
              onClick={() => handleSelectCourse(course)}
              className={`cursor-pointer rounded-xl p-6 border transition-all ${
                isSelected
                  ? "bg-[#1E293B] border-[#38BDF8] shadow-[0_0_15px_rgba(56,189,248,0.15)]"
                  : "bg-[#1E293B] border-slate-700 hover:border-slate-600"
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-[#38BDF8]">0{idx + 1}-KURS</span>
                <span className="text-xs bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded font-bold">
                  {course.totalModules} Modul
                </span>
              </div>
              <h3 className="text-base font-bold text-slate-100 mb-2">{course.title}</h3>
              <p className="text-xs text-slate-400 leading-relaxed mb-4">{course.description}</p>
              <div className="pt-3 border-t border-slate-700 flex items-center justify-between text-xs font-bold text-[#38BDF8]">
                <span>Kursga kirish</span>
                <ArrowRight className="w-4 h-4" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Tanlangan Kurs Interfeysi */}
      <div className="bg-[#1E293B] border border-slate-700 rounded-2xl p-6 md:p-8 shadow-xl space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-700 pb-5">
          <div>
            <span className="text-xs font-mono text-[#38BDF8] uppercase font-bold">FAOL TAYYORLOV KURSI</span>
            <h3 className="text-xl font-bold text-slate-100 mt-1">{selectedCourse.title}</h3>
          </div>
          <div className="flex items-center gap-2 flex-wrap" role="tablist">
            {selectedCourse.modules.map((mod, idx) => (
              <button
                key={mod.id}
                role="tab"
                aria-selected={activeModuleIndex === idx}
                onClick={() => {
                  setActiveModuleIndex(idx);
                  speakText(`${mod.title} tanlandi`);
                }}
                className={`px-4 py-2 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
                  activeModuleIndex === idx
                    ? "bg-[#38BDF8] text-slate-950"
                    : "bg-[#0F172A] text-slate-300 border border-slate-700"
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span>{idx + 1}-Dars</span>
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Asosiy Darslik */}
          <article className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between bg-[#0F172A] p-4 rounded-xl border border-slate-700">
              <h4 className="text-base font-bold text-[#38BDF8]">{currentModule.title}</h4>
              <button
                onClick={handlePlayAudioLecture}
                className={`px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-2 transition ${
                  isSpeaking
                    ? "bg-rose-600 text-white animate-pulse"
                    : "bg-[#38BDF8] text-slate-950 hover:bg-[#0284c7]"
                }`}
              >
                <Play className="w-4 h-4 fill-current" />
                <span>{isSpeaking ? "Audioni To'xtatish" : "Ovozli Ma'ruza (TTS)"}</span>
              </button>
            </div>

            <div className="bg-[#0F172A] border border-slate-700 rounded-xl p-6">
              <p className="text-sm text-slate-200 leading-relaxed">{currentModule.content}</p>
            </div>

            {/* Ishora Tili Belgilari */}
            {currentModule.signLanguageKeyWords && currentModule.signLanguageKeyWords.length > 0 && (
              <div className="space-y-3">
                <h5 className="text-sm font-bold text-amber-400 flex items-center gap-2">
                  <Hand className="w-4 h-4" /> Darsdagi Ishora Harakatlari:
                </h5>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {currentModule.signLanguageKeyWords.map((item, idx) => (
                    <div key={idx} className="bg-[#0F172A] p-4 rounded-xl border border-slate-700 space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="text-base font-bold text-amber-300">
                          {item.emoji} {item.word}
                        </span>
                        <button
                          onClick={() => speakText(`${item.word} ishorasi: ${item.description}`, true)}
                          className="p-1 rounded bg-[#1E293B] text-slate-300 hover:text-white"
                        >
                          <Volume2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <p className="text-xs text-slate-300">{item.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Viktorina */}
            {currentModule.quiz && currentModule.quiz.length > 0 && (
              <div className="space-y-4 pt-4 border-t border-slate-700">
                <h5 className="text-base font-bold text-slate-100 flex items-center gap-2">
                  <Award className="w-5 h-5 text-emerald-400" /> Amaliy Viktorina
                </h5>
                {currentModule.quiz.map((q, qIdx) => {
                  const selectedOpt = selectedAnswers[q.id];
                  const isSubmitted = showQuizResults[q.id];
                  const isCorrect = selectedOpt === q.correctAnswer;
                  return (
                    <div key={q.id} className="bg-[#0F172A] p-5 rounded-xl border border-slate-700 space-y-3">
                      <p className="text-sm font-bold text-slate-100">{qIdx + 1}. {q.question}</p>
                      <div className="space-y-2">
                        {q.options.map((opt, optIdx) => (
                          <button
                            key={optIdx}
                            onClick={() => setSelectedAnswers((prev) => ({ ...prev, [q.id]: optIdx }))}
                            className={`w-full text-left p-3 rounded-lg text-xs font-semibold border transition flex items-center justify-between ${
                              selectedOpt === optIdx
                                ? "bg-[#1E293B] border-[#38BDF8] text-[#38BDF8]"
                                : "bg-[#1E293B] border-slate-700 text-slate-300"
                            }`}
                          >
                            <span>{opt}</span>
                            {selectedOpt === optIdx && <CheckCircle className="w-4 h-4 text-[#38BDF8]" />}
                          </button>
                        ))}
                      </div>
                      <button
                        onClick={() => handleCheckQuiz(q)}
                        disabled={selectedOpt === undefined}
                        className="px-4 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-600 disabled:opacity-40 text-slate-950 font-bold text-xs"
                      >
                        Tekshirish
                      </button>
                      {isSubmitted && (
                        <div className={`p-3 rounded-lg border text-xs ${isCorrect ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-300" : "bg-rose-500/10 border-rose-500/30 text-rose-300"}`}>
                          <p className="font-bold">{isCorrect ? "✓ To'g'ri javob!" : "✗ Noto'g'ri javob."}</p>
                          <p>{q.explanation}</p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </article>

          {/* AI O'qituvchi Yon Paneli */}
          <aside className="lg:col-span-1 bg-[#0F172A] border border-slate-700 rounded-xl p-5 space-y-4 h-fit sticky top-24">
            <div className="flex items-center gap-2 text-amber-400 border-b border-slate-700 pb-3">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <h4 className="font-bold text-sm text-slate-100">[AI_O'qituvchi] Savol-Javob</h4>
            </div>
            <form onSubmit={handleAskAiTutor} className="space-y-3">
              <textarea
                value={tutorQuestion}
                onChange={(e) => setTutorQuestion(e.target.value)}
                placeholder="Savolingizni shu yerga yozing..."
                rows={3}
                className="w-full bg-[#1E293B] border border-slate-600 rounded-lg p-3 text-xs text-slate-100 focus:outline-none focus:border-[#38BDF8] resize-none"
              />
              <button
                type="submit"
                disabled={isLoadingTutor || !tutorQuestion.trim()}
                className="w-full py-2.5 rounded-lg bg-amber-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 hover:bg-amber-300 disabled:opacity-40"
              >
                <Sparkles className="w-4 h-4" />
                <span>{isLoadingTutor ? "AI tayyorlamoqda..." : "Savol Yuborish"}</span>
              </button>
            </form>
            {tutorAnswer && (
              <div className="p-4 rounded-xl bg-[#1E293B] border border-slate-700 space-y-2 text-xs text-slate-200">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-amber-400">[AI_O'qituvchi]:</span>
                  <button onClick={() => speakText(`AI O'qituvchi deydi: ${tutorAnswer}`, true)}>
                    <Volume2 className="w-3.5 h-3.5 text-slate-300" />
                  </button>
                </div>
                <p className="leading-relaxed">{tutorAnswer}</p>
              </div>
            )}
          </aside>
        </div>
      </div>
    </div>
  );
};
