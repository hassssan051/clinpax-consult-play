import Link from "next/link";

export default function NotFound() {
  return (
    <main className="page-shell">
      <p className="eyebrow">Not found</p>
      <h1>Consultation unavailable</h1>
      <p className="lede">
        This consultation ID does not match one of the 57 Primock consultations.
      </p>
      <p className="not-found-actions">
        <Link className="back-link" href="/">
          Back to consultation list
        </Link>
      </p>
    </main>
  );
}
