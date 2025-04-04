import React from 'react';
import { Bell, LogOut, Settings, User } from 'lucide-react';
import UserAvatar from '../common/UserAvatar';
import { Menu, MenuButton, MenuItems, MenuItem } from '@headlessui/react';
import { signOut } from 'firebase/auth';
import { auth } from '../../firebase/config';
import { useNavigate } from 'react-router-dom';

const TopBar = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut(auth);
    navigate('/login');
  };

  return (
    <div className="bg-white shadow px-6 py-3 flex items-center justify-between sticky top-0 z-30">
      {/* Left Side - Page Title */}
      <h1 className="text-xl font-semibold text-gray-800">Dashboard</h1>

      {/* Right Side - Actions */}
      <div className="flex items-center gap-4">
        {/* Notifications */}
        <button className="relative text-gray-500 hover:text-gray-700">
          <Bell className="w-5 h-5" />
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full px-1">
            3
          </span>
        </button>

        {/* Avatar with Dropdown Menu */}
        <Menu as="div" className="relative">
          <MenuButton className="flex items-center space-x-2 focus:outline-none">
            <UserAvatar size="sm" /> {/* ✅ Avatar component */}
          </MenuButton>

          <MenuItems className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 ring-1 ring-black ring-opacity-5 focus:outline-none">
            <MenuItem>
              {({ active }) => (
                <button
                  onClick={() => navigate('/profile')}
                  className={`${
                    active ? 'bg-gray-100' : ''
                  } flex items-center gap-2 px-4 py-2 text-sm text-gray-700 w-full`}
                >
                  <User className="w-4 h-4" />
                  View Profile
                </button>
              )}
            </MenuItem>
            <MenuItem>
              {({ active }) => (
                <button
                  onClick={() => navigate('/settings')}
                  className={`${
                    active ? 'bg-gray-100' : ''
                  } flex items-center gap-2 px-4 py-2 text-sm text-gray-700 w-full`}
                >
                  <Settings className="w-4 h-4" />
                  Settings
                </button>
              )}
            </MenuItem>
            <MenuItem>
              {({ active }) => (
                <button
                  onClick={handleLogout}
                  className={`${
                    active ? 'bg-gray-100' : ''
                  } flex items-center gap-2 px-4 py-2 text-sm text-red-600 w-full`}
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              )}
            </MenuItem>
          </MenuItems>
        </Menu>
      </div>
    </div>
  );
};

export default TopBar;