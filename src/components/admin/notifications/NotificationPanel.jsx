import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, X, AlertTriangle, Info, XCircle, Clock, User, Mail, MessageSquare, Zap, Database, Server } from 'lucide-react';

const NotificationPanel = ({ notifications, onMarkAsRead, onMarkAllRead, currentAdmin }) => {
  const [selectedNotification, setSelectedNotification] = useState(null);

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'critical':
        return 'border-red-200 bg-red-50';
      case 'warning':
        return 'border-yellow-200 bg-yellow-50';
      case 'info':
        return 'border-blue-200 bg-blue-50';
      default:
        return 'border-gray-200 bg-white';
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
      case 'user':
        return <User className="w-4 h-4" />;
      case 'email':
        return <Mail className="w-4 h-4" />;
      case 'message':
        return <MessageSquare className="w-4 h-4" />;
      default:
        return <Info className="w-4 h-4" />;
    }
  };

  const formatTime = (timestamp) => {
    const now = new Date();
    const notificationTime = new Date(timestamp);
    const diffInMinutes = Math.floor((now - notificationTime) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return notificationTime.toLocaleDateString();
  };

  const handleNotificationClick = (notification) => {
    if (!notification.read) {
      onMarkAsRead(notification.id);
    }
    setSelectedNotification(notification);
  };

  const handleMarkAsRead = (notificationId, event) => {
    event.stopPropagation();
    onMarkAsRead(notificationId);
  };

  if (notifications.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center"
      >
        <div className="max-w-md mx-auto">
          <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
            <Bell className="w-12 h-12 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No notifications</h3>
          <p className="text-gray-500">
            You're all caught up! New notifications will appear here when they arrive.
          </p>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">Notifications</h3>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500">
              {notifications.length} total
            </span>
            {notifications.filter(n => !n.read).length > 0 && (
              <button
                onClick={onMarkAllRead}
                className="text-sm text-blue-600 hover:text-blue-700 font-medium"
              >
                Mark all as read
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Notifications List */}
      <div className="max-h-96 overflow-y-auto">
        <AnimatePresence>
          {notifications.map((notification, index) => (
            <motion.div
              key={notification.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ delay: index * 0.05 }}
              className={`border-b border-gray-100 last:border-b-0 ${
                !notification.read ? 'bg-blue-50' : ''
              }`}
            >
              <div
                className={`p-4 cursor-pointer hover:bg-gray-50 transition-colors ${
                  getSeverityColor(notification.severity)
                }`}
                onClick={() => handleNotificationClick(notification)}
              >
                <div className="flex items-start gap-3">
                  {/* Icon */}
                  <div className="flex-shrink-0 mt-1">
                    {getSeverityIcon(notification.severity)}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="text-sm font-medium text-gray-900">
                            {notification.title}
                          </h4>
                          {!notification.read && (
                            <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 mb-2">
                          {notification.message}
                        </p>
                        <div className="flex items-center gap-4 text-xs text-gray-500">
                          <div className="flex items-center gap-1">
                            {getTypeIcon(notification.type)}
                            <span className="capitalize">{notification.type}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            <span>{formatTime(notification.timestamp)}</span>
                          </div>
                          {notification.adminEmail && (
                            <div className="flex items-center gap-1">
                              <User className="w-3 h-3" />
                              <span>{notification.adminEmail}</span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-1 ml-4">
                        {!notification.read && (
                          <button
                            onClick={(e) => handleMarkAsRead(notification.id, e)}
                            className="p-1 text-gray-400 hover:text-green-600 rounded"
                            title="Mark as read"
                          >
                            <Check className="w-4 h-4" />
                          </button>
                        )}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            // Dismiss notification
                          }}
                          className="p-1 text-gray-400 hover:text-red-600 rounded"
                          title="Dismiss"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Metadata */}
                {notification.metadata && (
                  <div className="mt-3 pt-3 border-t border-gray-100">
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      {notification.metadata.source && (
                        <span>Source: {notification.metadata.source}</span>
                      )}
                      {notification.metadata.alertId && (
                        <span>Alert ID: {notification.metadata.alertId}</span>
                      )}
                      {notification.metadata.endpoint && (
                        <span>Endpoint: {notification.metadata.endpoint}</span>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Notification Detail Modal */}
      <AnimatePresence>
        {selectedNotification && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            onClick={() => setSelectedNotification(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-lg p-6 w-96 max-w-md"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  {getSeverityIcon(selectedNotification.severity)}
                  <h3 className="text-lg font-semibold text-gray-900">
                    {selectedNotification.title}
                  </h3>
                </div>
                <button
                  onClick={() => setSelectedNotification(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4">
                <p className="text-gray-600">
                  {selectedNotification.message}
                </p>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium text-gray-700">Severity:</span>
                    <span className="ml-2 capitalize text-gray-600">
                      {selectedNotification.severity}
                    </span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Type:</span>
                    <span className="ml-2 capitalize text-gray-600">
                      {selectedNotification.type}
                    </span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Time:</span>
                    <span className="ml-2 text-gray-600">
                      {new Date(selectedNotification.timestamp).toLocaleString()}
                    </span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Status:</span>
                    <span className="ml-2 text-gray-600">
                      {selectedNotification.read ? 'Read' : 'Unread'}
                    </span>
                  </div>
                </div>

                {selectedNotification.metadata && (
                  <div className="pt-4 border-t border-gray-200">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Additional Details</h4>
                    <div className="space-y-1 text-sm text-gray-600">
                      {Object.entries(selectedNotification.metadata).map(([key, value]) => (
                        <div key={key} className="flex justify-between">
                          <span className="capitalize">{key}:</span>
                          <span>{value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex gap-2 pt-4">
                  <button
                    onClick={() => {
                      if (!selectedNotification.read) {
                        onMarkAsRead(selectedNotification.id);
                      }
                      setSelectedNotification(null);
                    }}
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    {selectedNotification.read ? 'Close' : 'Mark as Read'}
                  </button>
                  <button
                    onClick={() => setSelectedNotification(null)}
                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default NotificationPanel; 