import React from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Calendar, MapPin, Phone, Briefcase, Shield, CheckCircle, XCircle } from 'lucide-react';
import RoleBadge from '../shared/RoleBadge';
import StatusBadge from '../shared/StatusBadge';

const UserProfileHoverCard = ({ user }) => {
  const getFullName = (user) => {
    const firstName = user.firstname || user.firstName || '';
    const lastName = user.lastname || user.lastName || '';
    return `${firstName} ${lastName}`.trim() || 'N/A';
  };

  const formatDate = (date) => {
    if (!date) return 'N/A';
    const dateObj = date?.toDate?.() || new Date(date);
    return dateObj.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getRoleIcon = (role) => {
    switch (role) {
      case 'job-seeker':
        return <User className="w-4 h-4" />;
      case 'employer':
        return <Briefcase className="w-4 h-4" />;
      case 'super-admin':
        return <Shield className="w-4 h-4" />;
      default:
        return <User className="w-4 h-4" />;
    }
  };

  const getStatusIcon = (status) => {
    return status === 'active' 
      ? <CheckCircle className="w-4 h-4 text-green-500" />
      : <XCircle className="w-4 h-4 text-red-500" />;
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-white rounded-lg shadow-lg border border-gray-200 p-4 w-80 max-w-sm"
    >
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <div className="flex-shrink-0">
          <div className="h-12 w-12 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white font-medium text-lg">
            {getFullName(user).charAt(0).toUpperCase()}
          </div>
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-semibold text-gray-900 truncate">
            {getFullName(user)}
          </h3>
          <div className="flex items-center gap-2 mt-1">
            <RoleBadge role={user.role} />
            <StatusBadge status={user.status || 'active'} />
          </div>
        </div>
      </div>

      {/* User Details */}
      <div className="space-y-3">
        {/* Email */}
        <div className="flex items-center gap-2 text-sm">
          <Mail className="w-4 h-4 text-gray-400 flex-shrink-0" />
          <span className="text-gray-700 truncate">{user.email}</span>
        </div>

        {/* Phone */}
        {user.phone && (
          <div className="flex items-center gap-2 text-sm">
            <Phone className="w-4 h-4 text-gray-400 flex-shrink-0" />
            <span className="text-gray-700">{user.phone}</span>
          </div>
        )}

        {/* Location */}
        {user.location && (
          <div className="flex items-center gap-2 text-sm">
            <MapPin className="w-4 h-4 text-gray-400 flex-shrink-0" />
            <span className="text-gray-700">{user.location}</span>
          </div>
        )}

        {/* Joined Date */}
        <div className="flex items-center gap-2 text-sm">
          <Calendar className="w-4 h-4 text-gray-400 flex-shrink-0" />
          <span className="text-gray-700">
            Joined {formatDate(user.createdAt)}
          </span>
        </div>

        {/* Last Login */}
        {user.lastLogin && (
          <div className="flex items-center gap-2 text-sm">
            <CheckCircle className="w-4 h-4 text-gray-400 flex-shrink-0" />
            <span className="text-gray-700">
              Last login {formatDate(user.lastLogin)}
            </span>
          </div>
        )}

        {/* Company (for employers) */}
        {user.role === 'employer' && user.company && (
          <div className="flex items-center gap-2 text-sm">
            <Briefcase className="w-4 h-4 text-gray-400 flex-shrink-0" />
            <span className="text-gray-700">{user.company}</span>
          </div>
        )}

        {/* Job Title (for job seekers) */}
        {user.role === 'job-seeker' && user.jobTitle && (
          <div className="flex items-center gap-2 text-sm">
            <Briefcase className="w-4 h-4 text-gray-400 flex-shrink-0" />
            <span className="text-gray-700">{user.jobTitle}</span>
          </div>
        )}
      </div>

      {/* Quick Stats */}
      {(user.jobCount || user.applicationCount) && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="grid grid-cols-2 gap-4 text-sm">
            {user.role === 'employer' && user.jobCount !== undefined && (
              <div className="text-center">
                <div className="text-lg font-semibold text-blue-600">
                  {user.jobCount}
                </div>
                <div className="text-gray-500">Jobs Posted</div>
              </div>
            )}
            {user.role === 'job-seeker' && user.applicationCount !== undefined && (
              <div className="text-center">
                <div className="text-lg font-semibold text-green-600">
                  {user.applicationCount}
                </div>
                <div className="text-gray-500">Applications</div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* User ID */}
      <div className="mt-4 pt-3 border-t border-gray-200">
        <div className="text-xs text-gray-400">
          ID: {user.id}
        </div>
      </div>
    </motion.div>
  );
};

export default UserProfileHoverCard; 