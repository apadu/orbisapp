# Orbis accounts and stats setup

Until you finish these steps, the app works in guest-only mode, with stats saved in the browser.

## 1. Create the Supabase project
1. Go to [supabase.com](https://supabase.com) and create a new project (the free tier is fine).
2. Open **SQL Editor**, then **New query**. Paste in all of `supabase/schema.sql` and click **Run**.

## 2. Add the keys to the app
1. In Supabase, open **Project Settings**, then **API**. Copy the **Project URL** and the **anon public** key.
2. Copy `.env.example` to `.env.local` and fill in both values.
3. In Vercel, open **Project**, then **Settings**, then **Environment Variables**. Add the same two variables (`VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`), then redeploy.
4. Run `npm install` locally. This adds `@supabase/supabase-js`.

## 3. Set up email + password sign-in
In Supabase, go to **Authentication**, then **Providers**, then **Email**. It's on by default.
- Under **Authentication**, then **URL Configuration**:
  - Set **Site URL** to your production URL, e.g. `https://orbis.vercel.app`.
  - Add `http://localhost:5173` to the **Redirect URLs**.
- "Confirm email" is on by default, so new users must click a link before they can sign in. You can turn it off for testing.

## 4. Set up Google sign-in
1. In [Google Cloud Console](https://console.cloud.google.com/), go to **APIs & Services**, then **Credentials**. Choose **Create credentials**, then **OAuth client ID**, then **Web application**.
   - For **Authorized redirect URI**, use `https://<your-project-ref>.supabase.co/auth/v1/callback`.
   - You'll need to fill in the OAuth consent screen first: app name, support email, and the `email` and `profile` scopes.
2. Copy the Client ID and Client Secret. In Supabase, go to **Authentication**, then **Providers**, then **Google**, turn it on, and paste them in.

## How the data works
- `profiles`: one row per user. It's created automatically on sign-up and holds the username and avatar.
- `game_results`: one row per finished game. Fields: mode, score, correct/total, duration, and a `details` JSON with each country answered (this drives the Knowledge Map).
- `get_leaderboard(mode, since)`: returns each player's best score for a game. Ties are broken by fastest time.
- Row-level security: users can only read and write their own results. Leaderboards go through the function above and only expose usernames and scores.
- Guest games are saved in the browser. On first sign-in they're uploaded to the account, with duplicates removed via `client_id`.

## Known limitation
Scores are submitted from the browser, so a determined cheater could post fake leaderboard scores. If that becomes a problem, the fix is to validate results in a Supabase Edge Function.
