// File: /src/components/employer/sub_components_employer/EmployerStatCards.jsx

import React, { useEffect, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { collection, onSnapshot, query, where } from 'firebase/firestore';
import { Briefcase, FileText, Mail, Heart } from 'lucide-react';
import { db, auth } from '../../../firebase/config';

const EmployerStatCards = () => {
  const [user] = useAuthState(auth);
  const [stats, setStats] = useState({
    jobs: 0,
    applications: 0,
    messages: 0,
    saved: 0,
  });

  useEffect(() => {
    if (!user) return;

    // Real-time count for jobs posted
    const jobsQuery = query(collection(db, 'jobs'), where('userId', '==', user.uid));
    const unsubJobs = onSnapshot(jobsQuery, (snap) => {
      setStats((prev) => ({ ...prev, jobs: snap.size }));
    });

    // Real-time count for applications received
    const appsQuery = query(collection(db, 'applications'), where('employerId', '==', user.uid));
    const unsubApps = onSnapshot(appsQuery, (snap) => {
      setStats((prev) => ({ ...prev, applications: snap.size }));
    });

    // Real-time count for messages
    const messagesQuery = query(collection(db, 'messages'), where('recipientId', '==', user.uid));
    const unsubMessages = onSnapshot(messagesQuery, (snap) => {
      setStats((prev) => ({ ...prev, messages: snap.size }));
    });

    // Real-time count for saved jobs by seekers
    const savedQuery = query(collection(db, 'savedJobs'), where('employerId', '==', user.uid));
    const unsubSaved = onSnapshot(savedQuery, (snap) => {
      setStats((prev) => ({ ...prev, saved: snap.size }));
    });

    return () => {
      unsubJobs();
      unsubApps();
      unsubMessages();
      unsubSaved();
    };
  }, [user]);

  const cardData = [
    {
      title: 'Jobs You have Posted',
      value: stats.jobs,
      icon: <Briefcase size={20} className="text-blue-500" />,
    },
    {
      title: 'Applications Received',
      value: stats.applications,
      icon: <FileText size={20} className="text-green-500" />,
    },
    {
      title: 'Messages',
      value: stats.messages,
      icon: <Mail size={20} className="text-purple-500" />,
    },
    {
      title: 'Saved by Job Seekers',
      value: stats.saved,
      icon: <Heart size={20} className="text-pink-500" />,
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
      {cardData.map((card, idx) => (
        <div
          key={idx}
          className="bg-white p-6 rounded-lg shadow hover:shadow-md transition duration-300"
        >
          <div className="flex justify-between items-center mb-2">
            <h4 className="text-sm text-gray-500">{card.title}</h4>
            {card.icon}
          </div>
          <p className="text-3xl font-bold text-gray-800">{card.value}</p>
        </div>
      ))}
    </div>
  );
};

export default EmployerStatCards;
