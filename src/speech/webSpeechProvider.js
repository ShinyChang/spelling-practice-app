/**
 * Web Speech API provider - uses browser's built-in speech synthesis
 */
export class WebSpeechProvider {
  constructor() {
    this.voices = [];
    this.loadVoices();
  }

  loadVoices() {
    this.voices = window.speechSynthesis.getVoices();
    if (window.speechSynthesis.onvoiceschanged !== undefined) {
      window.speechSynthesis.onvoiceschanged = () => {
        this.voices = window.speechSynthesis.getVoices();
      };
    }
  }

  getVoice(accent) {
    let langCode;
    switch (accent) {
      case "us":
        langCode = "en-US";
        break;
      case "uk":
        langCode = "en-GB";
        break;
      case "zh-TW":
        langCode = "zh-TW";
        break;
      default:
        langCode = "en-US";
    }

    // First try to find a voice that matches the exact language code
    let voice = this.voices.find((v) => v.lang === langCode);

    // If no exact match, look for voices containing the right country code
    if (!voice) {
      const countryCode =
        accent === "us" ? "US" : accent === "uk" ? "GB" : "TW";
      voice = this.voices.find((v) => v.lang.includes(countryCode));
    }

    // Fallback to any English voice if specific accent not available
    if (!voice) {
      voice = this.voices.find((v) => v.lang.includes("en"));
    }

    return voice;
  }

  async speak(text, options = {}) {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = options.speed === "slow" ? 0.7 : 1;
    utterance.pitch = 1;

    const voice = this.getVoice(options.accent);
    if (voice) {
      utterance.voice = voice;
    }

    return new Promise((resolve) => {
      utterance.onend = resolve;
      utterance.onerror = resolve; // Resolve on error too to not block
      window.speechSynthesis.speak(utterance);
    });
  }

  cancel() {
    window.speechSynthesis.cancel();
  }

  // WebSpeechProvider is always ready
  isReady() {
    return true;
  }

  isLoading() {
    return false;
  }
}
