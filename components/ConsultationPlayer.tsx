"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import type { Consultation } from "@/lib/consultations";
import { formatTime } from "@/lib/consultations";

type ConsultationPlayerProps = {
  consultation: Consultation;
  audioUrl: string;
};

export default function ConsultationPlayer({
  consultation,
  audioUrl,
}: ConsultationPlayerProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const lineRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const [currentTime, setCurrentTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const activeLineIds = useMemo(() => {
    return consultation.transcript
      .filter((line) => currentTime >= line.start && currentTime <= line.end)
      .map((line) => line.id);
  }, [consultation.transcript, currentTime]);

  useEffect(() => {
    if (!isPlaying || activeLineIds.length === 0) return;

    const activeElement = lineRefs.current[activeLineIds[0]];
    activeElement?.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });
  }, [activeLineIds, isPlaying]);

  function seekTo(seconds: number) {
    const audio = audioRef.current;
    if (!audio) return;
    audio.currentTime = seconds;
    setCurrentTime(seconds);
  }

  return (
    <>
      <header className="player-header">
        <div className="player-title">
          <div>
            <p className="eyebrow">Primock57</p>
            <h1>{consultation.title}</h1>
          </div>
          <div className="player-actions">
            <Link className="back-link" href={`/${consultation.id}/notes`}>
              Blinded notes
            </Link>
            <Link className="back-link" href="/">
              All consultations
            </Link>
          </div>
        </div>

        {audioUrl ? (
          <audio
            className="audio-player"
            controls
            preload="metadata"
            ref={audioRef}
            src={audioUrl}
            onPause={() => setIsPlaying(false)}
            onPlay={() => setIsPlaying(true)}
            onTimeUpdate={(event) =>
              setCurrentTime(event.currentTarget.currentTime)
            }
          />
        ) : (
          <div className="notice" role="status">
            Audio URL is not configured. Set NEXT_PUBLIC_AUDIO_BASE_URL in Vercel
            and in your local environment.
          </div>
        )}
      </header>

      <section className="transcript" aria-label="Transcript">
        {consultation.transcript.map((line) => {
          const isActive = activeLineIds.includes(line.id);
          const speakerClass = line.speaker.toLowerCase();

          return (
            <button
              className={`transcript-line${isActive ? " active" : ""}`}
              key={line.id}
              ref={(element) => {
                lineRefs.current[line.id] = element;
              }}
              type="button"
              onClick={() => seekTo(line.start)}
            >
              <span className={`speaker ${speakerClass}`}>{line.speaker}</span>
              <span className="timestamp">
                {formatTime(line.start)}-{formatTime(line.end)}
              </span>
              <span className="utterance">{line.text}</span>
            </button>
          );
        })}
      </section>
    </>
  );
}
