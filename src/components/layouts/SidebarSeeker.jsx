import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Home, FileText, HelpCircle, LogOut, Menu, Bell, MessageCircle, SunMoon,} from 'lucide-react';
import { signOut } from 'firebase/auth';
import { auth, db } from '../../firebase/config';
import { doc, getDoc, collection, query, where, onSnapshot } from 'firebase/firestore';
import useTheme from '../../contexts/useTheme';
import UserAvatar from '../common/UserAvatar';

const SidebarSeeker = () => {
  const [userData, setUserData] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState(0);
  const [messages, setMessages] = useState(0);
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();

  // Fetch user info
  useEffect(() => {
    const fetchUser = async () => {
      const user = auth.currentUser;
      if (user) {
        const ref = doc(db, 'users', user.uid);
        const snap = await getDoc(ref);
        if (snap.exists()) setUserData(snap.data());
      }
    };
    fetchUser();
  }, []);

  // Fetch live counts for notifications and messages
  useEffect(() => {
    const user = auth.currentUser;
    if (!user) return;

    const notiRef = query(
      collection(db, 'notifications'),
      where('userId', '==', user.uid),
      where('read', '==', false)
    );
    const msgRef = query(
      collection(db, 'messages'),
      where('userId', '==', user.uid),
      where('read', '==', false)
    );

    const unsubNoti = onSnapshot(notiRef, (snap) => setNotifications(snap.size));
    const unsubMsg = onSnapshot(msgRef, (snap) => setMessages(snap.size));

    return () => {
      unsubNoti();
      unsubMsg();
    };
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
    navigate('/login');
  };

  // Sidebar menu items
  const menuItems = [
    { to: '/dashboard-seeker', icon: Home, label: 'Dashboard' },
    { to: '/dashboard-seeker/my-applications', icon: FileText, label: 'My Applications' },
    { to: '/dashboard-seeker/notifications', icon: Bell, label: 'Notifications', badge: notifications },
    { to: '/dashboard-seeker/messages', icon: MessageCircle, label: 'Messages', badge: messages },
    { to: '/dashboard-seeker/support', icon: HelpCircle, label: 'Support' },
  ];

  return (
    <>
      {/* Hamburger for mobile */}
      <button
        className="md:hidden fixed top-4 left-4 z-50 p-2 rounded bg-slate-900 text-white"
        onClick={() => setIsOpen(!isOpen)}
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 h-full w-64 bg-slate-900 text-white z-40 transform transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
          md:translate-x-0 md:static md:flex md:flex-col
        `}
      >
        {/* Profile */}
        <div className="flex flex-col items-center py-6 border-b border-slate-700">
          <UserAvatar size="lg" />
          {userData && (
            <div className="mt-3 text-center">
              <h3 className="text-lg font-semibold">{userData.firstname} {userData.lastname}</h3>
              <p className="text-sm text-gray-400">{userData.email}</p>
            </div>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 flex flex-col gap-1 px-4 mt-6">
          {menuItems.map(({ to, label, badge }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `flex items-center justify-between py-2 px-3 rounded hover:bg-slate-800 transition ${
                  isActive ? 'bg-slate-800' : ''
                }`
              }
              onClick={() => setIsOpen(false)}
            >
              <div className="flex items-center gap-3">
                {label}
              </div>
              {badge > 0 && (
                <span className="text-xs bg-red-600 rounded-full px-2 py-0.5">
                  {badge}
                </span>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Theme Toggle */}
        <div className="px-4 mb-4">
          <button
            onClick={toggleTheme}
            className="w-full flex items-center gap-3 py-2 px-3 rounded bg-gray-700 hover:bg-gray-600 transition"
          >
            <SunMoon className="w-5 h-5" />
            <span>{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
          </button>
        </div>

        {/* Logout */}
        <div className="p-4 border-t border-slate-700">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 text-sm w-full py-2 px-3 rounded bg-red-600 hover:bg-red-700 transition"
          >
            <LogOut className="w-5 h-5" />
            Logout
          </button>
        </div>
      </aside>
    </>
  );
};

export default SidebarSeeker;
