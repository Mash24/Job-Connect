import React, { useEffect, useState } from 'react';
import { auth, db } from '../../firebase/config';
import { doc, getDoc } from 'firebase/firestore';
import { UserCircle } from 'lucide-react'; // fallback icon
import { signOut } from 'firebase/auth';

const UserAvatar = () => {
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      const user = auth.currentUser;
      if (!user) return;

      const userDocRef = doc(db, 'users', user.uid);
      const userSnap = await getDoc(userDocRef);
      if (userSnap.exists()) {
        setUserData(userSnap.data());
      }
    };

    fetchUser();
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
    window.location.href = '/login';
  };

  const initials = (name) => {
    return name?.charAt(0)?.toUpperCase() || '?';
  };

  return (
    <div className="relative">
      <div className="flex items-center space-x-2 cursor-pointer group">
        {userData?.photoURL ? (
          <img
            src={userData.photoURL}
            alt="User Avatar"
            className="w-10 h-10 rounded-full object-cover border border-gray-300"
          />
        ) : (
          <div className="w-10 h-10 bg-blue-500 text-white rounded-full flex items-center justify-center text-lg font-bold">
            {initials(userData?.firstname)}
          </div>
        )}
        <span className="hidden md:inline text-sm font-medium">
          {userData?.firstname || 'User'}
        </span>

        {/* Dropdown Menu - you can replace this with real dropdown later
        <div className="absolute top-12 right-0 bg-white border rounded shadow-md p-2 hidden group-hover:block">
          <button
            onClick={handleLogout}
            className="block w-full text-left px-4 py-2 hover:bg-gray-100"
          >
            Logout
          </button>
        </div> */}
      </div>
    </div>
  );
};

export default UserAvatar;
