# Smart-Bookmark-App
Smart Bookmark App
A modern bookmark manager built with Next.js, Supabase, and Tailwind CSS. Save your favorite links securely and access them from anywhere with real-time synchronization across devices.

Features
Google OAuth Authentication - One-click sign-in using your Google account
Bookmark Management - Add, view, and delete bookmarks with ease
Real-time Sync - Bookmarks update instantly across all open tabs/devices without page refresh
Private Bookmarks - Each user can only see their own bookmarks
Clean UI - Modern, responsive design built with Tailwind CSS
Mobile Friendly - Works seamlessly on mobile, tablet, and desktop
Tech Stack
Frontend: Next.js 14+ (App Router), React, TypeScript, Tailwind CSS
Backend: Supabase (PostgreSQL database, real-time subscriptions)
Authentication: Supabase Auth with Google OAuth
Hosting: Vercel
Real-time: Supabase Real-time Engine
Getting Started
Prerequisites
Node.js 18+ and npm installed
A Supabase account (free tier available)
A Google OAuth application setup
1. Clone the Repository
git clone https://github.com/yourusername/smart-bookmark-app.git
cd smart-bookmark-app
npm install
2. Set Up Supabase Project
Go to supabase.com and create a new project
Wait for the project to be ready
Go to Settings > API to get your project credentials:
Copy your Project URL
Copy your anon public key
3. Configure Google OAuth
Go to Google Cloud Console
Create a new project
Enable Google+ API
Create OAuth 2.0 credentials (Web application)
Add authorized redirect URIs:
http://localhost:3000/auth/callback (for local development)
https://yourdomain.vercel.app/auth/callback (for production)
Copy the Client ID and Client Secret
In Supabase dashboard:
Go to Authentication > Providers
Enable Google provider
Paste your Client ID and Client Secret
4. Create Database Schema
In Supabase, go to SQL Editor
Create a new query and paste the SQL from supabase/migrations/001_create_bookmarks_table.sql
Run the query
5. Set Environment Variables
Create a .env.local file in the root directory:

NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
6. Run Locally
npm run dev
Open http://localhost:3000 with your browser.

Project Structure
app/
├── page.tsx                 # Login page
├── auth/
│   └── callback/page.tsx   # OAuth callback handler
├── bookmarks/
│   └── page.tsx            # Main bookmarks dashboard
└── layout.tsx              # Root layout
components/
├── BookmarkForm.tsx        # Form to add new bookmarks
└── BookmarkList.tsx        # Display and manage bookmarks
lib/
└── client.ts               # Supabase client utilities
supabase/
└── migrations/
    └── 001_create_bookmarks_table.sql
.env.local                  # Environment variables (not committed)
Features in Detail
Authentication
Users sign in with their Google account
OAuth handled securely via Supabase
Session persisted automatically
Automatic redirect to bookmarks page on login
Bookmark Management
Add: Simple form with URL and title validation
View: Paginated list of bookmarks with domain names and timestamps
Delete: One-click delete with confirmation
Real-time: All changes sync instantly across all open sessions
Real-time Synchronization
Powered by Supabase Realtime with PostgreSQL LISTEN feature
Uses WebSocket connections for instant updates
Subscribe to changes specific to the logged-in user
No page reload needed - bookmarks appear instantly
Security
Row Level Security (RLS) policies ensure users only see their own data
All queries filtered by auth.uid() on the database level
Public anon key safe to expose in frontend
Private user data never exposed to other users
Problems & Solutions
Problem 1: CORS Issues with Supabase
Issue: Initial development had CORS errors when trying to connect to Supabase from localhost.

Solution:

Ensured the Supabase URL and anon key were correctly configured
Used Supabase's built-in CORS support (already configured by default)
Made sure we were using the correct library (@supabase/ssr for proper App Router support)
Problem 2: Real-time Subscriptions Not Working
Issue: Bookmarks weren't updating in real-time when added from another tab.

Solution:

Verified that Row Level Security (RLS) policies were enabled on the bookmarks table
Ensured the supabase_realtime publication included the bookmarks table with ALTER PUBLICATION supabase_realtime ADD TABLE bookmarks;
Used proper channel naming with user-specific filters: channel('bookmarks:${userId}')
Tested with browser DevTools to confirm WebSocket connection was established
Problem 3: Auth State Not Persisting
Issue: Users were logged out after page refresh during development.

Solution:

Switched from deprecated @supabase/auth-helpers-nextjs to @supabase/ssr package
Used proper session handling in Next.js App Router
Implemented proper getSession() calls in useEffect to check authentication state
Problem 4: Tailwind CSS Not Loading
Issue: Styles appeared broken after initial setup.

Solution:

Verified Tailwind CSS was properly installed during Next.js project creation
Confirmed globals.css had Tailwind directives
Made sure build process was restarted
Problem 5: Google OAuth Redirect URI Mismatch
Issue: Got "redirect_uri_mismatch" error during Google sign-in flow.

Solution:

Verified exact redirect URI in Google Cloud Console matched the app redirect
Used window.location.origin to build dynamic redirect URIs for different environments
For local dev: http://localhost:3000/auth/callback
For production: https://yourdomain.vercel.app/auth/callback
Added both to Google OAuth configuration
Problem 6: npm Package Installation Issues on Windows
Issue: npm install failed with permission and tarball corruption errors due to OneDrive path length issues.

Solution:

Used npm cache clean --force to clear corrupted cache
Ran npm install --legacy-peer-deps for better dependency resolution
Moved project to a shorter path if needed
Used Remove-Item -Recurse to properly clean up node_modules before retry
Deployment to Vercel
Prerequisites
GitHub repository with the code (public or private)
Vercel account linked to GitHub
Deployment Steps
Push to GitHub

git add .
git commit -m "Initial commit: Smart Bookmark App"
git push origin main
Deploy on Vercel

Go to vercel.com
Click "New Project"
Import your GitHub repository
In Environment Variables, add:
NEXT_PUBLIC_SUPABASE_URL: Your Supabase project URL
NEXT_PUBLIC_SUPABASE_ANON_KEY: Your Supabase anon key
Click Deploy
Update Google OAuth Redirect URI

Once deployed, get your Vercel URL (e.g., https://smart-bookmark-app.vercel.app)
Go to Google Cloud Console
Add https://your-vercel-url.vercel.app/auth/callback to authorized redirect URIs
Update Supabase Settings

In Supabase, verify site URL is set to your Vercel URL
Update redirect URLs in Authentication settings if needed
Environment Variables
Required for Production
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyXxxx...
Optional
NEXT_PUBLIC_SITE_URL - Override site URL for auth redirects (useful for preview deployments)
API Routes
This app doesn't use API routes. All database operations go directly through Supabase client libraries with proper RLS policies protecting data.

Database Schema
Bookmarks Table
id (UUID) - Primary key
user_id (UUID) - References auth.users(id)
title (VARCHAR) - Bookmark title
url (TEXT) - Bookmark URL
created_at (TIMESTAMP) - Creation timestamp
updated_at (TIMESTAMP) - Last update timestamp
Security Policies
Users can only SELECT/INSERT/UPDATE/DELETE their own bookmarks
Enforced via RLS policies at the database level
No need for backend authorization logic
Performance Optimizations
Real-time subscriptions use efficient WebSocket connections
Database indexes on user_id and created_at for fast queries
Component-level state management prevents unnecessary re-renders
Images/assets served from CDN via Vercel
Future Enhancements
 Bookmark categories/tags
 Search and filter functionality
 Bulk import/export
 Bookmarks sharing (with permission controls)
 Browser extension
 Keyboard shortcuts
 Dark mode
 Bookmark statistics and analytics
Troubleshooting
Bookmarks not syncing in real-time?
Check browser console for WebSocket connection errors
Verify RLS policies are enabled in Supabase
Confirm the bookmarks table is in the supabase_realtime publication
Try clearing browser cache and refreshing
Can't sign in with Google?
Check if Google OAuth credentials are correctly configured
Verify redirect URI matches exactly in both Google Cloud and Supabase
Check browser console for specific error messages
Ensure Google+ API is enabled in Google Cloud Console
"User not authenticated" errors?
Clear browser cookies and local storage
Try incognito/private browsing mode
Verify session is being retrieved with getSession()
Contributing
Contributions are welcome! Please feel free to submit a Pull Request.

License
This project is open source and available under the MIT License.

Support
For issues and questions:

Check the Troubleshooting section above
Review Supabase documentation: https://supabase.com/docs
Check Next.js documentation: https://nextjs.org/docs
Open an issue on GitHub
Useful Links
Supabase Docs
Next.js Docs
Tailwind CSS Docs
Vercel Docs
Google OAuth Documentation
