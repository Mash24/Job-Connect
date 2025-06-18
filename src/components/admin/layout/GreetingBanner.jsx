import React, { useMemo } from 'react';
import UserAvatar from '../../common/UserAvatar';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, db } from '../../../firebase/config';
import { doc, getDoc } from 'firebase/firestore';

const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 18) return 'Good afternoon';
  return 'Good evening';
};

const GreetingBanner = () => {
  const [user] = useAuthState(auth);
  const [adminName, setAdminName] = React.useState('');

  React.useEffect(() => {
    const fetchName = async () => {
      if (user) {
        const userRef = doc(db, 'users', user.uid);
        const snap = await getDoc(userRef);
        if (snap.exists()) {
          setAdminName(snap.data().firstname || 'Admin');
        }
      }
    };
    fetchName();
  }, [user]);

  const greeting = useMemo(getGreeting, []);

  return (
    <div className="flex items-center justify-between bg-white rounded-xl shadow p-6 mb-2">
      <div>
        <h2 className="text-2xl font-bold flex items-center gap-2">
          {greeting}, {adminName}!
        </h2>
        <p className="text-gray-500 mt-1">Here's a quick overview of today's activity.</p>
      </div>
      <UserAvatar size="md" />
    </div>
  );
};

export default GreetingBanner; 