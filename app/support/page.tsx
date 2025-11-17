'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { Suspense } from 'react';

function BannedContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const userId = searchParams.get('userId');

  return (
    <div className="min-h-screen bg-linear-to-br from-black via-gray-900 to-black text-white flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full text-center">
        <div className="mb-8">
          <h1 className="text-6xl font-black text-transparent bg-clip-text bg-linear-to-r from-red-400 via-red-500 to-red-600 mb-4">
            Account Banned
          </h1>
          <p className="text-red-300 text-lg font-semibold mb-6">
            Your account has been permanently banned
          </p>
        </div>

        <div className="p-6 rounded-xl bg-red-500/20 border border-red-500/50 mb-8">
          <p className="text-red-200 mb-4">
            Unfortunately, your account does not meet our verification requirements and cannot be recovered.
          </p>
          <p className="text-red-200 text-sm">
            If you believe this is an error, you can contact our support team with your user ID: <span className="font-mono font-bold">{userId || 'N/A'}</span>
          </p>
        </div>

        <button
          onClick={() => router.push('/')}
          className="w-full py-3 rounded-xl bg-linear-to-r from-gray-700 to-gray-800 text-white font-bold hover:shadow-lg hover:shadow-gray-700/50 transition-all duration-300"
        >
          Return to Home
        </button>
      </div>
    </div>
  );
}

export default function SupportPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-linear-to-br from-black via-gray-900 to-black text-white flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-3xl font-bold mb-4">Loading...</h1>
          </div>
        </div>
      }
    >
      <BannedContent />
    </Suspense>
  );
}
