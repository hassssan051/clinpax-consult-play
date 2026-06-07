import { existsSync, readdirSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const transcriptsDir = path.join(root, "primock57", "transcripts");
const audioDir = path.join(root, "primock57", "output", "mixed_audio_mp3");

const ids = readdirSync(transcriptsDir)
  .filter((file) => file.endsWith("_doctor.TextGrid"))
  .map((file) => file.replace("_doctor.TextGrid", ""))
  .sort();

const missing = ids.filter((id) => !existsSync(path.join(audioDir, `${id}.mp3`)));

if (ids.length !== 57) {
  throw new Error(`Expected 57 consultations, found ${ids.length}`);
}

if (missing.length > 0) {
  throw new Error(`Missing MP3 files: ${missing.join(", ")}`);
}

console.log("Consultation data check passed: 57 TextGrid pairs and 57 MP3 files.");
