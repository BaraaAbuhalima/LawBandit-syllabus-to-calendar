# Syllabus to Calendar

Simple app that turns a course syllabus into calendar events and lets you sync them to your Google Calendar.

## Features

- Upload a syllabus text/PDF (content extracted client or server) and parse key dates.
- Edit events directly in a calendar (drag & drop dates).
- Sync events to Google Calendar (skips duplicates).

## Quick Start

```bash
git clone <your-repo-url>
cd syllabus-to-calender
npm install
cp .env.example
npm run dev
```

Visit https://law-bandit-syllabus-to-calendar-su3h-r4cc32tt5.vercel.app

## Environment Variables (.env.local)

```
OPENAI_API_KEY=sk-your-key
GOOGLE_CLIENT_ID=...apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=...
GOOGLE_REDIRECT_URI=http://localhost:3000/api/google/callback
```

Production example:

```
GOOGLE_REDIRECT_URI=https://your-domain.com/api/google/callback
```

## Google OAuth Setup

1. Enable Google Calendar API in Google Cloud Console.
2. Create OAuth Client (Web) and add redirect URIs:
   - http://localhost:3000/api/google/callback
   - https://your-domain.com/api/google/callback
3. Put ID + Secret into `.env.local`.
4. Restart dev server after changes.

## Usage Flow

1. Upload syllabus file.
2. Wait for parsing → events appear in the calendar.
3. Adjust any dates by dragging.
4. Click Connect / Sync Google Calendar.
5. After popup closes it auto-syncs; duplicates (same title + date) are skipped.

## Scripts

```bash
npm run dev      # start locally
npm run build    # production build
npm run start    # run built app
```

## Troubleshooting

| Issue                 | What to do                                                                |
| --------------------- | ------------------------------------------------------------------------- |
| redirect_uri_mismatch | Make sure exact redirect URL is in Google Console.                        |
| Authorization expired | Reconnect Google; may need prompt=consent again.                          |
| No events parsed      | Check file content or ensure OPENAI_API_KEY is valid if using AI parsing. |
| 5MB limit error       | Reduce file size or strip images.                                         |
