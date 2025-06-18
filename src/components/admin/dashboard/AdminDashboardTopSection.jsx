import React, { useEffect, useState } from 'react';
import GreetingBanner from '../layout/GreetingBanner';
import QuickActionsBar from '../layout/QuickActionsBar';
import AdminStatCard from '../cards/AdminStatCard';
import { UsersIcon, BriefcaseIcon, BellAlertIcon } from '@heroicons/react/24/outline';
import { db } from '../../../firebase/config';
import { collection, onSnapshot } from 'firebase/firestore';

const AdminDashboardTopSection = () => {
  const [usersCount, setUsersCount] = useState(0);
  const [jobsCount, setJobsCount] = useState(0);
  const [reportsCount, setReportsCount] = useState(0);

  useEffect(() => {
    const unsubUsers = onSnapshot(collection(db, 'users'), (snap) => setUsersCount(snap.size));
    const unsubJobs = onSnapshot(collection(db, 'jobs'), (snap) => setJobsCount(snap.size));
    const unsubReports = onSnapshot(collection(db, 'reports'), (snap) => setReportsCount(snap.size));
    return () => {
      unsubUsers();
      unsubJobs();
      unsubReports();
    };
  }, []);

  return (
    <div className="space-y-6">
      <GreetingBanner />
      <QuickActionsBar />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <AdminStatCard title="Total Users" value={usersCount} icon={<UsersIcon className="w-8 h-8" />} color="from-purple-500 to-pink-500" />
        <AdminStatCard title="Jobs Posted" value={jobsCount} icon={<BriefcaseIcon className="w-8 h-8" />} color="from-yellow-500 to-orange-500" />
        <AdminStatCard title="Reports" value={reportsCount} icon={<BellAlertIcon className="w-8 h-8" />} color="from-red-500 to-rose-500" />
      </div>
    </div>
  );
};

export default AdminDashboardTopSection; 