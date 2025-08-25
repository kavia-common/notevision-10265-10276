# notes_database Integration

This frontend expects an HTTP API provided by the notes_database service with endpoints:

Auth:
- POST /auth/login {email, password} -> {token, user}
- GET /auth/me -> User (requires Authorization: Bearer <token>)

Notes:
- GET /notes -> Note[]
- GET /notes/:id -> Note
- POST /notes {title, content} -> Note
- PUT /notes/:id {title?, content?} -> Note
- DELETE /notes/:id -> {success: boolean}

Video:
- POST /notes/:id/video -> {jobId} or {url}
- GET /notes/:id/video/:jobId -> {status: pending|processing|done|error, url?, error?}

Configure the base URL via VITE_API_BASE (see .env.example). In development you can proxy /api to the backend.
