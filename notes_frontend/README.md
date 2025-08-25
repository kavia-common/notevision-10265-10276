# NoteVision Frontend (Remotion)

This Remotion-based frontend provides:
- Authentication
- Notes CRUD with rich-text editing
- Local Remotion preview and backend-powered video generation with share links
- Responsive layout with sidebar, editor, and preview panel
- Light modern theme using the specified colors

## Quick Start

1. Install dependencies:
   npm i

2. Configure API base (see .env.example) or set up a dev proxy mapping /api to the notes_database backend.

3. Start Remotion Studio:
   npm run dev

Open the provided preview URL. The app UI is visible directly within the Remotion Studio page.

## Render a video via CLI

Example:
npx remotion render src/index.ts NoteVideo out/note.mp4 --props='{"title":"Hello","html":"<p>World</p>"}'
