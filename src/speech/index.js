/**
 * Speech provider module - manages different TTS engines
 */
export const PROVIDERS = {
  WEB_SPEECH: "webSpeech",
  PIPER: "piper",
};

export { WebSpeechProvider } from "./webSpeechProvider";
export { PiperProvider } from "./piperProvider";
