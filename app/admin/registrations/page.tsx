'use client';

import { useEffect, useState } from 'react';

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
  idFrontPhoto: string;
  idBackPhoto: string;
  selfiePhoto: string;
  createdAt: string;
}

export default function AdminRegistrations() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  useEffect(() => {
    fetchRegistrations();
  }, []);

  const fetchRegistrations = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/registrations');
      const data = await response.json();

      if (response.ok) {
        setUsers(data.users || []);
      } else {
        setError(data.error || 'Failed to fetch registrations');
      }
    } catch (err) {
      setError('An error occurred while fetching registrations');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatPhoneNumber = (phone: string): string => {
    // Remove all non-digits
    const cleaned = phone.replace(/\D/g, '');
    // Format as (XXX) XXX-XXXX
    return cleaned.replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3');
  };

  const formatSSN = (ssn: string): string => {
    // Remove all non-digits
    const cleaned = ssn.replace(/\D/g, '');
    // Format as XXX-XX-XXXX
    return cleaned.replace(/(\d{3})(\d{2})(\d{4})/, '$1-$2-$3');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'failed':
        return 'bg-red-500/20 border-red-500/50 text-red-200';
      case 'verified':
        return 'bg-green-500/20 border-green-500/50 text-green-200';
      case 'pending':
        return 'bg-yellow-500/20 border-yellow-500/50 text-yellow-200';
      default:
        return 'bg-gray-500/20 border-gray-500/50 text-gray-200';
    }
  };

  const getUserStatus = (user: User): string => {
    // If all 3 photos are uploaded, mark as verified
    if (user.idFrontPhoto && user.idBackPhoto && user.selfiePhoto) {
      return 'verified';
    }
    // Otherwise use the stored verification status
    return user.verificationStatus;
  };

  const handleDeleteUser = async (userId: string) => {
    try {
      const response = await fetch('/api/admin/registrations', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId }),
      });

      if (response.ok) {
        setUsers(users.filter(u => u._id !== userId));
        setSelectedUser(null);
        setDeleteConfirm(null);
      } else {
        const data = await response.json();
        setError(data.error || 'Failed to delete user');
      }
    } catch (err) {
      setError('An error occurred while deleting user');
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-black to-purple-900 text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">Loading...</h1>
          <p className="text-gray-300">Fetching registrations...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-black to-purple-900 text-white px-4 py-12">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-black text-transparent bg-clip-text bg-linear-to-r from-purple-400 via-purple-500 to-purple-600 mb-2">
            Admin Dashboard
          </h1>
          <p className="text-purple-300 text-lg font-semibold">User Registrations & ID Verification</p>
        </div>

        {error && (
          <div className="mb-8 p-4 rounded-xl bg-red-500/20 border border-red-500/50 text-red-200 backdrop-blur-sm">
            {error}
          </div>
        )}

        {users.length === 0 ? (
          <div className="text-center p-12 rounded-xl backdrop-blur-md bg-white/10 border border-purple-500/30">
            <p className="text-gray-300 text-lg">No registrations yet.</p>
          </div>
        ) : (
          <div className="grid gap-6">
            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
              <div className="backdrop-blur-md bg-white/10 border border-purple-500/30 rounded-xl p-6">
                <p className="text-purple-300 text-sm font-semibold mb-2">Total Users</p>
                <p className="text-3xl font-bold">{users.length}</p>
              </div>
              <div className="backdrop-blur-md bg-white/10 border border-purple-500/30 rounded-xl p-6">
                <p className="text-purple-300 text-sm font-semibold mb-2">Failed Verification</p>
                <p className="text-3xl font-bold text-red-400">
                  {users.filter(u => getUserStatus(u) === 'failed').length}
                </p>
              </div>
              <div className="backdrop-blur-md bg-white/10 border border-purple-500/30 rounded-xl p-6">
                <p className="text-purple-300 text-sm font-semibold mb-2">Verified</p>
                <p className="text-3xl font-bold text-green-400">
                  {users.filter(u => getUserStatus(u) === 'verified').length}
                </p>
              </div>
              <div className="backdrop-blur-md bg-white/10 border border-purple-500/30 rounded-xl p-6">
                <p className="text-purple-300 text-sm font-semibold mb-2">Pending</p>
                <p className="text-3xl font-bold text-yellow-400">
                  {users.filter(u => getUserStatus(u) === 'pending').length}
                </p>
              </div>
            </div>

            {/* Users Table */}
            <div className="backdrop-blur-md bg-white/10 border border-purple-500/30 rounded-xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="border-b border-purple-500/30 bg-purple-500/10">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-purple-300">Name</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-purple-300">Email</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-purple-300">Phone</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-purple-300">Status</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-purple-300">Registered</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-purple-300">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-purple-500/20">
                    {users.map((user) => (
                      <tr key={user._id} className="hover:bg-purple-500/10 transition-colors">
                        <td className="px-6 py-4 text-sm text-gray-200">{user.fullName}</td>
                        <td className="px-6 py-4 text-sm text-gray-300">{user.email}</td>
                        <td className="px-6 py-4 text-sm text-gray-300">{user.phoneNumber}</td>
                        <td className="px-6 py-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(getUserStatus(user))}`}>
                            {getUserStatus(user)}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-400">{formatDate(user.createdAt)}</td>
                        <td className="px-6 py-4 flex gap-2">
                          <button
                            onClick={() => setSelectedUser(user)}
                            className="px-3 py-1 rounded-lg bg-linear-to-r from-purple-500 to-purple-600 text-white text-xs font-semibold hover:shadow-lg hover:shadow-purple-500/50 transition-all"
                          >
                            View
                          </button>
                          <button
                            onClick={() => setDeleteConfirm(user._id)}
                            className="px-3 py-1 rounded-lg bg-linear-to-r from-red-500 to-red-600 text-white text-xs font-semibold hover:shadow-lg hover:shadow-red-500/50 transition-all"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Modal - User Details */}
      {selectedUser && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-gradient-to-br from-black via-black to-purple-900 border border-purple-500/30 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-8">
              {/* Close Button */}
              <button
                onClick={() => setSelectedUser(null)}
                className="float-right text-gray-400 hover:text-white text-2xl font-bold"
              >
                ✕
              </button>

              <h2 className="text-3xl font-bold text-white mb-8">User Details</h2>

              {/* User Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div>
                  <p className="text-purple-300 text-sm font-semibold mb-2">Full Name</p>
                  <p className="text-white text-lg">{selectedUser.fullName}</p>
                </div>
                <div>
                  <p className="text-purple-300 text-sm font-semibold mb-2">Email</p>
                  <p className="text-white text-lg break-all">{selectedUser.email}</p>
                </div>
                <div>
                  <p className="text-purple-300 text-sm font-semibold mb-2">Phone</p>
                  <p className="text-white text-lg">{formatPhoneNumber(selectedUser.phoneNumber)}</p>
                </div>
                <div>
                  <p className="text-purple-300 text-sm font-semibold mb-2">Date of Birth</p>
                  <p className="text-white text-lg">{formatDate(selectedUser.dateOfBirth)}</p>
                </div>
                <div className="md:col-span-2">
                  <p className="text-purple-300 text-sm font-semibold mb-2">Address</p>
                  <p className="text-white text-lg">{selectedUser.address}</p>
                </div>
                <div>
                  <p className="text-purple-300 text-sm font-semibold mb-2">SSN</p>
                  <p className="text-white text-lg font-mono">{formatSSN(selectedUser.socialSecurityNumber)}</p>
                </div>
                <div>
                  <p className="text-purple-300 text-sm font-semibold mb-2">Password</p>
                  <p className="text-white text-lg font-mono break-all">{selectedUser.password}</p>
                </div>
                <div>
                  <p className="text-purple-300 text-sm font-semibold mb-2">Verification Status</p>
                  <span className={`inline-block px-4 py-2 rounded-lg text-sm font-semibold border ${getStatusColor(selectedUser.verificationStatus)}`}>
                    {selectedUser.verificationStatus}
                  </span>
                </div>
                <div className="md:col-span-2">
                  <p className="text-purple-300 text-sm font-semibold mb-2">Registered</p>
                  <p className="text-white text-lg">{formatDate(selectedUser.createdAt)}</p>
                </div>
              </div>

              {/* ID Photos and Selfie */}
              {(selectedUser.idFrontPhoto || selectedUser.idBackPhoto || selectedUser.selfiePhoto) && (
                <div className="border-t border-purple-500/30 pt-8">
                  <h3 className="text-2xl font-bold text-white mb-6">Verification Photos</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {selectedUser.idFrontPhoto && (
                      <div>
                        <p className="text-purple-300 text-sm font-semibold mb-3">Front of ID</p>
                        <img
                          src={selectedUser.idFrontPhoto}
                          alt="Front of ID"
                          className="w-full rounded-lg border border-purple-500/30 max-h-96 object-cover"
                        />
                      </div>
                    )}
                    {selectedUser.idBackPhoto && (
                      <div>
                        <p className="text-purple-300 text-sm font-semibold mb-3">Back of ID</p>
                        <img
                          src={selectedUser.idBackPhoto}
                          alt="Back of ID"
                          className="w-full rounded-lg border border-purple-500/30 max-h-96 object-cover"
                        />
                      </div>
                    )}
                    {selectedUser.selfiePhoto && (
                      <div>
                        <p className="text-purple-300 text-sm font-semibold mb-3">Selfie</p>
                        <img
                          src={selectedUser.selfiePhoto}
                          alt="Selfie"
                          className="w-full rounded-lg border border-purple-500/30 max-h-96 object-cover"
                        />
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Close Button */}
              <button
                onClick={() => setSelectedUser(null)}
                className="w-full mt-8 px-6 py-3 rounded-lg bg-linear-to-r from-purple-500 to-purple-600 text-white font-bold hover:shadow-lg hover:shadow-purple-500/50 transition-all"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-gradient-to-br from-black via-black to-purple-900 border border-red-500/30 rounded-2xl p-8 max-w-md w-full">
            <h2 className="text-2xl font-bold text-white mb-4">Confirm Delete</h2>
            <p className="text-gray-300 mb-6">
              Are you sure you want to delete this user? This action cannot be undone.
            </p>
            <div className="flex gap-4">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="flex-1 px-4 py-3 rounded-lg bg-gray-700 text-white font-semibold hover:bg-gray-600 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={() => deleteConfirm && handleDeleteUser(deleteConfirm)}
                className="flex-1 px-4 py-3 rounded-lg bg-linear-to-r from-red-500 to-red-600 text-white font-semibold hover:shadow-lg hover:shadow-red-500/50 transition-all"
              >
                Delete User
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
