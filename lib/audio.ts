import "server-only";

import { existsSync } from "node:fs";
import path from "node:path";

export const localAudioDir = path.join(
  process.cwd(),
  "primock57",
  "output",
  "mixed_audio_mp3",
);

export function hasLocalAudioFile(audioFile: string) {
  return existsSync(path.join(localAudioDir, audioFile));
}

export function getAudioUrl(audioFile: string) {
  if (hasLocalAudioFile(audioFile)) {
    return `/api/local-audio/${audioFile}`;
  }

  const baseUrl = process.env.NEXT_PUBLIC_AUDIO_BASE_URL?.replace(/\/+$/, "");
  if (!baseUrl) return "";
  return `${baseUrl}/${audioFile}`;
}
