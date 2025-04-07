import React from 'react';

import UserWelcomeBanner from '../dashboard/UserWelcomeBanner';
import ProfileProgress from '../dashboard/ProfileProgress';
import StatCards from '../dashboard/StatCards';
import JobSuggestions from '../dashboard/JobSuggestions';
import SavedJobs from '../dashboard/SavedJobs';
import Messages from '../dashboard/Messages';
import AllJobs from '../../jobs/AllJobs';

const Overview = () => {
  return (
    <div className="space-y-6">
      <UserWelcomeBanner />
      <ProfileProgress />
      <StatCards />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <JobSuggestions />
        <AllJobs /> {/* ✅ Job Listings page */}
        <SavedJobs />
      </div>

      <Messages />
    </div>
  );
};

export default Overview;