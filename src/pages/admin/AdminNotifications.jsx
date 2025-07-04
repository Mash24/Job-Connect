import React, { useEffect, useState } from 'react';
import { collection, getDocs, query } from 'firebase/firestore';
import { db, auth } from '../../firebase/config';
import { useNavigate } from 'react-router-dom';

import AdminNotificationsSystem from '../../components/admin/notifications/AdminNotificationsSystem';

const AdminNotifications = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAdmin = async () => {
      const currentUser = auth.currentUser;
      if (!currentUser) return navigate('/login');

      const userSnap = await getDocs(query(collection(db, 'users')));
      const currentDoc = userSnap.docs.find(doc => doc.id === currentUser.uid);

      if (currentDoc?.data().role === 'super-admin') {
        setIsAdmin(true);
      } else {
        navigate('/login');
      }
      setLoading(false);
    };

    checkAdmin();
  }, [navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-500">Loading notifications system...</p>
        </div>
      </div>
    );
  }

  if (!isAdmin) return null;

  return <AdminNotificationsSystem />;
};

export default AdminNotifications; 