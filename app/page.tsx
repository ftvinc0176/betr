'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-black/90 backdrop-blur-md border-b border-gray-900">
        <div className="w-full px-8 lg:px-16">
          <div className="flex justify-between items-center h-24">
            <div className="flex-shrink-0">
              <h1 className="text-4xl font-black tracking-tighter">
                <span className="text-purple-500">Betr</span><span className="text-white"></span>
              </h1>
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center gap-16">
              <a href="#play" className="text-white hover:text-purple-400 transition font-medium text-base">
                Play now
              </a>
              <a href="#products" className="text-white hover:text-purple-400 transition font-medium text-base">
                Products
              </a>
              <a href="#availability" className="text-white hover:text-purple-400 transition font-medium text-base">
                Availability
              </a>
              <Link
                href="/login"
                className="text-white hover:text-purple-400 transition font-medium text-base"
              >
                Log in
              </Link>
              <Link
                href="/register"
                className="px-8 py-2.5 rounded-full bg-purple-600 hover:bg-purple-700 transition font-bold text-white shadow-lg"
              >
                Sign up
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>

          {/* Mobile Menu */}
          {menuOpen && (
            <div className="md:hidden pb-6 space-y-4 border-t border-gray-900 pt-6">
              <a href="#play" className="block text-white hover:text-purple-400 transition font-medium">
                Play now
              </a>
              <a href="#products" className="block text-white hover:text-purple-400 transition font-medium">
                Products
              </a>
              <a href="#availability" className="block text-white hover:text-purple-400 transition font-medium">
                Availability
              </a>
              <Link href="/login" className="block text-white hover:text-purple-400 transition font-medium">
                Log in
              </Link>
              <Link href="/register" className="block px-8 py-3 bg-purple-600 rounded-full font-bold text-center">
                Sign up
              </Link>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section - Full Height */}
      <section id="play" className="relative w-full min-h-[90vh] flex items-center justify-center px-6 py-32 overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-purple-900/30 rounded-full blur-3xl opacity-50"></div>
          <div className="absolute top-1/4 right-0 w-[600px] h-[600px] bg-purple-800/20 rounded-full blur-3xl opacity-30"></div>
          <div className="absolute bottom-0 left-1/4 w-[500px] h-[500px] bg-purple-700/10 rounded-full blur-3xl opacity-20"></div>
        </div>

        <div className="relative z-10 max-w-5xl mx-auto text-center space-y-8">
          {/* Badge */}
          <div className="inline-block">
            <div className="px-6 py-3 rounded-full border border-purple-500/60 bg-purple-500/10 backdrop-blur-sm">
              <span className="text-purple-300 text-sm font-bold tracking-widest uppercase">Picks New User Offer</span>
            </div>
          </div>

          {/* Main Heading - Dynamic Layout */}
          <div className="space-y-4">
            {/* FREE */}
            <h2 className="text-7xl md:text-8xl lg:text-9xl font-black text-purple-500 leading-none tracking-tighter drop-shadow-2xl">
              FREE
            </h2>
            
            {/* $10 */}
            <div className="text-8xl md:text-9xl lg:text-[10rem] font-black text-white leading-none tracking-tighter drop-shadow-2xl">
              $10
            </div>
            
            {/* NO DEPOSIT REQUIRED */}
            <h3 className="text-5xl md:text-6xl lg:text-7xl font-black text-white leading-none tracking-tight pt-4">
              NO DEPOSIT<br />REQUIRED
            </h3>
          </div>

          {/* Subheading */}
          <div className="pt-8 space-y-2">
            <p className="text-lg md:text-xl text-gray-300">
              Get your free $10 today and join players who&apos;ve already
            </p>
            <p className="text-2xl md:text-3xl font-bold">
              <span className="text-purple-400">won over $250M</span> <span className="text-gray-300">on Betr.</span>
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center pt-12">
            <Link
              href="/register"
              className="px-12 py-4 rounded-full bg-purple-600 hover:bg-purple-700 transition font-bold text-xl text-white shadow-2xl shadow-purple-600/50 hover:shadow-purple-600/80 transform hover:scale-105 hover:translate-y-1 duration-200"
            >
              Claim free $10
            </Link>
            <button className="px-12 py-4 rounded-full border-2 border-gray-600 hover:border-gray-400 transition font-semibold text-lg text-white hover:bg-white/5 transform hover:scale-105 duration-200">
              Learn more
            </button>
          </div>

          {/* Featured In Section */}
          <div className="pt-24 space-y-8">
            <p className="text-gray-500 text-xs font-bold tracking-widest uppercase">Featured in</p>
            <div className="flex flex-wrap justify-center items-center gap-6 md:gap-10 opacity-50 hover:opacity-70 transition">
              {[
                { text: 'SBJ', width: 'w-12' },
                { text: 'FOX', width: 'w-10' },
                { text: 'Bloomberg', width: 'w-24' },
                { text: 'ESPN', width: 'w-16' },
                { text: 'NY Post', width: 'w-16' },
                { text: 'CNBC', width: 'w-12' },
                { text: 'Hollywood', width: 'w-20' }
              ].map((logo, idx) => (
                <div key={idx} className="text-gray-500 font-bold text-sm whitespace-nowrap">{logo.text}</div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black border-t border-gray-900 py-24 px-6 lg:px-16">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-16 mb-20">
            <div>
              <h4 className="font-black text-lg text-white mb-8">Company</h4>
              <ul className="space-y-4">
                <li><a href="#" className="text-gray-400 hover:text-purple-400 transition text-sm">About Us</a></li>
                <li><a href="#" className="text-gray-400 hover:text-purple-400 transition text-sm">Careers</a></li>
                <li><a href="#" className="text-gray-400 hover:text-purple-400 transition text-sm">Press</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-black text-lg text-white mb-8">Legal</h4>
              <ul className="space-y-4">
                <li><a href="#" className="text-gray-400 hover:text-purple-400 transition text-sm">Terms of Service</a></li>
                <li><a href="#" className="text-gray-400 hover:text-purple-400 transition text-sm">Privacy Policy</a></li>
                <li><a href="#" className="text-gray-400 hover:text-purple-400 transition text-sm">Responsible Gaming</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-black text-lg text-white mb-8">Support</h4>
              <ul className="space-y-4">
                <li><a href="#" className="text-gray-400 hover:text-purple-400 transition text-sm">Help Center</a></li>
                <li><a href="#" className="text-gray-400 hover:text-purple-400 transition text-sm">Contact</a></li>
                <li><a href="#" className="text-gray-400 hover:text-purple-400 transition text-sm">FAQ</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-black text-lg text-white mb-8">Social</h4>
              <ul className="space-y-4">
                <li><a href="#" className="text-gray-400 hover:text-purple-400 transition text-sm">Twitter</a></li>
                <li><a href="#" className="text-gray-400 hover:text-purple-400 transition text-sm">Instagram</a></li>
                <li><a href="#" className="text-gray-400 hover:text-purple-400 transition text-sm">Facebook</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-900 pt-12 text-center text-gray-500 text-sm">
            <p>&copy; 2024 Betr. All rights reserved. Must be 21+ to participate. Play responsibly.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
