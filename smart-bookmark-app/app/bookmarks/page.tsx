'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/client';
import BookmarkForm from '@/components/BookmarkForm';
import BookmarkList from '@/components/BookmarkList';
import type { RealtimeChannel } from '@supabase/supabase-js';

export const dynamic = 'force-dynamic';

interface Bookmark {
  id: string;
  title: string;
  url: string;
  created_at: string;
  user_id: string;
}

export default function BookmarksPage() {
  const router = useRouter();
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<{ id: string; email?: string } | null>(null);
  const channelRef = useRef<RealtimeChannel | null>(null);

  // Define functions before useEffect so they can be called
  const fetchBookmarks = async (userId: string) => {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('bookmarks')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching bookmarks:', error);
      return;
    }

    setBookmarks(data || []);
  };

  const handleRealtimeUpdate = (payload: any) => {
    // Supabase real-time payload type is complex and dynamic, 'any' is acceptable here
    if (payload.eventType === 'INSERT' && payload.new) {
      const newBookmark = payload.new as Bookmark;
      setBookmarks((prev) => [newBookmark, ...prev]);
    } else if (payload.eventType === 'DELETE' && payload.old) {
      const oldBookmark = payload.old as Bookmark;
      setBookmarks((prev) => prev.filter((b) => b.id !== oldBookmark.id));
    } else if (payload.eventType === 'UPDATE' && payload.new) {
      const updatedBookmark = payload.new as Bookmark;
      setBookmarks((prev) =>
        prev.map((b) => (b.id === updatedBookmark.id ? updatedBookmark : b))
      );
    }
  };

  useEffect(() => {
    const initializeBookmarks = async () => {
      const supabase = createClient();

      // Check authentication
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        router.push('/');
        return;
      }

      setUser(session.user);

      // Fetch bookmarks
      await fetchBookmarks(session.user.id);

      // Subscribe to real-time updates
      const channel = supabase
        .channel(`bookmarks:${session.user.id}`)
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'bookmarks',
            filter: `user_id=eq.${session.user.id}`,
          },
          (payload) => {
            handleRealtimeUpdate(payload);
          }
        )
        .subscribe();

      channelRef.current = channel;
      setLoading(false);
    };

    initializeBookmarks();

    return () => {
      if (channelRef.current) {
        channelRef.current.unsubscribe();
      }
    };
  }, [router]);

  const handleSignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push('/');
  };

  const handleDeleteBookmark = async (id: string) => {
    const supabase = createClient();
    const { error } = await supabase.from('bookmarks').delete().eq('id', id);

    if (error) {
      console.error('Error deleting bookmark:', error);
      alert('Failed to delete bookmark');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p>Loading bookmarks...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 to-indigo-100">
      <nav className="bg-white shadow-md">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Smart Bookmarks</h1>
            <p className="text-sm text-gray-600">
              {user?.email}
            </p>
          </div>
          <button
            onClick={handleSignOut}
            className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-lg transition duration-200"
          >
            Sign Out
          </button>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <BookmarkForm userId={user?.id} />
          </div>
          <div className="lg:col-span-2">
            <BookmarkList
              bookmarks={bookmarks}
              onDelete={handleDeleteBookmark}
            />
          </div>
        </div>
      </main>
    </div>
  );
}
