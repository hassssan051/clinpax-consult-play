import { createReadStream } from "node:fs";
import { stat } from "node:fs/promises";
import path from "node:path";
import { Readable } from "node:stream";
import { NextRequest } from "next/server";
import { localAudioDir } from "@/lib/audio";
import { allConsultations } from "@/lib/consultations";

export const runtime = "nodejs";

const validAudioFiles = new Set<string>(
  allConsultations.map((consultation) => consultation.audioFile),
);

type LocalAudioParams = {
  params: Promise<{
    audioFile: string;
  }>;
};

export async function GET(request: NextRequest, { params }: LocalAudioParams) {
  const { audioFile } = await params;

  if (!validAudioFiles.has(audioFile)) {
    return new Response("Not found", { status: 404 });
  }

  const audioPath = path.join(localAudioDir, audioFile);

  if (!audioPath.startsWith(localAudioDir)) {
    return new Response("Not found", { status: 404 });
  }

  let fileStat;
  try {
    fileStat = await stat(audioPath);
  } catch {
    return new Response("Not found", { status: 404 });
  }

  const range = request.headers.get("range");
  const headers = new Headers({
    "Accept-Ranges": "bytes",
    "Cache-Control": "public, max-age=31536000, immutable",
    "Content-Type": "audio/mpeg",
  });

  if (range) {
    const match = range.match(/^bytes=(\d*)-(\d*)$/);
    if (!match) {
      return new Response("Invalid range", { status: 416 });
    }

    const start = match[1] ? Number(match[1]) : 0;
    const end = match[2] ? Number(match[2]) : fileStat.size - 1;

    if (
      !Number.isFinite(start) ||
      !Number.isFinite(end) ||
      start > end ||
      end >= fileStat.size
    ) {
      headers.set("Content-Range", `bytes */${fileStat.size}`);
      return new Response("Range not satisfiable", { status: 416, headers });
    }

    headers.set("Content-Length", String(end - start + 1));
    headers.set("Content-Range", `bytes ${start}-${end}/${fileStat.size}`);

    const stream = createReadStream(audioPath, { start, end });
    return new Response(Readable.toWeb(stream) as BodyInit, {
      status: 206,
      headers,
    });
  }

  headers.set("Content-Length", String(fileStat.size));

  const stream = createReadStream(audioPath);
  return new Response(Readable.toWeb(stream) as BodyInit, {
    status: 200,
    headers,
  });
}
