import React, { useEffect, useState } from 'react';
import { auth, db } from '../../firebase/config';
import { onAuthStateChanged } from 'firebase/auth';
import { AlertTriangle } from 'lucide-react';
import useGlobalSettings from '../../hooks/useGlobalSettings'; // ✅ import your hook

const MaintenanceOverlay = () => {
  const { settings, loading } = useGlobalSettings();
  const [showOverlay, setShowOverlay] = useState(false);

  useEffect(() => {
    if (loading || !settings?.maintenanceMode) return;

    onAuthStateChanged(auth, async (user) => {
      let isSuperAdmin = false;

      if (user) {
        const userSnap = await db.collection('users').doc(user.uid).get();
        const role = userSnap.exists() ? userSnap.data().role : 'unknown';
        isSuperAdmin = role === 'super-admin';
      }

      if (!isSuperAdmin && settings.maintenanceMode) {
        const now = Date.now();
        const end = settings.maintenanceEndsIn?.seconds
          ? settings.maintenanceEndsIn.seconds * 1000
          : 0;

        if (now < end) setShowOverlay(true);
      }
    });
  }, [settings, loading]);

  if (!showOverlay) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 text-white text-center p-6">
      <div className="bg-slate-900 border border-yellow-500 rounded-xl p-8 max-w-md space-y-4 shadow-2xl">
        <AlertTriangle className="w-8 h-8 text-yellow-400 mx-auto" />
        <h2 className="text-2xl font-bold text-yellow-400">Site Under Maintenance</h2>
        <p className="text-sm text-gray-200">
          We're currently making improvements. Thanks for your patience!
        </p>
        <p className="text-xs text-gray-500">Job Connect © {new Date().getFullYear()}</p>
      </div>
    </div>
  );
};

export default MaintenanceOverlay;
