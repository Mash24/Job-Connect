// File: /src/components/admin/charts/ApplicationsOverTime.jsx

import React, { useEffect, useState } from 'react';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '../../../firebase/config';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';

const ApplicationsOverTime = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'applications'), (snapshot) => {
      const monthlyCounts = {};

      snapshot.docs.forEach((doc) => {
        const app = doc.data();
        if (app.timestamp?.toDate) {
          const date = app.timestamp.toDate();
          const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
          monthlyCounts[key] = (monthlyCounts[key] || 0) + 1;
        }
      });

      const chartData = Object.keys(monthlyCounts).map((key) => ({
        month: key,
        applications: monthlyCounts[key],
      })).sort((a, b) => new Date(a.month) - new Date(b.month));

      setData(chartData);
      setLoading(false);
    }, (error) => {
      console.error('Error fetching applications:', error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <div className="bg-white rounded shadow p-4">
      <h3 className="text-lg font-semibold mb-2">📈 Applications Over Time</h3>
      {loading ? (
        <p className="text-sm text-gray-500">Loading chart...</p>
      ) : data.length === 0 ? (
        <p className="text-sm text-gray-400 italic">No application data available yet.</p>
      ) : (
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data} margin={{ top: 20, right: 20, left: 0, bottom: 20 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" tick={{ fontSize: 12 }} />
            <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
            <Tooltip formatter={(value) => [`${value} applications`, 'Applications']} />
            <Bar dataKey="applications" fill="#3b82f6" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};

export default ApplicationsOverTime;
