import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { collection, query, orderBy, limit, getDocs, onSnapshot, addDoc, updateDoc, doc, serverTimestamp, where } from 'firebase/firestore';
import { db, auth } from '../../../firebase/config';
import { Bell, BellOff, Settings, Filter, Check, X, AlertTriangle, Info, XCircle, Mail, MessageSquare, Zap } from 'lucide-react';

import NotificationPanel from './NotificationPanel';
import NotificationSettings from './NotificationSettings';
import AlertCenter from './AlertCenter';
import NotificationFilters from './NotificationFilters';

const AdminNotificationsSystem = () => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [filters, setFilters] = useState({
    severity: 'all',
    type: 'all',
    status: 'all',
    timeRange: '24h'
  });
  const [showSettings, setShowSettings] = useState(false);
  const [currentAdmin, setCurrentAdmin] = useState(null);
  const [notificationSettings, setNotificationSettings] = useState({
    email: true,
    sms: false,
    push: true,
    critical: true,
    warning: true,
    info: false
  });
  const [activeAlerts, setActiveAlerts] = useState([]);
  const [systemStatus, setSystemStatus] = useState('healthy');

  // Fetch current admin user
  useEffect(() => {
    const fetchCurrentAdmin = async () => {
      if (!auth.currentUser) return;

      try {
        const userDoc = await getDocs(query(
          collection(db, 'users'),
          where('email', '==', auth.currentUser.email)
        ));
        
        if (!userDoc.empty) {
          const adminData = userDoc.docs[0].data();
          setCurrentAdmin({
            id: userDoc.docs[0].id,
            ...adminData
          });
        }
      } catch (error) {
        console.error('Error fetching admin data:', error);
      }
    };

    fetchCurrentAdmin();
  }, []);

  // Fetch notifications
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const q = query(
          collection(db, 'notifications'),
          orderBy('timestamp', 'desc'),
          limit(100)
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
          const notificationData = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
            timestamp: doc.data().timestamp?.toDate?.() || new Date()
          }));
          
          setNotifications(notificationData);
          setUnreadCount(notificationData.filter(n => !n.read).length);
        });

        return unsubscribe;
      } catch (error) {
        console.error('Error fetching notifications:', error);
      }
    };

    fetchNotifications();
  }, []);

  // Simulate real-time alerts
  useEffect(() => {
    const simulateAlerts = () => {
      const alertTypes = [
        {
          id: 'api-error',
          title: 'API Response Time Degraded',
          message: 'Average response time exceeded 500ms threshold',
          severity: 'warning',
          type: 'performance',
          timestamp: new Date()
        },
        {
          id: 'database-slow',
          title: 'Database Query Performance',
          message: 'Slow queries detected in users collection',
          severity: 'critical',
          type: 'database',
          timestamp: new Date()
        },
        {
          id: 'high-usage',
          title: 'High System Usage',
          message: 'CPU usage reached 85% threshold',
          severity: 'warning',
          type: 'system',
          timestamp: new Date()
        }
      ];

      // Randomly add alerts
      if (Math.random() > 0.7) {
        const randomAlert = alertTypes[Math.floor(Math.random() * alertTypes.length)];
        setActiveAlerts(prev => [randomAlert, ...prev.slice(0, 4)]);
        
        // Create notification
        createNotification(randomAlert);
      }
    };

    const interval = setInterval(simulateAlerts, 30000); // Every 30 seconds
    return () => clearInterval(interval);
  }, []);

  // Create notification
  const createNotification = async (alert) => {
    if (!currentAdmin) return;

    try {
      const notification = {
        title: alert.title,
        message: alert.message,
        severity: alert.severity,
        type: alert.type,
        timestamp: serverTimestamp(),
        read: false,
        adminId: currentAdmin.id,
        adminEmail: currentAdmin.email,
        adminRole: currentAdmin.role,
        metadata: {
          source: 'system-monitoring',
          alertId: alert.id
        }
      };

      await addDoc(collection(db, 'notifications'), notification);

      // Update system status based on alert severity
      if (alert.severity === 'critical') {
        setSystemStatus('critical');
      } else if (alert.severity === 'warning' && systemStatus === 'healthy') {
        setSystemStatus('warning');
      }
    } catch (error) {
      console.error('Error creating notification:', error);
    }
  };

  // Mark notification as read
  const markAsRead = async (notificationId) => {
    try {
      const notificationRef = doc(db, 'notifications', notificationId);
      await updateDoc(notificationRef, { read: true });
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  // Mark all as read
  const markAllAsRead = async () => {
    try {
      const unreadNotifications = notifications.filter(n => !n.read);
      const batch = db.batch();

      unreadNotifications.forEach(notification => {
        const notificationRef = doc(db, 'notifications', notification.id);
        batch.update(notificationRef, { read: true });
      });

      await batch.commit();
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    }
  };

  // Dismiss alert
  const dismissAlert = (alertId) => {
    setActiveAlerts(prev => prev.filter(alert => alert.id !== alertId));
  };

  // Filter notifications
  const filteredNotifications = notifications.filter(notification => {
    if (filters.severity !== 'all' && notification.severity !== filters.severity) {
      return false;
    }
    if (filters.type !== 'all' && notification.type !== filters.type) {
      return false;
    }
    if (filters.status !== 'all') {
      const isRead = notification.read;
      if (filters.status === 'unread' && isRead) return false;
      if (filters.status === 'read' && !isRead) return false;
    }
    if (filters.timeRange !== 'all') {
      const notificationTime = new Date(notification.timestamp);
      const now = new Date();
      const hoursDiff = (now - notificationTime) / (1000 * 60 * 60);
      
      switch (filters.timeRange) {
        case '1h':
          if (hoursDiff > 1) return false;
          break;
        case '6h':
          if (hoursDiff > 6) return false;
          break;
        case '24h':
          if (hoursDiff > 24) return false;
          break;
      }
    }
    return true;
  });

  const getSeverityColor = (severity) => {
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

  const getSeverityIcon = (severity) => {
    switch (severity) {
      case 'critical':
        return <XCircle className="w-4 h-4" />;
      case 'warning':
        return <AlertTriangle className="w-4 h-4" />;
      case 'info':
        return <Info className="w-4 h-4" />;
      default:
        return <Info className="w-4 h-4" />;
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
                <Bell className="w-8 h-8 text-blue-600" />
                Admin Notifications System
              </h1>
              <p className="mt-2 text-gray-600">
                Real-time alerts, incident management, and notification preferences
              </p>
            </div>
            <div className="flex items-center gap-4">
              {/* System Status */}
              <div className={`flex items-center gap-2 px-3 py-1 rounded-full border ${getSeverityColor(systemStatus)}`}>
                {getSeverityIcon(systemStatus)}
                <span className="text-sm font-medium capitalize">
                  {systemStatus}
                </span>
              </div>

              {/* Notification Count */}
              <div className="flex items-center gap-2">
                <Bell className="w-5 h-5 text-gray-600" />
                <span className="text-sm text-gray-600">
                  {unreadCount} unread
                </span>
              </div>

              {/* Settings Button */}
              <button
                onClick={() => setShowSettings(!showSettings)}
                className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                <Settings className="w-4 h-4" />
                Settings
              </button>
            </div>
          </div>
        </motion.div>

        {/* Active Alerts */}
        <AnimatePresence>
          {activeAlerts.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mb-6"
            >
              <AlertCenter 
                alerts={activeAlerts} 
                onDismiss={dismissAlert}
                onAcknowledge={(alertId) => {
                  dismissAlert(alertId);
                  markAllAsRead();
                }}
              />
            </motion.div>
          )}
        </AnimatePresence>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Filters Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-1"
          >
            <NotificationFilters
              filters={filters}
              onFilterChange={setFilters}
              unreadCount={unreadCount}
              onMarkAllRead={markAllAsRead}
            />
          </motion.div>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-6">
            {/* Notification Panel */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <NotificationPanel
                notifications={filteredNotifications}
                onMarkAsRead={markAsRead}
                onMarkAllRead={markAllAsRead}
                currentAdmin={currentAdmin}
              />
            </motion.div>
          </div>
        </div>

        {/* Settings Modal */}
        <AnimatePresence>
          {showSettings && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
              onClick={() => setShowSettings(false)}
            >
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                className="bg-white rounded-lg p-6 w-96 max-w-md"
                onClick={(e) => e.stopPropagation()}
              >
                <NotificationSettings
                  settings={notificationSettings}
                  onSettingsChange={setNotificationSettings}
                  onClose={() => setShowSettings(false)}
                  currentAdmin={currentAdmin}
                />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Notification Badge */}
        {unreadCount > 0 && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="fixed bottom-6 right-6 z-40"
          >
            <div className="bg-red-500 text-white rounded-full w-12 h-12 flex items-center justify-center shadow-lg">
              <span className="text-sm font-bold">{unreadCount}</span>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default AdminNotificationsSystem; 