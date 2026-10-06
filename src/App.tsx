// src/App.tsx
import React, { useState, useEffect, useRef, useCallback } from "react";
import { AccessibilityProvider, useAccessibility } from "./context/AccessibilityContext";
import { Navbar } from "./components/Navbar";
import { RealTimeChat } from "./components/RealTimeChat";
import { SocialFeed } from "./components/SocialFeed";
import { TayyorlovKurslari } from "./components/TayyorlovKurslari";
import { SignLanguageDictionary } from "./components/SignLanguageDictionary";
import { AiTutorPanel } from "./components/AiTutorPanel";
import { SignLanguageVision } from "./components/SignLanguageVision";
import { InklyuzivBandlik } from "./components/InklyuzivBandlik";
import { LiveAssistVision } from "./components/LiveAssistVision";
import { PsychologyCommunity } from "./components/PsychologyCommunity";
import { TayyorlovExamCenter } from "./components/TayyorlovExamCenter";
import { AdminPanel } from "./components/AdminPanel";
import { ChatMessage, OnlineUser, NavTab } from "./types";
import { useGlobalHotkeys } from "./hooks/useGlobalHotkeys";

const MainAppContent: React.FC = () => {
  const { settings, activeAnnouncement, toggleScreenReader, setContrastTheme } = useAccessibility();
  const [activeTab, setActiveTab] = useState<NavTab>("chat");

  const toggleContrast = useCallback(() => {
    setContrastTheme(settings.contrastTheme === "yellow-black" ? "slate-dark" : "yellow-black");
  }, [settings.contrastTheme, setContrastTheme]);

  useGlobalHotkeys(setActiveTab, toggleScreenReader, toggleContrast);

  const [isWsConnected, setIsWsConnected] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string>("");
  const [currentUserName, setCurrentUserName] = useState<string>("[Foydalanuvchi_1]");
  const [currentRoom, setCurrentRoom] = useState<string>("main");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [onlineUsers, setOnlineUsers] = useState<OnlineUser[]>([]);
  const socketRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    let isMounted = true;
    let reconnectTimer: NodeJS.Timeout | null = null;

    const connectWs = () => {
      try {
        const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
        const wsUrl = `${protocol}//${window.location.host}/ws`;
        const ws = new WebSocket(wsUrl);
        socketRef.current = ws;

        ws.onopen = () => {
          if (isMounted) setIsWsConnected(true);
        };

        ws.onmessage = (event) => {
          if (!isMounted) return;
          try {
            const data = JSON.parse(event.data);
            if (data.type === "INIT") {
              setCurrentUserId(data.userId);
              setCurrentUserName(data.userName);
              setMessages(data.history || []);
              setOnlineUsers(data.onlineUsers || []);
            } else if (data.type === "NEW_MESSAGE") {
              setMessages((prev) => [...prev, data.message]);
            } else if (data.type === "USER_JOINED" || data.type === "USER_LEFT" || data.type === "USERS_UPDATED") {
              setOnlineUsers(data.onlineUsers || []);
            } else if (data.type === "ROOM_CHANGED") {
              setCurrentRoom(data.room);
              setMessages(data.history || []);
              setOnlineUsers(data.onlineUsers || []);
            }
          } catch (err) {
            console.error("WS Parse error:", err);
          }
        };

        ws.onclose = () => {
          if (isMounted) {
            setIsWsConnected(false);
            reconnectTimer = setTimeout(connectWs, 3000);
          }
        };
      } catch (err) {
        console.warn("WebSocket error:", err);
      }
    };

    connectWs();
    return () => {
      isMounted = false;
      if (reconnectTimer) clearTimeout(reconnectTimer);
      if (socketRef.current) socketRef.current.close();
    };
  }, []);

  const handleSendMessage = useCallback(
    (text: string, autoCorrect: boolean, generateSignGestures: boolean) => {
      if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
        socketRef.current.send(
          JSON.stringify({
            type: "SEND_MESSAGE",
            text,
            room: currentRoom,
            autoCorrect,
            generateSignGestures,
          })
        );
      }
    },
    [currentRoom]
  );

  const handleJoinRoom = useCallback((room: string) => {
    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      socketRef.current.send(JSON.stringify({ type: "JOIN_ROOM", room }));
    }
  }, []);

  const getThemeClass = () => {
    if (settings.contrastTheme === "yellow-black") return "theme-yellow-black";
    if (settings.contrastTheme === "high-light") return "theme-high-light";
    return "bg-slate-950 text-slate-100";
  };

  const getFontSizeClass = () => {
    if (settings.fontSize === "small") return "font-size-small";
    if (settings.fontSize === "large") return "font-size-large";
    if (settings.fontSize === "extra-large") return "font-size-extra-large";
    return "font-size-normal";
  };

  return (
    <div className={`min-h-screen flex flex-col font-sans transition-all duration-200 ${getThemeClass()} ${getFontSizeClass()}`}>
      <div role="status" aria-live="polite" className="sr-only">
        {activeAnnouncement}
      </div>

      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        userName={currentUserName}
        isWsConnected={isWsConnected}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-6 lg:p-8">
        {activeTab === "chat" && (
          <RealTimeChat
            messages={messages}
            onlineUsers={onlineUsers}
            currentUserId={currentUserId}
            currentUserName={currentUserName}
            onSendMessage={handleSendMessage}
            onJoinRoom={handleJoinRoom}
            currentRoom={currentRoom}
          />
        )}
        {activeTab === "lenta" && <SocialFeed />}
        {activeTab === "tayyorlov" && <TayyorlovKurslari />}
        {activeTab === "ishora" && <SignLanguageDictionary />}
        {activeTab === "ai-tutor" && <AiTutorPanel />}
        {activeTab === "cv-sign" && (
          <SignLanguageVision
            onSendToChat={(gestureText) => {
              handleSendMessage(gestureText, false, true);
              setActiveTab("chat");
            }}
          />
        )}
        {activeTab === "bandlik" && <InklyuzivBandlik />}
        {activeTab === "live-assist" && <LiveAssistVision />}
        {activeTab === "psychology" && <PsychologyCommunity />}
        {activeTab === "imtihon" && <TayyorlovExamCenter />}
        {activeTab === "admin" && <AdminPanel />}
      </main>

      <footer role="contentinfo" className="border-t border-slate-800 bg-[#0F172A] py-6 px-4 text-center text-xs text-slate-400 mt-auto">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>100% Onlayn AI Inklyuziv Muloqot va <span className="text-[#38BDF8] font-bold">Tayyorlov Kurslari</span> Platformasi.</p>
          <div className="flex items-center gap-3">
            <span>WCAG 2.1 Screen Reader Moslashuvchan</span>
            <span>•</span>
            <span>WebSockets Sinxron Oqim</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default function App() {
  return (
    <AccessibilityProvider>
      <MainAppContent />
    </AccessibilityProvider>
  );
}
