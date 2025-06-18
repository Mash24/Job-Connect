// ✅ File: src/pages/admin/AdminUsers.jsx
import React, { useEffect, useState } from 'react';
import { collection, getDocs, query, updateDoc, doc, addDoc, serverTimestamp } from 'firebase/firestore';
import { db, auth } from '../../firebase/config';
import { useNavigate } from 'react-router-dom';

import AdminUsersAdvanced from '../../components/admin/users/AdminUsersAdvanced';
import UserTable from '../../components/admin/tables/UserTable';
import RoleBadge from '../../components/admin/shared/RoleBadge';

const AdminUsers = () => {
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [filter, setFilter] = useState('all');
  const [isAdmin, setIsAdmin] = useState(false);
  const [useAdvancedView, setUseAdvancedView] = useState(true);
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

  const handleRoleUpdate = async (userId, newRole, email) => {
    try {
      const ref = doc(db, 'users', userId);
      await updateDoc(ref, { role: newRole });

      await addDoc(collection(db, 'logs'), {
        action: 'updated',
        type: 'role-change',
        performedBy: auth.currentUser?.email || 'admin',
        target: email,
        details: `Role changed to '${newRole}'`,
        timestamp: serverTimestamp(),
      });

      alert('✅ Role updated successfully');
    } catch (error) {
      console.error('Error updating role:', error);
      alert('❌ Failed to update role');
    }
  };

  if (!isAdmin) return null;

  // Use the new advanced view by default
  if (useAdvancedView) {
    return <AdminUsersAdvanced />;
  }

  // Fallback to the original simple view
  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">👥 Manage Users</h2>
        <div className="flex items-center gap-4">
          <div className="space-x-2">
            {['all', 'job-seeker', 'employer', 'super-admin'].map(role => (
              <button
                key={role}
                onClick={() => setFilter(role)}
                className={`px-3 py-1 rounded text-sm border ${
                  filter === role ? 'bg-blue-600 text-white' : 'bg-white text-gray-700'
                }`}
              >
                {role === 'all'
                  ? 'All Users'
                  : role.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
              </button>
            ))}
          </div>
          <button
            onClick={() => setUseAdvancedView(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Switch to Advanced View
          </button>
        </div>
      </div>

      {loading ? (
        <p className="text-gray-500">Loading users...</p>
      ) : (
        <UserTable users={filtered} onUpdateRole={handleRoleUpdate} />
      )}
    </div>
  );
};

export default AdminUsers;
