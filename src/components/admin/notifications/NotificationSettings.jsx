import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Settings, Bell, Mail, MessageSquare, X, Save, AlertTriangle, Info, XCircle, Zap } from 'lucide-react';

const NotificationSettings = ({ settings, onSettingsChange, onClose, currentAdmin }) => {
  const [localSettings, setLocalSettings] = useState(settings);
  const [isSaving, setIsSaving] = useState(false);

  const handleSettingChange = (key, value) => {
    setLocalSettings(prev => ({ ...prev, [key]: value }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      onSettingsChange(localSettings);
      onClose();
    } catch (error) {
      console.error('Error saving settings:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const resetToDefaults = () => {
    setLocalSettings({
      email: true,
      sms: false,
      push: true,
      critical: true,
      warning: true,
      info: false
    });
  };

  const notificationChannels = [
    {
      key: 'email',
      label: 'Email Notifications',
      description: 'Receive notifications via email',
      icon: Mail,
      color: 'text-blue-600'
    },
    {
      key: 'sms',
      label: 'SMS Notifications',
      description: 'Receive urgent notifications via SMS',
      icon: MessageSquare,
      color: 'text-green-600'
    },
    {
      key: 'push',
      label: 'Push Notifications',
      description: 'Receive real-time push notifications',
      icon: Bell,
      color: 'text-purple-600'
    }
  ];

  const severityLevels = [
    {
      key: 'critical',
      label: 'Critical Alerts',
      description: 'System failures, security breaches, data loss',
      icon: XCircle,
      color: 'text-red-600',
      bgColor: 'bg-red-50'
    },
    {
      key: 'warning',
      label: 'Warning Alerts',
      description: 'Performance degradation, high resource usage',
      icon: AlertTriangle,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50'
    },
    {
      key: 'info',
      label: 'Info Notifications',
      description: 'General updates, maintenance notifications',
      icon: Info,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    }
  ];

  const notificationTypes = [
    {
      key: 'system',
      label: 'System Events',
      description: 'Server status, infrastructure changes',
      icon: Zap
    },
    {
      key: 'database',
      label: 'Database Events',
      description: 'Query performance, connection issues',
      icon: Settings
    },
    {
      key: 'user',
      label: 'User Events',
      description: 'User registrations, suspicious activity',
      icon: Bell
    },
    {
      key: 'performance',
      label: 'Performance Events',
      description: 'API response times, resource usage',
      icon: Zap
    }
  ];

  return (
    <div className="w-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-100 rounded-lg">
            <Settings className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Notification Settings</h3>
            <p className="text-sm text-gray-600">
              Configure how you receive notifications
            </p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Admin Info */}
      {currentAdmin && (
        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-medium">
              {currentAdmin.firstname?.charAt(0) || currentAdmin.email?.charAt(0)}
            </div>
            <div>
              <p className="font-medium text-gray-900">
                {currentAdmin.firstname} {currentAdmin.lastname}
              </p>
              <p className="text-sm text-gray-600">{currentAdmin.email}</p>
              <p className="text-xs text-gray-500 capitalize">{currentAdmin.role}</p>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-6">
        {/* Notification Channels */}
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-3">Notification Channels</h4>
          <div className="space-y-3">
            {notificationChannels.map((channel) => {
              const Icon = channel.icon;
              return (
                <motion.div
                  key={channel.key}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center justify-between p-3 bg-white border border-gray-200 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-5 h-5 ${channel.color}`} />
                    <div>
                      <p className="text-sm font-medium text-gray-900">{channel.label}</p>
                      <p className="text-xs text-gray-500">{channel.description}</p>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={localSettings[channel.key]}
                      onChange={(e) => handleSettingChange(channel.key, e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Severity Levels */}
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-3">Alert Severity Levels</h4>
          <div className="space-y-3">
            {severityLevels.map((level) => {
              const Icon = level.icon;
              return (
                <motion.div
                  key={level.key}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex items-center justify-between p-3 border rounded-lg ${level.bgColor} border-current border-opacity-20`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-5 h-5 ${level.color}`} />
                    <div>
                      <p className="text-sm font-medium text-gray-900">{level.label}</p>
                      <p className="text-xs text-gray-600">{level.description}</p>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={localSettings[level.key]}
                      onChange={(e) => handleSettingChange(level.key, e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Notification Types */}
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-3">Notification Types</h4>
          <div className="grid grid-cols-1 gap-3">
            {notificationTypes.map((type) => {
              const Icon = type.icon;
              return (
                <motion.div
                  key={type.key}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center justify-between p-3 bg-white border border-gray-200 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-4 h-4 text-gray-600" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">{type.label}</p>
                      <p className="text-xs text-gray-500">{type.description}</p>
                    </div>
                  </div>
                  <div className="text-xs text-gray-500">
                    Enabled
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Advanced Settings */}
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-3">Advanced Settings</h4>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-white border border-gray-200 rounded-lg">
              <div>
                <p className="text-sm font-medium text-gray-900">Quiet Hours</p>
                <p className="text-xs text-gray-500">Pause non-critical notifications during quiet hours</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>

            <div className="flex items-center justify-between p-3 bg-white border border-gray-200 rounded-lg">
              <div>
                <p className="text-sm font-medium text-gray-900">Digest Mode</p>
                <p className="text-xs text-gray-500">Receive daily summary instead of real-time alerts</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between pt-6 border-t border-gray-200 mt-6">
        <button
          onClick={resetToDefaults}
          className="px-4 py-2 text-sm text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
        >
          Reset to Defaults
        </button>
        <div className="flex items-center gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="px-4 py-2 text-sm text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 rounded-lg transition-colors flex items-center gap-2"
          >
            {isSaving ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Saving...
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                Save Settings
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotificationSettings; 