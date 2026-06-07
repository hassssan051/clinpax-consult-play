import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Primock Consultation Player",
  description: "Audio and diarized transcript player for Primock consultations.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
