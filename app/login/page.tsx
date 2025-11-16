'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Login failed');
        return;
      }

      const userId = data.user?.id || data.user?._id;
      const hasAllPhotos = data.user?.hasAllPhotos;

      if (hasAllPhotos) {
        setSuccess('Login successful! Redirecting...');
        setTimeout(() => {
          router.push('/banned');
        }, 2000);
      } else {
        setSuccess('Login successful! Redirecting to verification...');
        setTimeout(() => {
          if (userId) {
            router.push(`/verify-id?userId=${encodeURIComponent(userId)}`);
          } else {
            router.push('/');
          }
        }, 2000);
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-black to-purple-900 text-white flex items-center justify-center px-4 py-12 relative overflow-hidden">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-5xl font-black text-transparent bg-clip-text bg-linear-to-r from-purple-400 via-purple-500 to-purple-600 mb-2">
            Betr
          </h1>
          <p className="text-purple-300 text-lg font-semibold">Free $10 Sports Betting</p>
        </div>

        <div className="backdrop-blur-md bg-white/10 border border-purple-500/30 rounded-2xl p-8 shadow-2xl">
          <h2 className="text-2xl font-bold text-center mb-8 text-white">
            Login to Your Account
          </h2>

          {error && (
            <div className="mb-6 p-4 rounded-xl bg-red-500/20 border border-red-500/50 text-red-200 text-sm backdrop-blur-sm animate-in fade-in slide-in-from-top">
              {error}
            </div>
          )}

          {success && (
            <div className="mb-6 p-4 rounded-xl bg-green-500/20 border border-green-500/50 text-green-200 text-sm backdrop-blur-sm animate-in fade-in slide-in-from-top">
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-purple-300 mb-2">
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 rounded-xl bg-white/10 border border-purple-500/30 text-white placeholder-gray-400 focus:outline-none focus:border-purple-400 focus:shadow-lg focus:shadow-purple-500/20 transition-all"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-purple-300 mb-2">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 rounded-xl bg-white/10 border border-purple-500/30 text-white placeholder-gray-400 focus:outline-none focus:border-purple-400 focus:shadow-lg focus:shadow-purple-500/20 transition-all"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-linear-to-r from-purple-500 to-purple-600 text-white font-bold disabled:bg-gray-600 disabled:cursor-not-allowed hover:shadow-lg hover:shadow-purple-500/50 active:scale-95 transition-all duration-300"
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>

          <p className="mt-6 text-center text-gray-300 text-sm">
            Don&apos;t have an account?{' '}
            <Link href="/register" className="text-purple-400 hover:text-purple-300 font-semibold transition-colors">
              Register here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
