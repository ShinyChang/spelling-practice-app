/**
 * TTS voice model definitions
 * Piper TTS: https://github.com/rhasspy/piper
 * Edge TTS: Microsoft Edge neural voices
 */

// Edge TTS voices for Traditional Chinese (Taiwan)
export const EDGE_TTS_VOICES = {
  "zh-TW": [
    {
      id: "zh-TW-HsiaoChenNeural",
      name: "HsiaoChen (曉臻)",
      gender: "female",
      description: "Clear female voice",
    },
    {
      id: "zh-TW-YunJheNeural",
      name: "YunJhe (雲哲)",
      gender: "male",
      description: "Natural male voice",
    },
    {
      id: "zh-TW-HsiaoYuNeural",
      name: "HsiaoYu (曉雨)",
      gender: "female",
      description: "Warm female voice",
    },
  ],
};

// Curated list of high-quality English voices for Piper TTS
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
 * Get all available Piper voices for a language/accent
 */
export const getVoicesForAccent = (accent) => {
  if (accent === "us") return PIPER_VOICES.en_US;
  if (accent === "uk") return PIPER_VOICES.en_GB;
  return [];
};

// Map accent settings to default Edge TTS voice IDs
export const ACCENT_TO_EDGE_TTS_VOICE = {
  "zh-TW": "zh-TW-HsiaoChenNeural",
};

/**
 * Check if Edge TTS supports the given accent (for Traditional Chinese)
 */
export const isEdgeTtsSupportedAccent = (accent) => {
  return accent === "zh-TW";
};

/**
 * Get the default Edge TTS voice ID for an accent
 */
export const getEdgeTtsVoiceForAccent = (accent) => {
  return ACCENT_TO_EDGE_TTS_VOICE[accent] || null;
};

/**
 * Get all available Edge TTS voices for a language/accent
 */
export const getEdgeTtsVoicesForAccent = (accent) => {
  if (accent === "zh-TW") return EDGE_TTS_VOICES["zh-TW"];
  return [];
};
