import { notesByConsultation } from "./notes-data";

export type BlindNote = {
  id: "note-a" | "note-b" | "note-c" | "note-d";
  label: "Note A" | "Note B" | "Note C" | "Note D";
  text: string;
};

export type NotesForConsultation = {
  consultationId: string;
  notes: readonly BlindNote[];
};

export const allNotesByConsultation = notesByConsultation;

export function getNotesForConsultation(consultationId: string) {
  return allNotesByConsultation.find(
    (entry) => entry.consultationId === consultationId,
  );
}

export function getBlindNote(consultationId: string, noteId: string) {
  return getNotesForConsultation(consultationId)?.notes.find(
    (note) => note.id === noteId,
  );
}

export function getFirstNoteId(consultationId: string) {
  return getNotesForConsultation(consultationId)?.notes[0]?.id;
}
