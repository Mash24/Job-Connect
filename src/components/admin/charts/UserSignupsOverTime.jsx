import React, { useEffect, useState } from 'react';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { db } from '../../../firebase/config';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { motion } from 'framer-motion';
import { groupByDate, filterByPeriod } from '../../../lib/utils';
import ChartCard from './ChartCard';

/**
 * @fileoverview UserSignupsOverTime
 * @description Real-time animated area chart showing user signup growth over time.
 * @component
 * @returns {JSX.Element}
 */
const UserSignupsOverTime = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState('30d');

  useEffect(() => {
    // Listen to real-time updates from Firestore
    const q = query(collection(db, 'users'), orderBy('createdAt', 'asc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const docs = snapshot.docs.map(doc => doc.data());
      const grouped = groupByDate(docs, 'createdAt');
      setData(grouped);
      setLoading(false);
    }, (error) => {
      console.error('Error fetching users:', error);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const filteredData = filterByPeriod(data, period);

  return (
    <ChartCard
      title="User Signups Over Time"
      icon="👥"
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
          <p className="text-sm text-gray-400 italic">No signup data yet. Start promoting your platform!</p>
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={filteredData} margin={{ top: 20, right: 20, left: 0, bottom: 20 }}>
            <defs>
              <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#10b981" stopOpacity={0.1}/>
              </linearGradient>
            </defs>
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
              formatter={value => [`${value} signups`, 'Signups']}
            />
            <Area
              type="monotone"
              dataKey="count"
              stroke="#10b981"
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#colorUsers)"
              isAnimationActive={true}
            />
          </AreaChart>
        </ResponsiveContainer>
      )}
    </ChartCard>
  );
};

export default UserSignupsOverTime; 