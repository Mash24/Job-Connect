// File: /src/components/employer/dashboard/JobStatsGraph.jsx

import React, { useEffect, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from 'recharts';
import { db, auth } from '../../../firebase/config';
import { format } from 'date-fns';

/**
 * JobStatsGraph
 * Line graph with curved paths for Jobs Posted, Applications, and Conversion Rate.
 */
const JobStatsGraph = () => {
  const [user] = useAuthState(auth);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const fetchJobStats = async () => {
      try {
        const q = query(collection(db, 'jobs'), where('userId', '==', user.uid));
        const snapshot = await getDocs(q);

        const stats = {};

        snapshot.forEach((doc) => {
          const job = doc.data();
          const createdAt = job.createdAt?.toDate();
          const dateKey = createdAt ? format(createdAt, 'yyyy-MM-dd') : 'unknown';

          if (!stats[dateKey]) {
            stats[dateKey] = {
              date: dateKey,
              jobs: 0,
              applications: 0,
            };
          }

          stats[dateKey].jobs += 1;
          stats[dateKey].applications += job.applications?.length || 0;
        });

        const chartData = Object.values(stats).map((day) => ({
          ...day,
          conversion: day.jobs > 0 ? (day.applications / day.jobs).toFixed(2) : 0,
        }));

        setData(chartData);
      } catch (err) {
        console.error('Error loading graph:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchJobStats();
  }, [user]);

  if (loading) return <p className="text-sm text-gray-500">Loading graph...</p>;

  return (
    <div className="bg-white p-6 rounded-xl shadow w-full">
      <h3 className="text-lg font-semibold mb-4 text-gray-800">📈 Job Activity & Conversion Rate</h3>

      <ResponsiveContainer width="100%" height={320}>
        <LineChart data={data} margin={{ top: 10, right: 30, bottom: 30, left: 10 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" angle={-30} textAnchor="end" />
          <YAxis yAxisId="left" label={{ value: 'Count', angle: -90, position: 'insideLeft' }} />
          <YAxis yAxisId="right" orientation="right" label={{ value: 'Conversion Rate', angle: -90, position: 'insideRight' }} />
          <Tooltip />
          <Legend verticalAlign="top" height={36} />
          <Line yAxisId="left" type="monotone" dataKey="jobs" stroke="#3B82F6" strokeWidth={2} name="Jobs Posted" />
          <Line yAxisId="left" type="monotone" dataKey="applications" stroke="#10B981" strokeWidth={2} name="Applications" />
          <Line yAxisId="right" type="monotone" dataKey="conversion" stroke="#F59E0B" strokeWidth={2} strokeDasharray="5 5" name="Conversion Rate" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default JobStatsGraph;
