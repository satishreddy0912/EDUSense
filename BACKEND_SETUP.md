# Vidya AI — Connected Backend

The existing UI/UX is preserved. This package adds a real API layer, persistent local storage, optional Supabase/PostgreSQL persistence, source-restricted AI quiz generation, document indexing, parent OTP sessions, attendance/quiz APIs, student performance insights and notification data.

## 1. Install

```bash
npm install
```

## 2. Local development

Terminal 1:

```bash
npm run server
```

Terminal 2:

```bash
npm run dev
```

Open the Vite URL shown in the terminal.

## 3. Production-style local run

```bash
npm run build
npm start
```

Open `http://localhost:4000`.

## 4. Database

The app works immediately using `server/data/db.json`, which persists changes between restarts. For production, create a Supabase project and run `supabase/schema.sql` in the Supabase SQL editor.

Copy `.env.example` to `.env` and set:

```env
SUPABASE_URL=https://YOUR_PROJECT.supabase.co
SUPABASE_SERVICE_ROLE_KEY=YOUR_SERVICE_ROLE_KEY
```

The Node backend uses the service-role key server-side only. Never expose this key as a `VITE_` variable.

## 5. AI Quiz Generation

Set:

```env
OPENAI_API_KEY=YOUR_OPENAI_API_KEY
OPENAI_MODEL=gpt-4.1-mini
```

The `/api/quizzes/generate` endpoint retrieves only documents matching the selected subject/class/chapter/topic and sends only those documents to the AI. No web search or external curriculum content is used.

Without an AI key, the endpoint returns a safe classroom-source demo set so the UI remains usable during a hackathon demo.

## 6. Source documents

The UI can index classroom text content and associates it with the selected scope. For PDF/PPT/PPTX production extraction, connect a parser/storage service or extract text before indexing. The backend API accepts the resulting extracted text at `/api/documents`.

## 7. Parent demo

Roll number: `SNIST10A042`

Parent mobile: `9876543210`

Development OTP: `123456`

Production should replace demo OTP delivery with an SMS provider.

## 8. Important production steps

- Replace demo authentication with Supabase Auth or another identity provider.
- Add row-level security policies for parent/student/teacher/admin roles.
- Move document content to Supabase Storage and keep metadata in Postgres.
- Add a PDF/PPT parser before indexing.
- Use a proper SMS OTP provider.
- Do not commit `.env` or service-role keys.
