import React, { useState, useEffect } from 'react';
import { Cpu, Memory, HardDrive, Network } from 'lucide-react';

const ServerStatusCard = ({ isLiveMode }) => {
  const [metrics, setMetrics] = useState({
    cpu: 23,
    memory: 67,
    disk: 45,
    network: 89
  });

  useEffect(() => {
    if (!isLiveMode) return;
    const interval = setInterval(() => {
      setMetrics(prev => ({
        cpu: Math.max(5, Math.min(95, prev.cpu + (Math.random() - 0.5) * 10)),
        memory: Math.max(20, Math.min(90, prev.memory + (Math.random() - 0.5) * 5)),
        disk: Math.max(30, Math.min(80, prev.disk + (Math.random() - 0.5) * 3)),
        network: Math.max(50, Math.min(95, prev.network + (Math.random() - 0.5) * 15))
      }));
    }, 3000);
    return () => clearInterval(interval);
  }, [isLiveMode]);

  const getMetricColor = value => {
    if (value >= 80) return 'text-red-600';
    if (value >= 60) return 'text-yellow-600';
    return 'text-green-600';
  };

  const getMetricStatus = value => {
    if (value >= 80) return 'Critical';
    if (value >= 60) return 'Warning';
    return 'Normal';
  };

  const CircularGauge = ({ value, size = 80, strokeWidth = 8 }) => {
    const radius = (size - strokeWidth) / 2;
    const circumference = radius * 2 * Math.PI;
    const strokeDasharray = circumference;
    const strokeDashoffset = circumference - (value / 100) * circumference;
    const getColorClass = val => {
      if (val >= 80) return 'stroke-red-500';
      if (val >= 60) return 'stroke-yellow-500';
      return 'stroke-green-500';
    };
    return (
      <div className="relative inline-block">
        <svg width={size} height={size} className="transform -rotate-90">
          <circle cx={size / 2} cy={size / 2} r={radius} stroke="currentColor" strokeWidth={strokeWidth} fill="transparent" className="text-gray-200" />
          <circle cx={size / 2} cy={size / 2} r={radius} stroke="currentColor" strokeWidth={strokeWidth} fill="transparent" strokeDasharray={strokeDasharray} strokeDashoffset={strokeDashoffset} strokeLinecap="round" className={`transition-all duration-1000 ${getColorClass(value)}`} />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className={`text-sm font-bold ${getMetricColor(value)}`}>{Math.round(value)}%</span>
        </div>
      </div>
    );
  };

  const MetricItem = ({ icon: Icon, label, value, unit = '%' }) => (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-white rounded-lg shadow-sm">
          <Icon className="w-5 h-5 text-gray-600" />
        </div>
        <div>
          <p className="text-sm font-medium text-gray-700">{label}</p>
          <p className="text-xs text-gray-500">{getMetricStatus(value)}</p>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <CircularGauge value={value} size={60} strokeWidth={6} />
        <div className="text-right">
          <p className={`text-lg font-bold ${getMetricColor(value)}`}>{Math.round(value)}{unit}</p>
        </div>
      </div>
    </motion.div>
  );

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Server Status</h3>
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${isLiveMode ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`} />
          <span className="text-sm text-gray-500">{isLiveMode ? 'Live' : 'Snapshot'}</span>
        </div>
      </div>
      <div className="space-y-4">
        <MetricItem icon={Cpu} label="CPU Usage" value={metrics.cpu} />
        <MetricItem icon={Memory} label="Memory Usage" value={metrics.memory} />
        <MetricItem icon={HardDrive} label="Disk Usage" value={metrics.disk} />
        <MetricItem icon={Network} label="Network I/O" value={metrics.network} />
      </div>
      <div className="mt-6 pt-4 border-t border-gray-200">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-gray-500">Server</p>
            <p className="font-medium">job-connect-prod-01</p>
          </div>
          <div>
            <p className="text-gray-500">Location</p>
            <p className="font-medium">US East (N. Virginia)</p>
          </div>
          <div>
            <p className="text-gray-500">Uptime</p>
            <p className="font-medium">99.97%</p>
          </div>
          <div>
            <p className="text-gray-500">Last Restart</p>
            <p className="font-medium">30 days ago</p>
          </div>
        </div>
      </div>
      <div className="mt-4 p-3 bg-green-50 rounded-lg">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
          <span className="text-sm text-green-700 font-medium">All systems operating within normal parameters</span>
        </div>
      </div>
    </div>
  );
};

export default ServerStatusCard; 