import React, { useState, useEffect } from 'react';
import { ChevronDown, RefreshCw } from 'lucide-react';
import { filterByPeriod, calculateTotal, comparePeriods, formatRelativeTime } from '../../../lib/utils';

const ChartCard = ({ 
  title, 
  data = [], 
  children, 
  period = 'all',
  onPeriodChange,
  showKPI = true,
  showFilters = true 
}) => {
  const [lastUpdate, setLastUpdate] = useState(Date.now());
  const [isOpen, setIsOpen] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setLastUpdate(Date.now());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const currentData = filterByPeriod(data, period);
  const currentTotal = calculateTotal(currentData);
  const getPreviousPeriodData = () => {
    const now = new Date();
    const currentDays = period === '7d' ? 7 : period === '30d' ? 30 : 365;
    const previousDays = currentDays * 2;
    const cutoff = new Date(now.getTime() - (previousDays * 24 * 60 * 60 * 1000));
    return data.filter(item => {
      const itemDate = new Date(item.date);
      return itemDate >= cutoff && itemDate < new Date(now.getTime() - (currentDays * 24 * 60 * 60 * 1000));
    });
  };
  const previousData = getPreviousPeriodData();
  const previousTotal = calculateTotal(previousData);
  const comparison = comparePeriods(currentTotal, previousTotal);
  const periodLabels = {
    '7d': '7 days',
    '30d': '30 days', 
    'all': 'All time'
  };
  return (
    <motion.div
      className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="p-6 pb-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
            >
              <ChevronDown 
                className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
              />
            </button>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 flex items-center gap-2">
              {title}
            </h3>
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
            <RefreshCw className="w-3 h-3 animate-spin" />
            <span>Live · {formatRelativeTime(lastUpdate)}</span>
          </div>
        </div>
        {showKPI && data.length > 0 && (
          <div className="mb-4 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-300">
                {currentTotal} {title.toLowerCase()} in the last {periodLabels[period]}
              </span>
              {comparison.percentage > 0 && (
                <div className={`flex items-center gap-1 text-xs font-medium ${
                  comparison.trend === 'up' 
                    ? 'text-green-600 dark:text-green-400' 
                    : 'text-red-600 dark:text-red-400'
                }`}>
                  <span>{comparison.trend === 'up' ? '↑' : '↓'}</span>
                  <span>{comparison.percentage}%</span>
                  <span>vs previous</span>
                </div>
              )}
            </div>
          </div>
        )}
        {showFilters && (
          <div className="flex items-center gap-2 mb-4">
            <span className="text-sm text-gray-600 dark:text-gray-400">Filter:</span>
            <select
              value={period}
              onChange={e => onPeriodChange?.(e.target.value)}
              className="text-sm border border-gray-200 dark:border-gray-600 rounded px-2 py-1 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="7d">Last 7 days</option>
              <option value="30d">Last 30 days</option>
              <option value="all">All time</option>
            </select>
          </div>
        )}
      </div>
      <motion.div
        initial={false}
        animate={{ height: isOpen ? 'auto' : 0, opacity: isOpen ? 1 : 0 }}
        transition={{ duration: 0.3 }}
        className="overflow-hidden"
      >
        {children}
      </motion.div>
    </motion.div>
  );
};

export default ChartCard; 