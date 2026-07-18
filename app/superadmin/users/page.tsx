'use client';
import React, { useState, useEffect } from 'react';
import { Edit, Trash2, Plus, Save, X, User, Mail, MapPin, AlertCircle, RefreshCw } from 'lucide-react';

interface User {
  id: string;
  username: string;
  email: string;
  province: string;
  is_active: boolean;
  created_at: string;
}

const UsersAdminPage = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [newUser, setNewUser] = useState({
    username: '',
    email: '',
    province: 'Harare',
    is_active: true
  });
  const [showAddForm, setShowAddForm] = useState(false);
  const [saveStatus, setSaveStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [debugInfo, setDebugInfo] = useState<string>('');

  const ZIMBABWE_PROVINCES = [
    'Harare', 'Bulawayo', 'Manicaland', 'Mashonaland Central',
    'Mashonaland East', 'Mashonaland West', 'Masvingo',
    'Matabeleland North', 'Matabeleland South', 'Midlands'
  ];

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      console.log('Loading users from custom PostgreSQL API...');
      setDebugInfo('Fetching users...');
      
      const response = await fetch('/api/users');
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to load users');
      }

      console.log('Users loaded:', data);
      setDebugInfo(`Found ${data?.length || 0} users`);
      setUsers(data || []);
      
    } catch (error: unknown) {
      const errMsg = error instanceof Error ? error.message : 'Unknown error';
      console.error('Error loading users:', error);
      setSaveStatus({ 
        type: 'error', 
        message: `Failed to load users: ${errMsg}` 
      });
      setDebugInfo(`Load error: ${errMsg}`);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveUser = async (user: User) => {
    try {
      setDebugInfo('Saving user...');
      const response = await fetch(`/api/users/${user.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: user.username,
          email: user.email,
          province: user.province,
          is_active: user.is_active,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to update user');
      }

      setUsers(users.map(u => u.id === user.id ? data : u));
      setEditingUser(null);
      setSaveStatus({ type: 'success', message: 'User updated successfully' });
      setDebugInfo('User saved successfully');
      
    } catch (error: unknown) {
      const errMsg = error instanceof Error ? error.message : 'Unknown error';
      console.error('Error updating user:', error);
      setSaveStatus({ 
        type: 'error', 
        message: `Failed to update user: ${errMsg}` 
      });
    }
  };

  const handleAddUser = async () => {
    if (!newUser.username.trim() || !newUser.email.trim()) {
      setSaveStatus({ type: 'error', message: 'Username and email are required' });
      return;
    }

    if (!newUser.email.includes('@')) {
      setSaveStatus({ type: 'error', message: 'Please enter a valid email' });
      return;
    }

    try {
      setDebugInfo('Adding new user...');
      console.log('Adding user:', newUser);

      const response = await fetch('/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: newUser.username.trim(),
          email: newUser.email.trim(),
          province: newUser.province,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to add user');
      }

      console.log('User added successfully:', data);
      setUsers([data, ...users]);
      setNewUser({ username: '', email: '', province: 'Harare', is_active: true });
      setShowAddForm(false);
      setSaveStatus({ type: 'success', message: 'User added successfully' });
      setDebugInfo('User added successfully');
      
    } catch (error: unknown) {
      const errMsg = error instanceof Error ? error.message : 'Failed to add user';
      console.error('Error adding user:', error);
      setSaveStatus({ 
        type: 'error', 
        message: errMsg 
      });
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!confirm('Are you sure you want to delete this user?')) return;

    try {
      setDebugInfo('Deleting user...');
      const response = await fetch(`/api/users/${userId}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to delete user');
      }

      setUsers(users.filter(u => u.id !== userId));
      setSaveStatus({ type: 'success', message: 'User deleted successfully' });
      setDebugInfo('User deleted successfully');
      
    } catch (error: unknown) {
      const errMsg = error instanceof Error ? error.message : 'Unknown error';
      console.error('Error deleting user:', error);
      setSaveStatus({ 
        type: 'error', 
        message: `Failed to delete user: ${errMsg}` 
      });
    }
  };

  const toggleUserStatus = async (user: User) => {
    const updatedUser = { ...user, is_active: !user.is_active };
    await handleSaveUser(updatedUser);
  };

  const handleCancelAdd = () => {
    setNewUser({ username: '', email: '', province: 'Harare', is_active: true });
    setShowAddForm(false);
  };

  useEffect(() => {
    if (saveStatus) {
      const timer = setTimeout(() => setSaveStatus(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [saveStatus]);

  if (loading) {
    return (
      <div className="min-h-[400px] flex items-center justify-center bg-slate-50">
        <div className="text-center space-y-3">
          <div className="animate-spin rounded-full h-10 w-10 border-2 border-blue-600 border-t-transparent mx-auto"></div>
          <p className="text-slate-500 text-sm font-medium">Loading system officials...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header card */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Official Alert Recipients</h1>
            <p className="text-slate-500 text-sm mt-1">Manage health officials authorized to receive regional outbreak notifications</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={loadUsers}
              className="flex items-center gap-2 px-4 py-2 border border-slate-200 bg-white text-slate-700 rounded-lg hover:bg-slate-50 transition-colors text-sm font-medium shadow-xs"
            >
              <RefreshCw className="w-4 h-4" />
              Refresh
            </button>
            <button
              onClick={() => setShowAddForm(true)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-500 transition-colors text-sm font-semibold shadow-xs"
            >
              <Plus className="w-4 h-4" />
              Add Official
            </button>
          </div>
        </div>

        {/* Debug block - formatted nicely */}
        {debugInfo && (
          <div className="mt-4 p-2 px-3 bg-slate-50 border border-slate-100 rounded-lg flex items-center gap-2 text-xs text-slate-500 font-mono">
            <AlertCircle className="w-3.5 h-3.5 text-slate-400" />
            <span>State: {debugInfo}</span>
          </div>
        )}
      </div>

      {/* Save Status alert popup */}
      {saveStatus && (
        <div className={`p-4 rounded-xl border ${
          saveStatus.type === 'success' 
            ? 'bg-emerald-50 text-emerald-800 border-emerald-200' 
            : 'bg-rose-50 text-rose-800 border-rose-200'
        } transition-all duration-300`}>
          <div className="flex items-center gap-2.5">
            {saveStatus.type === 'success' ? (
              <span className="text-emerald-600">✓</span>
            ) : (
              <AlertCircle className="w-5 h-5 text-rose-500" />
            )}
            <span className="text-sm font-medium">{saveStatus.message}</span>
          </div>
        </div>
      )}

      {/* Add User Modal/Form card */}
      {showAddForm && (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-lg font-bold text-slate-900">Add Alert Recipient</h3>
            <button
              onClick={handleCancelAdd}
              className="text-slate-400 hover:text-slate-600 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-5">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Username *
              </label>
              <input
                type="text"
                value={newUser.username}
                onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                placeholder="e.g. John Doe"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Email *
              </label>
              <input
                type="email"
                value={newUser.email}
                onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                placeholder="e.g. name@domain.gov"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Province Assignment
              </label>
              <select
                value={newUser.province}
                onChange={(e) => setNewUser({ ...newUser, province: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 bg-white rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              >
                {ZIMBABWE_PROVINCES.map(province => (
                  <option key={province} value={province}>{province}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="flex justify-end gap-3 border-t border-slate-100 pt-4">
            <button
              onClick={handleCancelAdd}
              className="px-4 py-2 text-sm font-medium text-slate-500 hover:text-slate-700 hover:bg-slate-50 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleAddUser}
              disabled={!newUser.username.trim() || !newUser.email.trim()}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 disabled:bg-slate-100 disabled:text-slate-400 disabled:cursor-not-allowed text-white rounded-lg text-sm font-semibold transition-colors"
            >
              <Save className="w-4 h-4" />
              Save Recipient
            </button>
          </div>
        </div>
      )}

      {/* Users Table */}
      <div className="bg-white shadow-xs rounded-xl border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Official Details
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Assigned Province
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Alert Status
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Date Added
                </th>
                <th className="px-6 py-4 text-right text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-100">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <div className="flex-shrink-0 h-9 w-9 flex items-center justify-center bg-blue-50 border border-blue-100 rounded-lg">
                        <User className="w-4.5 h-4.5 text-blue-600" />
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-slate-900 flex items-center gap-1.5">
                          {user.username}
                          {editingUser?.id === user.id && (
                            <span className="text-[10px] bg-blue-100 text-blue-800 font-bold px-1.5 py-0.2 rounded-full uppercase">
                              Editing
                            </span>
                          )}
                        </div>
                        <div className="text-xs text-slate-500 flex items-center gap-1.5 mt-0.5">
                          <Mail className="w-3.5 h-3.5 text-slate-400" />
                          {user.email}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-slate-700 flex items-center gap-1.5">
                      <MapPin className="w-4 h-4 text-slate-400" />
                      {editingUser?.id === user.id ? (
                        <select
                          value={editingUser.province}
                          onChange={(e) => setEditingUser({ ...editingUser, province: e.target.value })}
                          className="border border-slate-200 bg-white rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                        >
                          {ZIMBABWE_PROVINCES.map(province => (
                            <option key={province} value={province}>{province}</option>
                          ))}
                        </select>
                      ) : (
                        user.province
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      onClick={() => toggleUserStatus(user)}
                      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold transition-all ${
                        user.is_active
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-100 hover:bg-emerald-100'
                          : 'bg-slate-100 text-slate-600 border border-slate-200 hover:bg-slate-200'
                      }`}
                    >
                      {user.is_active ? 'Active' : 'Inactive'}
                    </button>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-xs text-slate-500">
                    {new Date(user.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end gap-2.5">
                      {editingUser?.id === user.id ? (
                        <>
                          <button
                            onClick={() => setEditingUser(null)}
                            className="text-slate-400 hover:text-slate-600 p-1 border border-transparent hover:bg-slate-100 rounded"
                            title="Cancel"
                          >
                            <X className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleSaveUser(editingUser)}
                            className="text-emerald-600 hover:text-emerald-800 p-1 border border-transparent hover:bg-emerald-50 rounded"
                            title="Save"
                          >
                            <Save className="w-4 h-4" />
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            onClick={() => setEditingUser(user)}
                            className="text-blue-600 hover:text-blue-800 p-1 border border-transparent hover:bg-blue-50 rounded"
                            title="Edit"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteUser(user.id)}
                            className="text-rose-600 hover:text-rose-800 p-1 border border-transparent hover:bg-rose-50 rounded"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {users.length === 0 && (
          <div className="text-center py-16 text-slate-500">
            <User className="w-12 h-12 mx-auto mb-3 text-slate-300" />
            <p className="text-base font-bold text-slate-900">No Officials Registered</p>
            <p className="text-sm mt-1">Get started by creating your first official recipient.</p>
            <button
              onClick={() => setShowAddForm(true)}
              className="mt-4 px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-500 font-semibold transition-colors text-sm shadow-xs"
            >
              Register First Official
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default UsersAdminPage;