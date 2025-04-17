import React, { useEffect, useState } from 'react';
import { collection, getCountFromServer } from 'firebase/firestore';
import { db } from '../../../firebase/config';

const AdminCard = ({ title, icon }) => {
  const [count, setCount] = useState('...');

  useEffect(() => {
    const fetchCount = async () => {
      try {
        let colRef;
        if (title === 'Total Users') colRef = collection(db, 'users');
        else if (title === 'Jobs Posted') colRef = collection(db, 'jobs');
        else if (title === 'Reports') colRef = collection(db, 'reports');

        if (colRef) {
          const snapshot = await getCountFromServer(colRef);
          setCount(snapshot.data().count);
        }
      } catch (err) {
        console.error(`❌ Failed to fetch ${title} count:`, err);
        setCount('Err');
      }
    };

    fetchCount();
  }, [title]);

  return (
    <div className="bg-white rounded shadow p-4 flex items-center gap-4">
      <div className="text-3xl">{icon}</div>
      <div>
        <p className="text-sm text-gray-500">{title}</p>
        <p className="text-xl font-bold">{count}</p>
      </div>
    </div>
  );
};

export default AdminCard;