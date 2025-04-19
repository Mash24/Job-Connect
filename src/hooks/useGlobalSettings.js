import { useEffect, useState } from 'react';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase/config';

const useGlobalSettings = () => {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const ref = doc(db, 'settings', 'global');

    const unsubscribe = onSnapshot(ref, (docSnap) => {
      if (docSnap.exists()) {
        setSettings(docSnap.data());
      }
      setLoading(false);
    }, (error) => {
      console.error('Error fetching global settings:', error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return { settings, loading };
};

export default useGlobalSettings;