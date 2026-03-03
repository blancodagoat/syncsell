'use client';

import { useEffect } from 'react';
import Link from 'next/link';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-md text-center">
        <h2 className="text-xl font-semibold mb-2">Something went wrong</h2>
        <p className="text-neutral-500 text-sm mb-6">
          We encountered an error while loading the dashboard.
        </p>
        <div className="flex gap-3 justify-center">
          <button
            onClick={reset}
            className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 text-sm"
          >
            Try again
          </button>
          <Link
            href="/dashboard"
            className="px-4 py-2 border border-neutral-300 rounded-lg hover:bg-neutral-50 text-sm"
          >
            Go to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
