import { useEffect } from "react";
import { NavTab } from "../components/Navbar";

export function useGlobalHotkeys(
  setActiveTab: (tab: NavTab) => void,
  toggleScreenReader: () => void,
  toggleContrast: () => void
) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Faqat Alt tugmasi bilan birga bosilganda
      if (!e.altKey) return;

      switch (e.key.toLowerCase()) {
        case "c":
          e.preventDefault();
          setActiveTab("chat");
          break;
        case "t":
          e.preventDefault();
          setActiveTab("tayyorlov");
          break;
        case "s":
          e.preventDefault();
          setActiveTab("ishora");
          break;
        case "v":
          e.preventDefault();
          setActiveTab("cv-sign");
          break;
        case "l":
          e.preventDefault();
          setActiveTab("live-assist");
          break;
        case "e":
          e.preventDefault();
          setActiveTab("imtihon");
          break;
        case "r":
          e.preventDefault();
          toggleScreenReader();
          break;
        case "k":
          e.preventDefault();
          toggleContrast();
          break;
        default:
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [setActiveTab, toggleScreenReader, toggleContrast]);
}
