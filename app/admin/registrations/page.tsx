'use client';

import { useEffect, useState } from 'react';

interface User {
  _id: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  dateOfBirth: string;
  address: string;
  ssn: string;
  verificationStatus: string;
  photo?: string;
  createdAt: string;
}

export default function AdminRegistrations() {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
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
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'banned':
        return 'bg-red-900/50 text-red-300';
      case 'verified':
        return 'bg-green-900/50 text-green-300';
      case 'pending':
        return 'bg-yellow-900/50 text-yellow-300';
      default:
        return 'bg-gray-900/50 text-gray-300';
    }
  };

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
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">User Registrations</h1>
          <p className="text-gray-400">Total users: {users.length}</p>
        </div>

        <div className="bg-linear-to-br from-gray-900 to-black border border-purple-500/30 rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-linear-to-r from-purple-600 to-purple-400 text-white">
                <tr>
                  <th className="px-6 py-4 text-left font-semibold">Name</th>
                  <th className="px-6 py-4 text-left font-semibold">Email</th>
                  <th className="px-6 py-4 text-left font-semibold">Phone</th>
                  <th className="px-6 py-4 text-left font-semibold">DOB</th>
                  <th className="px-6 py-4 text-left font-semibold">Address</th>
                  <th className="px-6 py-4 text-left font-semibold">SSN</th>
                  <th className="px-6 py-4 text-left font-semibold">Status</th>
                  <th className="px-6 py-4 text-left font-semibold">Registered</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user, idx) => (
                  <tr
                    key={user._id}
                    className={`border-b border-gray-800 hover:bg-gray-800/30 transition ${
                      idx % 2 === 0 ? 'bg-black/20' : 'bg-black/40'
                    }`}
                  >
                    <td className="px-6 py-4">{user.fullName}</td>
                    <td className="px-6 py-4 text-sm">{user.email}</td>
                    <td className="px-6 py-4 text-sm">{user.phoneNumber}</td>
                    <td className="px-6 py-4 text-sm">
                      {user.dateOfBirth ? new Date(user.dateOfBirth).toLocaleDateString() : 'N/A'}
                    </td>
                    <td className="px-6 py-4 text-sm truncate max-w-xs">{user.address || 'N/A'}</td>
                    <td className="px-6 py-4 text-sm font-mono">
                      {user.ssn ? `***-**-${user.ssn.slice(-4)}` : 'N/A'}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`text-xs px-3 py-1 rounded-full font-semibold ${getStatusColor(user.verificationStatus)}`}>
                        {user.verificationStatus}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {users.length === 0 && (
            <div className="flex items-center justify-center py-12">
              <p className="text-gray-400">No users registered yet</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
