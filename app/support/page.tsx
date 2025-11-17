'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useState, useEffect, useRef, Suspense } from 'react';

interface Message {
  id: string;
  sender: 'user' | 'support';
  message: string;
  timestamp: Date;
}

interface SupportMessage {
  id: string;
  sender: 'user' | 'support';
  message: string;
  timestamp: string;
}

function SupportContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const userId = searchParams.get('userId');
  
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const fetchMessages = async () => {
    try {
      const response = await fetch(`/api/support-messages?userId=${userId}`);
      const data = await response.json();

      if (response.ok) {
        // Parse timestamps back to Date objects
        const parsedMessages = (data.messages || []).map((msg: SupportMessage) => ({
          ...msg,
          timestamp: new Date(msg.timestamp),
        }));
        setMessages(parsedMessages);
      }
      setLoading(false);
    } catch (err) {
      console.error('Error fetching messages:', err);
      setError('Failed to load messages');
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!userId) {
      router.push('/login');
      return;
    }

    fetchMessages();
    
    // Poll for new messages every 2 seconds
    const interval = setInterval(fetchMessages, 2000);
    
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newMessage.trim()) {
      return;
    }

    setSending(true);
    try {
      const response = await fetch('/api/support-messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          message: newMessage.trim(),
          sender: 'user',
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setNewMessage('');
        // Immediately fetch updated messages
        const updatedResponse = await fetch(`/api/support-messages?userId=${userId}`);
        const updatedData = await updatedResponse.json();
        const parsedMessages = (updatedData.messages || []).map((msg: SupportMessage) => ({
          ...msg,
          timestamp: new Date(msg.timestamp),
        }));
        setMessages(parsedMessages);
      } else {
        setError(data.error || 'Failed to send message');
      }
    } catch (err) {
      console.error('Error sending message:', err);
      setError('Failed to send message');
    } finally {
      setSending(false);
    }
  };

  if (!userId) {
    return null;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-black to-purple-900 text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">Loading...</h1>
          <p className="text-gray-300">Connecting to support...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-black to-purple-900 text-white px-4 py-12">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-black text-transparent bg-clip-text bg-linear-to-r from-purple-400 via-purple-500 to-purple-600 mb-2">
            Betr Support
          </h1>
          <p className="text-purple-300">We&apos;re here to help</p>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-500/20 border border-red-500/50 text-red-200">
            {error}
          </div>
        )}

        {/* Chat Container */}
        <div className="backdrop-blur-md bg-white/10 border border-purple-500/30 rounded-2xl overflow-hidden flex flex-col h-[600px]">
          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {messages.length === 0 && (
              <div className="h-full flex items-center justify-center text-center">
                <div>
                  <p className="text-purple-300 text-lg font-semibold mb-2">
                    Thank you for contacting Betr support
                  </p>
                  <p className="text-gray-400">
                    We&apos;re ready to help. Send us a message and we&apos;ll respond as soon as possible.
                  </p>
                </div>
              </div>
            )}

            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-xs lg:max-w-md px-4 py-3 rounded-lg ${
                    msg.sender === 'user'
                      ? 'bg-purple-600 text-white'
                      : 'bg-purple-500/30 border border-purple-500/50 text-gray-200'
                  }`}
                >
                  <p className="text-sm">{msg.message}</p>
                  <p className="text-xs mt-1 opacity-70">
                    {new Date(msg.timestamp).toLocaleTimeString()}
                  </p>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="border-t border-purple-500/30 p-6 bg-black/20">
            <form onSubmit={handleSendMessage} className="flex gap-3">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type your message here..."
                disabled={sending}
                className="flex-1 px-4 py-3 rounded-lg bg-white/10 border border-purple-500/30 text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 disabled:opacity-50 disabled:cursor-not-allowed"
              />
              <button
                type="submit"
                disabled={sending || !newMessage.trim()}
                className="px-6 py-3 rounded-lg bg-linear-to-r from-purple-500 to-purple-600 text-white font-semibold hover:shadow-lg hover:shadow-purple-500/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {sending ? 'Sending...' : 'Send'}
              </button>
            </form>
          </div>
        </div>

        {/* Back Button */}
        <button
          onClick={() => router.push('/')}
          className="mt-6 text-purple-300 hover:text-purple-200 transition-colors"
        >
          ← Back to Home
        </button>
      </div>
    </div>
  );
}

export default function SupportPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gradient-to-br from-black via-black to-purple-900 text-white flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-3xl font-bold mb-4">Loading...</h1>
          </div>
        </div>
      }
    >
      <SupportContent />
    </Suspense>
  );
}
