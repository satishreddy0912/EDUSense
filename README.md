# Vidya AI — Full Stack Hackathon Build

This build keeps the existing Vidya AI UI/UX and adds the backend/data/AI layer.

### Included
- Persistent backend data store with JSON fallback
- Supabase/PostgreSQL schema and optional production persistence
- Parent OTP authentication and sessions
- Student/parent linked records
- Attendance analytics API
- Quiz CRUD + publish APIs
- Teacher-only source document indexing
- Source-restricted AI quiz generation
- Quiz source attribution
- Student performance aggregation and AI insight endpoint
- Notifications data endpoint
- Existing glassmorphism UI and responsive layout retained

### Start

```bash
npm install
npm run dev:backend
```

In another terminal:

```bash
npm run dev
```

For a single production-style process:

```bash
npm run build
npm start
```

Read `BACKEND_SETUP.md` before connecting Supabase/OpenAI.
