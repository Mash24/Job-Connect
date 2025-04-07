import React from 'react';
import EmployerWelcomeBanner from '../sub_components_employer/EmployerWelcomeBanner';
import EmployerStatCard from '../sub_components_employer/EmployerStatCard';
import JobStatsGraph from './JobStatsGraph';

const OverviewEmployer = () => {
  return (
    <div className="space-y-6 p-4">
      {/* Welcome Banner */}
      <EmployerWelcomeBanner />

      {/* Dashboard Stat Cards */}
      <EmployerStatCard />
      <JobStatsGraph /> 
    </div>
  );
};

export default OverviewEmployer;