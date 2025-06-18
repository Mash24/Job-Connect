import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronUp, User, Mail, Calendar, MapPin, CheckCircle, XCircle, Search, Filter } from 'lucide-react';
import RoleBadge from '../shared/RoleBadge';
import StatusBadge from '../shared/StatusBadge';

const UserListTable = ({ 
  users, 
  selectedUsers, 
  onSelectUser, 
  onSelectAll, 
  onUserHover, 
  loading, 
  onLoadMore, 
  hasMore,
  filters 
}) => {
  const [sortConfig, setSortConfig] = useState({
    key: 'createdAt',
    direction: 'desc'
  });

  const handleSort = (key) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const sortedUsers = [...users].sort((a, b) => {
    let aValue = a[sortConfig.key];
    let bValue = b[sortConfig.key];

    // Handle date sorting
    if (sortConfig.key === 'createdAt') {
      aValue = aValue?.toDate?.() || new Date(aValue);
      bValue = bValue?.toDate?.() || new Date(bValue);
    }

    // Handle string sorting
    if (typeof aValue === 'string') {
      aValue = aValue.toLowerCase();
      bValue = bValue.toLowerCase();
    }

    if (aValue < bValue) {
      return sortConfig.direction === 'asc' ? -1 : 1;
    }
    if (aValue > bValue) {
      return sortConfig.direction === 'asc' ? 1 : -1;
    }
    return 0;
  });

  const formatDate = (date) => {
    if (!date) return 'N/A';
    const dateObj = date?.toDate?.() || new Date(date);
    return dateObj.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getFullName = (user) => {
    const firstName = user.firstname || user.firstName || '';
    const lastName = user.lastname || user.lastName || '';
    return `${firstName} ${lastName}`.trim() || 'N/A';
  };

  const handleRowHover = (user, event) => {
    onUserHover({
      user,
      x: event.clientX,
      y: event.clientY
    });
  };

  const handleRowLeave = () => {
    onUserHover(null);
  };

  const SortIcon = ({ columnKey }) => {
    if (sortConfig.key !== columnKey) {
      return <ChevronDown className="w-4 h-4 text-gray-400" />;
    }
    return sortConfig.direction === 'asc' 
      ? <ChevronUp className="w-4 h-4 text-blue-600" />
      : <ChevronDown className="w-4 h-4 text-blue-600" />;
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (filters?.role !== 'all') count++;
    if (filters?.status !== 'all') count++;
    if (filters?.dateRange !== 'all') count++;
    if (filters?.location) count++;
    if (filters?.search) count++;
    return count;
  };

  const clearAllFilters = () => {
    // This would be handled by the parent component
    window.location.reload();
  };

  if (users.length === 0 && !loading) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center"
      >
        <div className="max-w-md mx-auto">
          {/* Lottie-style animated illustration */}
          <motion.div 
            className="w-32 h-32 mx-auto mb-6 bg-gradient-to-br from-blue-50 to-purple-50 rounded-full flex items-center justify-center"
            animate={{ 
              scale: [1, 1.05, 1],
              rotate: [0, 5, -5, 0]
            }}
            transition={{ 
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <motion.div
              animate={{ 
                y: [0, -10, 0],
                opacity: [0.7, 1, 0.7]
              }}
              transition={{ 
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              <Search className="w-16 h-16 text-blue-400" />
            </motion.div>
          </motion.div>

          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            {getActiveFiltersCount() > 0 ? 'No users found' : 'No users yet'}
          </h3>
          
          <p className="text-gray-500 mb-6">
            {getActiveFiltersCount() > 0 
              ? 'Try adjusting your filters or search criteria to find users.'
              : 'Users will appear here once they register on the platform.'
            }
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            {getActiveFiltersCount() > 0 && (
              <button
                onClick={clearAllFilters}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Clear All Filters
              </button>
            )}
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Refresh Page
            </button>
          </div>

          {/* Filter summary */}
          {getActiveFiltersCount() > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mt-6 p-3 bg-gray-50 rounded-lg"
            >
              <p className="text-sm text-gray-600">
                Active filters: {getActiveFiltersCount()}
              </p>
            </motion.div>
          )}
        </div>
      </motion.div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={selectedUsers.size === users.length && users.length > 0}
                    onChange={(e) => onSelectAll(e.target.checked)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                </label>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                User
              </th>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort('email')}
              >
                <div className="flex items-center gap-1">
                  <Mail className="w-4 h-4" />
                  Email
                  <SortIcon columnKey="email" />
                </div>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Role
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort('createdAt')}
              >
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  Joined
                  <SortIcon columnKey="createdAt" />
                </div>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Location
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            <AnimatePresence>
              {sortedUsers.map((user, index) => (
                <motion.tr
                  key={user.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ delay: index * 0.05 }}
                  className="hover:bg-gray-50 cursor-pointer"
                  onMouseEnter={(e) => handleRowHover(user, e)}
                  onMouseLeave={handleRowLeave}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <input
                      type="checkbox"
                      checked={selectedUsers.has(user.id)}
                      onChange={(e) => onSelectUser(user.id, e.target.checked)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      onClick={(e) => e.stopPropagation()}
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <div className="h-10 w-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white font-medium">
                          {getFullName(user).charAt(0).toUpperCase()}
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {getFullName(user)}
                        </div>
                        <div className="text-sm text-gray-500">
                          ID: {user.id.slice(0, 8)}...
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{user.email}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <RoleBadge role={user.role} />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <StatusBadge status={user.status || 'active'} />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(user.createdAt)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center text-sm text-gray-500">
                      <MapPin className="w-4 h-4 mr-1" />
                      {user.location || 'N/A'}
                    </div>
                  </td>
                </motion.tr>
              ))}
            </AnimatePresence>
          </tbody>
        </table>
      </div>

      {/* Load More */}
      {hasMore && (
        <div className="px-6 py-4 border-t border-gray-200">
          <button
            onClick={onLoadMore}
            disabled={loading}
            className="w-full px-4 py-2 text-sm text-blue-600 bg-blue-50 hover:bg-blue-100 disabled:opacity-50 rounded-lg flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                Loading...
              </>
            ) : (
              'Load More Users'
            )}
          </button>
        </div>
      )}

      {/* Loading State */}
      {loading && users.length === 0 && (
        <div className="px-6 py-12 text-center">
          <motion.div 
            className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          />
          <p className="text-gray-500">Loading users...</p>
        </div>
      )}
    </div>
  );
};

export default UserListTable; 