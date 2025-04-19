import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { auth, db } from '../firebase/config';
import { doc, getDoc } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';

const AdminRoute = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const userRef = doc(db, 'users', user.uid);
          const snap = await getDoc(userRef);

          if (snap.exists() && snap.data().role === 'super-admin') {
            setIsAdmin(true);
          }
        } catch (err) {
          console.error('Error checking admin role:', err);
        }
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) return <div className="text-center mt-10">Loading...</div>;
  if (!isAdmin) return <div className="text-center mt-10 text-red-500">❌ Access denied: Admins only</div>;

  return children;
};

export default AdminRoute;
