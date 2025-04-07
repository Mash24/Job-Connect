// File: /src/components/employer/dashboard/JobStats.jsx

import React, { useEffect, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { collection, onSnapshot, query, where } from 'firebase/firestore';
import { db, auth } from '../../../firebase/config';
import { Briefcase, Clock, Globe, CalendarDays } from 'lucide-react';

/**
 * JobListing Component
 * Displays key statistics for employer's job postings:
 * - Total Jobs Posted
 * - Active Jobs (not expired)
 * - Remote Jobs
 * - Jobs Posted This Month
 */

const JobListing = () => {
  const [user] = useAuthState(auth);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const q = query(collection(db, 'jobs'), where('userId', '==', user.uid));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const jobList = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setJobs(jobList);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  // Calculate Stats
  const totalJobs = jobs.length;
  const today = new Date();
  const activeJobs = jobs.filter(job => {
    const deadline = job.deadline ? new Date(job.deadline) : null;
    return deadline && deadline > today;
  }).length;

  const remoteJobs = jobs.filter(job => job.isRemote).length;

  const jobsThisMonth = jobs.filter(job => {
    const createdAt = job.createdAt?.toDate?.();
    return (
      createdAt &&
      createdAt.getMonth() === today.getMonth() &&
      createdAt.getFullYear() === today.getFullYear()
    );
  }).length;

  const StatCard = ({ icon: Icon, label, value }) => (
    <div className="bg-white rounded-xl shadow p-5 flex items-center gap-4 border hover:shadow-md transition">
      <div className="bg-blue-100 text-blue-600 p-3 rounded-full">
        <Icon size={20} />
      </div>
      <div>
        <p className="text-2xl font-bold">{value}</p>
        <p className="text-gray-600 text-sm">{label}</p>
      </div>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Job Posting Stats</h2>
      {loading ? (
        <p className="text-gray-500">Loading stats...</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          <StatCard icon={Briefcase} label="Total Jobs Posted" value={totalJobs} />
          <StatCard icon={Clock} label="Active Jobs" value={activeJobs} />
          <StatCard icon={Globe} label="Remote Jobs" value={remoteJobs} />
          <StatCard icon={CalendarDays} label="Jobs This Month" value={jobsThisMonth} />
        </div>
      )}
    </div>
  );
};

export default JobListing