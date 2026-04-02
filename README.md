# HSP Exteriors — Business Suite

A full business management app for HSP Exteriors including customer tracking, job management, AI-powered quoting, cold email outreach, and Google Calendar integration.

## Deploy to Vercel (2 minutes)

1. Go to [vercel.com](https://vercel.com) and sign up free with GitHub
2. Click **"Add New Project"**
3. Click **"Import Git Repository"** — or use **"Deploy from template"** and drag this folder
4. Set the **Root Directory** to `public`
5. Click **Deploy**

Your app will be live at `https://hsp-exteriors.vercel.app` (or similar).

## After deploying

Open the app, go to **Settings** and fill in:

- **Anthropic API key** — from console.anthropic.com (powers AI features)
- **Google Calendar Client ID** — from Google Cloud Console (calendar sync)
- **Supabase URL + anon key** — from supabase.com (cloud sync across devices)
- **Company info** — your name, phone, email

## Add to phone home screen

**iPhone (Safari):** Open your Vercel URL → tap Share → "Add to Home Screen"  
**Android (Chrome):** Open your Vercel URL → tap menu → "Add to Home Screen"

The app works offline and feels like a native app.

## Features

- Dashboard with live stats
- Customer & job tracking
- Visual job pipeline (Lead → Quoted → Active → Done)
- Monthly calendar with scheduled jobs
- AI-powered quoting with local market pricing
- Cold email outreach with AI drafting
- Google Calendar integration
- Supabase cloud sync (phone + computer share same data)
