# Environment Variables Guide

## Development (.env.local)

```
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyXxxx...
```

### Getting Your Credentials

1. **NEXT_PUBLIC_SUPABASE_URL**
   - Go to Supabase dashboard
   - Select your project
   - Go to Settings → API
   - Copy the "Project URL"

2. **NEXT_PUBLIC_SUPABASE_ANON_KEY**
   - Same page (Settings → API)
   - Copy the "anon public" key (not the service_role key)

## Production (Vercel)

Set these environment variables in Vercel project settings:

- Go to Project Settings → Environment Variables
- Add:
  - `NEXT_PUBLIC_SUPABASE_URL`: Same value as development
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Same value as development

These are safe to expose in frontend because:
- NEXT_PUBLIC prefix means they're embedded in client code anyway
- Supabase uses Row Level Security policies
- User data is protected by auth.uid() checks
- Public anon key has no write/delete access by default

## Security Notes

⚠️ **Never commit `.env.local`** - it's already in `.gitignore`

⚠️ **Never expose service_role key** - only use anon key

⚠️ **Always use HTTPS** in production

✓ **RLS policies protect data** - even if key is public

✓ **Auth verified** by database functions

✓ **All queries filtered** by user ID at database level
