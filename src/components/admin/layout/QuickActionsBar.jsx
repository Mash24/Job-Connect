import React from 'react';
import { useNavigate } from 'react-router-dom';
import { PlusCircleIcon, ExclamationTriangleIcon, MegaphoneIcon } from '@heroicons/react/24/solid';

const actions = [
  {
    label: 'Post Job',
    icon: <PlusCircleIcon className="w-6 h-6" />,
    route: '/admin/jobs/new',
    color: 'bg-blue-600',
  },
  {
    label: 'Review Reports',
    icon: <ExclamationTriangleIcon className="w-6 h-6" />,
    route: '/admin/reports',
    color: 'bg-red-500',
  },
  {
    label: 'Send Announcement',
    icon: <MegaphoneIcon className="w-6 h-6" />,
    route: '/admin/announcements/new',
    color: 'bg-yellow-500',
  },
];

const QuickActionsBar = () => {
  const navigate = useNavigate();
  return (
    <div className="flex gap-4 mb-4">
      {actions.map((action) => (
        <button
          key={action.label}
          onClick={() => navigate(action.route)}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-white font-semibold shadow transition-transform duration-150 hover:scale-105 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-400 ${action.color}`}
        >
          {action.icon}
          {action.label}
        </button>
      ))}
    </div>
  );
};

export default QuickActionsBar; 