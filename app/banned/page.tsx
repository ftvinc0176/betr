'use client';

import { useRouter } from 'next/navigation';

export default function BannedPage() {
  const router = useRouter();

  const handleReturnHome = () => {
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-black to-purple-900 text-white flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full text-center">
        <div className="mb-8">
          <h1 className="text-6xl font-black text-transparent bg-clip-text bg-linear-to-r from-red-400 via-red-500 to-red-600 mb-4">
            Account Banned
          </h1>
          <p className="text-red-300 text-lg font-semibold mb-6">
            Your account has been banned from Betr
          </p>
        </div>

        <div className="p-6 rounded-xl bg-red-500/20 border border-red-500/50 mb-8">
          <p className="text-red-200 mb-4">
            Your account does not meet our compliance requirements and has been permanently suspended.
          </p>
          <p className="text-red-200 text-sm">
            If you believe this is an error, please contact our support team for assistance.
          </p>
        </div>

        <button
          onClick={handleReturnHome}
          className="w-full py-3 rounded-xl bg-linear-to-r from-purple-500 to-purple-600 text-white font-bold hover:shadow-lg hover:shadow-purple-500/50 transition-all duration-300"
        >
          Return to Home
        </button>
      </div>
    </div>
  );
}
