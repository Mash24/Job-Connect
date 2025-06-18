import React from 'react';
import { Bell, LogOut, Settings, User, Search } from 'lucide-react';
import UserAvatar from '../common/UserAvatar';
import { Menu, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { signOut } from 'firebase/auth';
import { auth } from '../../firebase/config';
import { useNavigate } from 'react-router-dom';
// import ThemeToggle from '../common/ThemeToggle';

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
        {/* <ThemeToggle /> */}
        <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
          <Bell className="w-5 h-5 text-gray-600 dark:text-gray-300" />
        </button>

        {/* Avatar with Dropdown Menu */}
        <Menu as="div" className="relative">
          <Menu.Button className="flex items-center space-x-2 focus:outline-none">
            <UserAvatar size="sm" />
          </Menu.Button>

          <Transition
            as={Fragment}
            enter="transition ease-out duration-100"
            enterFrom="transform opacity-0 scale-95"
            enterTo="transform opacity-100 scale-100"
            leave="transition ease-in duration-75"
            leaveFrom="transform opacity-100 scale-100"
            leaveTo="transform opacity-0 scale-95"
          >
            <Menu.Items className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 ring-1 ring-black ring-opacity-5 focus:outline-none">
              <Menu.Item>
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
              </Menu.Item>
              <Menu.Item>
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
              </Menu.Item>
              <Menu.Item>
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
              </Menu.Item>
            </Menu.Items>
          </Transition>
        </Menu>
      </div>
    </div>
  );
};

export default TopBar;