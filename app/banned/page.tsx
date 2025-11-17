'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

function BannedContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const userId = searchParams.get('userId');

  const handleContactSupport = () => {
    if (userId) {
      router.push(`/support?userId=${userId}`);
    }
  };

  const handleReturnHome = () => {
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-black via-black to-purple-900 text-white flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full text-center">
        <div className="mb-8">
          <h1 className="text-6xl font-black text-transparent bg-clip-text bg-linear-to-r from-yellow-400 via-yellow-500 to-yellow-600 mb-4">
            Account Suspended
          </h1>
          <p className="text-yellow-300 text-lg font-semibold mb-6">
            Your account has been temporarily suspended
          </p>
        </div>

        <div className="p-6 rounded-xl bg-yellow-500/20 border border-yellow-500/50 mb-8">
          <p className="text-yellow-200 mb-4">
            We require additional information from you to complete your account verification.
          </p>
          <p className="text-yellow-200 text-sm">
            Please message support to proceed with verifying your account.
          </p>
        </div>

        <div className="flex flex-col gap-3">
          <button
            onClick={handleContactSupport}
            disabled={!userId}
            className="w-full py-3 rounded-xl bg-linear-to-r from-purple-500 to-purple-600 text-white font-bold hover:shadow-lg hover:shadow-purple-500/50 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Message Support
          </button>
          <button
            onClick={handleReturnHome}
            className="w-full py-3 rounded-xl bg-gray-700 hover:bg-gray-600 text-white font-bold transition-all duration-300"
          >
            Return to Home
          </button>
        </div>
      </div>
    </div>
  );
}

export default function BannedPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-linear-to-br from-black via-black to-purple-900 text-white flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-3xl font-bold">Loading...</h1>
          </div>
        </div>
      }
    >
      <BannedContent />
    </Suspense>
  );
}
