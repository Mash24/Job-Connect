import React, { useEffect, useState } from 'react';
import { collection, getDocs, updateDoc, doc } from 'firebase/firestore';
import { db } from '../firebase/config';

const FixOldReports = () => {
  const [status, setStatus] = useState('Ready');

  useEffect(() => {
    const normalizeReports = async () => {
      setStatus('Processing...');
      try {
        const snap = await getDocs(collection(db, 'reports'));
        const updates = [];

        for (const reportDoc of snap.docs) {
          const data = reportDoc.data();
          const updateFields = {};

          // Fill missing fields if not present
          if (!data.status) updateFields.status = 'pending';
          if (!data.type) updateFields.type = 'job'; // Or 'user' based on your data
          if (!data.reason) updateFields.reason = 'No reason specified';
          if (!data.createdAt) updateFields.createdAt = new Date();

          // Save update if needed
          if (Object.keys(updateFields).length > 0) {
            updates.push(updateDoc(doc(db, 'reports', reportDoc.id), updateFields));
          }
        }

        await Promise.all(updates);
        setStatus(`✅ Updated ${updates.length} reports.`);
      } catch (err) {
        console.error('❌ Failed to normalize reports:', err);
        setStatus('❌ Error occurred.');
      }
    };

    normalizeReports();
  }, []);

  return <div className="p-4 font-mono text-sm text-blue-600">{status}</div>;
};

export default FixOldReports;
