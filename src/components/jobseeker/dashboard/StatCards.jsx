import React, { useEffect, useState } from 'react';
import { FaBriefcase, FaClock, FaBookmark, FaEnvelope } from 'react-icons/fa';
import { auth, db } from '../../../firebase/config';
import { doc, getDoc } from 'firebase/firestore';

const StatCards = () => {
  const [stats, setStats] = useState({
    applications: 0,
    pending: 0,
    messages: 0,
    saved: 0,
  });

  // Fetch stats from Firestore on mount
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const user = auth.currentUser;
        if (!user) return;

        const seekerRef = doc(db, 'jobSeekers', user.uid);
        const docSnap = await getDoc(seekerRef);

        if (docSnap.exists()) {
          const data = docSnap.data();

          setStats({
            applications: data.stats?.applications || 0,
            pending: data.stats?.pending || 0,
            messages: data.stats?.messages || 0,
            saved: data.stats?.saved || 0,
          });
        }
      } catch (err) {
        console.error('Error fetching stats:', err);
      }
    };

    fetchStats();
  }, []);

  // Card data structure
  const cards = [
    {
      label: 'Total Applications',
      value: stats.applications,
      icon: <FaBriefcase className="text-blue-600 text-2xl" />,
      color: 'bg-blue-50 border-blue-200',
    },
    {
      label: 'Pending Applications',
      value: stats.pending,
      icon: <FaClock className="text-yellow-600 text-2xl" />,
      color: 'bg-yellow-50 border-yellow-200',
    },
    {
      label: 'Saved Jobs',
      value: stats.saved,
      icon: <FaBookmark className="text-green-600 text-2xl" />,
      color: 'bg-green-50 border-green-200',
    },
    {
      label: 'Messages',
      value: stats.messages,
      icon: <FaEnvelope className="text-purple-600 text-2xl" />,
      color: 'bg-purple-50 border-purple-200',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
      {cards.map((card, idx) => (
        <div
          key={idx}
          className={`flex items-center gap-4 p-4 border rounded-xl shadow-sm hover:shadow-md transition-all duration-200 ${card.color}`}
        >
          <div className="p-3 rounded-full bg-white shadow">{card.icon}</div>
          <div>
            <p className="text-sm text-gray-500">{card.label}</p>
            <h2 className="text-xl font-bold text-gray-800">{card.value}</h2>
          </div>
        </div>
      ))}
    </div>
  );
};

export default StatCards;