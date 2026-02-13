'use client';

import { Suspense } from 'react';
import CallbackContent from '@/components/CallbackContent';

export const dynamic = 'force-dynamic';

export default function Callback() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p>Completing sign in...</p>
          </div>
        </div>
      }
    >
      <CallbackContent />
    </Suspense>
  );
}
