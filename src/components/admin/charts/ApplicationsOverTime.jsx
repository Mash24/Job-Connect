import React, { useEffect, useState } from 'react';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { db } from '../../../firebase/config';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { motion } from 'framer-motion';
import { groupByDate, filterByPeriod } from '../../../lib/utils';
import ChartCard from './ChartCard';

/**
 * @fileoverview ApplicationsOverTime
 * @description Real-time animated line chart of job applications per day.
 * @component
 * @returns {JSX.Element}
 */
const ApplicationsOverTime = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState('30d');

  useEffect(() => {
    // Listen to real-time updates from Firestore
    const q = query(collection(db, 'applications'), orderBy('createdAt', 'asc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const docs = snapshot.docs.map(doc => doc.data());
      const grouped = groupByDate(docs, 'createdAt');
      setData(grouped);
      setLoading(false);
    }, (error) => {
      console.error('Error fetching applications:', error);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const filteredData = filterByPeriod(data, period);

  return (
    <ChartCard
      title="Applications Over Time"
      data={data}
      period={period}
      onPeriodChange={setPeriod}
    >
      {loading ? (
        <div className="p-6">
          <p className="text-sm text-gray-500">Loading chart...</p>
        </div>
      ) : filteredData.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-8">
          <img src="/images/ai.png" alt="No data" className="w-32 h-32 opacity-60 mb-2" />
          <p className="text-sm text-gray-400 italic">No application data yet. Encourage your users to apply!</p>
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={filteredData} margin={{ top: 20, right: 20, left: 0, bottom: 20 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="date"
              tick={{ fontSize: 12 }}
              tickFormatter={d => {
                const date = new Date(d);
                return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
              }}
            />
            <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
            <Tooltip
              labelFormatter={d => {
                const date = new Date(d);
                return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
              }}
              formatter={value => [`${value} applications`, 'Applications']}
            />
            <Line
              type="monotone"
              dataKey="count"
              stroke="#3b82f6"
              strokeWidth={3}
              dot={{ r: 4, stroke: '#3b82f6', strokeWidth: 2, fill: '#fff' }}
              activeDot={{ r: 7 }}
              isAnimationActive={true}
            />
          </LineChart>
        </ResponsiveContainer>
      )}
    </ChartCard>
  );
};

export default ApplicationsOverTime; 