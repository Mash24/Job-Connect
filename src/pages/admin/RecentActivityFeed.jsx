/**
 * @fileoverview RecentActivityFeed Component
 * @description A modern, real-time activity feed component that displays recent system activities
 * in the admin dashboard with enhanced styling, filtering, and interactive features.
 * 
 * @component
 * @requires React
 * @requires firebase/firestore
 * @requires lucide-react
 * @requires framer-motion
 */

import React, { useEffect, useState } from 'react';
import { collection, query, orderBy, limit, onSnapshot, where } from 'firebase/firestore';
import { db } from '../../firebase/config';
import { 
  Loader2, Filter, Search, Clock, User, Briefcase, 
  FileText, Settings, Shield, MessageSquare, AlertTriangle,
  Eye, MoreHorizontal, RefreshCw, Calendar
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * @constant {Object} typeIcons
 * @description Enhanced mapping of activity types to their corresponding icons and colors
 */
const typeIcons = {
  user: { icon: User, color: 'text-blue-600', bg: 'bg-blue-50' },
  job: { icon: Briefcase, color: 'text-green-600', bg: 'bg-green-50' },
  application: { icon: FileText, color: 'text-purple-600', bg: 'bg-purple-50' },
  report: { icon: AlertTriangle, color: 'text-red-600', bg: 'bg-red-50' },
  support: { icon: MessageSquare, color: 'text-orange-600', bg: 'bg-orange-50' },
  settings: { icon: Settings, color: 'text-gray-600', bg: 'bg-gray-50' },
  auth: { icon: Shield, color: 'text-indigo-600', bg: 'bg-indigo-50' },
  system: { icon: Settings, color: 'text-cyan-600', bg: 'bg-cyan-50' }
};

/**
 * @constant {Object} priorityColors
 * @description Color coding for different priority levels
 */
const priorityColors = {
  high: 'border-l-red-500 bg-red-50',
  medium: 'border-l-yellow-500 bg-yellow-50',
  low: 'border-l-green-500 bg-green-50',
  info: 'border-l-blue-500 bg-blue-50'
};

/**
 * @function formatTimeAgo
 * @description Enhanced time formatting with more precise relative time display
 * @param {Object} timestamp - Firestore timestamp object
 * @returns {string} Formatted time string (e.g., "2m ago", "1h ago", "3d ago")
 */
const formatTimeAgo = (timestamp) => {
  if (!timestamp?.seconds) return 'Just now';
  
  const now = Date.now();
  const timestampMs = timestamp.seconds * 1000;
  const diffMs = now - timestampMs;
  const diffSeconds = Math.floor(diffMs / 1000);
  const diffMinutes = Math.floor(diffSeconds / 60);
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffSeconds < 60) return `${diffSeconds}s ago`;
  if (diffMinutes < 60) return `${diffMinutes}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  
  const date = new Date(timestampMs);
  return date.toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric',
    year: diffDays > 365 ? 'numeric' : undefined
  });
};

/**
 * @function getPriorityLevel
 * @description Determines priority level based on activity type and content
 * @param {string} type - Activity type
 * @param {string} action - Action performed
 * @returns {string} Priority level (high, medium, low, info)
 */
const getPriorityLevel = (type, action) => {
  const highPriorityActions = ['error', 'failed', 'rejected', 'blocked', 'security'];
  const mediumPriorityActions = ['warning', 'pending', 'review', 'update'];
  
  if (highPriorityActions.some(term => action.toLowerCase().includes(term))) {
    return 'high';
  }
  if (mediumPriorityActions.some(term => action.toLowerCase().includes(term))) {
    return 'medium';
  }
  if (type === 'system' || type === 'auth') {
    return 'info';
  }
  return 'low';
};

/**
 * @component RecentActivityFeed
 * @description Enhanced real-time activity feed with modern design and advanced features
 * @returns {JSX.Element} Rendered component
 */
const RecentActivityFeed = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [lastRefresh, setLastRefresh] = useState(Date.now());

  useEffect(() => {
    /**
     * @description Sets up real-time listener for activity logs with enhanced querying
     * @returns {Function} Cleanup function to unsubscribe from Firestore
     */
    const q = query(
      collection(db, 'logs'),
      orderBy('timestamp', 'desc'),
      limit(50)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ 
        id: doc.id, 
        ...doc.data(),
        priority: getPriorityLevel(doc.data().type, doc.data().action)
      }));
      setLogs(data);
      setLoading(false);
    }, (error) => {
      console.error('Error fetching logs:', error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Filter and search logs
  const filteredLogs = logs.filter(log => {
    const matchesFilter = filter === 'all' || log.type === filter;
    const matchesSearch = searchTerm === '' || 
      log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.performedBy?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.target?.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesFilter && matchesSearch;
  });

  const handleRefresh = () => {
    setLastRefresh(Date.now());
    setLoading(true);
    // The real-time listener will automatically update the data
  };

  const getFilterCount = (type) => {
    return logs.filter(log => type === 'all' || log.type === type).length;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden"
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/20 rounded-lg">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold">Recent Activity Feed</h2>
              <p className="text-blue-100 text-sm">Real-time system activity monitoring</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={handleRefresh}
              className="p-2 bg-white/20 rounded-lg hover:bg-white/30 transition-colors"
              title="Refresh"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="p-2 bg-white/20 rounded-lg hover:bg-white/30 transition-colors"
              title="Filters"
            >
              <Filter className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-blue-200" />
          <input
            type="text"
            placeholder="Search activities..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-white/20 border border-white/30 rounded-lg text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-white/50"
          />
        </div>
      </div>

      {/* Filters */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="border-b border-gray-200 bg-gray-50"
          >
            <div className="p-4">
              <div className="flex flex-wrap gap-2">
                {[
                  { key: 'all', label: 'All', icon: Eye },
                  { key: 'user', label: 'Users', icon: User },
                  { key: 'job', label: 'Jobs', icon: Briefcase },
                  { key: 'application', label: 'Applications', icon: FileText },
                  { key: 'system', label: 'System', icon: Settings },
                  { key: 'auth', label: 'Auth', icon: Shield }
                ].map(({ key, label, icon: Icon }) => (
                  <button
                    key={key}
                    onClick={() => setFilter(key)}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                      filter === key
                        ? 'bg-blue-600 text-white shadow-md'
                        : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
                    }`}
                  >
                    <Icon className="w-3 h-3" />
                    {label}
                    <span className="ml-1 px-1.5 py-0.5 bg-white/20 rounded-full text-xs">
                      {getFilterCount(key)}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Activity List */}
      <div className="max-h-[500px] overflow-y-auto">
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="text-center">
              <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-3" />
              <p className="text-gray-600">Loading activities...</p>
            </div>
          </div>
        ) : filteredLogs.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Clock className="w-8 h-8 text-gray-400" />
            </div>
            <p className="text-gray-600 font-medium">No activities found</p>
            <p className="text-gray-400 text-sm mt-1">
              {searchTerm ? 'Try adjusting your search terms' : 'Activities will appear here as they occur'}
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            <AnimatePresence>
              {filteredLogs.map((log, index) => {
                const typeConfig = typeIcons[log.type] || typeIcons.system;
                const Icon = typeConfig.icon;
                const priorityClass = priorityColors[log.priority] || priorityColors.info;
                
                return (
                  <motion.div
                    key={log.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className={`p-4 hover:bg-gray-50 transition-colors border-l-4 ${priorityClass}`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`p-2 rounded-lg ${typeConfig.bg}`}>
                        <Icon className={`w-4 h-4 ${typeConfig.color}`} />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1">
                            <p className="text-sm text-gray-900 font-medium">
                              {log.performedBy || 'System'} 
                              <span className="font-normal text-gray-600"> {log.action}</span>
                              {log.target && (
                                <span className="text-gray-500"> {log.target}</span>
                              )}
                            </p>
                            
                            {log.details && (
                              <p className="text-xs text-gray-500 mt-1">{log.details}</p>
                            )}
                            
                            <div className="flex items-center gap-4 mt-2">
                              <div className="flex items-center gap-1 text-xs text-gray-400">
                                <Calendar className="w-3 h-3" />
                                {formatTimeAgo(log.timestamp)}
                              </div>
                              
                              {log.type && (
                                <span className="text-xs px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full capitalize">
                                  {log.type}
                                </span>
                              )}
                              
                              {log.priority && log.priority !== 'low' && (
                                <span className={`text-xs px-2 py-0.5 rounded-full capitalize ${
                                  log.priority === 'high' ? 'bg-red-100 text-red-600' :
                                  log.priority === 'medium' ? 'bg-yellow-100 text-yellow-600' :
                                  'bg-blue-100 text-blue-600'
                                }`}>
                                  {log.priority}
                                </span>
                              )}
                            </div>
                          </div>
                          
                          <button className="p-1 hover:bg-gray-200 rounded transition-colors">
                            <MoreHorizontal className="w-4 h-4 text-gray-400" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="bg-gray-50 px-6 py-3 border-t border-gray-200">
        <div className="flex items-center justify-between text-xs text-gray-500">
          <span>Showing {filteredLogs.length} of {logs.length} activities</span>
          <span>Last updated: {formatTimeAgo({ seconds: lastRefresh / 1000 })}</span>
        </div>
      </div>
    </motion.div>
  );
};

export default RecentActivityFeed; 