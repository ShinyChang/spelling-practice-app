/**
 * Edge TTS provider - uses Microsoft Edge's neural TTS service
 * Provides high-quality neural voices for Chinese (Mandarin) pronunciation
 */

// Dynamic import for browser environment
let EdgeTTS;

export class EdgeTtsProvider {
  constructor() {
    this._isLoading = false;
    this._isReady = false;
    this._currentAudio = null;
    this._initialized = false;
  }

  async _ensureInitialized() {
    if (this._initialized) return;

    try {
      // Dynamic import for browser compatibility
      const edgeTtsModule = await import('edge-tts-universal/browser');
      EdgeTTS = edgeTtsModule.EdgeTTS;
      this._initialized = true;
      this._isReady = true;
    } catch (error) {
      console.error("Failed to initialize Edge TTS:", error);
      throw error;
    }
  }

  async speak(text, options = {}) {
    await this._ensureInitialized();

    // Cancel current audio if playing
    this.cancel();

    const voice = options.voiceId || "zh-CN-XiaoxiaoNeural";

    try {
      this._isLoading = true;

      const tts = new EdgeTTS(text, voice);
      const result = await tts.synthesize();

      return new Promise((resolve, reject) => {
        // Create audio from the blob
        const audioBlob = new Blob([result.audio], { type: 'audio/mp3' });
        const audioUrl = URL.createObjectURL(audioBlob);

        this._currentAudio = new Audio(audioUrl);

        // Apply speed adjustment
        this._currentAudio.playbackRate = options.speed === "slow" ? 0.7 : 1;

        this._currentAudio.onended = () => {
          URL.revokeObjectURL(audioUrl);
          this._currentAudio = null;
          this._isLoading = false;
          resolve();
        };

        this._currentAudio.onerror = (error) => {
          URL.revokeObjectURL(audioUrl);
          this._currentAudio = null;
          this._isLoading = false;
          reject(error);
        };

        this._currentAudio.play().catch((error) => {
          URL.revokeObjectURL(audioUrl);
          this._isLoading = false;
          reject(error);
        });
      });
    } catch (error) {
      this._isLoading = false;
      console.error("Edge TTS speak error:", error);
      throw error;
    }
  }

  cancel() {
    if (this._currentAudio) {
      this._currentAudio.pause();
      this._currentAudio.currentTime = 0;
      this._currentAudio = null;
    }
  }

  isReady() {
    return this._isReady;
  }

  isLoading() {
    return this._isLoading;
  }
}
