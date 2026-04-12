// content/blob-bridge.ts
import { loggers } from "@utils/logger";

const logger = loggers.content;

function onBlobUrlDetected(event: MessageEvent): void {
  if (event.source !== window || event.data?.source !== "FB_VOICE_DOWNLOADER") {
    return;
  }

  if (event.data.action === "blobUrlDetected") {
    chrome.runtime.sendMessage({
      action: "registerAudioUrl",
      url: event.data.blobUrl,
      durationMs: event.data.durationMs,
      blobIndex: event.data.blobIndex,
      lastModified: null,
    });
  }
}

export function initializeBlobBridge(): void {
  window.addEventListener("message", onBlobUrlDetected);
  logger.info("Blob bridge initialized");
}