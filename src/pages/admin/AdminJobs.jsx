// File: /src/pages/admin/AdminJobs.jsx

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, db } from '../../firebase/config';
import { collection, getDocs, query, where } from 'firebase/firestore';

import JobTable from '../../components/admin/tables/JobTable';

const AdminJobs = () => {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [filter, setFilter] = useState('all');
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAdmin = async () => {
      const user = auth.currentUser;
      if (!user) return navigate('/login');

      const userDoc = await getDocs(query(collection(db, 'users')));
      const adminDoc = userDoc.docs.find(doc => doc.id === user.uid);
      if (adminDoc?.data()?.role === 'super-admin') {
        setIsAdmin(true);
      } else {
        navigate('/login');
      }
    };

    checkAdmin();
  }, [navigate]);

  useEffect(() => {
    const fetchJobs = async () => {
      const q = query(collection(db, 'jobs'));
      const snap = await getDocs(q);
      const list = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setJobs(list);
      setLoading(false);
    };

    fetchJobs();
  }, []);

  useEffect(() => {
    if (filter === 'all') {
      setFiltered(jobs);
    } else {
      setFiltered(jobs.filter(job => job.status === filter));
    }
  }, [filter, jobs]);

  if (!isAdmin) return null;

  return (
    <div className="flex min-h-screen bg-gray-50">
      <div className="flex-1">
        <div className="p-6 space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">💼 Manage Job Listings</h2>
            <div className="space-x-2">
              {['all', 'pending', 'approved', 'rejected'].map(status => (
                <button
                  key={status}
                  onClick={() => setFilter(status)}
                  className={`px-3 py-1 rounded text-sm border ${
                    filter === status ? 'bg-blue-600 text-white' : 'bg-white text-gray-700'
                  }`}
                >
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {loading ? (
            <p className="text-gray-500">Loading jobs...</p>
          ) : (
            <JobTable jobs={filtered} />
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminJobs;
