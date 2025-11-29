/**
 * Piper TTS provider - uses neural network based speech synthesis
 * Provides higher quality, more natural sounding voices
 */
import * as tts from "@mintplex-labs/piper-tts-web";

export class PiperProvider {
  constructor() {
    this._isLoading = false;
    this._isReady = false;
    this._loadProgress = 0;
    this._currentVoiceId = null;
    this._currentAudio = null;
    this._onProgressCallback = null;
  }

  setProgressCallback(callback) {
    this._onProgressCallback = callback;
  }

  async initialize(voiceId = "en_US-hfc_female-medium") {
    if (this._isLoading) return;
    if (this._isReady && this._currentVoiceId === voiceId) return;

    this._isLoading = true;
    this._loadProgress = 0;

    try {
      // Check if voice is already stored
      const storedVoices = await tts.stored();
      if (!storedVoices.includes(voiceId)) {
        // Download the voice model
        await tts.download(voiceId, (progress) => {
          this._loadProgress = progress.loaded / progress.total;
          if (this._onProgressCallback) {
            this._onProgressCallback(this._loadProgress);
          }
        });
      }

      this._currentVoiceId = voiceId;
      this._isReady = true;
    } catch (error) {
      console.error("Failed to initialize Piper TTS:", error);
      throw error;
    } finally {
      this._isLoading = false;
    }
  }

  async speak(text, options = {}) {
    const voiceId = options.voiceId || "en_US-hfc_female-medium";

    // Initialize if not ready or voice changed
    if (!this._isReady || this._currentVoiceId !== voiceId) {
      await this.initialize(voiceId);
    }

    // Cancel current audio if playing
    this.cancel();

    try {
      const wav = await tts.predict(
        {
          text,
          voiceId,
        },
        (progress) => {
          // Download progress callback (in case model needs downloading)
          this._loadProgress = progress.loaded / progress.total;
          if (this._onProgressCallback) {
            this._onProgressCallback(this._loadProgress);
          }
        }
      );

      return new Promise((resolve, reject) => {
        this._currentAudio = new Audio();
        this._currentAudio.src = URL.createObjectURL(wav);
        // Apply speed adjustment
        this._currentAudio.playbackRate = options.speed === "slow" ? 0.7 : 1;
        this._currentAudio.onended = () => {
          this._currentAudio = null;
          resolve();
        };
        this._currentAudio.onerror = (error) => {
          this._currentAudio = null;
          reject(error);
        };
        this._currentAudio.play().catch(reject);
      });
    } catch (error) {
      console.error("Piper TTS speak error:", error);
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

  getLoadProgress() {
    return this._loadProgress;
  }

  // Get list of available voices
  static async getAvailableVoices() {
    try {
      return await tts.voices();
    } catch (error) {
      console.error("Failed to fetch Piper voices:", error);
      return {};
    }
  }

  // Get list of stored/downloaded voices
  static async getStoredVoices() {
    try {
      return await tts.stored();
    } catch (error) {
      console.error("Failed to get stored voices:", error);
      return [];
    }
  }

  // Remove a voice from storage
  static async removeVoice(voiceId) {
    try {
      await tts.remove(voiceId);
    } catch (error) {
      console.error("Failed to remove voice:", error);
    }
  }
}
