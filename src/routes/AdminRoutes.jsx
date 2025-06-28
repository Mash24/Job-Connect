import React, { Suspense, lazy } from 'react';
import { Route } from 'react-router-dom';

import AdminLayout from '../components/admin/layout/AdminLayout';
import AdminDashboard from '../pages/admin/AdminDashboard';
const AdminUsers = lazy(() => import('../pages/admin/AdminUsers'));
const AdminReports = lazy(() => import('../pages/admin/AdminReports'));
const AdminAnalytics = lazy(() => import('../pages/admin/AdminAnalytics'));
import AdminJobs from '../pages/admin/AdminJobs';
import AdminLogs from '../pages/admin/AdminLogs';
import AdminSettings from '../pages/admin/AdminSettings';
import AdminAnnouncements from '../pages/admin/AdminAnnouncements';
import AdminProfile from '../pages/admin/AdminProfile';
import AdminSupportPage from '../components/admin/AdminSupportPage';
import SupportThreadPage from '../components/admin/support/SupportThreadPage';

import AdminRoute from './AdminRoute'; // optional auth guard

const AdminRoutes = () => (
  <Route path="/admin" element={
    <AdminRoute>
      <AdminLayout />
    </AdminRoute>
  }>
    <Route index element={<AdminDashboard />} />
    <Route path="dashboard" element={<AdminDashboard />} />
    <Route path="users" element={
      <Suspense fallback={<div className="text-center p-10">Loading Users...</div>}>
        <AdminUsers />
      </Suspense>
    } />
    <Route path="jobs" element={<AdminJobs />} />
    <Route path="reports" element={
      <Suspense fallback={<div className="text-center p-10">Loading Reports...</div>}>
        <AdminReports />
      </Suspense>
    } />
    <Route path="analytics" element={
      <Suspense fallback={<div className="text-center p-10">Loading Analytics...</div>}>
        <AdminAnalytics />
      </Suspense>
    } />
    <Route path="logs" element={<AdminLogs />} />
    <Route path="settings" element={<AdminSettings />} />
    <Route path="announcements" element={<AdminAnnouncements />} />
    <Route path="profile" element={<AdminProfile />} />
    <Route path="support" element={<AdminSupportPage />} />
    <Route path="support/:userId" element={<SupportThreadPage />} />
  </Route>
);

export default AdminRoutes;