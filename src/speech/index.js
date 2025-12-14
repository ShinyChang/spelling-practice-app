/**
 * Speech provider module - manages different TTS engines
 */
export const PROVIDERS = {
  WEB_SPEECH: "webSpeech",
  PIPER: "piper",
  EDGE_TTS: "edgeTts",
};

export { WebSpeechProvider } from "./webSpeechProvider";
export { PiperProvider } from "./piperProvider";
export { EdgeTtsProvider } from "./edgeTtsProvider";
