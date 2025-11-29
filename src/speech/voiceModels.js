/**
 * Piper TTS voice model definitions
 * See https://github.com/rhasspy/piper for full list
 */

// Curated list of high-quality English voices for spelling practice
export const PIPER_VOICES = {
  en_US: [
    {
      id: "en_US-hfc_female-medium",
      name: "HFC Female",
      quality: "medium",
      description: "Clear female voice",
    },
    {
      id: "en_US-lessac-medium",
      name: "Lessac",
      quality: "medium",
      description: "Natural male voice",
    },
    {
      id: "en_US-amy-medium",
      name: "Amy",
      quality: "medium",
      description: "Friendly female voice",
    },
    {
      id: "en_US-ryan-medium",
      name: "Ryan",
      quality: "medium",
      description: "Clear male voice",
    },
  ],
  en_GB: [
    {
      id: "en_GB-cori-medium",
      name: "Cori",
      quality: "medium",
      description: "British female voice",
    },
    {
      id: "en_GB-alba-medium",
      name: "Alba",
      quality: "medium",
      description: "Scottish female voice",
    },
  ],
};

// Map accent settings to default Piper voice IDs
export const ACCENT_TO_PIPER_VOICE = {
  us: "en_US-hfc_female-medium",
  uk: "en_GB-cori-medium",
  "zh-TW": null, // Piper doesn't have good zh-TW support, fallback to Web Speech
};

/**
 * Get the appropriate Piper voice ID for an accent
 * Returns null if Piper doesn't support this accent
 */
export const getPiperVoiceForAccent = (accent) => {
  return ACCENT_TO_PIPER_VOICE[accent] || null;
};

/**
 * Check if Piper supports the given accent
 */
export const isPiperSupportedAccent = (accent) => {
  return ACCENT_TO_PIPER_VOICE[accent] !== null;
};

/**
 * Get all available voices for a language/accent
 */
export const getVoicesForAccent = (accent) => {
  if (accent === "us") return PIPER_VOICES.en_US;
  if (accent === "uk") return PIPER_VOICES.en_GB;
  return [];
};
