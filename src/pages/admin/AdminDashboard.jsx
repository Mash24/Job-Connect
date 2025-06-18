// File: /src/pages/admin/AdminDashboard.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, db } from '../../firebase/config';
import { doc, getDoc } from 'firebase/firestore';

import AdminCard from '../../components/admin/cards/AdminCard';
import ApplicationsOverTime from '../../components/admin/charts/ApplicationsOverTime';
import UserSignupsOverTime from '../../components/admin/charts/UserSignupsOverTime';
import JobStatusBreakdown from '../../components/admin/charts/JobStatusBreakdown';
import RecentActivityFeed from '../../pages/admin/RecentActivityFeed';
import AdminDashboardTopSection from '../../components/admin/dashboard/AdminDashboardTopSection';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAdmin = async () => {
      const user = auth.currentUser;
      if (!user) return navigate('/login');

      try {
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists() && userDoc.data().role === 'super-admin') {
          setIsAdmin(true);
        } else {
          setIsAdmin(false);
        }
      } catch (error) {
        console.error('❌ Error checking admin status:', error);
        setIsAdmin(false);
      } finally {
        setLoading(false);
      }
    };

    checkAdmin();
  }, [navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500 text-lg">
        Checking admin access...
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500 text-lg">
        ❌ Access denied: Admins only
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold mb-2">📊 Dashboard Overview</h1>

      {/* ====== NEW TOP SECTION ====== */}
      <AdminDashboardTopSection />

      {/* ====== CHARTS ====== */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mt-6">
        <ApplicationsOverTime />
        <UserSignupsOverTime />
        <JobStatusBreakdown />
      </div>

      {/* ====== ACTIVITY FEED ====== */}
      <RecentActivityFeed />
    </div>
  );
};

export default AdminDashboard;
