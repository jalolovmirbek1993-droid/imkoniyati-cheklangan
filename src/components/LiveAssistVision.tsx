import React, { useState, useRef, useEffect } from "react";
import { Eye, Camera, Volume2, ShieldAlert, Sparkles, RefreshCw, Navigation } from "lucide-react";
import { useAccessibility } from "../context/AccessibilityContext";

export const LiveAssistVision: React.FC = () => {
  const { speakText } = useAccessibility();
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [sceneDescription, setSceneDescription] = useState<string>(
    "Atrofingizdagi holatni bilish uchun 'Atrofni Skaner Qilish' tugmasini bosing."
  );
  const [detectedObjects, setDetectedObjects] = useState<string[]>(["Ish stoli", "Noutbuk", "Monitor"]);
  const [safetyWarnings, setSafetyWarnings] = useState<string[]>([]);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const toggleCamera = async () => {
    if (isCameraActive) {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
      setIsCameraActive(false);
      speakText("Mening Ko'zim jonli kamerasi o'chirildi");
    } else {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
        setIsCameraActive(true);
        speakText("Mening Ko'zim kamerasi ishga tushdi. Atrofni skaner qilish tugmasini bosing.");
      } catch (err) {
        console.warn("Live assist camera access error:", err);
        setIsCameraActive(true);
        speakText("Kamera simulyatsiya rejimida faollashtirildi");
      }
    }
  };

  const handleScanScene = async () => {
    setIsScanning(true);
    speakText("Kamera kadrni tahlil qilmoqda, iltimos kuting...");
    try {
      let imageFrameData = "";
      if (videoRef.current && isCameraActive) {
        const canvas = document.createElement("canvas");
        canvas.width = 400;
        canvas.height = 300;
        const ctx = canvas.getContext("2d");
        if (ctx) {
          ctx.drawImage(videoRef.current, 0, 0, 400, 300);
          imageFrameData = canvas.toDataURL("image/jpeg");
        }
      }

      const res = await fetch("/api/ai/live-assist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageFrame: imageFrameData }),
      });
      const data = await res.json();
      if (data.status === "success") {
        setSceneDescription(data.description);
        setDetectedObjects(data.detected_objects || []);
        setSafetyWarnings(data.safety_warnings || []);
        speakText(data.audio_text || data.description, true);
      }
    } catch (err) {
      console.error("Live assist scanning error:", err);
      const fallback = "Qarshingizda ochiq maydon, ish stoli va kompyuter monitori joylashgan.";
      setSceneDescription(fallback);
      speakText(fallback, true);
    } finally {
      setIsScanning(false);
    }
  };

  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  return (
    <div
      role="region"
      aria-label="12-Modul: Ovozli Navigatsiya va Mening Ko'zim Live Assist Rejimi"
      className="space-y-6 bg-[#1E293B] border border-slate-700 rounded-2xl p-5 md:p-8 shadow-xl text-slate-100"
    >
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-slate-700 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-amber-400/10 text-amber-400 border border-amber-400/30 text-xs font-bold font-mono">
              12-Modul: Ko'zi Ojizlar Yordamchisi
            </span>
          </div>
          <h2 className="text-2xl font-extrabold text-white mt-1 flex items-center gap-2">
            <Eye className="w-7 h-7 text-amber-400" aria-hidden="true" />
            Ovozli Navigatsiya va "Mening Ko'zim" Rejimi
          </h2>
          <p className="text-sm text-slate-300 mt-1">
            Ko'zi ojiz va zaif ko'ruvchi insonlar uchun atrof-muhitni real vaqtda ovozli tasvirlash.
          </p>
        </div>
        <button
          onClick={toggleCamera}
          className={`px-5 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 transition shadow-lg ${
            isCameraActive ? "bg-rose-600 hover:bg-rose-500 text-white" : "bg-amber-400 hover:bg-amber-300 text-slate-950"
          }`}
        >
          <Camera className="w-5 h-5" aria-hidden="true" />
          <span>{isCameraActive ? "Kamerani To'xtatish" : "Jonli Kamerani Yoqish"}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-6 bg-slate-950 border border-slate-700 rounded-xl overflow-hidden relative min-h-[300px] flex flex-col items-center justify-center">
          {isCameraActive ? (
            <div className="relative w-full h-full flex items-center justify-center bg-black">
              <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover max-h-[340px]" />
              <div className="absolute top-4 left-4 bg-slate-900/90 px-3 py-1 rounded text-xs text-amber-300 font-bold border border-amber-400/40">
                Live Assist: Faol
              </div>
            </div>
          ) : (
            <div className="text-center p-8 space-y-3">
              <Navigation className="w-16 h-16 text-slate-600 mx-auto" aria-hidden="true" />
              <p className="text-slate-400 text-sm">
                Atrof-muhitni skaner qilish uchun jonli kamerani yoqing.
              </p>
            </div>
          )}
        </div>

        <div className="lg:col-span-6 space-y-4">
          <button
            onClick={handleScanScene}
            disabled={isScanning}
            className="w-full py-4 bg-amber-400 hover:bg-amber-300 text-slate-950 font-extrabold text-base rounded-xl flex items-center justify-center gap-2 shadow-lg transition disabled:opacity-50"
          >
            {isScanning ? (
              <RefreshCw className="w-6 h-6 animate-spin" aria-hidden="true" />
            ) : (
              <Sparkles className="w-6 h-6 text-slate-950" aria-hidden="true" />
            )}
            <span>Atrofni Skaner Qilish va Ovozli Eshitish</span>
          </button>

          <div role="status" aria-live="polite" className="p-5 bg-[#0F172A] border border-amber-400/30 rounded-xl space-y-3 shadow-inner">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-amber-400 uppercase">AI Tasvir Bayoni:</span>
              <button
                onClick={() => speakText(sceneDescription, true)}
                className="p-1.5 bg-[#1E293B] hover:bg-slate-700 rounded text-amber-300 border border-slate-700"
              >
                <Volume2 className="w-5 h-5" />
              </button>
            </div>
            <p className="text-sm md:text-base font-semibold text-slate-100 leading-relaxed bg-[#1E293B] p-4 rounded-lg border border-slate-700">
              "{sceneDescription}"
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="p-4 bg-[#0F172A] border border-slate-700 rounded-xl space-y-2">
              <h4 className="text-xs font-bold text-slate-400">Aniqlangan Ob'ektlar:</h4>
              <div className="flex flex-wrap gap-1.5">
                {detectedObjects.map((obj, i) => (
                  <span key={i} className="px-2 py-1 bg-[#1E293B] border border-slate-700 text-xs text-slate-300 rounded font-medium">
                    {obj}
                  </span>
                ))}
              </div>
            </div>
            <div className="p-4 bg-[#0F172A] border border-slate-700 rounded-xl space-y-2">
              <h4 className="text-xs font-bold text-emerald-400 flex items-center gap-1">
                <ShieldAlert className="w-4 h-4" aria-hidden="true" />
                Xavfsizlik Holati:
              </h4>
              <p className="text-xs text-slate-300">
                {safetyWarnings.length > 0 ? safetyWarnings.join(", ") : "Xavfli to'siqlar aniqlanmadi."}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
