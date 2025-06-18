import React, { useState } from 'react';
import { doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../../../firebase/config';
import StatusBadge from '../shared/StatusBadge';
import DropdownActionMenu from '../shared/DropdownActionMenu';
import JobDetailsModal from '../modals/JobDetailsModal';
import EditJobModal from '../modals/EditJobModal';
import { 
  Hash, Copy, CheckCircle, AlertTriangle, 
  TrendingUp, MapPin, DollarSign, Calendar,
  Eye, Users, Building, Tag
} from 'lucide-react';

/**
 * @component JobTable
 * @description Enhanced job table with unique job IDs, priority indicators, and improved functionality
 */
const JobTable = ({ 
  jobs, 
  selectedJobs = new Set(), 
  setSelectedJobs = () => {},
  onUpdateStatus = () => {},
  jobIdDisplay = null,
  copyJobId = () => {},
  copiedJobId = null
}) => {
  const [selectedJob, setSelectedJob] = useState(null);
  const [editingJob, setEditingJob] = useState(null);

  const confirmAndExecute = async (message, action) => {
    if (window.confirm(message)) {
      try {
        await action();
        alert('✅ Action completed.');
        window.location.reload();
      } catch (err) {
        console.error('❌ Error:', err);
        alert('Something went wrong. Please try again.');
      }
    }
  };

  const handleUpdateStatus = async (jobId, newStatus) => {
    const jobRef = doc(db, 'jobs', jobId);
    await updateDoc(jobRef, { status: newStatus });
    onUpdateStatus(jobId, newStatus);
  };

  const handleDelete = async (jobId) => {
    const jobRef = doc(db, 'jobs', jobId);
    await deleteDoc(jobRef);
  };

  const handleViewJob = (job) => setSelectedJob(job);
  const handleEdit = (job) => setEditingJob(job);
  const closeViewModal = () => setSelectedJob(null);
  const closeEditModal = () => setEditingJob(null);

  const handleSelectJob = (jobId) => {
    const newSelected = new Set(selectedJobs);
    if (newSelected.has(jobId)) {
      newSelected.delete(jobId);
    } else {
      newSelected.add(jobId);
    }
    setSelectedJobs(newSelected);
  };

  const handleSelectAll = () => {
    if (selectedJobs.size === jobs.length) {
      setSelectedJobs(new Set());
    } else {
      setSelectedJobs(new Set(jobs.map(job => job.id)));
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'text-red-600 bg-red-50 border-red-200';
      case 'normal': return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'low': return 'text-gray-600 bg-gray-50 border-gray-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getPriorityIcon = (priority) => {
    switch (priority) {
      case 'high': return <AlertTriangle className="w-3 h-3" />;
      case 'normal': return <CheckCircle className="w-3 h-3" />;
      case 'low': return <Tag className="w-3 h-3" />;
      default: return <Tag className="w-3 h-3" />;
    }
  };

  const formatSalary = (salary) => {
    if (!salary) return 'N/A';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(salary);
  };

  const formatDate = (date) => {
    if (!date) return 'N/A';
    const dateObj = date?.toDate?.() || new Date(date);
    return dateObj.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="overflow-x-auto bg-white shadow rounded-lg">
      <table className="min-w-full divide-y divide-gray-200 text-sm">
        <thead className="bg-gradient-to-r from-gray-50 to-gray-100 text-gray-700">
          <tr>
            <th className="px-4 py-3 text-left">
              <input
                type="checkbox"
                checked={selectedJobs.size === jobs.length && jobs.length > 0}
                onChange={handleSelectAll}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
            </th>
            <th className="px-4 py-3 text-left font-medium">Job ID</th>
            <th className="px-4 py-3 text-left font-medium">Title & Company</th>
            <th className="px-4 py-3 text-left font-medium">Location</th>
            <th className="px-4 py-3 text-left font-medium">Salary</th>
            <th className="px-4 py-3 text-left font-medium">Status</th>
            <th className="px-4 py-3 text-left font-medium">Priority</th>
            <th className="px-4 py-3 text-left font-medium">Applications</th>
            <th className="px-4 py-3 text-left font-medium">Created</th>
            <th className="px-4 py-3 text-left font-medium">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100 text-gray-800">
          {jobs.map((job) => (
            <tr 
              key={job.id} 
              className={`hover:bg-gray-50 transition-colors ${
                selectedJobs.has(job.id) ? 'bg-blue-50' : ''
              }`}
            >
              {/* Checkbox */}
              <td className="px-4 py-3">
                <input
                  type="checkbox"
                  checked={selectedJobs.has(job.id)}
                  onChange={() => handleSelectJob(job.id)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
              </td>

              {/* Job ID */}
              <td className="px-4 py-3">
                {jobIdDisplay ? (
                  jobIdDisplay(job.jobId || `JOB-${job.id.slice(-6)}`, copyJobId)
                ) : (
                  <div className="flex items-center gap-2">
                    <Hash className="w-4 h-4 text-blue-600" />
                    <span className="font-mono text-sm bg-blue-50 text-blue-700 px-2 py-1 rounded">
                      {job.jobId || `JOB-${job.id.slice(-6)}`}
                    </span>
                    <button
                      onClick={() => copyJobId(job.jobId || `JOB-${job.id.slice(-6)}`)}
                      className="p-1 hover:bg-blue-100 rounded transition-colors"
                      title="Copy Job ID"
                    >
                      <Copy className={`w-3 h-3 ${copiedJobId === job.jobId ? 'text-green-600' : 'text-blue-600'}`} />
                    </button>
                  </div>
                )}
              </td>

              {/* Title & Company */}
              <td className="px-4 py-3">
                <div className="space-y-1">
                  <div className="font-medium text-gray-900">{job.title || 'N/A'}</div>
                  <div className="flex items-center gap-1 text-sm text-gray-600">
                    <Building className="w-3 h-3" />
                    {job.company || job.companyName || 'N/A'}
                  </div>
                  {job.category && (
                    <div className="flex items-center gap-1 text-xs text-gray-500">
                      <Tag className="w-3 h-3" />
                      {job.category}
                    </div>
                  )}
                </div>
              </td>

              {/* Location */}
              <td className="px-4 py-3">
                <div className="flex items-center gap-1 text-gray-700">
                  <MapPin className="w-3 h-3 text-gray-500" />
                  {job.location || 'Remote'}
                </div>
              </td>

              {/* Salary */}
              <td className="px-4 py-3">
                <div className="flex items-center gap-1 text-gray-700">
                  <DollarSign className="w-3 h-3 text-green-600" />
                  {formatSalary(job.salary)}
                </div>
              </td>

              {/* Status */}
              <td className="px-4 py-3">
                <StatusBadge status={job.status} />
              </td>

              {/* Priority */}
              <td className="px-4 py-3">
                <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${getPriorityColor(job.priority || 'normal')}`}>
                  {getPriorityIcon(job.priority || 'normal')}
                  {job.priority || 'normal'}
                </div>
              </td>

              {/* Applications */}
              <td className="px-4 py-3">
                <div className="flex items-center gap-1 text-gray-700">
                  <Users className="w-3 h-3 text-purple-600" />
                  <span className="font-medium">{job.applications || 0}</span>
                  {job.views && (
                    <span className="text-xs text-gray-500">
                      ({job.views} views)
                    </span>
                  )}
                </div>
              </td>

              {/* Created Date */}
              <td className="px-4 py-3">
                <div className="flex items-center gap-1 text-gray-700">
                  <Calendar className="w-3 h-3 text-gray-500" />
                  {formatDate(job.createdAt)}
                </div>
              </td>

              {/* Actions */}
              <td className="px-4 py-3">
                <DropdownActionMenu
                  job={job}
                  onView={() => handleViewJob(job)}
                  onApprove={() =>
                    confirmAndExecute('Approve this job?', () =>
                      handleUpdateStatus(job.id, 'active')
                    )
                  }
                  onReject={() =>
                    confirmAndExecute('Reject this job?', () =>
                      handleUpdateStatus(job.id, 'rejected')
                    )
                  }
                  onPause={() =>
                    confirmAndExecute('Pause this job?', () =>
                      handleUpdateStatus(job.id, 'paused')
                    )
                  }
                  onResume={() =>
                    confirmAndExecute('Resume this job?', () =>
                      handleUpdateStatus(job.id, 'active')
                    )
                  }
                  onDelete={() =>
                    confirmAndExecute('Delete this job?', () =>
                      handleDelete(job.id)
                    )
                  }
                  onEdit={() => handleEdit(job)}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Summary Row */}
      {jobs.length > 0 && (
        <tfoot className="bg-gray-50 border-t border-gray-200">
          <tr>
            <td colSpan="10" className="px-4 py-3 text-sm text-gray-600">
              <div className="flex items-center justify-between">
                <span>
                  Showing {jobs.length} job(s)
                  {selectedJobs.size > 0 && ` • ${selectedJobs.size} selected`}
                </span>
                <div className="flex items-center gap-4 text-xs">
                  <span className="flex items-center gap-1">
                    <AlertTriangle className="w-3 h-3 text-red-600" />
                    High Priority: {jobs.filter(j => j.priority === 'high').length}
                  </span>
                  <span className="flex items-center gap-1">
                    <Users className="w-3 h-3 text-purple-600" />
                    Total Applications: {jobs.reduce((sum, j) => sum + (j.applications || 0), 0)}
                  </span>
                  <span className="flex items-center gap-1">
                    <TrendingUp className="w-3 h-3 text-green-600" />
                    Active: {jobs.filter(j => j.status === 'active').length}
                  </span>
                </div>
              </div>
            </td>
          </tr>
        </tfoot>
      )}

      {/* 🔍 View Job Modal */}
      {selectedJob && (
        <JobDetailsModal
          job={selectedJob}
          isOpen={true}
          onClose={closeViewModal}
          onApprove={() => confirmAndExecute('Approve this job?', () => handleUpdateStatus(selectedJob.id, 'active'))}
          onReject={() => confirmAndExecute('Reject this job?', () => handleUpdateStatus(selectedJob.id, 'rejected'))}
          onPause={() => confirmAndExecute('Pause this job?', () => handleUpdateStatus(selectedJob.id, 'paused'))}
          onResume={() => confirmAndExecute('Resume this job?', () => handleUpdateStatus(selectedJob.id, 'active'))}
          onDelete={() => confirmAndExecute('Delete this job?', () => handleDelete(selectedJob.id))}
          onEdit={() => handleEdit(selectedJob)}
        />
      )}

      {/* ✏️ Edit Job Modal */}
      {editingJob && (
        <EditJobModal
          job={editingJob}
          isOpen={true}
          onClose={closeEditModal}
        />
      )}
    </div>
  );
};

export default JobTable; 