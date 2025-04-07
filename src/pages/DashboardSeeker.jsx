// File: src/pages/DashboardSeeker.jsx
import React from 'react';
import { Outlet } from 'react-router-dom';

import SidebarSeeker from '../components/layouts/SidebarSeeker';
import TopBar from '../components/layouts/TopBar';

/**
 * Dashboard layout for job seekers
 * Renders sidebar, topbar, and nested routes (e.g., JobListings, MyApplication)
 */
const DashboardSeeker = () => {
  return (
    <div className="flex min-h-screen bg-gray-100">
      <SidebarSeeker />

      <div className="flex-1 flex flex-col">
        <TopBar />

        <main className="p-6 space-y-6 overflow-y-auto">
          <Outlet /> {/* 🔥 JobListings renders here */}
        </main>
      </div>
    </div>
  );
};

export default DashboardSeeker;