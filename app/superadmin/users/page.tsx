'use client';
import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { Edit, Trash2, Plus, Save, X, User, Mail, MapPin, AlertCircle } from 'lucide-react';

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

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
      console.log('Loading users from Supabase...');
      setDebugInfo('Fetching users...');
      
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Supabase error:', error);
        setDebugInfo(`Error: ${error.message} (${error.code})`);
        throw error;
      }

      console.log('Users loaded:', data);
      setDebugInfo(`Found ${data?.length || 0} users`);
      setUsers(data || []);
      
    } catch (error: any) {
      console.error('Error loading users:', error);
      setSaveStatus({ 
        type: 'error', 
        message: `Failed to load users: ${error.message}` 
      });
      setDebugInfo(`Load error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveUser = async (user: User) => {
    try {
      setDebugInfo('Saving user...');
      const { data, error } = await supabase
        .from('users')
        .update({
          username: user.username,
          email: user.email,
          province: user.province,
          is_active: user.is_active,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id)
        .select();

      if (error) {
        setDebugInfo(`Save error: ${error.message}`);
        throw error;
      }

      if (!data || data.length === 0) {
        throw new Error('No data returned from update');
      }

      setUsers(users.map(u => u.id === user.id ? data[0] : u));
      setEditingUser(null);
      setSaveStatus({ type: 'success', message: 'User updated successfully' });
      setDebugInfo('User saved successfully');
      
    } catch (error: any) {
      console.error('Error updating user:', error);
      setSaveStatus({ 
        type: 'error', 
        message: `Failed to update user: ${error.message}` 
      });
    }
  };

  const handleAddUser = async () => {
    // Basic validation
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

      const { data, error } = await supabase
        .from('users')
        .insert([{
          username: newUser.username.trim(),
          email: newUser.email.trim(),
          province: newUser.province,
          is_active: true
        }])
        .select();

      if (error) {
        console.error('Supabase insert error:', error);
        setDebugInfo(`Insert error: ${error.message} (${error.code})`);
        
        if (error.code === '23505') { // Unique violation
          if (error.message.includes('username')) {
            throw new Error('Username already exists');
          } else if (error.message.includes('email')) {
            throw new Error('Email already exists');
          }
        }
        throw error;
      }

      if (!data || data.length === 0) {
        throw new Error('No data returned from insert');
      }

      console.log('User added successfully:', data[0]);
      setUsers([data[0], ...users]);
      setNewUser({ username: '', email: '', province: 'Harare', is_active: true });
      setShowAddForm(false);
      setSaveStatus({ type: 'success', message: 'User added successfully' });
      setDebugInfo('User added successfully');
      
    } catch (error: any) {
      console.error('Error adding user:', error);
      setSaveStatus({ 
        type: 'error', 
        message: error.message || 'Failed to add user' 
      });
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!confirm('Are you sure you want to delete this user?')) return;

    try {
      setDebugInfo('Deleting user...');
      const { error } = await supabase
        .from('users')
        .delete()
        .eq('id', userId);

      if (error) throw error;

      setUsers(users.filter(u => u.id !== userId));
      setSaveStatus({ type: 'success', message: 'User deleted successfully' });
      setDebugInfo('User deleted successfully');
      
    } catch (error: any) {
      console.error('Error deleting user:', error);
      setSaveStatus({ 
        type: 'error', 
        message: `Failed to delete user: ${error.message}` 
      });
    }
  };

  const toggleUserStatus = async (user: User) => {
    const updatedUser = { ...user, is_active: !user.is_active };
    await handleSaveUser(updatedUser);
  };

  // Reset form when closing
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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading users...</p>
          {debugInfo && <p className="text-sm text-gray-500 mt-2">{debugInfo}</p>}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
              <p className="text-gray-600 mt-2">Manage system users and their provinces</p>
            </div>
            <button
              onClick={loadUsers}
              className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
            >
              Refresh
            </button>
          </div>
          
          {/* Debug Info */}
          {debugInfo && (
            <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-center gap-2 text-sm text-blue-800">
                <AlertCircle className="w-4 h-4" />
                <span>Debug: {debugInfo}</span>
              </div>
            </div>
          )}
        </div>

        {/* Status Message */}
        {saveStatus && (
          <div className={`mb-6 p-4 rounded-lg ${
            saveStatus.type === 'success' 
              ? 'bg-green-50 text-green-800 border border-green-200' 
              : 'bg-red-50 text-red-800 border border-red-200'
          }`}>
            <div className="flex items-center gap-2">
              {saveStatus.type === 'success' ? (
                <span>✅</span>
              ) : (
                <AlertCircle className="w-5 h-5" />
              )}
              <span>{saveStatus.message}</span>
            </div>
          </div>
        )}

        {/* Add User Button */}
        <div className="mb-6">
          <button
            onClick={() => setShowAddForm(true)}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <Plus className="w-5 h-5" />
            Add New User
          </button>
        </div>

        {/* Add User Form */}
        {showAddForm && (
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Add New User</h3>
              <button
                onClick={handleCancelAdd}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Username *
                </label>
                <input
                  type="text"
                  value={newUser.username}
                  onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="Enter username"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email *
                </label>
                <input
                  type="email"
                  value={newUser.email}
                  onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="Enter email"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Province
                </label>
                <select
                  value={newUser.province}
                  onChange={(e) => setNewUser({ ...newUser, province: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  {ZIMBABWE_PROVINCES.map(province => (
                    <option key={province} value={province}>{province}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="flex justify-end gap-3">
              <button
                onClick={handleCancelAdd}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleAddUser}
                disabled={!newUser.username.trim() || !newUser.email.trim()}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <Save className="w-4 h-4" />
                Save User
              </button>
            </div>
          </div>
        )}

        {/* Users Table */}
        <div className="bg-white shadow-sm rounded-lg border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Province
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Created
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {users.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 flex items-center justify-center bg-green-100 rounded-full">
                          <User className="w-5 h-5 text-green-600" />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {user.username}
                            {editingUser?.id === user.id && <span className="ml-2 text-blue-600">(editing)</span>}
                          </div>
                          <div className="text-sm text-gray-500 flex items-center gap-1">
                            <Mail className="w-3 h-3" />
                            {user.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 flex items-center gap-1">
                        <MapPin className="w-4 h-4 text-gray-400" />
                        {editingUser?.id === user.id ? (
                          <select
                            value={editingUser.province}
                            onChange={(e) => setEditingUser({ ...editingUser, province: e.target.value })}
                            className="border border-gray-300 rounded px-2 py-1 text-sm"
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
                        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                          user.is_active
                            ? 'bg-green-100 text-green-800 hover:bg-green-200'
                            : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                        }`}
                      >
                        {user.is_active ? 'Active' : 'Inactive'}
                      </button>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(user.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end gap-2">
                        {editingUser?.id === user.id ? (
                          <>
                            <button
                              onClick={() => setEditingUser(null)}
                              className="text-gray-500 hover:text-gray-700 p-1"
                              title="Cancel"
                            >
                              <X className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleSaveUser(editingUser)}
                              className="text-green-600 hover:text-green-800 p-1"
                              title="Save"
                            >
                              <Save className="w-4 h-4" />
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              onClick={() => setEditingUser(user)}
                              className="text-blue-600 hover:text-blue-800 p-1"
                              title="Edit"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteUser(user.id)}
                              className="text-red-600 hover:text-red-800 p-1"
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
            <div className="text-center py-12 text-gray-500">
              <User className="w-12 h-12 mx-auto mb-3 text-gray-300" />
              <p className="text-lg font-medium">No users found</p>
              <p className="text-sm mt-1">Add your first user using the button above</p>
              <button
                onClick={() => setShowAddForm(true)}
                className="mt-4 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                Add First User
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UsersAdminPage;