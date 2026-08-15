import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { ContrastTheme, FontSize, AccessibilityMode, AccessibilitySettings } from "../types";

interface AccessibilityContextType {
  // New API
  settings: AccessibilitySettings;
  setContrastTheme: (theme: ContrastTheme) => void;
  setFontSize: (size: FontSize) => void;
  setUserMode: (mode: AccessibilityMode) => void;
  toggleScreenReader: () => void;
  toggleAutoSpeak: () => void;
  toggleSignLanguageAssist: () => void;
  setSpeakSpeed: (speed: number) => void;
  speakText: (text: string, force?: boolean) => void;
  stopSpeaking: () => void;
  isSpeaking: boolean;
  activeAnnouncement: string;

  // Old API Compatibility
  theme: ContrastTheme;
  setTheme: (theme: ContrastTheme) => void;
  fontSize: FontSize;
  speak: (text: string, assertive?: boolean) => void;
  listen: () => void;
  isListening: boolean;
  transcript: string;
  narratorText: string;
  announce: (text: string, assertive?: boolean) => void;
}

const AccessibilityContext = createContext<AccessibilityContextType | undefined>(undefined);

export const AccessibilityProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // --- New State ---
  const [settings, setSettings] = useState<AccessibilitySettings>({
    contrastTheme: "slate-dark",
    fontSize: "normal",
    screenReaderEnabled: true,
    autoSpeakMessages: true,
    signLanguageAssist: true,
    userMode: "general",
    speakSpeed: 1.0,
  });

  const [isSpeaking, setIsSpeaking] = useState(false);
  const [activeAnnouncement, setActiveAnnouncement] = useState("");

  // --- Old State Compatibility ---
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [narratorText, setNarratorText] = useState('');
  const [isAssertive, setIsAssertive] = useState(false);

  // --- New Methods ---
  const setContrastTheme = (contrastTheme: ContrastTheme) => {
    setSettings((prev) => ({ ...prev, contrastTheme }));
  };

  const setFontSize = (fontSize: FontSize) => {
    setSettings((prev) => ({ ...prev, fontSize }));
  };

  const setUserMode = (userMode: AccessibilityMode) => {
    setSettings((prev) => ({ ...prev, userMode }));
  };

  const toggleScreenReader = () => {
    setSettings((prev) => ({ ...prev, screenReaderEnabled: !prev.screenReaderEnabled }));
  };

  const toggleAutoSpeak = () => {
    setSettings((prev) => ({ ...prev, autoSpeakMessages: !prev.autoSpeakMessages }));
  };

  const toggleSignLanguageAssist = () => {
    setSettings((prev) => ({ ...prev, signLanguageAssist: !prev.signLanguageAssist }));
  };

  const setSpeakSpeed = (speakSpeed: number) => {
    setSettings((prev) => ({ ...prev, speakSpeed }));
  };

  const stopSpeaking = useCallback(() => {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  }, []);

  const speakText = useCallback(
    (text: string, force = false) => {
      if (!("speechSynthesis" in window)) return;
      if (!force && !settings.screenReaderEnabled) return;
      stopSpeaking();

      const cleanText = text.replace(/\[|\]/g, " ");
      setActiveAnnouncement(cleanText);

      const utterance = new SpeechSynthesisUtterance(cleanText);
      utterance.lang = "uz-UZ";
      utterance.rate = settings.speakSpeed;

      const voices = window.speechSynthesis.getVoices();
      const uzVoice = voices.find((v) => v.lang.includes("uz") || v.lang.includes("tr") || v.lang.includes("ru"));
      if (uzVoice) {
        utterance.voice = uzVoice;
      }

      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);

      window.speechSynthesis.speak(utterance);
    },
    [settings.screenReaderEnabled, settings.speakSpeed, stopSpeaking]
  );

  // --- Old Methods Compatibility ---
  const speak = useCallback((text: string, assertive: boolean = false) => {
    speakText(text, assertive);
    announce(text, assertive);
  }, [speakText]);

  const announce = useCallback((text: string, assertive: boolean = false) => {
    setNarratorText(text);
    setIsAssertive(assertive);
    setTimeout(() => {
      setNarratorText('');
    }, 5000);
  }, []);

  const listen = useCallback(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      announce('Kechirasiz, brauzeringiz ovoz orqali yozishni qullab quvvatlamaydi.', true);
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'uz-UZ';
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = () => {
      setIsListening(true);
      announce('Tinglayapman, gapiring.', true);
    };

    recognition.onresult = (event: any) => {
      const current = event.resultIndex;
      const t = event.results[current][0].transcript;
      setTranscript(t);
      announce(`Siz aytdingiz: ${t}`);
    };

    recognition.onerror = (event: any) => {
      console.error(event.error);
      setIsListening(false);
      announce('Xatolik yuz berdi. Qaytadan urinib koring.', true);
    };

    recognition.onend = () => setIsListening(false);

    recognition.start();
  }, [announce]);

  // --- DOM Effects ---
  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove('text-base', 'text-xl', 'text-2xl', 'theme-slate-dark', 'theme-yellow-black', 'theme-high-light');
    
    if (settings.fontSize === 'normal') root.classList.add('text-base');
    if (settings.fontSize === 'large') root.classList.add('text-xl');
    if (settings.fontSize === 'extra-large') root.classList.add('text-2xl');

    root.classList.add(`theme-${settings.contrastTheme}`);
    
    if (settings.contrastTheme === 'slate-dark') {
      root.style.backgroundColor = '#0f172a';
      root.style.color = '#f8fafc';
    } else if (settings.contrastTheme === 'yellow-black') {
      root.style.backgroundColor = '#000000';
      root.style.color = '#fde047';
      document.body.classList.add("high-contrast", "theme-yellow-black");
    } else if (settings.contrastTheme === 'high-light') {
      root.style.backgroundColor = '#ffffff';
      root.style.color = '#000000';
      document.body.classList.remove("high-contrast", "theme-yellow-black");
    }
  }, [settings.fontSize, settings.contrastTheme]);

  // Keyboard navigation for old compatibility
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.altKey) {
        if (e.key.toLowerCase() === 'c') {
          e.preventDefault();
          announce('Chat sahifasiga otilmoqda');
          window.location.hash = '#/chat';
        }
        if (e.key.toLowerCase() === 't') {
          e.preventDefault();
          announce('Tayyorlov sahifasiga otilmoqda');
          window.location.hash = '#/prepare';
        }
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [announce]);

  return (
    <AccessibilityContext.Provider
      value={{
        // New
        settings,
        setContrastTheme,
        setFontSize,
        setUserMode,
        toggleScreenReader,
        toggleAutoSpeak,
        toggleSignLanguageAssist,
        setSpeakSpeed,
        speakText,
        stopSpeaking,
        isSpeaking,
        activeAnnouncement,
        
        // Old Compatibility
        theme: settings.contrastTheme,
        setTheme: setContrastTheme,
        fontSize: settings.fontSize,
        speak,
        listen,
        isListening,
        transcript,
        narratorText,
        announce
      }}
    >
      <div 
        aria-live={isAssertive ? 'assertive' : 'polite'} 
        aria-atomic="true" 
        className="sr-only"
      >
        {narratorText}
      </div>
      {children}
    </AccessibilityContext.Provider>
  );
};

export const useAccessibility = () => {
  const context = useContext(AccessibilityContext);
  if (!context) {
    throw new Error("useAccessibility must be used within AccessibilityProvider");
  }
  return context;
};
