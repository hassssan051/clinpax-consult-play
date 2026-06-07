import { consultations } from "./consultations-data";

export type Speaker = "Doctor" | "Patient";

export type TranscriptLine = {
  id: string;
  speaker: Speaker;
  start: number;
  end: number;
  text: string;
};

export type Consultation = {
  id: string;
  title: string;
  day: number;
  consultationNumber: number;
  audioFile: string;
  transcript: readonly TranscriptLine[];
};

export const allConsultations = consultations;

export function getConsultation(id: string) {
  return allConsultations.find((consultation) => consultation.id === id);
}

export function formatTime(seconds: number) {
  const safeSeconds = Math.max(0, Math.floor(seconds));
  const minutes = Math.floor(safeSeconds / 60);
  const remainingSeconds = safeSeconds % 60;
  return `${minutes}:${String(remainingSeconds).padStart(2, "0")}`;
}
