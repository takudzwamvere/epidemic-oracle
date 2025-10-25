'use client';
import React, { useState } from 'react';
import { 
  Save, 
  User, 
  Bell, 
  Shield, 
  Database, 
  Mail,
  MapPin,
  Building,
  Phone,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

const AdminSettings = () => {
  const [settings, setSettings] = useState({
    profile: {
      name: 'Health Administrator',
      email: 'admin@gweruhealth.gov.zw',
      phone: '+263 77 123 4567',
      position: 'District Health Officer',
      facility: 'Gweru Central Hospital'
    },
    notifications: {
      emailAlerts: true,
      smsAlerts: false,
      qualityReports: true,
      systemUpdates: true
    },
    dataPreferences: {
      autoProcess: true,
      keepOriginal: false,
      defaultFormat: 'CSV',
      maxFileSize: 50
    },
    location: {
      district: 'Gweru',
      province: 'Midlands',
      healthZone: 'Central District',
      facilityCode: 'GW-CENT-001'
    }
  });

  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');

  const handleSave = async () => {
    setIsSaving(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsSaving(false);
    setSaveMessage('Settings saved successfully!');
    setTimeout(() => setSaveMessage(''), 3000);
  };

  const handleInputChange = (section: string, field: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section as keyof typeof prev],
        [field]: value
      }
    }));
  };

  const handleToggle = (section: string, field: string) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section as keyof typeof prev],
        [field]: !prev[section as keyof typeof prev][field as keyof typeof prev[typeof section]]
      }
    }));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Settings</h1>
            <p className="text-gray-600">Manage your account and system preferences</p>
          </div>
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="flex items-center gap-2 px-4 py-2 bg-green-400 hover:bg-green-500 text-white font-semibold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Save className="w-4 h-4" />
            {isSaving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>

      {/* Save Message */}
      {saveMessage && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-start gap-3">
          <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
          <p className="text-green-800">{saveMessage}</p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Profile & Location */}
        <div className="lg:col-span-2 space-y-6">
          {/* Profile Settings */}
          <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <User className="w-5 h-5 text-green-400" />
              <h2 className="text-lg font-semibold text-gray-900">Profile Information</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-2">Full Name</label>
                <input
                  type="text"
                  value={settings.profile.name}
                  onChange={(e) => handleInputChange('profile', 'name', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 text-gray-900 placeholder-gray-500 rounded-lg focus:border-green-400 focus:outline-none focus:ring-1 focus:ring-green-400"
                />
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-2">Email</label>
                <input
                  type="email"
                  value={settings.profile.email}
                  onChange={(e) => handleInputChange('profile', 'email', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 text-gray-900 placeholder-gray-500 rounded-lg focus:border-green-400 focus:outline-none focus:ring-1 focus:ring-green-400"
                />
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-2">Phone</label>
                <input
                  type="tel"
                  value={settings.profile.phone}
                  onChange={(e) => handleInputChange('profile', 'phone', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 text-gray-900 placeholder-gray-500 rounded-lg focus:border-green-400 focus:outline-none focus:ring-1 focus:ring-green-400"
                />
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-2">Position</label>
                <input
                  type="text"
                  value={settings.profile.position}
                  onChange={(e) => handleInputChange('profile', 'position', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 text-gray-900 placeholder-gray-500 rounded-lg focus:border-green-400 focus:outline-none focus:ring-1 focus:ring-green-400"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-gray-700 text-sm font-medium mb-2">Health Facility</label>
                <input
                  type="text"
                  value={settings.profile.facility}
                  onChange={(e) => handleInputChange('profile', 'facility', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 text-gray-900 placeholder-gray-500 rounded-lg focus:border-green-400 focus:outline-none focus:ring-1 focus:ring-green-400"
                />
              </div>
            </div>
          </div>

          {/* Location Settings */}
          <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <MapPin className="w-5 h-5 text-green-400" />
              <h2 className="text-lg font-semibold text-gray-900">Location Information</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-2">District</label>
                <input
                  type="text"
                  value={settings.location.district}
                  onChange={(e) => handleInputChange('location', 'district', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 text-gray-900 placeholder-gray-500 rounded-lg focus:border-green-400 focus:outline-none focus:ring-1 focus:ring-green-400"
                />
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-2">Province</label>
                <select
                  value={settings.location.province}
                  onChange={(e) => handleInputChange('location', 'province', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 text-gray-900 rounded-lg focus:border-green-400 focus:outline-none focus:ring-1 focus:ring-green-400"
                >
                  <option value="Midlands">Midlands</option>
                  <option value="Harare">Harare</option>
                  <option value="Bulawayo">Bulawayo</option>
                  <option value="Manicaland">Manicaland</option>
                  <option value="Mashonaland">Mashonaland</option>
                  <option value="Masvingo">Masvingo</option>
                  <option value="Matabeleland">Matabeleland</option>
                </select>
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-2">Health Zone</label>
                <input
                  type="text"
                  value={settings.location.healthZone}
                  onChange={(e) => handleInputChange('location', 'healthZone', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 text-gray-900 placeholder-gray-500 rounded-lg focus:border-green-400 focus:outline-none focus:ring-1 focus:ring-green-400"
                />
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-2">Facility Code</label>
                <input
                  type="text"
                  value={settings.location.facilityCode}
                  onChange={(e) => handleInputChange('location', 'facilityCode', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 text-gray-900 placeholder-gray-500 rounded-lg focus:border-green-400 focus:outline-none focus:ring-1 focus:ring-green-400"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Preferences */}
        <div className="space-y-6">
          {/* Notification Settings */}
          <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <Bell className="w-5 h-5 text-green-400" />
              <h2 className="text-lg font-semibold text-gray-900">Notifications</h2>
            </div>
            <div className="space-y-4">
              {Object.entries(settings.notifications).map(([key, value]) => (
                <div key={key} className="flex items-center justify-between">
                  <div>
                    <div className="text-gray-900 text-sm font-medium">
                      {key === 'emailAlerts' && 'Email Alerts'}
                      {key === 'smsAlerts' && 'SMS Alerts'}
                      {key === 'qualityReports' && 'Quality Reports'}
                      {key === 'systemUpdates' && 'System Updates'}
                    </div>
                    <div className="text-gray-500 text-xs">
                      {key === 'emailAlerts' && 'Receive email notifications'}
                      {key === 'smsAlerts' && 'Receive SMS notifications'}
                      {key === 'qualityReports' && 'Get quality report updates'}
                      {key === 'systemUpdates' && 'System maintenance alerts'}
                    </div>
                  </div>
                  <button
                    onClick={() => handleToggle('notifications', key)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      value ? 'bg-green-400' : 'bg-gray-300'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        value ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Data Preferences */}
          <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <Database className="w-5 h-5 text-green-400" />
              <h2 className="text-lg font-semibold text-gray-900">Data Preferences</h2>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-gray-900 text-sm font-medium">Auto-process Data</div>
                  <div className="text-gray-500 text-xs">Automatically process uploaded files</div>
                </div>
                <button
                  onClick={() => handleToggle('dataPreferences', 'autoProcess')}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    settings.dataPreferences.autoProcess ? 'bg-green-400' : 'bg-gray-300'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      settings.dataPreferences.autoProcess ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <div className="text-gray-900 text-sm font-medium">Keep Original Files</div>
                  <div className="text-gray-500 text-xs">Save original files after processing</div>
                </div>
                <button
                  onClick={() => handleToggle('dataPreferences', 'keepOriginal')}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    settings.dataPreferences.keepOriginal ? 'bg-green-400' : 'bg-gray-300'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      settings.dataPreferences.keepOriginal ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              <div>
                <label className="block text-gray-700 text-sm font-medium mb-2">Default Format</label>
                <select
                  value={settings.dataPreferences.defaultFormat}
                  onChange={(e) => handleInputChange('dataPreferences', 'defaultFormat', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 text-gray-900 rounded-lg focus:border-green-400 focus:outline-none focus:ring-1 focus:ring-green-400"
                >
                  <option value="CSV">CSV</option>
                  <option value="JSON">JSON</option>
                  <option value="XML">XML</option>
                  <option value="Excel">Excel</option>
                </select>
              </div>

              <div>
                <label className="block text-gray-700 text-sm font-medium mb-2">
                  Max File Size: {settings.dataPreferences.maxFileSize}MB
                </label>
                <input
                  type="range"
                  min="10"
                  max="100"
                  step="10"
                  value={settings.dataPreferences.maxFileSize}
                  onChange={(e) => handleInputChange('dataPreferences', 'maxFileSize', parseInt(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-green-400"
                />
                <div className="flex justify-between text-gray-500 text-xs mt-1">
                  <span>10MB</span>
                  <span>100MB</span>
                </div>
              </div>
            </div>
          </div>

          {/* Account Security */}
          <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <Shield className="w-5 h-5 text-green-400" />
              <h2 className="text-lg font-semibold text-gray-900">Security</h2>
            </div>
            <div className="space-y-3">
              <button className="w-full text-left px-3 py-2 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors border border-gray-200">
                <div className="text-gray-900 text-sm font-medium">Change Password</div>
                <div className="text-gray-500 text-xs">Update your account password</div>
              </button>
              <button className="w-full text-left px-3 py-2 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors border border-gray-200">
                <div className="text-gray-900 text-sm font-medium">Two-Factor Authentication</div>
                <div className="text-gray-500 text-xs">Enable 2FA for extra security</div>
              </button>
              <button className="w-full text-left px-3 py-2 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors border border-gray-200">
                <div className="text-gray-900 text-sm font-medium">Login History</div>
                <div className="text-gray-500 text-xs">View recent account activity</div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminSettings;