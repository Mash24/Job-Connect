// File: src/pages/admin/AdminLogs.jsx

import React, { useEffect, useState, useCallback } from 'react';
import { AnimatePresence } from 'framer-motion';
import { 
  FileText, Filter, Search, Download, RefreshCw, 
  AlertTriangle, Info, CheckCircle, XCircle, Clock,
  User, Briefcase, Settings, Shield, Globe, Activity,
  Eye, Trash2, Archive, Bell
} from 'lucide-react';
import { collection, onSnapshot, query, orderBy, limit } from 'firebase/firestore';
import { db } from '../../firebase/config';

const AdminLogs = () => {
  const [logs, setLogs] = useState([]);
  const [filteredLogs, setFilteredLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    level: 'all',
    category: 'all',
    user: 'all',
    dateRange: 'all',
    search: ''
  });
  const [logStats, setLogStats] = useState({
    total: 0,
    errors: 0,
    warnings: 0,
    info: 0,
    success: 0
  });
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [logLimit, setLogLimit] = useState(100);

  useEffect(() => {
    const q = query(
      collection(db, 'logs'), 
      orderBy('timestamp', 'desc'),
      limit(logLimit)
    );
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const list = snapshot.docs.map((doc) => ({ 
        id: doc.id, 
        ...doc.data(),
        timestamp: doc.data().timestamp?.toDate() || new Date()
      }));
      setLogs(list);
      calculateLogStats(list);
      setLoading(false);
    }, (error) => {
      console.error('Error fetching logs:', error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [logLimit]);

  useEffect(() => {
    applyFilters();
  }, [applyFilters]);

  const calculateLogStats = (logList) => {
    const stats = {
      total: logList.length,
      errors: logList.filter(log => log.level === 'error').length,
      warnings: logList.filter(log => log.level === 'warning').length,
      info: logList.filter(log => log.level === 'info').length,
      success: logList.filter(log => log.level === 'success').length
    };
    setLogStats(stats);
  };

  const applyFilters = useCallback(() => {
    let filtered = [...logs];

    // Level filter
    if (filters.level !== 'all') {
      filtered = filtered.filter(log => log.level === filters.level);
    }

    // Category filter
    if (filters.category !== 'all') {
      filtered = filtered.filter(log => log.category === filters.category);
    }

    // User filter
    if (filters.user !== 'all') {
      filtered = filtered.filter(log => log.userId === filters.user);
    }

    // Date range filter
    if (filters.dateRange !== 'all') {
      const now = new Date();
      const daysAgo = parseInt(filters.dateRange);
      const cutoffDate = new Date(now.getTime() - (daysAgo * 24 * 60 * 60 * 1000));
      
      filtered = filtered.filter(log => {
        const logDate = log.timestamp?.toDate?.() || new Date(log.timestamp);
        return logDate >= cutoffDate;
      });
    }

    // Search filter
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      filtered = filtered.filter(log => 
        log.message?.toLowerCase().includes(searchTerm) ||
        log.category?.toLowerCase().includes(searchTerm) ||
        log.userId?.toLowerCase().includes(searchTerm) ||
        log.action?.toLowerCase().includes(searchTerm)
      );
    }

    setFilteredLogs(filtered);
  }, [filters, logs]);

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const getLevelIcon = (level) => {
    switch (level) {
      case 'error':
        return <XCircle className="w-4 h-4 text-red-600" />;
      case 'warning':
        return <AlertTriangle className="w-4 h-4 text-yellow-600" />;
      case 'info':
        return <Info className="w-4 h-4 text-blue-600" />;
      case 'success':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      default:
        return <Activity className="w-4 h-4 text-gray-600" />;
    }
  };

  const getLevelColor = (level) => {
    switch (level) {
      case 'error':
        return 'bg-red-50 border-red-200 text-red-800';
      case 'warning':
        return 'bg-yellow-50 border-yellow-200 text-yellow-800';
      case 'info':
        return 'bg-blue-50 border-blue-200 text-blue-800';
      case 'success':
        return 'bg-green-50 border-green-200 text-green-800';
      default:
        return 'bg-gray-50 border-gray-200 text-gray-800';
    }
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'user':
        return <User className="w-4 h-4" />;
      case 'job':
        return <Briefcase className="w-4 h-4" />;
      case 'system':
        return <Settings className="w-4 h-4" />;
      case 'security':
        return <Shield className="w-4 h-4" />;
      case 'api':
        return <Globe className="w-4 h-4" />;
      default:
        return <Activity className="w-4 h-4" />;
    }
  };

  const formatTimestamp = (timestamp) => {
    const date = timestamp?.toDate?.() || new Date(timestamp);
    return date.toLocaleString();
  };

  const exportLogs = () => {
    if (filteredLogs.length === 0) {
      alert('No logs to export');
      return;
    }

    const headers = [
      'Timestamp', 'Level', 'Category', 'User ID', 'Action', 'Message', 'Details'
    ];

    const csvData = filteredLogs.map(log => [
      formatTimestamp(log.timestamp),
      log.level || '',
      log.category || '',
      log.userId || '',
      log.action || '',
      log.message || '',
      JSON.stringify(log.details || {})
    ]);

    const csvContent = [
      headers.join(','),
      ...csvData.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `admin_logs_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const clearLogs = () => {
    if (confirm('Are you sure you want to clear all logs? This action cannot be undone.')) {
      // Implementation for clearing logs would go here
      alert('Log clearing functionality would be implemented here');
    }
  };

  const getCategories = () => {
    const categories = new Set(logs.map(log => log.category).filter(Boolean));
    return Array.from(categories);
  };

  const getUsers = () => {
    const users = new Set(logs.map(log => log.userId).filter(Boolean));
    return Array.from(users);
  };

  const renderStatsCards = () => (
    <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-6">
      <div
        className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Total Logs</p>
            <p className="text-2xl font-bold text-gray-900">{logStats.total}</p>
          </div>
          <div className="p-2 bg-gray-100 rounded-lg">
            <FileText className="w-5 h-5 text-gray-600" />
          </div>
        </div>
      </div>

      <div
        className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Errors</p>
            <p className="text-2xl font-bold text-red-600">{logStats.errors}</p>
          </div>
          <div className="p-2 bg-red-100 rounded-lg">
            <XCircle className="w-5 h-5 text-red-600" />
          </div>
        </div>
      </div>

      <div
        className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Warnings</p>
            <p className="text-2xl font-bold text-yellow-600">{logStats.warnings}</p>
          </div>
          <div className="p-2 bg-yellow-100 rounded-lg">
            <AlertTriangle className="w-5 h-5 text-yellow-600" />
          </div>
        </div>
      </div>

      <div
        className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Info</p>
            <p className="text-2xl font-bold text-blue-600">{logStats.info}</p>
          </div>
          <div className="p-2 bg-blue-100 rounded-lg">
            <Info className="w-5 h-5 text-blue-600" />
          </div>
        </div>
      </div>

      <div
        className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Success</p>
            <p className="text-2xl font-bold text-green-600">{logStats.success}</p>
          </div>
          <div className="p-2 bg-green-100 rounded-lg">
            <CheckCircle className="w-5 h-5 text-green-600" />
          </div>
        </div>
      </div>
    </div>
  );

  const renderFilters = () => (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
        <button
          onClick={() => setFilters({
            level: 'all',
            category: 'all',
            user: 'all',
            dateRange: 'all',
            search: ''
          })}
          className="text-sm text-blue-600 hover:text-blue-800"
        >
          Clear All
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Search */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={filters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
              placeholder="Search logs..."
              className="pl-10 pr-3 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        {/* Level */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Level</label>
          <select
            value={filters.level}
            onChange={(e) => handleFilterChange('level', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">All Levels</option>
            <option value="error">Error</option>
            <option value="warning">Warning</option>
            <option value="info">Info</option>
            <option value="success">Success</option>
          </select>
        </div>

        {/* Category */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
          <select
            value={filters.category}
            onChange={(e) => handleFilterChange('category', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">All Categories</option>
            {getCategories().map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </div>

        {/* User */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">User</label>
          <select
            value={filters.user}
            onChange={(e) => handleFilterChange('user', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">All Users</option>
            {getUsers().map(user => (
              <option key={user} value={user}>{user}</option>
            ))}
          </select>
        </div>

        {/* Date Range */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Date Range</label>
          <select
            value={filters.dateRange}
            onChange={(e) => handleFilterChange('dateRange', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">All Time</option>
            <option value="1">Last 24 hours</option>
            <option value="7">Last 7 days</option>
            <option value="30">Last 30 days</option>
          </select>
        </div>
      </div>
    </div>
  );

  const renderControls = () => (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={autoRefresh}
              onChange={(e) => setAutoRefresh(e.target.checked)}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <span className="text-sm text-gray-700">Auto-refresh</span>
          </label>
          
          <select
            value={logLimit}
            onChange={(e) => setLogLimit(parseInt(e.target.value))}
            className="px-3 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value={50}>50 logs</option>
            <option value={100}>100 logs</option>
            <option value={200}>200 logs</option>
            <option value={500}>500 logs</option>
          </select>
        </div>

        <div className="flex gap-2">
          <button
            onClick={exportLogs}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <Download className="w-4 h-4" />
            Export
          </button>
          <button
            onClick={clearLogs}
            className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            <Trash2 className="w-4 h-4" />
            Clear
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">📜 System Logs</h1>
              <p className="text-gray-600">Monitor system activity and track user actions</p>
            </div>
            
            <div className="flex items-center gap-3">
              <button
                onClick={() => window.location.reload()}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                <RefreshCw className="w-4 h-4" />
                Refresh
              </button>
            </div>
          </div>

          {/* Stats Cards */}
          {renderStatsCards()}

          {/* Filters */}
          {renderFilters()}

          {/* Controls */}
          {renderControls()}
        </div>

        {/* Logs List */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading logs...</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredLogs.length === 0 ? (
              <div className="text-center py-12">
                <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No logs found</h3>
                <p className="text-gray-500">Try adjusting your filters or check back later</p>
              </div>
            ) : (
              <AnimatePresence>
                {filteredLogs.map((log) => (
                  <div
                    key={log.id}
                    className={`bg-white rounded-lg shadow-sm border p-4 ${getLevelColor(log.level)}`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3 flex-1">
                        <div className="flex-shrink-0 mt-1">
                          {getLevelIcon(log.level)}
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-sm font-medium">{log.level?.toUpperCase()}</span>
                            <span className="text-xs text-gray-500">•</span>
                            <div className="flex items-center gap-1">
                              {getCategoryIcon(log.category)}
                              <span className="text-sm text-gray-600">{log.category}</span>
                            </div>
                            <span className="text-xs text-gray-500">•</span>
                            <span className="text-sm text-gray-600">{formatTimestamp(log.timestamp)}</span>
                          </div>
                          
                          <p className="text-sm font-medium mb-1">{log.message}</p>
                          
                          {log.action && (
                            <p className="text-xs text-gray-600 mb-1">
                              Action: {log.action}
                            </p>
                          )}
                          
                          {log.userId && (
                            <p className="text-xs text-gray-600">
                              User: {log.userId}
                            </p>
                          )}
                          
                          {log.details && Object.keys(log.details).length > 0 && (
                            <details className="mt-2">
                              <summary className="text-xs text-gray-600 cursor-pointer hover:text-gray-800">
                                View Details
                              </summary>
                              <pre className="text-xs bg-gray-100 p-2 rounded mt-1 overflow-x-auto">
                                {JSON.stringify(log.details, null, 2)}
                              </pre>
                            </details>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2 ml-4">
                        <button
                          onClick={() => {
                            // View log details
                            console.log('View log:', log);
                          }}
                          className="p-1 text-gray-400 hover:text-gray-600"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </AnimatePresence>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminLogs;
