import React from 'react';

const EmployerFooter = () => {
  return (
    <footer className="bg-white border-t mt-6 px-6 py-4 text-sm text-gray-600 flex flex-col md:flex-row justify-between items-center">
      <div className="mb-2 md:mb-0">
        &copy; {new Date().getFullYear()} Job Connect. All rights reserved.
      </div>
      <div className="flex gap-4">
        <a href="/dashboard-employer/support" className="hover:text-blue-500 transition">Support</a>
        <a href="/dashboard-employer/settings" className="hover:text-blue-500 transition">Settings</a>
        <a href="/terms" className="hover:text-blue-500 transition">Terms</a>
      </div>
    </footer>
  );
};

export default EmployerFooter;