import React from 'react';
import { Outlet } from 'react-router-dom';

import SidebarSeeker from '../components/layouts/SidebarSeeker';
import TopBar from '../components/layouts/TopBar';


const DashboardSeeker = () => {
  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Left Sidebar */}
      <SidebarSeeker />

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Navigation */}
        <TopBar />

        {/* Page Content */}
        <main className="p-6 space-y-6 overflow-y-auto">
          <Outlet /> {/* ✅ Renders nested child routes like Overview, MyApplication, etc. */}
        </main>
      </div>
    </div>
  );
};

export default DashboardSeeker;