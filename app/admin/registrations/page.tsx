'use client';

import { useEffect, useState } from 'react';

interface SupportMessage {
  sender: 'user' | 'support';
  message: string;
  timestamp: string;
  agentName?: string;
}

interface User {
  _id: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  verificationStatus: string;
  createdAt: string;
  supportMessages?: SupportMessage[];
}

export default function AdminRegistrations() {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [chatMessages, setChatMessages] = useState<SupportMessage[]>([]);
  const [messageInput, setMessageInput] = useState('');
  const [sendingMessage, setSendingMessage] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const init = async () => {
      await fetchUsers();
      setIsInitialized(true);
    };
    init();
    const interval = setInterval(fetchUsers, 5000);
    return () => clearInterval(interval);
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await fetch('/api/admin/registrations', { cache: 'no-store' });
      const data = await response.json();
      if (response.ok && data.users) {
        setUsers(data.users);
      }
    } catch (err) {
      console.error('Fetch error:', err);
    }
  };

  const selectUser = (user: User) => {
    setSelectedUser(user);
    setChatMessages(user.supportMessages || []);
  };

  const sendMessage = async () => {
    if (!messageInput.trim() || !selectedUser) return;

    setSendingMessage(true);
    try {
      const response = await fetch('/api/support-messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: selectedUser._id,
          sender: 'support',
          message: messageInput.trim(),
          agentName: 'Emily from Betr',
        }),
      });

      if (response.ok) {
        setMessageInput('');
        await fetchUsers();
        const updated = users.find(u => u._id === selectedUser._id);
        if (updated) {
          setSelectedUser(updated);
          setChatMessages(updated.supportMessages || []);
        }
      }
    } catch (err) {
      console.error('Send error:', err);
    } finally {
      setSendingMessage(false);
    }
  };

  const getUnseenCount = (user: User) => {
    return (user.supportMessages || []).filter(m => m.sender === 'user').length;
  };

  if (!isInitialized) {
    return (
      <div className="min-h-screen bg-linear-to-br from-black via-gray-900 to-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin mx-auto mb-4"></div>
          <h1 className="text-2xl font-bold">Loading Dashboard</h1>
          <p className="text-gray-400 mt-2">Connecting to database...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-black via-gray-900 to-black text-white">
      <div className="grid grid-cols-3 gap-6 p-8 max-w-7xl mx-auto">
        {/* Users List */}
        <div className="col-span-1">
          <div className="bg-gradient-to-br from-gray-900 to-black border border-purple-500/30 rounded-2xl overflow-hidden">
            <div className="bg-gradient-to-r from-purple-600 to-purple-400 px-6 py-4">
              <h2 className="text-xl font-bold">User Registrations</h2>
              <p className="text-purple-100 text-sm">{users.length} users</p>
            </div>

            <div className="overflow-y-auto max-h-[calc(100vh-200px)]">
              {users.map((user) => (
                <button
                  key={user._id}
                  onClick={() => selectUser(user)}
                  className={`w-full px-6 py-4 border-b border-gray-800 text-left transition ${
                    selectedUser?._id === user._id
                      ? 'bg-purple-500/20 border-l-4 border-l-purple-500'
                      : 'hover:bg-gray-800/50'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold truncate">{user.fullName}</p>
                      <p className="text-sm text-gray-400 truncate">{user.email}</p>
                      <div className="flex gap-2 mt-1 items-center">
                        <span
                          className={`text-xs px-2 py-1 rounded ${
                            user.verificationStatus === 'banned'
                              ? 'bg-red-900/50 text-red-300'
                              : user.verificationStatus === 'verified'
                                ? 'bg-green-900/50 text-green-300'
                                : 'bg-yellow-900/50 text-yellow-300'
                          }`}
                        >
                          {user.verificationStatus}
                        </span>
                        {getUnseenCount(user) > 0 && (
                          <span className="text-xs bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center font-bold">
                            {getUnseenCount(user)}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Chat Panel */}
        <div className="col-span-2">
          {selectedUser ? (
            <div className="bg-gradient-to-br from-gray-900 to-black border border-purple-500/30 rounded-2xl overflow-hidden flex flex-col h-[calc(100vh-100px)]">
              {/* Header */}
              <div className="bg-gradient-to-r from-purple-600 to-purple-400 px-6 py-4 border-b border-purple-500/30">
                <h3 className="text-xl font-bold">{selectedUser.fullName}</h3>
                <p className="text-purple-100 text-sm">{selectedUser.email}</p>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {chatMessages.length === 0 ? (
                  <div className="flex items-center justify-center h-full text-gray-500">
                    <p>No messages yet. Start a conversation.</p>
                  </div>
                ) : (
                  chatMessages.map((msg, idx) => (
                    <div
                      key={idx}
                      className={`flex ${msg.sender === 'support' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-xs rounded-lg px-4 py-3 ${
                          msg.sender === 'support'
                            ? 'bg-purple-600 text-white'
                            : 'bg-gray-800 text-gray-100'
                        }`}
                      >
                        <p className="text-xs font-semibold mb-1">
                          {msg.sender === 'support' ? 'Emily from Betr' : 'User'}
                        </p>
                        <p className="break-words">{msg.message}</p>
                        <p className="text-xs opacity-70 mt-1">
                          {new Date(msg.timestamp).toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Input */}
              <div className="border-t border-gray-800 p-4 bg-black/50">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                    placeholder="Type a message..."
                    className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500"
                  />
                  <button
                    onClick={sendMessage}
                    disabled={sendingMessage || !messageInput.trim()}
                    className="bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-700 hover:to-purple-600 disabled:opacity-50 text-white font-semibold px-6 py-2 rounded-lg transition"
                  >
                    {sendingMessage ? 'Sending...' : 'Send'}
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-gradient-to-br from-gray-900 to-black border border-purple-500/30 rounded-2xl flex items-center justify-center h-[calc(100vh-100px)]">
              <p className="text-gray-500">Select a user to start chatting</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
