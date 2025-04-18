// File: src/pages/admin/AdminLogs.jsx

import React, { useEffect, useState } from 'react';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { db } from '../../firebase/config';
import LogCard from '../../components/admin/logs/LogCard';

const AdminLogs = () => {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    const q = query(collection(db, 'logs'), orderBy('timestamp', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const list = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setLogs(list);
    });
    return () => unsubscribe();
  }, []);

  return (
    <div className="min-h-screen p-6 bg-gray-50">
      <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
        📜 Admin Logs
      </h2>

      {logs.length === 0 ? (
        <p className="text-gray-500 italic">No logs found.</p>
      ) : (
        <div className="space-y-4">
          {logs.map((log) => (
            <LogCard key={log.id} log={log} />
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminLogs;
