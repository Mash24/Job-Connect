// File: /src/components/employer/sub_components_employer/TopBarEmployer.jsx
import React from 'react';
import UserAvatar from '../../common/UserAvatar';

const TopBarEmployer = () => {
  return (
    <div className="bg-white shadow px-6 py-4 flex items-center justify-between sticky top-0 z-30">
      <h1 className="text-xl font-semibold text-gray-800">Employer Dashboard</h1>
      <div className="flex items-center gap-4">
        <UserAvatar size="sm" />
      </div>
    </div>
  );
};

export default TopBarEmployer;