// File: src/pages/admin/AdminSettings.jsx
import React, { useEffect, useState, useCallback } from 'react';
import { doc, getDoc, updateDoc, Timestamp } from 'firebase/firestore';
import { db } from '../../firebase/config';
import { Loader2, Settings, CheckCircle2 } from 'lucide-react';
import debounce from 'lodash.debounce';

const AdminSettings = () => {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [savingField, setSavingField] = useState(null);
  const [errorField, setErrorField] = useState(null);
  const [maintenanceTime, setMaintenanceTime] = useState('');

  const docRef = doc(db, 'settings', 'global');

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
        }
      } catch (err) {
        console.error('Failed to fetch settings:', err);
        alert('⚠️ Failed to load settings');
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

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

  const ToggleButton = ({ field }) => (
    <div key={field} className="flex items-center justify-between">
      <label className="text-sm">
        {field.replace(/([A-Z])/g, ' $1').replace(/^./, (s) => s.toUpperCase())}
      </label>
      <button
        onClick={() => handleToggle(field)}
        disabled={savingField === field}
        className={`px-3 py-1 rounded text-sm shadow border transition duration-150 ${
          settings[field] ? 'bg-green-500 text-white' : 'bg-gray-300 text-gray-700'
        }`}
      >
        {savingField === field ? (
          <Loader2 className="animate-spin w-4 h-4" />
        ) : settings[field] ? 'Enabled' : 'Disabled'}
      </button>
    </div>
  );

  const TextInput = ({ label, field }) => (
    <div>
      <label className="block text-sm text-gray-600 mb-1">{label}</label>
      <input
        value={settings[field] || ''}
        onChange={handleChange(field)}
        className={`w-full p-2 border rounded text-sm ${
          errorField === field ? 'border-red-500' : ''
        }`}
        disabled={savingField === field}
      />
    </div>
  );

  if (loading) {
    return <div className="p-6">Loading settings...</div>;
  }

  return (
    <div className="min-h-screen p-6 bg-gray-100">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-semibold text-gray-800 flex items-center gap-2 mb-6">
          <Settings className="text-blue-600" /> Admin Settings
        </h2>

        <div className="space-y-6 bg-white p-6 rounded-xl shadow border">
          <TextInput label="App Name" field="appName" />
          <TextInput label="Support Email" field="supportEmail" />
          <TextInput label="App Version" field="version" />

          {/* Toggles */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {['enableChat', 'enableReports', 'maintenanceMode'].map(field => (
              <ToggleButton key={field} field={field} />
            ))}
          </div>

          {/* Maintenance End Time */}
          <div className="pt-4">
            <label className="block text-sm text-gray-600 mb-1">Maintenance End Time</label>
            <input
              type="datetime-local"
              value={maintenanceTime}
              onChange={handleTimeChange}
              className="p-2 border rounded text-sm w-full max-w-xs"
            />
            <button
              onClick={saveTime}
              className="mt-2 px-4 py-2 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
            >
              Save Settings
            </button>
          </div>

          {savingField === null && (
            <div className="flex items-center gap-2 text-sm text-green-600">
              <CheckCircle2 className="w-4 h-4" /> All changes saved.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminSettings;
