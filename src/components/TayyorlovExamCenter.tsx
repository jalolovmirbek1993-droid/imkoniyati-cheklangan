import React, { useState, useEffect, useRef } from "react";
import { Award, Mic, Volume2, CheckCircle2, XCircle, RefreshCw, Hand } from "lucide-react";
import { ExamQuestion, ExamResult } from "../types";
import { useAccessibility } from "../context/AccessibilityContext";

export const TayyorlovExamCenter: React.FC = () => {
  const { speakText } = useAccessibility();
  const [questions, setQuestions] = useState<ExamQuestion[]>([]);
  const [currentExamMode, setCurrentExamMode] = useState<"voice_stt" | "visual_sign" | "standard">("standard");
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<{ [key: number]: number }>({});
  const [isListening, setIsListening] = useState(false);
  const [examResult, setExamResult] = useState<ExamResult | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    fetch("/api/exams/questions")
      .then((res) => res.json())
      .then((data) => setQuestions(data.questions || []))
      .catch((err) => console.error("Fetch exam questions error:", err));
  }, []);

  const handleReadQuestion = () => {
    if (questions[currentQuestionIndex]) {
      const q = questions[currentQuestionIndex];
      const speech = `Savol ${currentQuestionIndex + 1}: ${q.audio_prompt || q.question_text}. Variantlar: ${q.options
        .map((opt, i) => `${i + 1}: ${opt}`)
        .join(". ")}`;
      speakText(speech, true);
    }
  };

  const handleStartVoiceAnswer = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      speakText("Brauzeringiz ovozli tanib olishni qo'llab-quvvatlamaydi.");
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
      setIsListening(true);
      speakText("Mikrofon tinglamoqda, javob variantingizni ayting...");

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript.toLowerCase();
        setIsListening(false);
        const q = questions[currentQuestionIndex];
        let matchedIdx = -1;
        q.options.forEach((opt, idx) => {
          if (transcript.includes(opt.toLowerCase()) || transcript.includes(String(idx + 1))) {
            matchedIdx = idx;
          }
        });
        if (matchedIdx !== -1) {
          setSelectedAnswers((prev) => ({ ...prev, [q.id]: matchedIdx }));
          speakText(`${matchedIdx + 1}-variant belgilandi.`);
        } else {
          speakText("Variant aniqlanmadi, qaytadan urinib ko'ring.");
        }
      };

      recognition.onerror = () => setIsListening(false);
      recognition.onend = () => setIsListening(false);
      recognition.start();
    } catch {
      setIsListening(false);
    }
  };

  const handleSubmitExam = async () => {
    setIsSubmitting(true);
    speakText("Imtihon natijalari hisoblanmoqda...");
    try {
      const res = await fetch("/api/exams/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_name: "[O'quvchi]",
          answers: selectedAnswers,
          mode: currentExamMode,
        }),
      });
      const data = await res.json();
      if (data.status === "success") {
        setExamResult(data.result);
        speakText(data.message, true);
      }
    } catch (err) {
      console.error("Submit exam error:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRestartExam = () => {
    setExamResult(null);
    setCurrentQuestionIndex(0);
    setSelectedAnswers({});
    speakText("Imtihon qayta boshlandi");
  };

  const currentQ = questions[currentQuestionIndex];

  return (
    <div role="region" aria-label="14-Modul: Imtihon Markazi" className="space-y-6 bg-[#1E293B] border border-slate-700 rounded-2xl p-5 md:p-8 shadow-xl text-slate-100">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-slate-700 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-amber-400/10 text-amber-400 border border-amber-400/30 text-xs font-bold font-mono">
              14-Modul: Imtihon va Test
            </span>
          </div>
          <h2 className="text-2xl font-extrabold text-white mt-1 flex items-center gap-2">
            <Award className="w-7 h-7 text-amber-400" aria-hidden="true" />
            Ovozli Imtihon va Test Markazi (Tayyorlov)
          </h2>
          <p className="text-sm text-slate-300 mt-1">
            Ko'zi ojizlar uchun ovozli (STT) va eshitishda nuqsoni borlar uchun vizual imtihon tizimi.
          </p>
        </div>

        {!examResult && (
          <div className="flex items-center gap-1.5 bg-slate-950 p-1.5 rounded-xl border border-slate-800">
            <button
              onClick={() => {
                setCurrentExamMode("voice_stt");
                speakText("Ovozli Imtihon rejimi tanlandi");
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1 ${
                currentExamMode === "voice_stt" ? "bg-amber-400 text-slate-950" : "text-slate-300 hover:text-white"
              }`}
            >
              <Mic className="w-3.5 h-3.5" />
              <span>Ovozli Rejim</span>
            </button>
            <button
              onClick={() => {
                setCurrentExamMode("visual_sign");
                speakText("Imo-ishorali Rejim tanlandi");
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1 ${
                currentExamMode === "visual_sign" ? "bg-amber-400 text-slate-950" : "text-slate-300 hover:text-white"
              }`}
            >
              <Hand className="w-3.5 h-3.5" />
              <span>Imo-ishora</span>
            </button>
            <button
              onClick={() => {
                setCurrentExamMode("standard");
                speakText("Standard rejim tanlandi");
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                currentExamMode === "standard" ? "bg-amber-400 text-slate-950" : "text-slate-300 hover:text-white"
              }`}
            >
              Standard
            </button>
          </div>
        )}
      </div>

      {examResult ? (
        <div className="max-w-xl mx-auto bg-[#0F172A] border border-slate-700 rounded-2xl p-8 space-y-6 text-center shadow-2xl">
          {examResult.passed ? (
            <div className="space-y-4">
              <Award className="w-16 h-16 text-amber-400 mx-auto" />
              <h3 className="text-2xl font-extrabold text-white">Tayyorlov Kursi Sertifikati</h3>
              <p className="text-sm text-slate-300">
                Natijangiz: <span className="text-emerald-400 font-bold text-lg">{examResult.score}%</span>
              </p>
              <div className="p-4 bg-[#1E293B] border border-amber-400/40 rounded-xl space-y-2 text-left text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-400">Sertifikat ID:</span>
                  <span className="font-mono text-amber-300 font-bold">{examResult.certificate_id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Kurs:</span>
                  <span className="text-slate-200 font-bold">{examResult.course_title}</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <XCircle className="w-16 h-16 text-rose-500 mx-auto" />
              <h3 className="text-xl font-bold text-white">Natija: {examResult.score}%</h3>
              <p className="text-xs text-slate-300">Darsliklarni takrorlab, imtihonni qayta topshirishingiz mumkin.</p>
            </div>
          )}
          <button
            onClick={handleRestartExam}
            className="w-full py-3 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold rounded-xl text-xs flex items-center justify-center gap-2 shadow"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Imtihonni Qayta Topshirish</span>
          </button>
        </div>
      ) : questions.length === 0 ? (
        <p className="text-center py-12 text-slate-400 text-sm">Savollar yuklanmoqda...</p>
      ) : (
        <div className="space-y-6 max-w-3xl mx-auto">
          <div className="flex items-center justify-between text-xs font-bold text-slate-400 bg-[#0F172A] p-3.5 rounded-xl border border-slate-700">
            <span>Savol {currentQuestionIndex + 1} / {questions.length}</span>
            <span className="text-amber-400">{currentQ?.course_title}</span>
            <button
              onClick={handleReadQuestion}
              className="p-1.5 bg-[#1E293B] hover:bg-slate-700 text-amber-300 rounded border border-slate-700 flex items-center gap-1"
            >
              <Volume2 className="w-4 h-4" />
              <span>O'qish</span>
            </button>
          </div>

          <div className="bg-[#0F172A] border border-slate-700 rounded-xl p-6 space-y-5">
            <h3 className="text-lg font-bold text-white">{currentQ.question_text}</h3>

            {currentExamMode === "visual_sign" && currentQ.sign_gesture_prompt && (
              <div className="p-3 bg-[#1E293B] border border-amber-400/30 rounded-lg text-sm text-amber-300 font-bold flex items-center gap-2">
                <Hand className="w-5 h-5 text-amber-400" />
                <span>Ishora Yordamchisi: {currentQ.sign_gesture_prompt}</span>
              </div>
            )}

            {currentExamMode === "voice_stt" && (
              <div className="p-4 bg-[#1E293B] border border-slate-700 rounded-xl text-center space-y-2">
                <button
                  onClick={handleStartVoiceAnswer}
                  className={`px-6 py-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 mx-auto transition ${
                    isListening ? "bg-rose-600 animate-pulse text-white" : "bg-amber-400 text-slate-950"
                  }`}
                >
                  <Mic className="w-5 h-5" />
                  <span>{isListening ? "Tinglanmoqda..." : "Ovozli Javob Berish"}</span>
                </button>
              </div>
            )}

            <div className="space-y-3">
              {currentQ.options.map((option, idx) => {
                const isSelected = selectedAnswers[currentQ.id] === idx;
                return (
                  <button
                    key={idx}
                    onClick={() => {
                      setSelectedAnswers((prev) => ({ ...prev, [currentQ.id]: idx }));
                      speakText(`${idx + 1}-variant tanlandi: ${option}`);
                    }}
                    className={`w-full p-4 rounded-xl text-left text-xs font-semibold flex items-center justify-between transition border ${
                      isSelected
                        ? "bg-amber-400/20 border-amber-400 text-amber-200 font-bold"
                        : "bg-[#1E293B] border-slate-700 text-slate-200"
                    }`}
                  >
                    <span>
                      <span className="font-mono text-slate-400 mr-2">{idx + 1}.</span>
                      {option}
                    </span>
                    {isSelected && <CheckCircle2 className="w-5 h-5 text-amber-400" />}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex items-center justify-between pt-2">
            <button
              onClick={() => setCurrentQuestionIndex((prev) => Math.max(0, prev - 1))}
              disabled={currentQuestionIndex === 0}
              className="px-4 py-2 bg-[#0F172A] border border-slate-700 rounded-lg text-xs font-bold text-slate-300 disabled:opacity-40"
            >
              Oldingi Savol
            </button>
            {currentQuestionIndex < questions.length - 1 ? (
              <button
                onClick={() => setCurrentQuestionIndex((prev) => prev + 1)}
                className="px-6 py-2.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-extrabold rounded-lg text-xs shadow"
              >
                Keyingi Savol
              </button>
            ) : (
              <button
                onClick={handleSubmitExam}
                disabled={isSubmitting}
                className="px-6 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold rounded-lg text-xs shadow flex items-center gap-2"
              >
                {isSubmitting && <RefreshCw className="w-4 h-4 animate-spin" />}
                <span>Imtihonni Yakunlash</span>
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
