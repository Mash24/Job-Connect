/**
 * @fileoverview RecentActivityFeed Component
 * @description A real-time activity feed component that displays recent system activities
 * in the admin dashboard. It shows various types of activities with their respective
 * timestamps and icons.
 * 
 * @component
 * @requires React
 * @requires firebase/firestore
 * @requires lucide-react
 */

import React, { useEffect, useState } from 'react';
import { collection, query, orderBy, limit, onSnapshot } from 'firebase/firestore';
import { db } from '../../firebase/config';
import { Loader2 } from 'lucide-react';

/**
 * @constant {Object} typeIcons
 * @description Mapping of activity types to their corresponding emoji icons
 */
const typeIcons = {
  user: '🧑',
  job: '💼',
  report: '🚨',
  support: '💬',
  settings: '⚙️',
  auth: '🔐',
};

/**
 * @function formatTimeAgo
 * @description Formats a timestamp into a human-readable relative time string
 * @param {Object} timestamp - Firestore timestamp object
 * @returns {string} Formatted time string (e.g., "2m ago", "1h ago")
 */
const formatTimeAgo = (timestamp) => {
  if (!timestamp?.seconds) return 'Just now';
  const secondsAgo = Math.floor((Date.now() - timestamp.seconds * 1000) / 1000);
  if (secondsAgo < 60) return `${secondsAgo}s ago`;
  if (secondsAgo < 3600) return `${Math.floor(secondsAgo / 60)}m ago`;
  if (secondsAgo < 86400) return `${Math.floor(secondsAgo / 3600)}h ago`;
  return `${Math.floor(secondsAgo / 86400)}d ago`;
};

/**
 * @component RecentActivityFeed
 * @description Displays a real-time feed of recent system activities
 * @returns {JSX.Element} Rendered component
 */
const RecentActivityFeed = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    /**
     * @description Sets up real-time listener for activity logs
     * @returns {Function} Cleanup function to unsubscribe from Firestore
     */
    const q = query(
      collection(db, 'logs'),
      orderBy('timestamp', 'desc'),
      limit(20)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setLogs(data);
      setLoading(false);
    }, (error) => {
      console.error('Error fetching logs:', error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <div className="bg-white border rounded-xl shadow p-4">
      <h2 className="text-lg font-semibold mb-4">📝 Recent Activity Feed</h2>

      {loading ? (
        <div className="flex justify-center py-10 text-gray-400">
          <Loader2 className="w-5 h-5 animate-spin" /> Loading...
        </div>
      ) : logs.length === 0 ? (
        <div className="text-center text-sm text-gray-400 italic">No recent activity found.</div>
      ) : (
        <ul className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
          {logs.map(log => (
            <li key={log.id} className="text-sm text-gray-700 flex items-start gap-2">
              <span className="text-xl">{typeIcons[log.type] || '🔍'}</span>
              <div>
                <p>{log.performedBy || 'Someone'} <span className="font-medium text-gray-900">{log.action}</span> {log.target}</p>
                <span className="text-xs text-gray-400">{formatTimeAgo(log.timestamp)}</span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default RecentActivityFeed;
