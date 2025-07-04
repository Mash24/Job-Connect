import React from 'react';
import { Filter, Clock, AlertTriangle, Info, XCircle, Bell } from 'lucide-react';

const NotificationFilters = ({ filters, onFilterChange, unreadCount, onMarkAllRead }) => {
  const severityOptions = [
    { value: 'all', label: 'All Severities', icon: Bell },
    { value: 'critical', label: 'Critical', icon: XCircle, color: 'text-red-600' },
    { value: 'warning', label: 'Warning', icon: AlertTriangle, color: 'text-yellow-600' },
    { value: 'info', label: 'Info', icon: Info, color: 'text-blue-600' }
  ];

  const typeOptions = [
    { value: 'all', label: 'All Types' },
    { value: 'system', label: 'System' },
    { value: 'database', label: 'Database' },
    { value: 'performance', label: 'Performance' },
    { value: 'user', label: 'User' },
    { value: 'email', label: 'Email' },
    { value: 'message', label: 'Message' }
  ];

  const statusOptions = [
    { value: 'all', label: 'All Status' },
    { value: 'unread', label: 'Unread' },
    { value: 'read', label: 'Read' }
  ];

  const timeRangeOptions = [
    { value: 'all', label: 'All Time' },
    { value: '1h', label: 'Last Hour' },
    { value: '6h', label: 'Last 6 Hours' },
    { value: '24h', label: 'Last 24 Hours' }
  ];

  const handleFilterChange = (key, value) => {
    onFilterChange({ ...filters, [key]: value });
  };

  const clearFilters = () => {
    onFilterChange({
      severity: 'all',
      type: 'all',
      status: 'all',
      timeRange: '24h'
    });
  };

  const getActiveFilterCount = () => {
    let count = 0;
    if (filters.severity !== 'all') count++;
    if (filters.type !== 'all') count++;
    if (filters.status !== 'all') count++;
    if (filters.timeRange !== 'all') count++;
    return count;
  };

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
          {getActiveFilterCount() > 0 && (
            <button
              onClick={clearFilters}
              className="text-sm text-gray-500 hover:text-gray-700"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* Unread Summary */}
        {unreadCount > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-3 bg-blue-50 rounded-lg border border-blue-200"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Bell className="w-4 h-4 text-blue-600" />
                <span className="text-sm font-medium text-blue-800">
                  {unreadCount} unread notification{unreadCount !== 1 ? 's' : ''}
                </span>
              </div>
              <button
                onClick={onMarkAllRead}
                className="text-sm text-blue-600 hover:text-blue-700 font-medium"
              >
                Mark all read
              </button>
            </div>
          </motion.div>
        )}

        {/* Severity Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Severity
          </label>
          <div className="space-y-2">
            {severityOptions.map((option) => {
              const Icon = option.icon;
              return (
                <label key={option.value} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="severity"
                    value={option.value}
                    checked={filters.severity === option.value}
                    onChange={(e) => handleFilterChange('severity', e.target.value)}
                    className="text-blue-600 focus:ring-blue-500"
                  />
                  <Icon className={`w-4 h-4 ${option.color || 'text-gray-500'}`} />
                  <span className="text-sm text-gray-700">{option.label}</span>
                </label>
              );
            })}
          </div>
        </div>

        {/* Type Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Type
          </label>
          <select
            value={filters.type}
            onChange={(e) => handleFilterChange('type', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
          >
            {typeOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* Status Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Status
          </label>
          <div className="space-y-2">
            {statusOptions.map((option) => (
              <label key={option.value} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="status"
                  value={option.value}
                  checked={filters.status === option.value}
                  onChange={(e) => handleFilterChange('status', e.target.value)}
                  className="text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">{option.label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Time Range Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Clock className="w-4 h-4 inline mr-1" />
            Time Range
          </label>
          <select
            value={filters.timeRange}
            onChange={(e) => handleFilterChange('timeRange', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
          >
            {timeRangeOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* Quick Actions */}
        <div className="pt-4 border-t border-gray-200">
          <h4 className="text-sm font-medium text-gray-700 mb-3">Quick Actions</h4>
          <div className="space-y-2">
            <button
              onClick={() => onFilterChange({ ...filters, severity: 'critical' })}
              className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg border border-red-200 hover:border-red-300"
            >
              Show Critical Only
            </button>
            <button
              onClick={() => onFilterChange({ ...filters, status: 'unread' })}
              className="w-full text-left px-3 py-2 text-sm text-blue-600 hover:bg-blue-50 rounded-lg border border-blue-200 hover:border-blue-300"
            >
              Show Unread Only
            </button>
            <button
              onClick={() => onFilterChange({ ...filters, timeRange: '1h' })}
              className="w-full text-left px-3 py-2 text-sm text-green-600 hover:bg-green-50 rounded-lg border border-green-200 hover:border-green-300"
            >
              Recent (Last Hour)
            </button>
          </div>
        </div>

        {/* Filter Summary */}
        {getActiveFilterCount() > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-3 bg-gray-50 rounded-lg"
          >
            <h4 className="text-sm font-medium text-gray-700 mb-2">Active Filters</h4>
            <div className="space-y-1 text-xs text-gray-600">
              {filters.severity !== 'all' && (
                <div>Severity: {filters.severity}</div>
              )}
              {filters.type !== 'all' && (
                <div>Type: {filters.type}</div>
              )}
              {filters.status !== 'all' && (
                <div>Status: {filters.status}</div>
              )}
              {filters.timeRange !== 'all' && (
                <div>Time: {timeRangeOptions.find(o => o.value === filters.timeRange)?.label}</div>
              )}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default NotificationFilters; 