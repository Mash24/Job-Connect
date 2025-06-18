import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';
import { TrendingUp, TrendingDown, Activity, Zap } from 'lucide-react';

const APIMetricsGraph = ({ isLiveMode }) => {
  const [apiData, setApiData] = useState([]);
  const [currentMetrics, setCurrentMetrics] = useState({
    averageLatency: 127,
    p95Latency: 245,
    p99Latency: 389,
    requestsPerSecond: 156,
    errorRate: 0.8
  });

  // Generate mock API data for the last 24 hours
  useEffect(() => {
    const generateData = () => {
      const data = [];
      const now = new Date();
      
      for (let i = 23; i >= 0; i--) {
        const time = new Date(now.getTime() - i * 60 * 60 * 1000);
        const baseLatency = 100 + Math.random() * 100;
        const baseRequests = 100 + Math.random() * 100;
        
        data.push({
          time: time.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
          timestamp: time.getTime(),
          latency: Math.round(baseLatency + Math.sin(i) * 20),
          requests: Math.round(baseRequests + Math.cos(i) * 30),
          errors: Math.round(Math.random() * 5),
          p95: Math.round(baseLatency * 1.5 + Math.random() * 50),
          p99: Math.round(baseLatency * 2 + Math.random() * 100)
        });
      }
      
      return data;
    };

    setApiData(generateData());
  }, []);

  // Update metrics in real-time
  useEffect(() => {
    if (!isLiveMode) return;

    const interval = setInterval(() => {
      setCurrentMetrics(prev => ({
        averageLatency: Math.max(50, Math.min(300, prev.averageLatency + (Math.random() - 0.5) * 20)),
        p95Latency: Math.max(100, Math.min(500, prev.p95Latency + (Math.random() - 0.5) * 30)),
        p99Latency: Math.max(200, Math.min(800, prev.p99Latency + (Math.random() - 0.5) * 50)),
        requestsPerSecond: Math.max(50, Math.min(300, prev.requestsPerSecond + (Math.random() - 0.5) * 20)),
        errorRate: Math.max(0, Math.min(5, prev.errorRate + (Math.random() - 0.5) * 1))
      }));

      // Add new data point
      setApiData(prev => {
        const newData = [...prev];
        const now = new Date();
        const baseLatency = 100 + Math.random() * 100;
        
        newData.push({
          time: now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
          timestamp: now.getTime(),
          latency: Math.round(baseLatency + Math.sin(Date.now() / 1000) * 20),
          requests: Math.round(150 + Math.cos(Date.now() / 1000) * 30),
          errors: Math.round(Math.random() * 5),
          p95: Math.round(baseLatency * 1.5 + Math.random() * 50),
          p99: Math.round(baseLatency * 2 + Math.random() * 100)
        });

        // Keep only last 24 data points
        return newData.slice(-24);
      });
    }, 5000);

    return () => clearInterval(interval);
  }, [isLiveMode]);

  const getLatencyColor = (value) => {
    if (value > 300) return '#ef4444'; // red
    if (value > 200) return '#f59e0b'; // yellow
    return '#10b981'; // green
  };

  const getRequestColor = (value) => {
    if (value > 250) return '#ef4444';
    if (value > 200) return '#f59e0b';
    return '#3b82f6';
  };

  const MetricCard = ({ title, value, unit, icon: Icon, color = 'blue', trend = 'up' }) => (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <Icon className={`w-4 h-4 text-${color}-600`} />
          <span className="text-sm font-medium text-gray-700">{title}</span>
        </div>
        <div className={`flex items-center gap-1 text-xs ${
          trend === 'up' ? 'text-green-600' : 'text-red-600'
        }`}>
          {trend === 'up' ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
          {Math.random() > 0.5 ? '+' : '-'}{Math.floor(Math.random() * 5)}%
        </div>
      </div>
      <div className="flex items-end gap-1">
        <span className={`text-xl font-bold text-${color}-600`}>
          {Math.round(value)}
        </span>
        <span className="text-sm text-gray-500">{unit}</span>
      </div>
    </div>
  );

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">API Performance Metrics</h3>
        <div className="flex items-center gap-2">
          <Activity className="w-5 h-5 text-blue-600" />
          <span className="text-sm text-gray-500">Last 24 hours</span>
        </div>
      </div>

      {/* Current Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
        <MetricCard
          title="Avg Latency"
          value={currentMetrics.averageLatency}
          unit="ms"
          icon={Zap}
          color="green"
          trend="down"
        />
        <MetricCard
          title="P95 Latency"
          value={currentMetrics.p95Latency}
          unit="ms"
          icon={Activity}
          color="yellow"
          trend="down"
        />
        <MetricCard
          title="P99 Latency"
          value={currentMetrics.p99Latency}
          unit="ms"
          icon={Activity}
          color="red"
          trend="down"
        />
        <MetricCard
          title="Requests/sec"
          value={currentMetrics.requestsPerSecond}
          unit="req"
          icon={TrendingUp}
          color="blue"
          trend="up"
        />
        <MetricCard
          title="Error Rate"
          value={currentMetrics.errorRate}
          unit="%"
          icon={Activity}
          color="red"
          trend="down"
        />
      </div>

      {/* Latency Trend Chart */}
      <div className="mb-6">
        <h4 className="text-sm font-medium text-gray-700 mb-3">Response Time Trends</h4>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={apiData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
              <XAxis 
                dataKey="time" 
                stroke="#6b7280"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis 
                stroke="#6b7280"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `${value}ms`}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#ffffff',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }}
                labelStyle={{ color: '#374151', fontWeight: '600' }}
                formatter={(value, name) => [
                  `${value}ms`,
                  name === 'latency' ? 'Average' : name === 'p95' ? 'P95' : 'P99'
                ]}
              />
              <Area
                type="monotone"
                dataKey="latency"
                stroke="#10b981"
                fill="#10b981"
                fillOpacity={0.1}
                strokeWidth={2}
                name="Average Latency"
              />
              <Area
                type="monotone"
                dataKey="p95"
                stroke="#f59e0b"
                fill="#f59e0b"
                fillOpacity={0.1}
                strokeWidth={2}
                name="P95 Latency"
              />
              <Area
                type="monotone"
                dataKey="p99"
                stroke="#ef4444"
                fill="#ef4444"
                fillOpacity={0.1}
                strokeWidth={2}
                name="P99 Latency"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Requests Per Second Chart */}
      <div>
        <h4 className="text-sm font-medium text-gray-700 mb-3">Requests Per Second</h4>
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={apiData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
              <XAxis 
                dataKey="time" 
                stroke="#6b7280"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis 
                stroke="#6b7280"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `${value}/s`}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#ffffff',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }}
                labelStyle={{ color: '#374151', fontWeight: '600' }}
                formatter={(value) => [`${value} req/s`, 'Requests']}
              />
              <Line
                type="monotone"
                dataKey="requests"
                stroke="#3b82f6"
                strokeWidth={3}
                dot={{ fill: '#3b82f6', strokeWidth: 2, r: 3 }}
                activeDot={{ r: 5, stroke: '#3b82f6', strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Performance Summary */}
      <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
        <div className="flex items-center gap-2 mb-2">
          <Activity className="w-5 h-5 text-blue-600" />
          <span className="font-medium text-blue-800">Performance Summary</span>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div>
            <span className="text-blue-600 font-medium">Peak RPS:</span>
            <span className="ml-1 text-blue-800">287 req/s</span>
          </div>
          <div>
            <span className="text-blue-600 font-medium">Avg Response:</span>
            <span className="ml-1 text-blue-800">127ms</span>
          </div>
          <div>
            <span className="text-blue-600 font-medium">Uptime:</span>
            <span className="ml-1 text-blue-800">99.97%</span>
          </div>
          <div>
            <span className="text-blue-600 font-medium">Errors:</span>
            <span className="ml-1 text-blue-800">0.8%</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default APIMetricsGraph; 