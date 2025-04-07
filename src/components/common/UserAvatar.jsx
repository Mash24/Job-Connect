// File: /src/components/common/UserAvatar.jsx

import React, { useEffect, useRef, useState } from 'react';
import { auth, db } from '../../firebase/config';
import { doc, getDoc } from 'firebase/firestore';
import { signOut } from 'firebase/auth';
import { useAuthState } from 'react-firebase-hooks/auth';

const UserAvatar = ({ size = 'md' }) => {
  const [user] = useAuthState(auth);
  const [userData, setUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(true); // 🟡 Track loading state
  const [showMenu, setShowMenu] = useState(false);
  const avatarRef = useRef(null);

  // 🔁 Fetch user profile with retry
  useEffect(() => {
    let isMounted = true;
    const maxRetries = 3;
    const baseDelay = 1000;

    const fetchWithRetry = async (retryCount = 0) => {
      if (!user || !isMounted) return;

      try {
        const userRef = doc(db, 'users', user.uid);
        const snap = await getDoc(userRef);

        if (snap.exists()) {
          isMounted && setUserData(snap.data());
        } else {
          console.warn('🕵️ No profile found for:', user.uid);
          isMounted && setUserData({ firstname: 'User', photoURL: null, public: false });
        }
      } catch (error) {
        console.error(`🔥 Firestore fetch failed (${retryCount + 1}):`, error);

        if (error.code === 'permission-denied' && retryCount < maxRetries) {
          const delay = baseDelay * Math.pow(2, retryCount);
          await new Promise(resolve => setTimeout(resolve, delay));
          return fetchWithRetry(retryCount + 1);
        }

        isMounted &&
          setUserData({
            firstname: 'User',
            photoURL: null,
            public: false,
            error: true,
            errorMessage:
              error.code === 'permission-denied' ? 'Profile is private' : 'Failed to load profile',
          });
      } finally {
        isMounted && setIsLoading(false); // ✅ Done loading
      }
    };

    fetchWithRetry();
    return () => {
      isMounted = false;
    };
  }, [user]);

  // 📤 Click outside = close menu
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (avatarRef.current && !avatarRef.current.contains(e.target)) {
        setShowMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // 🚪 Log out
  const handleLogout = async () => {
    await signOut(auth);
    window.location.href = '/login';
  };

  const initials = (name) => name?.charAt(0)?.toUpperCase() || '?';
  const sizeClass = size === 'sm' ? 'w-8 h-8 text-sm' : 'w-10 h-10 text-lg';

  return (
    <div className="relative" ref={avatarRef}>
      {/* 👤 Avatar Button */}
      <div
        onClick={() => setShowMenu((prev) => !prev)}
        className="flex items-center space-x-2 cursor-pointer"
      >
        {userData?.photoURL ? (
          <img
            src={userData.photoURL}
            alt="User Avatar"
            className={`${sizeClass} rounded-full object-cover border border-gray-300`}
          />
        ) : (
          <div
            className={`${sizeClass} ${
              isLoading
                ? 'bg-gray-300'
                : userData?.error
                ? 'bg-red-500'
                : userData?.public === false
                ? 'bg-gray-400'
                : 'bg-blue-600'
            } text-white rounded-full flex items-center justify-center font-bold`}
          >
            {isLoading ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            ) : userData?.error ? (
              '!'
            ) : userData?.public === false ? (
              '🔒'
            ) : (
              initials(userData?.firstname)
            )}
          </div>
        )}
        <div className="relative">
          <span className="hidden md:inline text-sm font-medium">
            {userData?.error ? 'Error' : userData?.firstname || 'User'}
          </span>

          {/* 🔴 Error tooltip */}
          {userData?.error && (
            <div className="absolute left-full ml-2 w-48 bg-white p-2 rounded shadow-lg text-xs text-gray-700 border border-gray-200 z-50">
              <div className="font-medium text-red-500 mb-1">
                {userData.errorMessage || 'Failed to load profile'}
              </div>
              <button
                onClick={() => {
                  setUserData(null);
                  setIsLoading(true);
                  window.location.reload(); // Or call fetchWithRetry again if needed
                }}
                className="text-blue-500 hover:underline"
              >
                Try again
              </button>
            </div>
          )}
        </div>
      </div>

      {/* 🔽 Dropdown Menu */}
      {showMenu && (
        <div className="absolute top-12 right-0 bg-white border rounded shadow-md p-2 w-44 z-50 animate-fade-in">
          <a
            href="/profile"
            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
          >
            My Profile
          </a>
          <a
            href="/switch-role"
            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
          >
            Switch Role
          </a>
          <a
            href="/settings"
            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
          >
            Settings
          </a>
          <button
            onClick={handleLogout}
            className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
          >
            Logout
          </button>
        </div>
      )}
    </div>
  );
};

export default UserAvatar;
