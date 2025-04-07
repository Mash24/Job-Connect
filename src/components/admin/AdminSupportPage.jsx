// File: /src/pages/admin/AdminSupportPage.jsx
import React, { useEffect, useState } from 'react';
import { auth, db } from '../../firebase/config';
import { doc, getDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import SupportInbox from '../../components/admin/support/SupportInbox';

const AdminSupportPage = () => {
  const [isAdmin, setIsAdmin] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const user = auth.currentUser;
    if (!user) return navigate('/login');

    const checkAdmin = async () => {
      const userRef = doc(db, 'users', user.uid);
      const snap = await getDoc(userRef);
      if (snap.exists() && snap.data().role === 'super-admin') {
        setIsAdmin(true);
      } else {
        setIsAdmin(false);
      }
    };

    checkAdmin();
  }, [navigate]);

  if (isAdmin === null) return <p>Loading...</p>;
  if (isAdmin === false) return <p className="text-red-500 text-center mt-10">❌ Access denied: Admins only.</p>;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-2xl font-bold mb-4">Admin Support Panel</h1>
      <SupportInbox />
    </div>
  );
};

export default AdminSupportPage;
