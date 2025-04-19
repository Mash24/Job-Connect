// File: /src/components/admin/charts/UserSignupsChart.jsx

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
import { CalendarDays } from 'lucide-react';
import dayjs from 'dayjs';
import localizedFormat from 'dayjs/plugin/localizedFormat';
dayjs.extend(localizedFormat);

const UserSignupsChart = () => {
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'users'), (snapshot) => {
      const grouped = {};

      snapshot.forEach((doc) => {
        const user = doc.data();
        const timestamp = user.createdAt;

        if (timestamp?.seconds) {
          const date = dayjs(timestamp.seconds * 1000);
          const key = date.format('MMM YYYY');
          grouped[key] = (grouped[key] || 0) + 1;
        }
      });

      // Convert to array and sort by month
      const sorted = Object.entries(grouped)
        .map(([month, count]) => ({ month, count }))
        .sort((a, b) => dayjs(a.month, 'MMM YYYY').unix() - dayjs(b.month, 'MMM YYYY').unix());

      setChartData(sorted);
      setLoading(false);
    });

    return () => unsub();
  }, []);

  return (
    <div className="bg-white p-4 rounded-xl shadow border">
      <div className="flex items-center gap-2 mb-4">
        <CalendarDays className="text-blue-600" />
        <h3 className="text-lg font-semibold text-gray-700">User Signups Over Time</h3>
      </div>

      {loading ? (
        <p className="text-sm text-gray-500">Loading...</p>
      ) : chartData.length === 0 ? (
        <p className="text-sm text-gray-500 italic">No signup data available.</p>
      ) : (
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData} margin={{ top: 10, right: 20, bottom: 30, left: 0 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" tick={{ fontSize: 12 }} angle={-45} textAnchor="end" height={60} />
            <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
            <Tooltip />
            <Bar dataKey="count" fill="#3b82f6" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};

export default UserSignupsChart;
