import React, { useEffect, useState } from 'react';
import { collection, onSnapshot, orderBy, query, doc, getDoc } from 'firebase/firestore';
import { db } from '../../../firebase/config';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';

const SupportInbox = () => {
  const [threads, setThreads] = useState({});
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const navigate = useNavigate();

  // Load support messages and group them by userId
  useEffect(() => {
    const q = query(collection(db, 'support'), orderBy('createdAt', 'desc'));

    const unsubscribe = onSnapshot(q, async (snapshot) => {
      const grouped = {};

      for (const docSnap of snapshot.docs) {
        const data = docSnap.data();
        const { userId } = data;

        // Initialize user thread if it doesn't exist
        if (!grouped[userId]) {
          grouped[userId] = {
            userId,
            email: data.email,
            latestMessage: data.text,
            latestDate: data.createdAt?.toDate(),
            status: 'pending' // default
          };

          // Fetch status from /supportThreads/{userId}
          try {
            const threadDoc = await getDoc(doc(db, 'supportThreads', userId));
            if (threadDoc.exists()) {
              grouped[userId].status = threadDoc.data().status || 'pending';
            }
          } catch (err) {
            console.warn('Failed to fetch thread status:', err.message);
          }
        }
      }

      setThreads(grouped);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const sortedThreads = Object.values(threads)
    .filter((t) => filter === 'all' || t.status === filter)
    .sort((a, b) => b.latestDate - a.latestDate);

  const statusColors = {
    pending: 'bg-yellow-100 text-yellow-700',
    answered: 'bg-blue-100 text-blue-700',
    resolved: 'bg-green-100 text-green-700'
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h2 className="text-2xl font-bold mb-4">🛟 Support Inbox</h2>

      {/* Filters */}
      <div className="mb-6 flex gap-3 flex-wrap">
        {['all', 'pending', 'answered', 'resolved'].map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`text-sm px-4 py-1.5 rounded-full border transition ${
              filter === status
                ? 'bg-blue-600 text-white border-blue-600'
                : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'
            }`}
          >
            {status === 'all'
              ? 'All'
              : status.charAt(0).toUpperCase() + status.slice(1)}
          </button>
        ))}
      </div>

      {/* Message Threads */}
      {loading ? (
        <p className="text-gray-500 text-center py-6">Loading...</p>
      ) : sortedThreads.length === 0 ? (
        <p className="text-gray-400 italic text-center">No threads found.</p>
      ) : (
        <ul className="divide-y rounded border">
          {sortedThreads.map((thread) => (
            <li
              key={thread.userId}
              onClick={() => navigate(`/admin/support/${thread.userId}`)}
              className="p-4 hover:bg-gray-50 cursor-pointer flex justify-between items-center"
            >
              <div>
                <p className="font-semibold">{thread.email}</p>
                <p className="text-sm text-gray-600 truncate max-w-md">
                  {thread.latestMessage}
                </p>
              </div>
              <div className="flex flex-col items-end gap-1">
                <p className="text-xs text-gray-400">
                  {thread.latestDate
                    ? format(thread.latestDate, 'MMM d, h:mm a')
                    : 'Unknown'}
                </p>
                <span
                  className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusColors[thread.status]}`}
                >
                  {thread.status.charAt(0).toUpperCase() + thread.status.slice(1)}
                </span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SupportInbox;