# NoteVision Frontend (Remotion)

This is a Remotion-based web frontend that provides:
- User login/authentication
- CRUD for notes
- Rich text editing
- Local Remotion Player preview for note videos
- Backend-integrated video generation and shareable links

## Development

1) Install dependencies
   npm i

2) Configure backend API URL
   Copy .env.example to appropriate env file for your environment (e.g. VITE_API_BASE if supported) or configure a dev proxy to route /api to your notes_database backend.

3) Start Remotion Studio
   npm run dev

The app UI is mounted directly in the Studio page for seamless editing and preview.

## Environment

- VITE_API_BASE: Base URL for API (e.g., /api or http://localhost:4000)

## Rendering Videos

- The composition "NoteVideo" takes two props:
  - title: string
  - html: rich text HTML
- You can render via CLI:
  npx remotion render src/index.ts NoteVideo out/note.mp4 --props='{"title":"My Note","html":"<p>Body</p>"}'
