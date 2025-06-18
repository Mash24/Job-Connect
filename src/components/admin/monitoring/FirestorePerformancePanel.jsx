import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { collection, query, orderBy, limit, getDocs, onSnapshot } from 'firebase/firestore';
import { db } from '../../../firebase/config';
import { Database, TrendingUp, TrendingDown, Clock, AlertCircle } from 'lucide-react';

const FirestorePerformancePanel = ({ isLiveMode }) => {
  const [metrics, setMetrics] = useState({
    readsPerSecond: 45,
    writesPerSecond: 12,
    errorsPerMinute: 2,
    averageLatency: 127,
    activeConnections: 89,
    cacheHitRate: 94
  });

  const [recentOperations, setRecentOperations] = useState([]);
  const [slowQueries, setSlowQueries] = useState([]);

  // Simulate real-time Firestore metrics
  useEffect(() => {
    if (!isLiveMode) return;

    const interval = setInterval(() => {
      setMetrics(prev => ({
        readsPerSecond: Math.max(10, Math.min(100, prev.readsPerSecond + (Math.random() - 0.5) * 20)),
        writesPerSecond: Math.max(2, Math.min(30, prev.writesPerSecond + (Math.random() - 0.5) * 8)),
        errorsPerMinute: Math.max(0, Math.min(10, prev.errorsPerMinute + (Math.random() - 0.5) * 3)),
        averageLatency: Math.max(50, Math.min(300, prev.averageLatency + (Math.random() - 0.5) * 50)),
        activeConnections: Math.max(50, Math.min(150, prev.activeConnections + (Math.random() - 0.5) * 10)),
        cacheHitRate: Math.max(85, Math.min(99, prev.cacheHitRate + (Math.random() - 0.5) * 5))
      }));
    }, 2000);

    return () => clearInterval(interval);
  }, [isLiveMode]);

  // Fetch recent operations from logs
  useEffect(() => {
    const fetchRecentOperations = async () => {
      try {
        const q = query(
          collection(db, 'logs'),
          orderBy('timestamp', 'desc'),
          limit(10)
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
          const operations = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
            timestamp: doc.data().timestamp?.toDate?.() || new Date()
          }));
          setRecentOperations(operations);
        });

        return unsubscribe;
      } catch (error) {
        console.error('Error fetching recent operations:', error);
      }
    };

    fetchRecentOperations();
  }, []);

  // Simulate slow queries
  useEffect(() => {
    const mockSlowQueries = [
      {
        query: 'users.where("role", "==", "employer").orderBy("createdAt")',
        duration: 2450,
        timestamp: new Date(Date.now() - 300000),
        collection: 'users'
      },
      {
        query: 'jobs.where("status", "==", "active").limit(100)',
        duration: 1890,
        timestamp: new Date(Date.now() - 600000),
        collection: 'jobs'
      }
    ];
    setSlowQueries(mockSlowQueries);
  }, []);

  const getPerformanceColor = (value, threshold) => {
    if (value > threshold * 1.5) return 'text-red-600';
    if (value > threshold) return 'text-yellow-600';
    return 'text-green-600';
  };

  const getPerformanceStatus = (value, threshold) => {
    if (value > threshold * 1.5) return 'Critical';
    if (value > threshold) return 'Warning';
    return 'Normal';
  };

  const MetricCard = ({ title, value, unit, threshold, icon: Icon, trend = 'up' }) => (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-gray-50 rounded-lg p-4"
    >
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <Icon className="w-4 h-4 text-gray-600" />
          <span className="text-sm font-medium text-gray-700">{title}</span>
        </div>
        <div className={`flex items-center gap-1 text-xs ${
          trend === 'up' ? 'text-green-600' : 'text-red-600'
        }`}>
          {trend === 'up' ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
          {Math.random() > 0.5 ? '+' : '-'}{Math.floor(Math.random() * 10)}%
        </div>
      </div>
      <div className="flex items-end gap-2">
        <span className={`text-2xl font-bold ${getPerformanceColor(value, threshold)}`}>
          {Math.round(value)}
        </span>
        <span className="text-sm text-gray-500">{unit}</span>
      </div>
      <div className="mt-1">
        <span className={`text-xs ${getPerformanceColor(value, threshold)}`}>
          {getPerformanceStatus(value, threshold)}
        </span>
      </div>
    </motion.div>
  );

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Firestore Performance</h3>
        <div className="flex items-center gap-2">
          <Database className="w-5 h-5 text-blue-600" />
          <span className="text-sm text-gray-500">Real-time metrics</span>
        </div>
      </div>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <MetricCard
          title="Reads/sec"
          value={metrics.readsPerSecond}
          unit="ops"
          threshold={80}
          icon={TrendingUp}
          trend="up"
        />
        <MetricCard
          title="Writes/sec"
          value={metrics.writesPerSecond}
          unit="ops"
          threshold={25}
          icon={TrendingUp}
          trend="up"
        />
        <MetricCard
          title="Avg Latency"
          value={metrics.averageLatency}
          unit="ms"
          threshold={200}
          icon={Clock}
          trend="down"
        />
        <MetricCard
          title="Cache Hit Rate"
          value={metrics.cacheHitRate}
          unit="%"
          threshold={90}
          icon={Database}
          trend="up"
        />
      </div>

      {/* Error Rate */}
      <div className="mb-6 p-4 bg-red-50 rounded-lg border border-red-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-red-600" />
            <span className="font-medium text-red-800">Error Rate</span>
          </div>
          <span className={`text-lg font-bold ${getPerformanceColor(metrics.errorsPerMinute, 5)}`}>
            {metrics.errorsPerMinute} errors/min
          </span>
        </div>
        <div className="mt-2">
          <div className="w-full bg-red-200 rounded-full h-2">
            <motion.div
              className="bg-red-600 h-2 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${(metrics.errorsPerMinute / 10) * 100}%` }}
              transition={{ duration: 1 }}
            />
          </div>
        </div>
      </div>

      {/* Recent Operations */}
      <div className="mb-6">
        <h4 className="text-sm font-medium text-gray-700 mb-3">Recent Operations</h4>
        <div className="space-y-2 max-h-32 overflow-y-auto">
          {recentOperations.slice(0, 5).map((op, index) => (
            <motion.div
              key={op.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center justify-between text-xs p-2 bg-gray-50 rounded"
            >
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${
                  op.type === 'error' ? 'bg-red-500' : 'bg-green-500'
                }`} />
                <span className="font-medium">{op.action}</span>
                <span className="text-gray-500">on {op.type}</span>
              </div>
              <span className="text-gray-500">
                {op.timestamp?.toLocaleTimeString() || 'now'}
              </span>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Slow Queries */}
      <div>
        <h4 className="text-sm font-medium text-gray-700 mb-3">Slow Queries (>1s)</h4>
        <div className="space-y-2">
          {slowQueries.map((query, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="p-3 bg-yellow-50 rounded-lg border border-yellow-200"
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium text-yellow-800">
                  {query.collection}
                </span>
                <span className="text-sm text-yellow-700">
                  {query.duration}ms
                </span>
              </div>
              <p className="text-xs text-yellow-700 font-mono">
                {query.query}
              </p>
              <p className="text-xs text-yellow-600 mt-1">
                {query.timestamp.toLocaleTimeString()}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FirestorePerformancePanel; 