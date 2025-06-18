import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, XCircle, Info, X, Check, Clock, Zap, Server, Database } from 'lucide-react';

const AlertCenter = ({ alerts, onDismiss, onAcknowledge }) => {
  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'critical':
        return 'bg-red-50 border-red-200 text-red-800';
      case 'warning':
        return 'bg-yellow-50 border-yellow-200 text-yellow-800';
      case 'info':
        return 'bg-blue-50 border-blue-200 text-blue-800';
      default:
        return 'bg-gray-50 border-gray-200 text-gray-800';
    }
  };

  const getSeverityIcon = (severity) => {
    switch (severity) {
      case 'critical':
        return <XCircle className="w-5 h-5 text-red-600" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-yellow-600" />;
      case 'info':
        return <Info className="w-5 h-5 text-blue-600" />;
      default:
        return <Info className="w-5 h-5 text-gray-600" />;
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'system':
        return <Server className="w-4 h-4" />;
      case 'database':
        return <Database className="w-4 h-4" />;
      case 'performance':
        return <Zap className="w-4 h-4" />;
      default:
        return <Info className="w-4 h-4" />;
    }
  };

  const formatTime = (timestamp) => {
    const now = new Date();
    const alertTime = new Date(timestamp);
    const diffInMinutes = Math.floor((now - alertTime) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    return alertTime.toLocaleTimeString();
  };

  if (alerts.length === 0) {
    return null;
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-red-50 to-yellow-50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-100 rounded-lg">
              <AlertTriangle className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Active Alerts</h3>
              <p className="text-sm text-gray-600">
                {alerts.length} active alert{alerts.length !== 1 ? 's' : ''} requiring attention
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
            <span className="text-sm font-medium text-red-600">Live</span>
          </div>
        </div>
      </div>

      {/* Alerts List */}
      <div className="divide-y divide-gray-100">
        <AnimatePresence>
          {alerts.map((alert, index) => (
            <motion.div
              key={alert.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ delay: index * 0.1 }}
              className={`p-4 ${getSeverityColor(alert.severity)}`}
            >
              <div className="flex items-start gap-3">
                {/* Icon */}
                <div className="flex-shrink-0 mt-1">
                  {getSeverityIcon(alert.severity)}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="text-sm font-semibold">
                          {alert.title}
                        </h4>
                        <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${
                          alert.severity === 'critical' ? 'bg-red-100 text-red-800' :
                          alert.severity === 'warning' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-blue-100 text-blue-800'
                        }`}>
                          {alert.severity}
                        </span>
                      </div>
                      <p className="text-sm mb-2">
                        {alert.message}
                      </p>
                      <div className="flex items-center gap-4 text-xs opacity-75">
                        <div className="flex items-center gap-1">
                          {getTypeIcon(alert.type)}
                          <span className="capitalize">{alert.type}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          <span>{formatTime(alert.timestamp)}</span>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-1 ml-4">
                      <button
                        onClick={() => onAcknowledge(alert.id)}
                        className="p-1.5 text-green-600 hover:bg-green-100 rounded-lg transition-colors"
                        title="Acknowledge"
                      >
                        <Check className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onDismiss(alert.id)}
                        className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                        title="Dismiss"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Recommended Actions */}
                  <div className="mt-3 pt-3 border-t border-current border-opacity-20">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-medium">Recommended Actions:</span>
                      <div className="flex items-center gap-2">
                        {alert.severity === 'critical' && (
                          <span className="text-xs px-2 py-1 bg-red-100 text-red-800 rounded">
                            Immediate attention required
                          </span>
                        )}
                        {alert.type === 'performance' && (
                          <span className="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded">
                            Check system resources
                          </span>
                        )}
                        {alert.type === 'database' && (
                          <span className="text-xs px-2 py-1 bg-purple-100 text-purple-800 rounded">
                            Review query performance
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Footer Actions */}
      <div className="px-6 py-3 bg-gray-50 border-t border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4 text-sm text-gray-600">
            <span>Total Alerts: {alerts.length}</span>
            <span>Critical: {alerts.filter(a => a.severity === 'critical').length}</span>
            <span>Warning: {alerts.filter(a => a.severity === 'warning').length}</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => alerts.forEach(alert => onAcknowledge(alert.id))}
              className="px-3 py-1.5 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              Acknowledge All
            </button>
            <button
              onClick={() => alerts.forEach(alert => onDismiss(alert.id))}
              className="px-3 py-1.5 text-sm bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              Dismiss All
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AlertCenter; 