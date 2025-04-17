// src/components/admin/layout/AdminLayout.jsx
import React from 'react';
import { Outlet } from 'react-router-dom';
import AdminSidebar from './AdminSidebar';
import AdminTopbar from './AdminTopbar';
import useAdminCheck from '../../../hooks/useAdminCheck';

const AdminLayout = () => {
  const isAdmin = useAdminCheck();

  if (isAdmin === null) {
    return <p className="text-center p-10 text-gray-500">Loading...</p>;
  }

  if (!isAdmin) {
    return <p className="text-center p-10 text-red-500">❌ Access denied: Admins only</p>;
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <AdminSidebar />
      <div className="flex flex-col flex-1">
        <AdminTopbar />
        <main className="flex-1 p-6 overflow-y-auto bg-gray-50">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;