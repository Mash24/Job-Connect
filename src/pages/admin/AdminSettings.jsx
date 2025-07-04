import React, { useEffect, useState, useCallback } from 'react';
import { AnimatePresence } from 'framer-motion';
import { 
  Settings, Loader2, CheckCircle2, Save, Shield, 
  Bell, Globe, Users, Database, 
  Palette, Zap, AlertTriangle, Info, Eye, EyeOff,
  Download, Upload, RefreshCw, Trash2
} from 'lucide-react';
import { doc, getDoc, updateDoc, Timestamp } from 'firebase/firestore';
import { db } from '../../firebase/config';
import debounce from 'lodash.debounce';

const AdminSettings = () => {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [savingField, setSavingField] = useState(null);
  const [errorField, setErrorField] = useState(null);
  const [activeTab, setActiveTab] = useState('general');
  const [maintenanceTime, setMaintenanceTime] = useState('');

  const docRef = doc(db, 'settings', 'global');

  const tabs = [
    { id: 'general', name: 'General', icon: Settings },
    { id: 'security', name: 'Security', icon: Shield },
    { id: 'notifications', name: 'Notifications', icon: Bell },
    { id: 'appearance', name: 'Appearance', icon: Palette },
    { id: 'performance', name: 'Performance', icon: Zap },
    { id: 'backup', name: 'Backup & Restore', icon: Database }
  ];

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const snap = await getDoc(docRef);
        if (snap.exists()) {
          const data = snap.data();
          setSettings(data);
          if (data.maintenanceEndsIn?.seconds) {
            const dt = new Date(data.maintenanceEndsIn.seconds * 1000);
            setMaintenanceTime(dt.toISOString().slice(0, 16));
          }
        } else {
          // Initialize default settings
          const defaultSettings = {
            appName: 'Job Connect',
            supportEmail: 'support@jobconnect.com',
            version: '1.0.0',
            enableChat: true,
            enableReports: true,
            maintenanceMode: false,
            enableNotifications: true,
            enableEmailNotifications: true,
            enablePushNotifications: false,
            maxFileSize: 10,
            sessionTimeout: 30,
            enableTwoFactor: false,
            enableAuditLog: true,
            enableRateLimiting: true,
            maxLoginAttempts: 5,
            passwordMinLength: 8,
            theme: 'light',
            primaryColor: '#3b82f6',
            enableDarkMode: true,
            enableAnimations: true,
            cacheEnabled: true,
            cacheDuration: 3600,
            enableCompression: true,
            enableCDN: false,
            backupEnabled: true,
            backupFrequency: 'daily',
            backupRetention: 30,
            enableAutoBackup: true
          };
          setSettings(defaultSettings);
        }
      } catch (err) {
        console.error('Failed to fetch settings:', err);
        alert('⚠️ Failed to load settings');
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, [docRef]);

  const updateField = async (field, value) => {
    setSavingField(field);
    setErrorField(null);
    try {
      await updateDoc(docRef, { [field]: value });
      setSettings(prev => ({ ...prev, [field]: value }));
    } catch (err) {
      console.error(`Error updating ${field}:`, err);
      setErrorField(field);
      alert(`❌ Failed to update ${field}`);
    } finally {
      setSavingField(null);
    }
  };

  const debouncedUpdate = useCallback(debounce(updateField, 600), []);

  const handleChange = (field) => (e) => {
    const value = e.target.value;
    setSettings(prev => ({ ...prev, [field]: value }));
    debouncedUpdate(field, value);
  };

  const handleToggle = async (field) => {
    const newValue = !settings[field];
    await updateField(field, newValue);

    if (field === 'maintenanceMode' && newValue && maintenanceTime) {
      const endsAt = Timestamp.fromDate(new Date(maintenanceTime));
      await updateField('maintenanceEndsIn', endsAt);
    }
  };

  const handleTimeChange = (e) => {
    setMaintenanceTime(e.target.value);
  };

  const saveTime = async () => {
    if (!maintenanceTime) return;
    try {
      const endsAt = Timestamp.fromDate(new Date(maintenanceTime));
      await updateField('maintenanceEndsIn', endsAt);
    } catch (error) {
      alert('❌ Failed to save maintenance end time');
    }
  };

  const exportSettings = () => {
    const dataStr = JSON.stringify(settings, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `settings_${new Date().toISOString().split('T')[0]}.json`;
    link.click();
  };

  const importSettings = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = async (e) => {
        try {
          const importedSettings = JSON.parse(e.target.result);
          // Update all settings
          for (const [key, value] of Object.entries(importedSettings)) {
            await updateField(key, value);
          }
          alert('✅ Settings imported successfully');
        } catch (error) {
          alert('❌ Failed to import settings');
        }
      };
      reader.readAsText(file);
    }
  };

  const resetSettings = () => {
    if (confirm('Are you sure you want to reset all settings to default? This action cannot be undone.')) {
      // Implementation for resetting settings
      alert('Settings reset functionality would be implemented here');
    }
  };

  const ToggleButton = ({ field, label, description }) => (
    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
      <div>
        <label className="text-sm font-medium text-gray-900">{label}</label>
        {description && (
          <p className="text-xs text-gray-600 mt-1">{description}</p>
        )}
      </div>
      <button
        onClick={() => handleToggle(field)}
        disabled={savingField === field}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
          settings[field] ? 'bg-blue-600' : 'bg-gray-300'
        }`}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
            settings[field] ? 'translate-x-6' : 'translate-x-1'
          }`}
        />
        {savingField === field && (
          <Loader2 className="absolute inset-0 m-auto w-4 h-4 animate-spin text-white" />
        )}
      </button>
    </div>
  );

  const TextInput = ({ label, field, type = 'text', description }) => (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <div className="relative">
        <input
          type={type}
          value={settings[field] || ''}
          onChange={handleChange(field)}
          className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
            errorField === field ? 'border-red-500' : ''
          }`}
          disabled={savingField === field}
        />
        {savingField === field && (
          <Loader2 className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 animate-spin text-gray-400" />
        )}
      </div>
      {description && (
        <p className="text-xs text-gray-600 mt-1">{description}</p>
      )}
    </div>
  );

  const NumberInput = ({ label, field, min, max, step, description }) => (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <input
        type="number"
        min={min}
        max={max}
        step={step}
        value={settings[field] || ''}
        onChange={handleChange(field)}
        className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
          errorField === field ? 'border-red-500' : ''
        }`}
        disabled={savingField === field}
      />
      {description && (
        <p className="text-xs text-gray-600 mt-1">{description}</p>
      )}
    </div>
  );

  const SelectInput = ({ label, field, options, description }) => (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <select
        value={settings[field] || ''}
        onChange={handleChange(field)}
        className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
          errorField === field ? 'border-red-500' : ''
        }`}
        disabled={savingField === field}
      >
        {options.map(option => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {description && (
        <p className="text-xs text-gray-600 mt-1">{description}</p>
      )}
    </div>
  );

  const renderGeneralSettings = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <TextInput 
          label="App Name" 
          field="appName" 
          description="The name displayed throughout the application"
        />
        <TextInput 
          label="Support Email" 
          field="supportEmail" 
          type="email"
          description="Email address for user support inquiries"
        />
        <TextInput 
          label="App Version" 
          field="version" 
          description="Current application version"
        />
        <TextInput 
          label="Company Name" 
          field="companyName" 
          description="Your company or organization name"
        />
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">Feature Toggles</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <ToggleButton 
            field="enableChat" 
            label="Enable Chat System"
            description="Allow users to chat with support"
          />
          <ToggleButton 
            field="enableReports" 
            label="Enable Reports"
            description="Allow users to generate reports"
          />
          <ToggleButton 
            field="maintenanceMode" 
            label="Maintenance Mode"
            description="Put the application in maintenance mode"
          />
          <ToggleButton 
            field="enableNotifications" 
            label="Enable Notifications"
            description="Allow system notifications"
          />
        </div>
      </div>

      {settings?.maintenanceMode && (
        <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="w-5 h-5 text-yellow-600" />
            <h3 className="font-medium text-yellow-800">Maintenance Mode Active</h3>
          </div>
          <p className="text-sm text-yellow-700 mb-3">
            The application is currently in maintenance mode. Users will see a maintenance page.
          </p>
          <div className="flex items-center gap-4">
            <input
              type="datetime-local"
              value={maintenanceTime}
              onChange={handleTimeChange}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <button
              onClick={saveTime}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Set End Time
            </button>
          </div>
        </div>
      )}
    </div>
  );

  const renderSecuritySettings = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ToggleButton 
          field="enableTwoFactor" 
          label="Two-Factor Authentication"
          description="Require 2FA for admin accounts"
        />
        <ToggleButton 
          field="enableAuditLog" 
          label="Audit Logging"
          description="Log all admin actions for security"
        />
        <ToggleButton 
          field="enableRateLimiting" 
          label="Rate Limiting"
          description="Limit API requests to prevent abuse"
        />
        <NumberInput 
          label="Max Login Attempts" 
          field="maxLoginAttempts" 
          min={1} 
          max={10}
          description="Maximum failed login attempts before lockout"
        />
        <NumberInput 
          label="Password Min Length" 
          field="passwordMinLength" 
          min={6} 
          max={20}
          description="Minimum password length requirement"
        />
        <NumberInput 
          label="Session Timeout (minutes)" 
          field="sessionTimeout" 
          min={5} 
          max={480}
          description="Auto-logout after inactivity"
        />
      </div>

      <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <div className="flex items-center gap-2 mb-2">
          <Info className="w-5 h-5 text-blue-600" />
          <h3 className="font-medium text-blue-800">Security Recommendations</h3>
        </div>
        <ul className="text-sm text-blue-700 space-y-1">
          <li>• Enable two-factor authentication for all admin accounts</li>
          <li>• Use strong passwords with at least 12 characters</li>
          <li>• Regularly review audit logs for suspicious activity</li>
          <li>• Keep the application updated to the latest version</li>
        </ul>
      </div>
    </div>
  );

  const renderNotificationSettings = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ToggleButton 
          field="enableEmailNotifications" 
          label="Email Notifications"
          description="Send notifications via email"
        />
        <ToggleButton 
          field="enablePushNotifications" 
          label="Push Notifications"
          description="Send browser push notifications"
        />
        <ToggleButton 
          field="enableSMSNotifications" 
          label="SMS Notifications"
          description="Send notifications via SMS"
        />
        <ToggleButton 
          field="enableInAppNotifications" 
          label="In-App Notifications"
          description="Show notifications within the app"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <SelectInput 
          label="Default Notification Frequency" 
          field="notificationFrequency" 
          options={[
            { value: 'immediate', label: 'Immediate' },
            { value: 'hourly', label: 'Hourly' },
            { value: 'daily', label: 'Daily' },
            { value: 'weekly', label: 'Weekly' }
          ]}
          description="Default frequency for user notifications"
        />
        <NumberInput 
          label="Notification Retention (days)" 
          field="notificationRetention" 
          min={1} 
          max={365}
          description="How long to keep notification history"
        />
      </div>
    </div>
  );

  const renderAppearanceSettings = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <SelectInput 
          label="Theme" 
          field="theme" 
          options={[
            { value: 'light', label: 'Light' },
            { value: 'dark', label: 'Dark' },
            { value: 'auto', label: 'Auto (System)' }
          ]}
          description="Default theme for the application"
        />
        <ToggleButton 
          field="enableDarkMode" 
          label="Dark Mode"
          description="Allow users to switch to dark mode"
        />
        <ToggleButton 
          field="enableAnimations" 
          label="Animations"
          description="Enable UI animations and transitions"
        />
        <TextInput 
          label="Primary Color" 
          field="primaryColor" 
          type="color"
          description="Primary brand color for the application"
        />
      </div>

      <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
        <h3 className="font-medium text-gray-900 mb-2">Preview</h3>
        <div className="flex items-center gap-4">
          <div 
            className="w-16 h-16 rounded-lg"
            style={{ backgroundColor: settings?.primaryColor || '#3b82f6' }}
          ></div>
          <div>
            <p className="text-sm text-gray-600">Primary Color</p>
            <p className="text-sm font-mono">{settings?.primaryColor || '#3b82f6'}</p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderPerformanceSettings = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ToggleButton 
          field="cacheEnabled" 
          label="Enable Caching"
          description="Cache frequently accessed data"
        />
        <ToggleButton 
          field="enableCompression" 
          label="Enable Compression"
          description="Compress responses to reduce bandwidth"
        />
        <ToggleButton 
          field="enableCDN" 
          label="Enable CDN"
          description="Use Content Delivery Network for assets"
        />
        <NumberInput 
          label="Cache Duration (seconds)" 
          field="cacheDuration" 
          min={60} 
          max={86400}
          description="How long to cache data"
        />
      </div>

      <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
        <div className="flex items-center gap-2 mb-2">
          <Zap className="w-5 h-5 text-green-600" />
          <h3 className="font-medium text-green-800">Performance Tips</h3>
        </div>
        <ul className="text-sm text-green-700 space-y-1">
          <li>• Enable caching for better response times</li>
          <li>• Use compression to reduce bandwidth usage</li>
          <li>• Enable CDN for faster asset delivery</li>
          <li>• Monitor cache hit rates regularly</li>
        </ul>
      </div>
    </div>
  );

  const renderBackupSettings = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ToggleButton 
          field="backupEnabled" 
          label="Enable Backups"
          description="Automatically backup application data"
        />
        <ToggleButton 
          field="enableAutoBackup" 
          label="Auto Backup"
          description="Schedule automatic backups"
        />
        <SelectInput 
          label="Backup Frequency" 
          field="backupFrequency" 
          options={[
            { value: 'hourly', label: 'Hourly' },
            { value: 'daily', label: 'Daily' },
            { value: 'weekly', label: 'Weekly' },
            { value: 'monthly', label: 'Monthly' }
          ]}
          description="How often to create backups"
        />
        <NumberInput 
          label="Backup Retention (days)" 
          field="backupRetention" 
          min={1} 
          max={365}
          description="How long to keep backup files"
        />
      </div>

      <div className="flex gap-4">
        <button
          onClick={exportSettings}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <Download className="w-4 h-4" />
          Export Settings
        </button>
        
        <label className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 cursor-pointer">
          <Upload className="w-4 h-4" />
          Import Settings
          <input
            type="file"
            accept=".json"
            onChange={importSettings}
            className="hidden"
          />
        </label>
        
        <button
          onClick={resetSettings}
          className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
        >
          <Trash2 className="w-4 h-4" />
          Reset to Default
        </button>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading settings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">⚙️ Admin Settings</h1>
              <p className="text-gray-600">Configure application settings and preferences</p>
            </div>
            
            <div className="flex items-center gap-3">
              <button
                onClick={() => window.location.reload()}
                className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
              >
                <RefreshCw className="w-4 h-4" />
                Refresh
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 py-2 px-1 border-b-2 font-medium text-sm ${
                      activeTab === tab.id
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {tab.name}
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Content */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          {activeTab === 'general' && renderGeneralSettings()}
          {activeTab === 'security' && renderSecuritySettings()}
          {activeTab === 'notifications' && renderNotificationSettings()}
          {activeTab === 'appearance' && renderAppearanceSettings()}
          {activeTab === 'performance' && renderPerformanceSettings()}
          {activeTab === 'backup' && renderBackupSettings()}
        </div>

        {/* Status */}
        {savingField === null && (
          <div className="mt-4 flex items-center gap-2 text-sm text-green-600">
            <CheckCircle2 className="w-4 h-4" />
            All changes saved automatically
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminSettings; 