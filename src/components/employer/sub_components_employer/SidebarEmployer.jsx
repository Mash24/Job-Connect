// File: /src/components/employer/sub_components_employer/SidebarEmployer.jsx
import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Plus, ClipboardList, MessageCircle, LifeBuoy, LogOut} from 'lucide-react';
import { signOut } from 'firebase/auth';
import { auth } from '../../../firebase/config';

const SidebarEmployer = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut(auth);
    // Redirect to login page after logout
    navigate('/login');
  };

  const linkClass = ({ isActive }) =>
    `flex items-center gap-2 transition-all duration-200 ${
      isActive ? 'text-blue-400 font-semibold' : 'hover:text-blue-400'
    }`;

  return (
    <aside className="w-64 bg-slate-900 text-white min-h-screen p-5 hidden, md:block">
      <div className="mb-10 text-2xl font-bold">Employer Panel</div>
      <nav className="flex flex-col gap-4">
      <NavLink to="." end className={linkClass}>
          <LayoutDashboard className="w-5 h-5" />
          Dashboard
        </NavLink>
        <NavLink to="job-listings" className={linkClass}>
          <ClipboardList className="w-5 h-5" />
          Job Listings
        </NavLink>
        <NavLink to="post-job" className={linkClass}>
          <Plus className="w-5 h-5" />
          Post Job
        </NavLink>
        <NavLink to="manage-jobs" className={linkClass}>
          <ClipboardList className="w-5 h-5" />
          Manage Jobs
        </NavLink>
        <NavLink to="messages" className={linkClass}>
          <MessageCircle className="w-5 h-5" />
          Messages
        </NavLink>
        <NavLink to="support" className={linkClass}>
          <LifeBuoy className="w-5 h-5" />
          Support
        </NavLink>
        <button onClick={handleLogout} className="mt-10 flex items-center gap-2 hover:text-red-400">
          <LogOut className="w-5 h-5" /> Logout
        </button>
      </nav>
    </aside>
  );
};

export default SidebarEmployer;