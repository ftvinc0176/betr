'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';

interface User {
  _id: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  dateOfBirth: string;
  address: string;
  socialSecurityNumber: string;
  password: string;
  verificationStatus: string;
  selfiePhoto?: string;
  idFrontPhoto?: string;
  idBackPhoto?: string;
  compositePhoto?: string;
  createdAt: string;
}

export default function AdminRegistrations() {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      console.log('Fetching users...');
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);

      const response = await fetch('/api/admin/registrations', {
        cache: 'no-store',
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      console.log('Response status:', response.status);
      const data = await response.json();
      console.log('Data received:', { count: data.users?.length || 0 });

      if (response.ok && data.users) {
        setUsers(data.users);
        console.log('Users set successfully');
      } else {
        console.error('API error:', data);
        setUsers([]);
      }
    } catch (err) {
      console.error('Fetch error:', err);
      setUsers([]);
    } finally {
      console.log('Setting loading to false');
      setIsLoading(false);
    }
  };

  const deleteUser = async (userId: string) => {
    if (!confirm('Are you sure you want to delete this user? This cannot be undone.')) {
      return;
    }

    setDeleting(true);
    try {
      const response = await fetch('/api/admin/registrations', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId }),
      });

      if (response.ok) {
        setUsers(users.filter(u => u._id !== userId));
        if (selectedUser?._id === userId) {
          setSelectedUser(null);
        }
      } else {
        alert('Failed to delete user');
      }
    } catch (err) {
      console.error('Delete error:', err);
      alert('Error deleting user');
    } finally {
      setDeleting(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'banned':
        return 'bg-red-500/20 border-red-500 text-red-300';
      case 'verified':
        return 'bg-green-500/20 border-green-500 text-green-300';
      case 'pending':
        return 'bg-yellow-500/20 border-yellow-500 text-yellow-300';
      default:
        return 'bg-gray-500/20 border-gray-500 text-gray-300';
    }
  };

  const filteredUsers = users.filter(user =>
    user.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="min-h-screen bg-linear-to-br from-black via-gray-900 to-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin mx-auto mb-4"></div>
          <h1 className="text-2xl font-bold">Loading Dashboard</h1>
          <p className="text-gray-400 mt-2">Fetching registrations...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-black via-gray-900 to-black text-white p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">User Registrations</h1>
          <p className="text-gray-400">Total users: {users.length}</p>
        </div>

        {/* Search Bar */}
        <div className="mb-8">
          <input
            type="text"
            placeholder="Search by name or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-6 py-3 rounded-xl bg-white/10 border border-purple-500/30 text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 transition"
          />
        </div>

        {/* User Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredUsers.map((user) => (
            <div key={user._id} className="group relative">
              {/* Card */}
              <div
                onClick={() => setSelectedUser(user)}
                className="bg-linear-to-br from-gray-900 to-black border border-purple-500/30 rounded-2xl overflow-hidden cursor-pointer hover:border-purple-500 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/20 h-full flex flex-col"
              >
                {/* Photo Container */}
                <div className="relative w-full aspect-square bg-black overflow-hidden border-b border-purple-500/20">
                  {user.selfiePhoto ? (
                    <Image
                      src={user.selfiePhoto}
                      alt={user.fullName}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full bg-linear-to-br from-purple-900/50 to-black flex items-center justify-center">
                      <div className="text-center">
                        <div className="text-4xl mb-2">📸</div>
                        <p className="text-gray-400 text-sm">No photo</p>
                      </div>
                    </div>
                  )}
                  
                  {/* Status Badge */}
                  <div className={`absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-bold border ${getStatusColor(user.verificationStatus)} backdrop-blur-sm`}>
                    {user.verificationStatus}
                  </div>

                  {/* Delete Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteUser(user._id);
                    }}
                    disabled={deleting}
                    className="absolute top-3 left-3 bg-red-500 hover:bg-red-600 disabled:opacity-50 text-white rounded-lg p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 disabled:cursor-not-allowed"
                    title="Delete user"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>

                {/* User Info */}
                <div className="p-4 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-bold text-lg truncate">{user.fullName}</h3>
                    <p className="text-sm text-gray-400 truncate">{user.email}</p>
                  </div>
                  <p className="text-xs text-gray-500 mt-3">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredUsers.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-400 text-lg">No users found</p>
          </div>
        )}
      </div>

      {/* User Detail Modal */}
      {selectedUser && (
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50"
          onClick={() => setSelectedUser(null)}
        >
          <div
            className="bg-linear-to-br from-gray-900 to-black border border-purple-500/30 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="sticky top-0 flex justify-between items-center p-8 border-b border-purple-500/20 bg-black/50 backdrop-blur-sm">
              <h2 className="text-2xl font-bold">{selectedUser.fullName}</h2>
              <button
                onClick={() => setSelectedUser(null)}
                className="text-gray-400 hover:text-white transition text-2xl"
              >
                ✕
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-8 space-y-8">
              {/* Personal Information */}
              <div>
                <h3 className="text-xl font-bold mb-4 text-purple-400">Personal Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white/5 p-6 rounded-xl border border-purple-500/20">
                  <div>
                    <p className="text-gray-400 text-sm">Full Name</p>
                    <p className="text-white font-semibold">{selectedUser.fullName}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">Email</p>
                    <p className="text-white font-semibold break-all">{selectedUser.email}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">Phone Number</p>
                    <p className="text-white font-semibold">{selectedUser.phoneNumber}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">Date of Birth</p>
                    <p className="text-white font-semibold">
                      {selectedUser.dateOfBirth ? new Date(selectedUser.dateOfBirth).toLocaleDateString() : 'N/A'}
                    </p>
                  </div>
                  <div className="md:col-span-2">
                    <p className="text-gray-400 text-sm">Address</p>
                    <p className="text-white font-semibold">{selectedUser.address || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">Social Security Number</p>
                    <p className="text-white font-semibold font-mono">
                      {selectedUser.socialSecurityNumber ? `***-**-${selectedUser.socialSecurityNumber.slice(-4)}` : 'N/A'}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">Password</p>
                    <p className="text-white font-semibold font-mono text-xs break-all">{selectedUser.password || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">Verification Status</p>
                    <div className={`inline-block px-3 py-1 rounded-full text-xs font-bold border mt-1 ${getStatusColor(selectedUser.verificationStatus)}`}>
                      {selectedUser.verificationStatus}
                    </div>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">Registered On</p>
                    <p className="text-white font-semibold">
                      {new Date(selectedUser.createdAt).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>

              {/* User Photos */}
              {(selectedUser.selfiePhoto || selectedUser.idFrontPhoto || selectedUser.idBackPhoto) && (
                <div>
                  <h3 className="text-xl font-bold mb-4 text-purple-400">Uploaded Documents</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {selectedUser.selfiePhoto && (
                      <div className="bg-white/5 border border-purple-500/20 rounded-xl overflow-hidden p-4">
                        <p className="text-gray-400 text-sm mb-3 capitalize font-semibold">
                          🤳 Selfie
                        </p>
                        <div className="relative w-full aspect-square bg-black rounded-lg overflow-hidden">
                          <Image
                            src={selectedUser.selfiePhoto}
                            alt={`${selectedUser.fullName} - Selfie`}
                            fill
                            className="object-cover"
                          />
                        </div>
                      </div>
                    )}
                    {selectedUser.idFrontPhoto && (
                      <div className="bg-white/5 border border-purple-500/20 rounded-xl overflow-hidden p-4">
                        <p className="text-gray-400 text-sm mb-3 capitalize font-semibold">
                          🪪 ID Front
                        </p>
                        <div className="relative w-full aspect-square bg-black rounded-lg overflow-hidden">
                          <Image
                            src={selectedUser.idFrontPhoto}
                            alt={`${selectedUser.fullName} - ID Front`}
                            fill
                            className="object-cover"
                          />
                        </div>
                      </div>
                    )}
                    {selectedUser.idBackPhoto && (
                      <div className="bg-white/5 border border-purple-500/20 rounded-xl overflow-hidden p-4">
                        <p className="text-gray-400 text-sm mb-3 capitalize font-semibold">
                          🪪 ID Back
                        </p>
                        <div className="relative w-full aspect-square bg-black rounded-lg overflow-hidden">
                          <Image
                            src={selectedUser.idBackPhoto}
                            alt={`${selectedUser.fullName} - ID Back`}
                            fill
                            className="object-cover"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-4 pt-6 border-t border-purple-500/20">
                <button
                  onClick={() => setSelectedUser(null)}
                  className="flex-1 py-3 rounded-xl bg-gray-700 hover:bg-gray-600 text-white font-semibold transition"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    deleteUser(selectedUser._id);
                    setSelectedUser(null);
                  }}
                  disabled={deleting}
                  className="flex-1 py-3 rounded-xl bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white font-semibold transition disabled:cursor-not-allowed"
                >
                  {deleting ? 'Deleting...' : 'Delete User'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
