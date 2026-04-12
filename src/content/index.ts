// content/index.ts
import { initializeBlobBridge } from "./blob-bridge";
import { initializeAudioAnalyzer } from "./audio-analyzer";
import { PlayerScanner } from "./player-scanner";
import { loggers } from "@utils/logger";

const logger = loggers.content;

function initialize(): void {
  logger.info("Content script initializing...");

  initializeBlobBridge();
  initializeAudioAnalyzer();
  new PlayerScanner();

  logger.info("Content script ready");
}

initialize();