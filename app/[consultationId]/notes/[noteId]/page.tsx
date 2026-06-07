import Link from "next/link";
import { notFound } from "next/navigation";
import { getConsultation } from "@/lib/consultations";
import {
  allNotesByConsultation,
  getBlindNote,
  getNotesForConsultation,
} from "@/lib/notes";

type NotePageProps = {
  params: Promise<{
    consultationId: string;
    noteId: string;
  }>;
};

export function generateStaticParams() {
  return allNotesByConsultation.flatMap((entry) =>
    entry.notes.map((note) => ({
      consultationId: entry.consultationId,
      noteId: note.id,
    })),
  );
}

export async function generateMetadata({ params }: NotePageProps) {
  const { consultationId, noteId } = await params;
  const consultation = getConsultation(consultationId);
  const note = getBlindNote(consultationId, noteId);

  if (!consultation || !note) {
    return {
      title: "Note unavailable",
    };
  }

  return {
    title: `${note.label} | ${consultation.title}`,
  };
}

export default async function NotePage({ params }: NotePageProps) {
  const { consultationId, noteId } = await params;
  const consultation = getConsultation(consultationId);
  const noteSet = getNotesForConsultation(consultationId);
  const note = getBlindNote(consultationId, noteId);

  if (!consultation || !noteSet || !note) notFound();

  return (
    <main className="page-shell note-shell">
      <header className="note-header">
        <div>
          <p className="eyebrow">Blinded notes</p>
          <h1>{consultation.title}</h1>
        </div>
        <div className="note-header-actions">
          <Link className="back-link" href={`/${consultationId}`}>
            Audio and transcript
          </Link>
          <Link className="back-link" href="/">
            All consultations
          </Link>
        </div>
      </header>

      <nav className="note-tabs" aria-label="Blinded note options">
        {noteSet.notes.map((candidate) => (
          <Link
            aria-current={candidate.id === note.id ? "page" : undefined}
            className={`note-tab${candidate.id === note.id ? " active" : ""}`}
            href={`/${consultationId}/notes/${candidate.id}`}
            key={candidate.id}
          >
            {candidate.label}
          </Link>
        ))}
      </nav>

      <article className="note-document" aria-labelledby="note-title">
        <div className="note-document-header">
          <p className="eyebrow">Current note</p>
          <h2 id="note-title">{note.label}</h2>
        </div>

        {note.text ? (
          <div className="note-body">{note.text}</div>
        ) : (
          <div className="notice" role="status">
            This blinded note is not available yet in source_data.xlsx.
          </div>
        )}
      </article>
    </main>
  );
}
