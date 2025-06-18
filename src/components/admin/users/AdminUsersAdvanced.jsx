import React, { useState, useEffect } from 'react';
import { collection, getDocs, query, where, orderBy, limit, startAfter, updateDoc, doc, writeBatch, serverTimestamp } from 'firebase/firestore';
import { db, auth } from '../../../firebase/config';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, Filter, Download, Send, CheckCircle, XCircle, RefreshCw, FileText } from 'lucide-react';

import UserFilterPanel from './UserFilterPanel';
import UserListTable from './UserListTable';
import UserBulkActions from './UserBulkActions';
import UserProfileHoverCard from './UserProfileHoverCard';

const AdminUsersAdvanced = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedUsers, setSelectedUsers] = useState(new Set());
  const [filters, setFilters] = useState({
    role: 'all',
    status: 'all',
    dateRange: 'all',
    location: '',
    search: ''
  });
  const [pagination, setPagination] = useState({
    currentPage: 1,
    pageSize: 20,
    hasMore: true,
    lastDoc: null
  });
  const [hoveredUser, setHoveredUser] = useState(null);
  const [currentAdminRole, setCurrentAdminRole] = useState('super-admin');
  const [savedFilters, setSavedFilters] = useState([
    { name: 'Top Employers', filters: { role: 'employer', status: 'active' }, role: 'super-admin' },
    { name: 'New Users', filters: { dateRange: '7days' }, role: 'super-admin' },
    { name: 'Inactive Users', filters: { status: 'inactive' }, role: 'super-admin' },
    { name: 'Job Seekers', filters: { role: 'job-seeker' }, role: 'admin' },
    { name: 'Recent Signups', filters: { dateRange: '30days' }, role: 'admin' }
  ]);

  // Fetch users with pagination
  const fetchUsers = async (isInitial = false) => {
    try {
      setLoading(true);
      let q = query(collection(db, 'users'), orderBy('createdAt', 'desc'), limit(pagination.pageSize));
      
      if (!isInitial && pagination.lastDoc) {
        q = query(q, startAfter(pagination.lastDoc));
      }

      const snapshot = await getDocs(q);
      const newUsers = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      
      if (isInitial) {
        setUsers(newUsers);
      } else {
        setUsers(prev => [...prev, ...newUsers]);
      }

      setPagination(prev => ({
        ...prev,
        hasMore: snapshot.docs.length === pagination.pageSize,
        lastDoc: snapshot.docs[snapshot.docs.length - 1] || null
      }));
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  // Apply filters
  const applyFilters = (userList, filterSettings) => {
    return userList.filter(user => {
      // Role filter
      if (filterSettings.role !== 'all' && user.role !== filterSettings.role) {
        return false;
      }

      // Status filter
      if (filterSettings.status !== 'all' && user.status !== filterSettings.status) {
        return false;
      }

      // Date range filter
      if (filterSettings.dateRange !== 'all') {
        const userDate = new Date(user.createdAt?.toDate?.() || user.createdAt);
        const now = new Date();
        const daysDiff = (now - userDate) / (1000 * 60 * 60 * 24);

        switch (filterSettings.dateRange) {
          case '7days':
            if (daysDiff > 7) return false;
            break;
          case '30days':
            if (daysDiff > 30) return false;
            break;
          case '90days':
            if (daysDiff > 90) return false;
            break;
        }
      }

      // Location filter
      if (filterSettings.location && user.location) {
        if (!user.location.toLowerCase().includes(filterSettings.location.toLowerCase())) {
          return false;
        }
      }

      // Search filter
      if (filterSettings.search) {
        const searchTerm = filterSettings.search.toLowerCase();
        const fullName = `${user.firstname || ''} ${user.lastname || ''}`.toLowerCase();
        const email = (user.email || '').toLowerCase();
        
        if (!fullName.includes(searchTerm) && !email.includes(searchTerm)) {
          return false;
        }
      }

      return true;
    });
  };

  // Handle filter changes
  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    setPagination(prev => ({ ...prev, currentPage: 1 }));
  };

  // Save filter preset
  const saveFilterPreset = (name) => {
    const newPreset = { 
      name, 
      filters: { ...filters },
      role: currentAdminRole 
    };
    setSavedFilters(prev => [...prev, newPreset]);
  };

  // Load filter preset
  const loadFilterPreset = (preset) => {
    setFilters(preset.filters);
  };

  // Export to CSV
  const exportToCSV = () => {
    if (filteredUsers.length === 0) {
      alert('No users to export');
      return;
    }

    const headers = [
      'ID',
      'First Name',
      'Last Name', 
      'Email',
      'Role',
      'Status',
      'Location',
      'Created At',
      'Last Login'
    ];

    const csvData = filteredUsers.map(user => [
      user.id,
      user.firstname || user.firstName || '',
      user.lastname || user.lastName || '',
      user.email || '',
      user.role || '',
      user.status || 'active',
      user.location || '',
      formatDate(user.createdAt),
      formatDate(user.lastLogin)
    ]);

    const csvContent = [
      headers.join(','),
      ...csvData.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `users_export_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const formatDate = (date) => {
    if (!date) return '';
    const dateObj = date?.toDate?.() || new Date(date);
    return dateObj.toISOString();
  };

  // Bulk actions
  const handleBulkAction = async (action) => {
    if (selectedUsers.size === 0) return;

    try {
      const batch = writeBatch(db);
      const selectedUserIds = Array.from(selectedUsers);

      selectedUserIds.forEach(userId => {
        const userRef = doc(db, 'users', userId);
        const user = users.find(u => u.id === userId);
        
        switch (action) {
          case 'approve':
            batch.update(userRef, { status: 'active' });
            break;
          case 'deactivate':
            batch.update(userRef, { status: 'inactive' });
            break;
          case 'delete':
            batch.delete(userRef);
            break;
        }
      });

      // Add log entry
      const logRef = doc(collection(db, 'logs'));
      batch.set(logRef, {
        action: 'bulk-update',
        type: action,
        performedBy: auth.currentUser?.email || 'admin',
        target: `${selectedUsers.size} users`,
        details: `Bulk ${action} action performed`,
        timestamp: serverTimestamp(),
      });

      await batch.commit();

      // Update local state
      setUsers(prev => prev.filter(user => !selectedUserIds.includes(user.id)));
      setSelectedUsers(new Set());
      
      alert(`✅ Successfully ${action}d ${selectedUsers.size} users`);
    } catch (error) {
      console.error('Error performing bulk action:', error);
      alert('❌ Failed to perform bulk action');
    }
  };

  // Select/deselect all users
  const handleSelectAll = (checked) => {
    if (checked) {
      setSelectedUsers(new Set(filteredUsers.map(user => user.id)));
    } else {
      setSelectedUsers(new Set());
    }
  };

  // Select individual user
  const handleSelectUser = (userId, checked) => {
    const newSelected = new Set(selectedUsers);
    if (checked) {
      newSelected.add(userId);
    } else {
      newSelected.delete(userId);
    }
    setSelectedUsers(newSelected);
  };

  // Load more users
  const loadMore = () => {
    if (pagination.hasMore && !loading) {
      fetchUsers(false);
    }
  };

  // Get role-based saved filters
  const getRoleBasedFilters = () => {
    return savedFilters.filter(preset => 
      preset.role === currentAdminRole || preset.role === 'super-admin'
    );
  };

  // Initial load
  useEffect(() => {
    fetchUsers(true);
  }, []);

  // Apply filters when users or filters change
  useEffect(() => {
    const filtered = applyFilters(users, filters);
    setFilteredUsers(filtered);
  }, [users, filters]);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                <Users className="w-8 h-8 text-blue-600" />
                Advanced User Management
              </h1>
              <p className="mt-2 text-gray-600">
                Manage users with advanced filtering, bulk actions, and real-time updates
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => fetchUsers(true)}
                disabled={loading}
                className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
              >
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                Refresh
              </button>
              <button
                onClick={exportToCSV}
                disabled={filteredUsers.length === 0}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
              >
                <FileText className="w-4 h-4" />
                Export CSV
              </button>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Filter Panel */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-1"
          >
            <UserFilterPanel
              filters={filters}
              onFilterChange={handleFilterChange}
              savedFilters={getRoleBasedFilters()}
              onSavePreset={saveFilterPreset}
              onLoadPreset={loadFilterPreset}
            />
          </motion.div>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-6">
            {/* Bulk Actions */}
            <AnimatePresence>
              {selectedUsers.size > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                >
                  <UserBulkActions
                    selectedCount={selectedUsers.size}
                    onBulkAction={handleBulkAction}
                    onClearSelection={() => setSelectedUsers(new Set())}
                  />
                </motion.div>
              )}
            </AnimatePresence>

            {/* User Table */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <UserListTable
                users={filteredUsers}
                selectedUsers={selectedUsers}
                onSelectUser={handleSelectUser}
                onSelectAll={handleSelectAll}
                onUserHover={setHoveredUser}
                loading={loading}
                onLoadMore={loadMore}
                hasMore={pagination.hasMore}
                filters={filters}
              />
            </motion.div>
          </div>
        </div>

        {/* Hover Card */}
        <AnimatePresence>
          {hoveredUser && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="fixed z-50"
              style={{
                left: hoveredUser.x + 10,
                top: hoveredUser.y - 10
              }}
            >
              <UserProfileHoverCard user={hoveredUser.user} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default AdminUsersAdvanced; 