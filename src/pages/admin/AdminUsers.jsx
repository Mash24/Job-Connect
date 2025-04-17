// File: /src/pages/admin/AdminUsers.jsx
import React, { useEffect, useState } from 'react';
import { collection, getDocs, query } from 'firebase/firestore';
import { db, auth } from '../../firebase/config';
import { useNavigate } from 'react-router-dom';

import UserTable from '../../components/admin/tables/UserTable';
import RoleBadge from '../../components/admin/shared/RoleBadge';

const AdminUsers = () => {
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [filter, setFilter] = useState('all');
  const [isAdmin, setIsAdmin] = useState(false);
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
    };

    checkAdmin();
  }, [navigate]);

  useEffect(() => {
    const fetchUsers = async () => {
      const q = query(collection(db, 'users'));
      const snapshot = await getDocs(q);

      const list = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setUsers(list);
      setLoading(false);
    };

    fetchUsers();
  }, []);

  useEffect(() => {
    if (filter === 'all') {
      setFiltered(users);
    } else {
      setFiltered(users.filter(user => user.role === filter));
    }
  }, [filter, users]);

  if (!isAdmin) return null;

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">👥 Manage Users</h2>
        <div className="space-x-2">
          {['all', 'job-seeker', 'employer', 'super-admin'].map(role => (
            <button
              key={role}
              onClick={() => setFilter(role)}
              className={`px-3 py-1 rounded text-sm border ${
                filter === role ? 'bg-blue-600 text-white' : 'bg-white text-gray-700'
              }`}
            >
              {role === 'all' ? 'All Users' : <RoleBadge role={role} />}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <p className="text-gray-500">Loading users...</p>
      ) : (
        <UserTable users={filtered} />
      )}
    </div>
  );
};

export default AdminUsers;
