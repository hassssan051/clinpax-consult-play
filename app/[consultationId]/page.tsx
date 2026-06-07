import { notFound } from "next/navigation";
import ConsultationPlayer from "@/components/ConsultationPlayer";
import { getAudioUrl } from "@/lib/audio";
import { allConsultations, getConsultation } from "@/lib/consultations";

type ConsultationPageProps = {
  params: Promise<{
    consultationId: string;
  }>;
};

export function generateStaticParams() {
  return allConsultations.map((consultation) => ({
    consultationId: consultation.id,
  }));
}

export async function generateMetadata({ params }: ConsultationPageProps) {
  const { consultationId } = await params;
  const consultation = getConsultation(consultationId);

  if (!consultation) {
    return {
      title: "Consultation unavailable",
    };
  }

  return {
    title: `${consultation.title} | Primock Consultation Player`,
  };
}

export default async function ConsultationPage({
  params,
}: ConsultationPageProps) {
  const { consultationId } = await params;
  const consultation = getConsultation(consultationId);

  if (!consultation) notFound();

  return (
    <main className="page-shell">
      <ConsultationPlayer
        audioUrl={getAudioUrl(consultation.audioFile)}
        consultation={consultation}
      />
    </main>
  );
}
