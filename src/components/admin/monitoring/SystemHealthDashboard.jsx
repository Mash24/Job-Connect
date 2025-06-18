import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { collection, query, orderBy, limit, getDocs, onSnapshot } from 'firebase/firestore';
import { db } from '../../../firebase/config';
import { Activity, Server, Database, Zap, AlertTriangle, TrendingUp, Clock, Wifi, WifiOff } from 'lucide-react';

import ServerStatusCard from './ServerStatusCard';
import FirestorePerformancePanel from './FirestorePerformancePanel';
import APIMetricsGraph from './APIMetricsGraph';
import ErrorLogTimeline from './ErrorLogTimeline';

const SystemHealthDashboard = () => {
  const [isLiveMode, setIsLiveMode] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [systemStatus, setSystemStatus] = useState('healthy'); // healthy, warning, critical
  const [overallUptime, setOverallUptime] = useState(99.97);
  const [activeConnections, setActiveConnections] = useState(1247);
  const [errorCount, setErrorCount] = useState(0);
  const [logs, setLogs] = useState([]);

  // Simulate real-time data updates
  useEffect(() => {
    if (!isLiveMode) return;

    const interval = setInterval(() => {
      setLastUpdated(new Date());
      
      // Simulate fluctuating metrics
      setActiveConnections(prev => prev + Math.floor(Math.random() * 10) - 5);
      setErrorCount(prev => Math.max(0, prev + Math.floor(Math.random() * 3) - 1));
      
      // Update system status based on error count
      if (errorCount > 10) {
        setSystemStatus('critical');
      } else if (errorCount > 5) {
        setSystemStatus('warning');
      } else {
        setSystemStatus('healthy');
      }
    }, 5000); // Update every 5 seconds

    return () => clearInterval(interval);
  }, [isLiveMode, errorCount]);

  // Fetch recent logs for error timeline
  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const q = query(
          collection(db, 'logs'),
          orderBy('timestamp', 'desc'),
          limit(100)
        );
        
        const unsubscribe = onSnapshot(q, (snapshot) => {
          const logData = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          }));
          setLogs(logData);
        });

        return unsubscribe;
      } catch (error) {
        console.error('Error fetching logs:', error);
      }
    };

    fetchLogs();
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'healthy':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'warning':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'critical':
        return 'text-red-600 bg-red-50 border-red-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'healthy':
        return <Activity className="w-5 h-5 text-green-600" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-yellow-600" />;
      case 'critical':
        return <AlertTriangle className="w-5 h-5 text-red-600" />;
      default:
        return <Activity className="w-5 h-5 text-gray-600" />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                <Server className="w-8 h-8 text-blue-600" />
                System Health Monitoring
              </h1>
              <p className="mt-2 text-gray-600">
                Real-time monitoring of platform performance, uptime, and system metrics
              </p>
            </div>
            <div className="flex items-center gap-4">
              {/* Live Mode Toggle */}
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">Live Mode</span>
                <button
                  onClick={() => setIsLiveMode(!isLiveMode)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    isLiveMode ? 'bg-blue-600' : 'bg-gray-200'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      isLiveMode ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
                {isLiveMode && (
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 1, repeat: Infinity }}
                    className="w-2 h-2 bg-red-500 rounded-full"
                  />
                )}
              </div>

              {/* System Status Badge */}
              <div className={`flex items-center gap-2 px-3 py-1 rounded-full border ${getStatusColor(systemStatus)}`}>
                {getStatusIcon(systemStatus)}
                <span className="text-sm font-medium capitalize">
                  {systemStatus}
                </span>
              </div>

              {/* Last Updated */}
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Clock className="w-4 h-4" />
                {isLiveMode ? 'Live' : 'Snapshot'} • {lastUpdated.toLocaleTimeString()}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Uptime</p>
                  <p className="text-2xl font-bold text-gray-900">{overallUptime}%</p>
                </div>
                <div className="p-2 bg-green-100 rounded-lg">
                  <TrendingUp className="w-6 h-6 text-green-600" />
                </div>
              </div>
              <div className="mt-4">
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  All systems operational
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Active Connections</p>
                  <p className="text-2xl font-bold text-gray-900">{activeConnections.toLocaleString()}</p>
                </div>
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Wifi className="w-6 h-6 text-blue-600" />
                </div>
              </div>
              <div className="mt-4">
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  Normal traffic
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Error Rate</p>
                  <p className="text-2xl font-bold text-gray-900">{errorCount}</p>
                </div>
                <div className="p-2 bg-red-100 rounded-lg">
                  <AlertTriangle className="w-6 h-6 text-red-600" />
                </div>
              </div>
              <div className="mt-4">
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <div className={`w-2 h-2 rounded-full ${
                    errorCount > 10 ? 'bg-red-500' : errorCount > 5 ? 'bg-yellow-500' : 'bg-green-500'
                  }`}></div>
                  {errorCount > 10 ? 'High' : errorCount > 5 ? 'Moderate' : 'Low'} errors
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Response Time</p>
                  <p className="text-2xl font-bold text-gray-900">127ms</p>
                </div>
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Zap className="w-6 h-6 text-purple-600" />
                </div>
              </div>
              <div className="mt-4">
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  Excellent performance
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Main Monitoring Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Server Status */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
          >
            <ServerStatusCard isLiveMode={isLiveMode} />
          </motion.div>

          {/* Firestore Performance */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
          >
            <FirestorePerformancePanel isLiveMode={isLiveMode} />
          </motion.div>

          {/* API Metrics Graph */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="lg:col-span-2"
          >
            <APIMetricsGraph isLiveMode={isLiveMode} />
          </motion.div>

          {/* Error Log Timeline */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="lg:col-span-2"
          >
            <ErrorLogTimeline logs={logs} isLiveMode={isLiveMode} />
          </motion.div>
        </div>

        {/* Background Heartbeat Animation */}
        {isLiveMode && (
          <motion.div
            className="fixed inset-0 pointer-events-none"
            animate={{
              background: [
                'radial-gradient(circle at 50% 50%, rgba(59, 130, 246, 0.02) 0%, transparent 50%)',
                'radial-gradient(circle at 50% 50%, rgba(59, 130, 246, 0.05) 0%, transparent 50%)',
                'radial-gradient(circle at 50% 50%, rgba(59, 130, 246, 0.02) 0%, transparent 50%)'
              ]
            }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          />
        )}
      </div>
    </div>
  );
};

export default SystemHealthDashboard; 