// File: /src/components/employer/dashboard/DashboardEmployer.jsx

import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import SidebarEmployer from '../sub_components_employer/SidebarEmployer';
import TopBarEmployer from '../sub_components_employer/TopBarEmployer';

import OverviewEmployer from './OverviewEmployer';
import JobListings from './JobListing';
import PostJobForm from '../../../components/jobs/PostJobForm';
import ManageJobs from './ManageJobs';
import Messages from './Messages';
import Support from '../support/Support';
import EmployerFooter from './EmployerFooter';

const DashboardEmployerLayout = () => {
  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <SidebarEmployer />

      {/* Main Content Area */}
      <div className="flex flex-col flex-1">
        {/* Top Bar */}
        <TopBarEmployer />

        {/* Content */}
        <main className="flex-1 p-4">
          <Routes>
            <Route path="/" element={<OverviewEmployer />} />
            <Route path="job-listings" element={<JobListings />} />
            <Route path="post-job" element={<PostJobForm />} />
            <Route path="manage-jobs" element={<ManageJobs />} />
            <Route path="messages" element={<Messages />} />
            <Route path="support" element={<Support />} />

            {/* Catch all → redirect to dashboard home */}
            <Route path="*" element={<Navigate to="/dashboard-employer" />} />
          </Routes>
        </main>

        {/* <!-- Footer --> */}
        <EmployerFooter />
      </div>
    </div>
  );
};

export default DashboardEmployerLayout