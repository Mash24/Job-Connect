import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth } from '../../../firebase/config';
import { FaChevronDown } from 'react-icons/fa';

const AdminTopbar = () => {
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut(auth);
    navigate('/login');
  };

  return (
    <div className="w-full bg-white px-6 py-4 border-b flex items-center justify-between">
      <h1 className="text-xl font-bold">👋 Welcome, Admin</h1>

      <div className="relative">
        <button
          onClick={() => setShowDropdown((prev) => !prev)}
          className="bg-blue-600 text-white px-4 py-2 rounded-md flex items-center gap-2 hover:bg-blue-700"
        >
          Profile <FaChevronDown className="text-xs" />
        </button>

        {showDropdown && (
          <div className="absolute right-0 mt-2 w-40 bg-white border rounded shadow z-50">
            <button
              onClick={() => navigate('/admin/profile')}
              className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-sm"
            >
              My Profile
            </button>
            <button
              onClick={handleLogout}
              className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-sm text-red-600"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminTopbar;