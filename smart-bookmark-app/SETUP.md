# Smart Bookmark App - Setup & Deployment Guide

This document provides step-by-step instructions to set up and deploy the Smart Bookmark App.

## Quick Start for Testing

### 1. Local Development Setup

```bash
# Clone repository
git clone <your-repo-url>
cd smart-bookmark-app

# Install dependencies
npm install

# Create .env.local file with your Supabase credentials
echo "NEXT_PUBLIC_SUPABASE_URL=your-supabase-url" > .env.local
echo "NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key" >> .env.local

# Run development server
npm run dev
```

Visit http://localhost:3000 in your browser.

### 2. Supabase Setup (Free Tier Available)

1. **Create Account & Project**
   - Go to https://supabase.com
   - Sign up and create a new project
   - Wait for the project to initialize (about 2-3 minutes)

2. **Get Your Credentials**
   - Go to Settings → API
   - Copy `Project URL` and `anon public` key
   - Add these to your `.env.local` file

3. **Create Database Tables**
   - Go to SQL Editor in Supabase dashboard
   - Create new query
   - Copy and paste entire content from `supabase/migrations/001_create_bookmarks_table.sql`
   - Click "Run"
   - This creates the bookmarks table with Row Level Security policies

4. **Enable Google OAuth (Auth Provider)**
   - Go to Authentication → Providers
   - Find and enable Google
   - You'll need Google OAuth credentials (see next section)

### 3. Google OAuth Setup

1. **Create Google Cloud Project**
   - Go to https://console.cloud.google.com
   - Create a new project or select existing
   - Search for "Google+ API" and enable it

2. **Create OAuth Credentials**
   - Go to Credentials → Create Credentials → OAuth 2.0 Client ID
   - Choose "Web application"
   - Add Authorized redirect URIs:
     - `http://localhost:3000/auth/callback` (for local testing)
   - Create credentials
   - Copy Client ID and Client Secret

3. **Configure in Supabase**
   - Go to Supabase → Authentication → Providers → Google
   - Paste your Google Client ID and Client Secret
   - Save

### 4. Test Locally

```bash
npm run dev
```

- Open http://localhost:3000
- Click "Sign in with Google"
- You should be redirected to Google, then back to app
- Navigate to bookmarks page
- Add a bookmark (title + URL)
- Open another browser tab to same URL
- Add another bookmark in tab 1
- Watch it appear in tab 2 instantly (real-time!)

## Deployment to Vercel

### Prerequisites
- GitHub repository (push your code first)
- Vercel account (free tier available)
- Supabase project already set up

### Deployment Steps

1. **Push Code to GitHub**
   ```bash
   git remote add origin <your-github-repo-url>
   git push -u origin main
   ```

2. **Deploy on Vercel**
   - Go to https://vercel.com
   - Click "New Project"
   - Import your GitHub repository
   - Configure environment variables:
     - `NEXT_PUBLIC_SUPABASE_URL`: Your Supabase project URL
     - `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Your Supabase anon key
   - Click "Deploy"
   - Wait for deployment to complete (usually 2-3 minutes)

3. **Get Your Live URL**
   - After deployment, Vercel shows your URL (e.g., `https://smart-bookmark-app.vercel.app`)
   - This is your live application URL

4. **Update Google OAuth for Production**
   - Go to Google Cloud Console → Credentials
   - Edit your OAuth 2.0 Client ID
   - Add new Authorized redirect URI:
     - `https://your-vercel-url.vercel.app/auth/callback`
   - Save changes

5. **Update Supabase Settings**
   - Go to Supabase → Authentication → URL Configuration
   - Set Site URL to: `https://your-vercel-url.vercel.app`
   - Add Redirect URLs:
     - `https://your-vercel-url.vercel.app/**`

6. **Test Production Deployment**
   - Visit your live Vercel URL
   - Sign in with Google
   - Add bookmarks
   - Test real-time sync across tabs

## Features to Highlight When Testing

1. **Google OAuth Sign-In**
   - No email/password needed
   - Only Google account required
   - Secure OAuth 2.0 flow

2. **Private Bookmarks**
   - Sign in with Account A, add bookmarks
   - Sign in with Account B (different Google account), verify you see NO bookmarks from Account A
   - Only see your own bookmarks

3. **Real-time Sync**
   - Open app in 2 browser tabs
   - Sign in same account in both
   - Add bookmark in tab 1
   - Watch it appear in tab 2 without refresh
   - Delete bookmark in tab 2
   - Watch it disappear from tab 1 instantly

4. **URL Validation**
   - Try adding bookmark with invalid URL
   - See error message
   - Add bookmark with valid URL
   - Should work

## Troubleshooting

### "Not authenticated" or Redirect Loop
- **Cause**: Redirect URI mismatch between Google OAuth and app
- **Fix**: Verify exact redirect URI matches in all 3 places:
  1. Google Cloud Console
  2. Supabase settings
  3. App code

### Bookmarks don't sync in real-time
- **Cause**: RLS policies might be disabled
- **Fix**: 
  1. Go to Supabase SQL Editor
  2. Run: `ALTER PUBLICATION supabase_realtime ADD TABLE bookmarks;`
  3. Refresh browser

### "Page requires .env.local"
- **Cause**: Missing environment variables
- **Fix**: Make sure `.env.local` has:
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### Build fails on Vercel
- **Cause**: Environment variables not set
- **Fix**: Go to Vercel project settings and add:
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## What to Expect

The app should work as follows:

1. **First Visit**: Redirects to Google login
2. **After Login**: Shows empty bookmarks list with form to add
3. **Add Bookmark**: 
   - Enter title and URL
   - Click "Add Bookmark"
   - Appears immediately in list
4. **Real-time Updates**:
   - Open same account in 2 tabs
   - Add bookmark in one tab
   - Appears instantly in other (no refresh needed)
5. **Delete**: 
   - Click ✕ on bookmark
   - Confirm deletion
   - Disappears immediately from all tabs
6. **Privacy**:
   - Different Google accounts can't see each other's bookmarks
   - Each user gets isolated data

## Next Steps

After deployment, you can:
- Share your Vercel URL for testing
- Add features (categories, search, export)
- Monitor usage in Vercel and Supabase dashboards
- Scale to more users (both free tiers support good volume)

## Support

- Supabase Docs: https://supabase.com/docs
- Next.js Docs: https://nextjs.org/docs
- Vercel Docs: https://vercel.com/docs
- Google OAuth: https://developers.google.com/identity/protocols/oauth2
