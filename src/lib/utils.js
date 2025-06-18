import { clsx } from "clsx";
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

/**
 * Groups an array of Firestore docs by day (YYYY-MM-DD) using a date field.
 * @param {Array} docs - Array of Firestore doc data objects
 * @param {string} dateField - Field name containing Firestore Timestamp
 * @returns {Array<{date: string, count: number}>}
 */
export function groupByDate(docs, dateField = 'createdAt') {
  const result = {};
  docs.forEach(doc => {
    const ts = doc[dateField];
    let date;
    if (ts?.toDate) {
      date = ts.toDate().toISOString().split('T')[0];
    } else if (typeof ts === 'string' && ts.length >= 10) {
      date = ts.slice(0, 10);
    }
    if (date) {
      result[date] = (result[date] || 0) + 1;
    }
  });
  return Object.entries(result)
    .map(([date, count]) => ({ date, count }))
    .sort((a, b) => new Date(a.date) - new Date(b.date));
}

/**
 * Compares two periods and calculates percentage change
 * @param {number} current - Current period count
 * @param {number} previous - Previous period count
 * @returns {Object} { change, percentage, trend }
 */
export function comparePeriods(current, previous) {
  if (previous === 0) return { change: current, percentage: 100, trend: 'up' };
  const change = current - previous;
  const percentage = Math.round((change / previous) * 100);
  return {
    change: Math.abs(change),
    percentage: Math.abs(percentage),
    trend: change >= 0 ? 'up' : 'down'
  };
}

/**
 * Filters data by date range
 * @param {Array} data - Array of data objects with date field
 * @param {string} period - '7d', '30d', 'all'
 * @returns {Array} Filtered data
 */
export function filterByPeriod(data, period) {
  if (period === 'all') return data;
  
  const now = new Date();
  const days = period === '7d' ? 7 : 30;
  const cutoff = new Date(now.getTime() - (days * 24 * 60 * 60 * 1000));
  
  return data.filter(item => {
    const itemDate = new Date(item.date);
    return itemDate >= cutoff;
  });
}

/**
 * Calculates total count from grouped data
 * @param {Array} data - Array of {date, count} objects
 * @returns {number} Total count
 */
export function calculateTotal(data) {
  return data.reduce((sum, item) => sum + item.count, 0);
}

/**
 * Formats relative time (e.g., "2s ago", "1m ago")
 * @param {Date} timestamp - Date to format
 * @returns {string} Formatted relative time
 */
export function formatRelativeTime(timestamp) {
  const now = Date.now();
  const diff = now - timestamp;
  
  if (diff < 60000) return `${Math.floor(diff / 1000)}s ago`;
  if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
  if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
  return `${Math.floor(diff / 86400000)}d ago`;
}
