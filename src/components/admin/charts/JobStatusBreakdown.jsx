// File: /src/components/admin/charts/JobStatusBreakdown.jsx

import React, { useEffect, useState } from 'react';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '../../../firebase/config';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { motion } from 'framer-motion';

const STATUS_COLORS = {
  approved: '#10b981', // green
  pending: '#f59e42', // orange
  rejected: '#ef4444', // red
};

/**
 * @fileoverview JobStatusBreakdown
 * @description Real-time animated pie chart showing job status breakdown.
 * @component
 * @returns {JSX.Element}
 */
const JobStatusBreakdown = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Listen to real-time updates from Firestore
    const unsubscribe = onSnapshot(collection(db, 'jobs'), (snapshot) => {
      const statusCounts = { approved: 0, pending: 0, rejected: 0 };
      snapshot.docs.forEach(doc => {
        const job = doc.data();
        if (job.status && statusCounts.hasOwnProperty(job.status)) {
          statusCounts[job.status] += 1;
        }
      });
      const chartData = Object.entries(statusCounts)
        .map(([status, count]) => ({ status, count }))
        .filter(item => item.count > 0);
      setData(chartData);
      setLoading(false);
    }, (error) => {
      console.error('Error fetching jobs:', error);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  return (
    <motion.div
      className="bg-white rounded-xl shadow p-6 flex flex-col h-full"
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, type: 'spring', delay: 0.2 }}
    >
      <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
        <span role="img" aria-label="pie">🥧</span> Job Status Breakdown
      </h3>
      {loading ? (
        <p className="text-sm text-gray-500">Loading chart...</p>
      ) : data.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-8">
          <img src="/images/ai.png" alt="No data" className="w-32 h-32 opacity-60 mb-2" />
          <p className="text-sm text-gray-400 italic">No job data yet. Post jobs to see status breakdown!</p>
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={data}
              dataKey="count"
              nameKey="status"
              cx="50%"
              cy="50%"
              outerRadius={90}
              innerRadius={50}
              label={({ status, percent }) => `${status.charAt(0).toUpperCase() + status.slice(1)} (${(percent * 100).toFixed(0)}%)`}
              isAnimationActive={true}
            >
              {data.map((entry, idx) => (
                <Cell key={`cell-${entry.status}`} fill={STATUS_COLORS[entry.status] || '#8884d8'} />
              ))}
            </Pie>
            <Tooltip formatter={(value, name) => [`${value} jobs`, name.charAt(0).toUpperCase() + name.slice(1)]} />
            <Legend verticalAlign="bottom" height={36} formatter={value => value.charAt(0).toUpperCase() + value.slice(1)} />
          </PieChart>
        </ResponsiveContainer>
      )}
    </motion.div>
  );
};

export default JobStatusBreakdown; 