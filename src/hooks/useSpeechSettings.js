import { useState, useEffect, useCallback } from "react";
import { PROVIDERS } from "../speech";

const STORAGE_KEY = "spellingAppSpeechSettings";

const defaultSettings = {
  provider: PROVIDERS.WEB_SPEECH, // 'webSpeech' or 'piper'
  speed: "normal", // 'normal' or 'slow'
  accent: "us", // 'us', 'uk', or 'zh-TW'
  piperVoice: "en_US-hfc_female-medium", // Selected Piper voice
};

/**
 * Hook for managing speech settings with localStorage persistence
 */
export function useSpeechSettings() {
  const [settings, setSettings] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return { ...defaultSettings, ...parsed };
      }
    } catch (error) {
      console.error("Error loading speech settings:", error);
    }
    return defaultSettings;
  });

  // Persist settings to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    } catch (error) {
      console.error("Error saving speech settings:", error);
    }
  }, [settings]);

  // Update a single setting
  const updateSetting = useCallback((key, value) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  }, []);

  // Update multiple settings at once
  const updateSettings = useCallback((newSettings) => {
    setSettings((prev) => ({ ...prev, ...newSettings }));
  }, []);

  // Reset to defaults
  const resetSettings = useCallback(() => {
    setSettings(defaultSettings);
  }, []);

  return {
    settings,
    updateSetting,
    updateSettings,
    resetSettings,
  };
}
