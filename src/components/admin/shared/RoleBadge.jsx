import React from 'react';
import { User, Briefcase, Shield } from 'lucide-react';

const RoleBadge = ({ role }) => {
  let badgeColor = '';
  let label = '';
  let Icon = null;

  switch (role) {
    case 'job-seeker':
      badgeColor = 'bg-green-100 text-green-800';
      label = 'Job Seeker';
      Icon = User;
      break;
    case 'employer':
      badgeColor = 'bg-yellow-100 text-yellow-800';
      label = 'Employer';
      Icon = Briefcase;
      break;
    case 'super-admin':
      badgeColor = 'bg-purple-100 text-purple-800';
      label = 'Super Admin';
      Icon = Shield;
      break;
    default:
      badgeColor = 'bg-gray-100 text-gray-800';
      label = 'Unknown';
      Icon = User;
  }

  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium rounded-full ${badgeColor}`}>
      <Icon className="w-3.5 h-3.5" />
      {label}
    </span>
  );
};

export default RoleBadge;
