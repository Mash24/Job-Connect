import React, { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { Filter, Save, X, Search, MapPin, Calendar, User, Briefcase, Shield, CheckCircle, XCircle } from 'lucide-react';

const UserFilterPanel = ({ filters, onFilterChange, savedFilters, onSavePreset, onLoadPreset }) => {
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [presetName, setPresetName] = useState('');
  const [isExpanded, setIsExpanded] = useState(true);

  const handleFilterChange = (key, value) => {
    onFilterChange({ ...filters, [key]: value });
  };

  const clearFilters = () => {
    onFilterChange({
      role: 'all',
      status: 'all',
      dateRange: 'all',
      location: '',
      search: ''
    });
  };

  const handleSavePreset = () => {
    if (presetName.trim()) {
      onSavePreset(presetName.trim());
      setPresetName('');
      setShowSaveDialog(false);
    }
  };

  const getActiveFilterCount = () => {
    let count = 0;
    if (filters.role !== 'all') count++;
    if (filters.status !== 'all') count++;
    if (filters.dateRange !== 'all') count++;
    if (filters.location) count++;
    if (filters.search) count++;
    return count;
  };

  const roleOptions = [
    { value: 'all', label: 'All Roles', icon: User },
    { value: 'job-seeker', label: 'Job Seekers', icon: User },
    { value: 'employer', label: 'Employers', icon: Briefcase },
    { value: 'super-admin', label: 'Admins', icon: Shield }
  ];

  const statusOptions = [
    { value: 'all', label: 'All Status', icon: CheckCircle },
    { value: 'active', label: 'Active', icon: CheckCircle },
    { value: 'inactive', label: 'Inactive', icon: XCircle }
  ];

  const dateRangeOptions = [
    { value: 'all', label: 'All Time' },
    { value: '7days', label: 'Last 7 Days' },
    { value: '30days', label: 'Last 30 Days' },
    { value: '90days', label: 'Last 90 Days' }
  ];

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-blue-600" />
            <h3 className="font-semibold text-gray-900">Filters</h3>
            {getActiveFilterCount() > 0 && (
              <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-0.5 rounded-full">
                {getActiveFilterCount()}
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-1 hover:bg-gray-100 rounded"
            >
              <motion.div
                animate={{ rotate: isExpanded ? 180 : 0 }}
                transition={{ duration: 0.2 }}
              >
                ▼
              </motion.div>
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="p-4 space-y-6">
              {/* Search */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Search className="w-4 h-4 inline mr-1" />
                  Search Users
                </label>
                <input
                  type="text"
                  placeholder="Search by name or email..."
                  value={filters.search}
                  onChange={(e) => handleFilterChange('search', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              {/* Role Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Role
                </label>
                <div className="space-y-2">
                  {roleOptions.map((option) => {
                    const Icon = option.icon;
                    return (
                      <label key={option.value} className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="role"
                          value={option.value}
                          checked={filters.role === option.value}
                          onChange={(e) => handleFilterChange('role', e.target.value)}
                          className="text-blue-600 focus:ring-blue-500"
                        />
                        <Icon className="w-4 h-4 text-gray-500" />
                        <span className="text-sm text-gray-700">{option.label}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* Status Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status
                </label>
                <div className="space-y-2">
                  {statusOptions.map((option) => {
                    const Icon = option.icon;
                    return (
                      <label key={option.value} className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="status"
                          value={option.value}
                          checked={filters.status === option.value}
                          onChange={(e) => handleFilterChange('status', e.target.value)}
                          className="text-blue-600 focus:ring-blue-500"
                        />
                        <Icon className="w-4 h-4 text-gray-500" />
                        <span className="text-sm text-gray-700">{option.label}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* Date Range Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Calendar className="w-4 h-4 inline mr-1" />
                  Signup Date
                </label>
                <select
                  value={filters.dateRange}
                  onChange={(e) => handleFilterChange('dateRange', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  {dateRangeOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Location Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <MapPin className="w-4 h-4 inline mr-1" />
                  Location
                </label>
                <input
                  type="text"
                  placeholder="Enter location..."
                  value={filters.location}
                  onChange={(e) => handleFilterChange('location', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              {/* Preset Filters */}
              <div className="flex items-center gap-2">
                <button
                  onClick={clearFilters}
                  className="px-3 py-1 text-sm rounded-md bg-gray-100 text-gray-700 hover:bg-gray-200"
                >
                  Clear Filters
                </button>
                <button
                  onClick={() => setShowSaveDialog(true)}
                  className="px-3 py-1 text-sm rounded-md bg-blue-100 text-blue-700"
                >
                  <Save className="w-4 h-4 inline mr-1" />
                  Save Preset
                </button>
                {savedFilters.map((preset, idx) => (
                  <button
                    key={idx}
                    onClick={() => onLoadPreset(preset)}
                    className="px-3 py-1 text-sm rounded-md bg-green-100 text-green-700"
                  >
                    {preset.name}
                  </button>
                ))}
              </div>

              {/* Save Preset Dialog */}
              {showSaveDialog && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 z-50">
                  <div className="bg-white rounded-lg shadow-lg p-6 w-80">
                    <h4 className="font-semibold mb-2">Save Filter Preset</h4>
                    <input
                      type="text"
                      placeholder="Preset name"
                      value={presetName}
                      onChange={(e) => setPresetName(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg mb-3"
                    />
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => setShowSaveDialog(false)}
                        className="px-3 py-1 text-sm rounded-md bg-gray-100 text-gray-700"
                      >
                        <X className="w-4 h-4 inline mr-1" />
                        Cancel
                      </button>
                      <button
                        onClick={handleSavePreset}
                        className="px-3 py-1 text-sm rounded-md bg-blue-600 text-white"
                      >
                        <Save className="w-4 h-4 inline mr-1" />
                        Save
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default UserFilterPanel; 