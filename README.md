# ViralLens 🎯

AI-powered viral video analysis for UGC creators. Decode viral videos, diagnose your flops, and get AI coaching.

## Tech Stack
- **Frontend**: React + TypeScript + Vite + Tailwind CSS + Framer Motion
- **Backend**: Supabase (Auth, Database, Edge Functions)
- **AI**: Google Gemini 2.0 Flash
- **Hosting**: Vercel

---

## 🚀 SETUP GUIDE (Step by Step)

### Step 1: Supabase Setup

1. Go to [supabase.com](https://supabase.com) and create a new project
2. Save your **Project URL** and **Anon Key** (Settings → API)
3. Go to **SQL Editor** → New Query
4. Copy the ENTIRE contents of `supabase/migrations/001_initial_schema.sql` and run it
5. Go to **Authentication → Providers**:
   - Make sure **Email** is enabled (it is by default)
   - Enable **Google** OAuth if you want Google sign-in ([guide](https://supabase.com/docs/guides/auth/social-login/auth-google))
6. Go to **Authentication → URL Configuration**:
   - Set **Site URL** to `http://localhost:3000` (change to your Vercel URL after deploying)
   - Add `http://localhost:3000/dashboard` to **Redirect URLs**

### Step 2: Gemini API Key

1. Go to [aistudio.google.com/apikey](https://aistudio.google.com/apikey)
2. Create an API key
3. Save it — you'll need it for the Edge Functions

### Step 3: Deploy Edge Functions

Install Supabase CLI:
```bash
npm install -g supabase
```

Login and link your project:
```bash
supabase login
supabase link --project-ref YOUR_PROJECT_REF
```

Set your Gemini API key as a secret:
```bash
supabase secrets set GEMINI_API_KEY=your_gemini_api_key_here
```

Deploy all 3 functions:
```bash
supabase functions deploy decode-video
supabase functions deploy diagnose-flop
supabase functions deploy coach-chat
```

### Step 4: Run Locally

Create a `.env` file in the root:
```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

Install and run:
```bash
npm install
npm run dev
```

Open http://localhost:3000

### Step 5: Deploy to Vercel

1. Push the project to GitHub:
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/YOUR_USERNAME/virallens.git
git push -u origin main
```

2. Go to [vercel.com](https://vercel.com) → Import your GitHub repo
3. Add **Environment Variables** in Vercel:
   - `VITE_SUPABASE_URL` = your Supabase project URL
   - `VITE_SUPABASE_ANON_KEY` = your Supabase anon key
4. Deploy!
5. After deploying, go back to Supabase → Authentication → URL Configuration:
   - Update **Site URL** to your Vercel URL (e.g., `https://virallens.vercel.app`)
   - Add `https://virallens.vercel.app/dashboard` to **Redirect URLs**

---

## 💳 Adding Payments (Optional — For Later)

To add Stripe payments:
1. Create a Stripe account at [stripe.com](https://stripe.com)
2. Create products for Pro ($9.99/mo) and Credits Pack ($4.99)
3. Create a Supabase Edge Function for checkout sessions
4. Wire up the "Upgrade to Pro" and "Buy Credits" buttons

This is optional for launch — the free credits system works without payments.

---

## 📁 Project Structure

```
virallens/
├── src/
│   ├── components/       # Shared UI components
│   │   ├── Navbar.tsx
│   │   ├── Footer.tsx
│   │   ├── AnimatedSection.tsx
│   │   ├── AnimatedCounter.tsx
│   │   └── ProtectedRoute.tsx
│   ├── context/
│   │   └── AuthContext.tsx    # Auth state management
│   ├── lib/
│   │   ├── supabase.ts       # Supabase client
│   │   ├── credits.ts        # Credits logic
│   │   └── ai.ts             # AI API calls
│   ├── pages/
│   │   ├── Landing.tsx        # Landing page (/)
│   │   ├── Auth.tsx           # Sign up / Sign in (/auth)
│   │   ├── Dashboard.tsx      # User dashboard (/dashboard)
│   │   ├── Decode.tsx         # Viral decoder (/decode)
│   │   ├── Diagnose.tsx       # Flop diagnosis (/diagnose)
│   │   ├── Coach.tsx          # AI coach chat (/coach)
│   │   └── Settings.tsx       # Account settings (/settings)
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── supabase/
│   ├── migrations/
│   │   └── 001_initial_schema.sql
│   └── functions/
│       ├── decode-video/index.ts
│       ├── diagnose-flop/index.ts
│       └── coach-chat/index.ts
├── package.json
├── tailwind.config.js
├── vite.config.ts
├── vercel.json
└── .env.example
```

---

## Credits System

| Action | Cost |
|--------|------|
| Decode a Viral Video | 2 credits |
| Diagnose a Flop | 2 credits |
| AI Coach Message | 1 credit |

Every new user starts with **15 free credits**.

---

Built with 💜 by ViralLens
