import React, { useEffect, useState } from 'react';
import { auth, db } from '../../../firebase/config'; // Adjust the import path as necessary
import { doc, getDoc } from 'firebase/firestore';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';

const UserWelcomeBanner = () => {
  const [firstName, setFirstName] = useState('');

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const user = auth.currentUser;
        if (!user) return;

        const userRef = doc(db, 'users', user.uid);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
          setFirstName(userSnap.data().firstname);
        }
      } catch (err) {
        console.error('Failed to fetch user name:', err);
      }
    };

    fetchUserData();
  }, []);

  return (
    <motion.div 
      className="relative bg-gradient-to-br from-blue-400 to-indigo-500 text-white p-8 rounded-2xl shadow-lg overflow-hidden"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="absolute -top-6 -left-6 opacity-20">
        <Sparkles size={100} strokeWidth={0.8} />
      </div>
      <h2 className="text-3xl font-bold tracking-wide">
        Welcome back{firstName ? `, ${firstName}` : ''} 👋
      </h2>
      <p className="text-sm mt-2 opacity-90">
        Here’s what’s happening with your profile today.
      </p>
    </motion.div>
  );
};

export default UserWelcomeBanner;