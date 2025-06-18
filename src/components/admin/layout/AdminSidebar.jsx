import React from 'react';
import { NavLink } from 'react-router-dom';

const AdminSidebar = () => {
  const links = [
    { label: 'Dashboard', path: '/admin/dashboard' },
    { label: 'Users', path: '/admin/users' },
    { label: 'Jobs', path: '/admin/jobs' },
    { label: 'Reports', path: '/admin/reports' },
    { label: 'Analytics', path: '/admin/analytics' },
    { label: 'Logs', path: '/admin/logs' },
    { label: 'Announcements', path: '/admin/announcements' },
    { label: 'Settings', path: '/admin/settings' },
  ];

  return (
    <aside className="w-64 bg-white shadow-md">
      <div className="p-4 font-bold text-lg border-b">Admin Panel</div>
      <nav className="flex flex-col p-4 space-y-2">
        {links.map((link) => (
          <NavLink
            key={link.path}
            to={link.path}
            className={({ isActive }) =>
              `px-3 py-2 rounded ${
                isActive ? 'bg-blue-100 text-blue-700 font-semibold' : 'text-gray-700 hover:bg-gray-100'
              }`
            }
          >
            {link.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};

export default AdminSidebar;