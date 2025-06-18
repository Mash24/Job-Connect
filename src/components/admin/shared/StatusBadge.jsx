import React from 'react';
import { CheckCircle, XCircle, Clock, AlertCircle } from 'lucide-react';

const StatusBadge = ({ status }) => {
  let badgeColor = '';
  let label = '';
  let Icon = null;

  switch (status) {
    case 'active':
      badgeColor = 'bg-green-100 text-green-800';
      label = 'Active';
      Icon = CheckCircle;
      break;
    case 'inactive':
      badgeColor = 'bg-red-100 text-red-800';
      label = 'Inactive';
      Icon = XCircle;
      break;
    case 'pending':
      badgeColor = 'bg-yellow-100 text-yellow-800';
      label = 'Pending';
      Icon = Clock;
      break;
    case 'suspended':
      badgeColor = 'bg-orange-100 text-orange-800';
      label = 'Suspended';
      Icon = AlertCircle;
      break;
    default:
      badgeColor = 'bg-gray-100 text-gray-800';
      label = 'Unknown';
      Icon = AlertCircle;
  }

  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium rounded-full ${badgeColor}`}>
      <Icon className="w-3.5 h-3.5" />
      {label}
    </span>
  );
};

export default StatusBadge;