import React, { useEffect, useState } from 'react';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '../../../firebase/config';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const STATUS_COLORS = {
  approved: '#10b981', // green
  pending: '#f59e42', // orange
  rejected: '#ef4444', // red
};

const JobStatusBreakdown = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'jobs'), (snapshot) => {
      const statusCounts = { approved: 0, pending: 0, rejected: 0 };
      snapshot.docs.forEach(doc => {
        const job = doc.data();
        if (job.status && Object.prototype.hasOwnProperty.call(statusCounts, job.status)) {
          statusCounts[job.status] += 1;
        }
      });
      const chartData = Object.entries(statusCounts)
        .map(([, count]) => ({ status: Object.keys(statusCounts)[Object.values(statusCounts).indexOf(count)], count }))
        .filter(item => item.count > 0);
      setData(chartData);
      setLoading(false);
    }, (error) => {
      console.error('Error fetching jobs:', error);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const renderCustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);
    if (percent < 0.05) return null;
    return (
      <text 
        x={x} 
        y={y} 
        fill="white" 
        textAnchor={x > cx ? 'start' : 'end'} 
        dominantBaseline="central"
        fontSize="12"
        fontWeight="bold"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  return (
    <div
      className="bg-white rounded-xl shadow p-6 flex flex-col h-full"
    >
      <h3 className="text-lg font-semibold mb-2">
        Job Status Breakdown
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
              outerRadius={80}
              innerRadius={40}
              label={renderCustomLabel}
              labelLine={false}
              isAnimationActive={true}
            >
              {data.map((entry) => (
                <Cell key={`cell-${entry.status}`} fill={STATUS_COLORS[entry.status] || '#8884d8'} />
              ))}
            </Pie>
            <Tooltip 
              formatter={(value, name) => [`${value} jobs`, name.charAt(0).toUpperCase() + name.slice(1)]} 
              contentStyle={{
                backgroundColor: 'white',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
              }}
            />
            <Legend 
              verticalAlign="bottom" 
              height={36} 
              formatter={value => value.charAt(0).toUpperCase() + value.slice(1)}
              wrapperStyle={{
                paddingTop: '20px'
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};

export default JobStatusBreakdown; 