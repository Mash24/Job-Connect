// ✅ File: src/hooks/useAdminCheck.js
import { useEffect, useState } from 'react';
import { auth, db } from '../firebase/config';
import { doc, getDoc } from 'firebase/firestore';

const useAdminCheck = () => {
  const [isAdmin, setIsAdmin] = useState(null);

  useEffect(() => {
    const unsub = auth.onAuthStateChanged(async (user) => {
      if (!user) return setIsAdmin(false);

      const docSnap = await getDoc(doc(db, 'users', user.uid));
      if (docSnap.exists() && docSnap.data().role === 'super-admin') {
        setIsAdmin(true);
      } else {
        setIsAdmin(false);
      }
    });

    return () => unsub();
  }, []);

  return isAdmin;
};

export default useAdminCheck;
