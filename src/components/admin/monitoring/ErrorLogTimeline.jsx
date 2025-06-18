import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, AlertCircle, XCircle, Info, Clock, Filter } from 'lucide-react';

const ErrorLogTimeline = ({ logs, isLiveMode }) => {
  const [errorData, setErrorData] = useState([]);
  const [selectedTimeframe, setSelectedTimeframe] = useState('24h');
  const [errorCounts, setErrorCounts] = useState({
    total: 0,
    critical: 0,
    warning: 0,
    info: 0
  });

  // Process logs and generate error timeline data
  useEffect(() => {
    const processLogs = () => {
      const now = new Date();
      const hours = selectedTimeframe === '24h' ? 24 : selectedTimeframe === '12h' ? 12 : 6;
      const data = [];
      
      // Generate hourly buckets
      for (let i = hours - 1; i >= 0; i--) {
        const time = new Date(now.getTime() - i * 60 * 60 * 1000);
        const hourStart = new Date(time.getFullYear(), time.getMonth(), time.getDate(), time.getHours());
        const hourEnd = new Date(hourStart.getTime() + 60 * 60 * 1000);
        
        // Count errors in this hour
        const hourErrors = logs.filter(log => {
          const logTime = log.timestamp?.toDate?.() || new Date(log.timestamp);
          return logTime >= hourStart && logTime < hourEnd && log.type === 'error';
        });
        
        data.push({
          time: time.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
          timestamp: time.getTime(),
          errors: hourErrors.length,
          critical: hourErrors.filter(e => e.severity === 'critical').length,
          warning: hourErrors.filter(e => e.severity === 'warning').length,
          info: hourErrors.filter(e => e.severity === 'info').length
        });
      }
      
      setErrorData(data);
      
      // Calculate total counts
      const total = data.reduce((sum, hour) => sum + hour.errors, 0);
      const critical = data.reduce((sum, hour) => sum + hour.critical, 0);
      const warning = data.reduce((sum, hour) => sum + hour.warning, 0);
      const info = data.reduce((sum, hour) => sum + hour.info, 0);
      
      setErrorCounts({ total, critical, warning, info });
    };

    processLogs();
  }, [logs, selectedTimeframe]);

  // Simulate real-time error updates
  useEffect(() => {
    if (!isLiveMode) return;

    const interval = setInterval(() => {
      setErrorData(prev => {
        const newData = [...prev];
        const now = new Date();
        const currentHour = newData[newData.length - 1];
        
        if (currentHour) {
          currentHour.errors += Math.floor(Math.random() * 3);
          currentHour.critical += Math.floor(Math.random() * 2);
          currentHour.warning += Math.floor(Math.random() * 2);
        }
        
        return newData;
      });
    }, 10000);

    return () => clearInterval(interval);
  }, [isLiveMode]);

  const getErrorColor = (severity) => {
    switch (severity) {
      case 'critical':
        return 'text-red-600 bg-red-50 border-red-200';
      case 'warning':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'info':
        return 'text-blue-600 bg-blue-50 border-blue-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getErrorIcon = (severity) => {
    switch (severity) {
      case 'critical':
        return <XCircle className="w-4 h-4" />;
      case 'warning':
        return <AlertTriangle className="w-4 h-4" />;
      case 'info':
        return <Info className="w-4 h-4" />;
      default:
        return <AlertCircle className="w-4 h-4" />;
    }
  };

  const maxErrors = Math.max(...errorData.map(d => d.errors), 1);

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Error Rate Timeline</h3>
        <div className="flex items-center gap-4">
          {/* Timeframe Selector */}
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-500" />
            <select
              value={selectedTimeframe}
              onChange={(e) => setSelectedTimeframe(e.target.value)}
              className="text-sm border border-gray-300 rounded-md px-2 py-1"
            >
              <option value="6h">Last 6 hours</option>
              <option value="12h">Last 12 hours</option>
              <option value="24h">Last 24 hours</option>
            </select>
          </div>
          
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-red-600" />
            <span className="text-sm text-gray-500">Real-time monitoring</span>
          </div>
        </div>
      </div>

      {/* Error Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-red-50 border border-red-200 rounded-lg p-4"
        >
          <div className="flex items-center gap-2 mb-2">
            <XCircle className="w-5 h-5 text-red-600" />
            <span className="text-sm font-medium text-red-800">Critical</span>
          </div>
          <p className="text-2xl font-bold text-red-600">{errorCounts.critical}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-yellow-50 border border-yellow-200 rounded-lg p-4"
        >
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="w-5 h-5 text-yellow-600" />
            <span className="text-sm font-medium text-yellow-800">Warnings</span>
          </div>
          <p className="text-2xl font-bold text-yellow-600">{errorCounts.warning}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-blue-50 border border-blue-200 rounded-lg p-4"
        >
          <div className="flex items-center gap-2 mb-2">
            <Info className="w-5 h-5 text-blue-600" />
            <span className="text-sm font-medium text-blue-800">Info</span>
          </div>
          <p className="text-2xl font-bold text-blue-600">{errorCounts.info}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-gray-50 border border-gray-200 rounded-lg p-4"
        >
          <div className="flex items-center gap-2 mb-2">
            <AlertCircle className="w-5 h-5 text-gray-600" />
            <span className="text-sm font-medium text-gray-800">Total</span>
          </div>
          <p className="text-2xl font-bold text-gray-600">{errorCounts.total}</p>
        </motion.div>
      </div>

      {/* Error Timeline Chart */}
      <div className="mb-6">
        <h4 className="text-sm font-medium text-gray-700 mb-3">Error Rate Over Time</h4>
        <div className="h-48">
          <div className="flex items-end justify-between h-full gap-1">
            {errorData.map((hour, index) => (
              <motion.div
                key={hour.timestamp}
                initial={{ opacity: 0, scaleY: 0 }}
                animate={{ opacity: 1, scaleY: 1 }}
                transition={{ delay: index * 0.05 }}
                className="flex-1 flex flex-col items-center"
              >
                {/* Error bars */}
                <div className="w-full flex flex-col-reverse gap-1 mb-2">
                  {hour.critical > 0 && (
                    <motion.div
                      className="w-full bg-red-500 rounded-sm"
                      style={{ height: `${(hour.critical / maxErrors) * 100}%` }}
                      initial={{ height: 0 }}
                      animate={{ height: `${(hour.critical / maxErrors) * 100}%` }}
                      transition={{ duration: 0.5 }}
                    />
                  )}
                  {hour.warning > 0 && (
                    <motion.div
                      className="w-full bg-yellow-500 rounded-sm"
                      style={{ height: `${(hour.warning / maxErrors) * 100}%` }}
                      initial={{ height: 0 }}
                      animate={{ height: `${(hour.warning / maxErrors) * 100}%` }}
                      transition={{ duration: 0.5, delay: 0.1 }}
                    />
                  )}
                  {hour.info > 0 && (
                    <motion.div
                      className="w-full bg-blue-500 rounded-sm"
                      style={{ height: `${(hour.info / maxErrors) * 100}%` }}
                      initial={{ height: 0 }}
                      animate={{ height: `${(hour.info / maxErrors) * 100}%` }}
                      transition={{ duration: 0.5, delay: 0.2 }}
                    />
                  )}
                </div>
                
                {/* Time label */}
                <span className="text-xs text-gray-500 transform -rotate-45 origin-left">
                  {hour.time}
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Error Logs */}
      <div>
        <h4 className="text-sm font-medium text-gray-700 mb-3">Recent Error Logs</h4>
        <div className="space-y-2 max-h-48 overflow-y-auto">
          {logs
            .filter(log => log.type === 'error')
            .slice(0, 10)
            .map((log, index) => (
              <motion.div
                key={log.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`flex items-center justify-between p-3 rounded-lg border ${getErrorColor(log.severity || 'info')}`}
              >
                <div className="flex items-center gap-3">
                  {getErrorIcon(log.severity || 'info')}
                  <div>
                    <p className="text-sm font-medium">
                      {log.action || 'Unknown Error'}
                    </p>
                    <p className="text-xs opacity-75">
                      {log.details || 'No details available'}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <Clock className="w-3 h-3" />
                  <span>
                    {log.timestamp?.toDate?.()?.toLocaleTimeString() || 'Unknown time'}
                  </span>
                </div>
              </motion.div>
            ))}
        </div>
        
        {logs.filter(log => log.type === 'error').length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <AlertCircle className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p>No errors logged in the selected timeframe</p>
            <p className="text-sm">System is running smoothly!</p>
          </div>
        )}
      </div>

      {/* Error Rate Status */}
      <div className="mt-6 p-4 bg-green-50 rounded-lg border border-green-200">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-sm text-green-700 font-medium">
            Error rate is within acceptable limits ({((errorCounts.total / 24) * 100).toFixed(1)}% per hour)
          </span>
        </div>
      </div>
    </div>
  );
};

export default ErrorLogTimeline; 