import { notFound, redirect } from "next/navigation";
import { allConsultations, getConsultation } from "@/lib/consultations";
import { getFirstNoteId } from "@/lib/notes";

type NotesIndexPageProps = {
  params: Promise<{
    consultationId: string;
  }>;
};

export function generateStaticParams() {
  return allConsultations.map((consultation) => ({
    consultationId: consultation.id,
  }));
}

export default async function NotesIndexPage({ params }: NotesIndexPageProps) {
  const { consultationId } = await params;
  const consultation = getConsultation(consultationId);
  const firstNoteId = getFirstNoteId(consultationId);

  if (!consultation || !firstNoteId) notFound();

  redirect(`/${consultationId}/notes/${firstNoteId}`);
}
