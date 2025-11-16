'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-gray-900 border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex-shrink-0">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
                ProBets
              </h1>
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center gap-8">
              <a href="#features" className="hover:text-blue-400 transition">
                Features
              </a>
              <a href="#about" className="hover:text-blue-400 transition">
                About
              </a>
              <a href="#contact" className="hover:text-blue-400 transition">
                Contact
              </a>
              <Link
                href="/login"
                className="px-4 py-2 rounded-lg border border-blue-500 hover:bg-blue-500 hover:text-white transition"
              >
                Login
              </Link>
              <Link
                href="/register"
                className="px-4 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 transition font-semibold"
              >
                Register
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>

          {/* Mobile Menu */}
          {menuOpen && (
            <div className="md:hidden pb-4 space-y-2">
              <a href="#features" className="block hover:text-blue-400 transition py-2">
                Features
              </a>
              <a href="#about" className="block hover:text-blue-400 transition py-2">
                About
              </a>
              <a href="#contact" className="block hover:text-blue-400 transition py-2">
                Contact
              </a>
              <Link href="/login" className="block py-2 text-blue-400 hover:text-blue-300">
                Login
              </Link>
              <Link href="/register" className="block py-2 text-blue-400 hover:text-blue-300">
                Register
              </Link>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-20 pb-32 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <h2 className="text-5xl md:text-7xl font-bold mb-6">
              The Future of Sports Betting
            </h2>
            <p className="text-xl text-gray-400 mb-12 max-w-2xl mx-auto">
              Join thousands of bettors enjoying real-time odds, live betting, and exclusive promotions on your favorite sports.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/register"
                className="px-8 py-3 rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 transition font-semibold text-lg"
              >
                Create Account
              </Link>
              <Link
                href="/login"
                className="px-8 py-3 rounded-lg border-2 border-blue-500 hover:bg-blue-500 hover:text-white transition font-semibold text-lg"
              >
                Sign In
              </Link>
            </div>
          </div>

          {/* Stats */}
          <div className="grid md:grid-cols-3 gap-8 mt-24">
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-400 mb-2">50K+</div>
              <p className="text-gray-400">Active Users</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-400 mb-2">$10M+</div>
              <p className="text-gray-400">Daily Volume</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-400 mb-2">24/7</div>
              <p className="text-gray-400">Live Betting</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="bg-gray-800 py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <h3 className="text-4xl font-bold text-center mb-16">Why Choose ProBets?</h3>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-gray-900 p-8 rounded-lg border border-gray-700 hover:border-blue-500 transition">
              <div className="text-3xl mb-4">⚡</div>
              <h4 className="text-xl font-semibold mb-3">Real-Time Odds</h4>
              <p className="text-gray-400">Get live odds updates and instant notifications for your favorite events.</p>
            </div>
            <div className="bg-gray-900 p-8 rounded-lg border border-gray-700 hover:border-blue-500 transition">
              <div className="text-3xl mb-4">🏆</div>
              <h4 className="text-xl font-semibold mb-3">Premium Payouts</h4>
              <p className="text-gray-400">Competitive odds and generous payouts on all your winning bets.</p>
            </div>
            <div className="bg-gray-900 p-8 rounded-lg border border-gray-700 hover:border-blue-500 transition">
              <div className="text-3xl mb-4">🔒</div>
              <h4 className="text-xl font-semibold mb-3">Secure & Safe</h4>
              <p className="text-gray-400">Bank-level security protects your personal and financial information.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-blue-900 to-blue-800 py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h3 className="text-4xl font-bold mb-8">Ready to Get Started?</h3>
          <p className="text-xl text-gray-300 mb-12">Join our community of sports bettors today and get exclusive welcome bonuses.</p>
          <Link
            href="/register"
            className="inline-block px-8 py-4 rounded-lg bg-white text-blue-600 hover:bg-gray-100 transition font-bold text-lg"
          >
            Sign Up Now
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 border-t border-gray-800 py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <h4 className="font-semibold mb-4">About</h4>
              <p className="text-gray-400 text-sm">Leading sports betting platform with millions of satisfied customers.</p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="text-gray-400 text-sm space-y-2">
                <li><a href="#" className="hover:text-white transition">Terms of Service</a></li>
                <li><a href="#" className="hover:text-white transition">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white transition">Responsible Gaming</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="text-gray-400 text-sm space-y-2">
                <li><a href="#" className="hover:text-white transition">Help Center</a></li>
                <li><a href="#" className="hover:text-white transition">Contact Us</a></li>
                <li><a href="#" className="hover:text-white transition">FAQ</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Follow Us</h4>
              <ul className="text-gray-400 text-sm space-y-2">
                <li><a href="#" className="hover:text-white transition">Twitter</a></li>
                <li><a href="#" className="hover:text-white transition">Facebook</a></li>
                <li><a href="#" className="hover:text-white transition">Instagram</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center text-gray-400">
            <p>&copy; 2024 ProBets. All rights reserved. Must be 21+ to participate.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
