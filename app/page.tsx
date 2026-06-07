import Link from "next/link";
import { allConsultations } from "@/lib/consultations";

export default function HomePage() {
  return (
    <main className="page-shell">
      <header className="topbar">
        <div>
          <p className="eyebrow">Primock57</p>
          <h1>Consultation Player</h1>
          <p className="lede">
            Open a consultation to play the mixed audio and review the synced,
            diarized transcript.
          </p>
        </div>
      </header>

      <section className="index-grid" aria-label="Consultations">
        {allConsultations.map((consultation) => (
          <Link
            className="consult-link"
            href={`/${consultation.id}`}
            key={consultation.id}
          >
            <strong>{consultation.title}</strong>
            <span>{consultation.transcript.length} lines</span>
          </Link>
        ))}
      </section>
    </main>
  );
}
