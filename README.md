# Primock Consultation Player

Minimal Next.js app for playing the 57 Primock consultations with synced,
diarized transcripts.

## Local Setup

Install dependencies:

```bash
npm install
```

Generate transcript data from the TextGrid files:

```bash
npm run generate:data
```

If `primock57/output/mixed_audio_mp3` exists locally, the app serves audio from
that folder through `/api/local-audio/...`; no external audio URL is needed for
local development.

For deployed Vercel usage, create `.env.local` and set your public audio base
URL:

```bash
NEXT_PUBLIC_AUDIO_BASE_URL=https://your-public-audio-base-url
```

If MP3s are uploaded inside an `audio/` prefix, include it:

```bash
NEXT_PUBLIC_AUDIO_BASE_URL=https://your-public-audio-base-url/audio
```

Run locally:

```bash
npm run dev
```

Open `http://localhost:3000/day1_consultation01`.

## Hosted Audio

Upload every file in `primock57/output/mixed_audio_mp3` to your public audio
store, keeping filenames unchanged:

```text
day1_consultation01.mp3
day1_consultation02.mp3
...
day5_consultation12.mp3
```

The app builds audio URLs as:

```text
${NEXT_PUBLIC_AUDIO_BASE_URL}/day1_consultation01.mp3
```

## Vercel Blob Audio

Vercel Blob works well as long as the uploaded public URLs keep stable
filenames. The final URL should look like:

```text
https://<store>.public.blob.vercel-storage.com/audio/day1_consultation01.mp3
```

Then set:

```bash
NEXT_PUBLIC_AUDIO_BASE_URL=https://<store>.public.blob.vercel-storage.com/audio
```

If you upload with the Vercel Blob SDK or CLI, use a pathname like
`audio/day1_consultation01.mp3` and disable the random suffix
(`addRandomSuffix: false`). If Vercel adds a random suffix, the app cannot infer
the URL from the consultation ID without a separate URL manifest.

Set cache metadata on the uploaded MP3 objects so evaluators do not re-download
the same audio unnecessarily:

```text
Cache-Control: public, max-age=31536000, immutable
Content-Type: audio/mpeg
```

The local audio route already sends these cache headers and supports byte-range
requests for seeking. For Vercel Blob, browser caching and range support are
handled by Vercel's public Blob URL.

## Google Drive

Google Drive public links are not recommended for the deployed audio source.
Drive sharing links are viewer pages, not stable direct media URLs, and direct
download links can hit confirmation pages, quota limits, redirects, or blocked
range requests. Vercel Blob is a cleaner fit for predictable browser audio
playback.

## Vercel

Deploy the app to Vercel Hobby and set this environment variable in the Vercel
project:

```bash
NEXT_PUBLIC_AUDIO_BASE_URL=https://<store>.public.blob.vercel-storage.com/audio
```

The local `primock57` dataset is excluded from Vercel uploads by
`.vercelignore`; generated transcript data in `lib/consultations-data.ts` is
what ships with the app.
