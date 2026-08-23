# 🚀 EDUSense (Vidya AI) Hosting & Deployment Guide

This repository is pre-configured for **1-click / turnkey deployment** across all major cloud providers.

---

## ⚡ Option 1: Render (Recommended — Fullstack in 1 Service)

Render runs the Node.js API and serves the compiled React/Vite frontend together on a single public URL with free SSL.

### Steps:
1. Push your latest changes to GitHub.
2. Sign in to [Render.com](https://render.com).
3. Click **New +** → **Web Service**.
4. Connect your repository (`satishreddy0912/EDUSense`).
5. Configure the settings:
   - **Environment**: `Node`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
   - **Plan**: `Free`
6. *(Optional)* Add Environment Variables under **Environment**:
   - `OPENAI_API_KEY`: *(Your OpenAI key for AI quiz generation)*
   - `OPENAI_MODEL`: `gpt-4.1-mini`
   - `SUPABASE_URL`: *(Your Supabase URL, if using Postgres)*
   - `SUPABASE_SERVICE_ROLE_KEY`: *(Your Supabase key)*
7. Click **Create Web Service**. Your app will be live at `https://<your-app-name>.onrender.com`.

---

## ⚡ Option 2: Vercel (Instant Global CDN + Serverless API)

Vercel provides edge hosting for the frontend and automatically runs `/api/*` routes via the pre-configured serverless functions in `/api`.

### Steps:
1. Sign in to [Vercel.com](https://vercel.com).
2. Click **Add New...** → **Project**.
3. Import the `EDUSense` repository.
4. Framework Preset: **Vite** (detected automatically).
5. *(Optional)* Add Environment Variables:
   - `OPENAI_API_KEY`
   - `OPENAI_MODEL`
   - `SUPABASE_URL`
   - `SUPABASE_SERVICE_ROLE_KEY`
6. Click **Deploy**. Vercel will build and launch your application globally.

---

## ⚡ Option 3: Railway / Koyeb

Railway automatically detects both the `Dockerfile` and the `package.json` setup.

### Steps:
1. Visit [Railway.app](https://railway.app) and sign in.
2. Click **New Project** → **Deploy from GitHub repo**.
3. Select `EDUSense`.
4. Railway will automatically build and assign a public domain under **Settings → Networking → Generate Domain**.

---

## ⚡ Option 4: Docker / VPS / Cloud Run

A production-ready multi-stage `Dockerfile` is included.

### Build and Run:
```bash
# Build the Docker image
docker build -t edusense-app .

# Run the container on port 4000
docker run -d -p 4000:4000 --name edusense edusense-app
```
Access at `http://localhost:4000` or your server's public IP.

---

## ⚡ Option 5: Instant Live Tunnel (For Immediate Demos / Hackathon Presentations)

If you need a public HTTPS link **right now** without registering on cloud platforms:

1. Build and start your local server:
   ```bash
   npm run build
   npm start
   ```
2. In a second terminal, start an instant public tunnel:
   ```bash
   npx localtunnel --port 4000
   ```
   *or with Cloudflare:*
   ```bash
   npx cloudflared tunnel --url http://localhost:4000
   ```
3. Open the generated `https://...` link on any device, phone, or tablet.

---

## 🔑 Demo Credentials

Once hosted, you can log in to the portals using these built-in credentials:

- **Teacher Portal**: ID `teacher001` | Password `Vidya@123`
- **Admin Portal**: ID `admin001` | Password `Admin@123`
- **Student Portal**: ID `SNIST10A042` | Password `Student@123`
- **Parent Portal**: Roll Number `SNIST10A042` | Mobile `9876543210` | OTP `123456`
