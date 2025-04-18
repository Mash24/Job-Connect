import React, { useState } from 'react';
import { doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../../../firebase/config';
import StatusBadge from '../shared/StatusBadge';
import DropdownActionMenu from '../shared/DropdownActionMenu';
import JobDetailsModal from '../modals/JobDetailsModal';
import EditJobModal from '../modals/EditJobModal';

const JobTable = ({ jobs }) => {
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
  };

  const handleDelete = async (jobId) => {
    const jobRef = doc(db, 'jobs', jobId);
    await deleteDoc(jobRef);
  };

  const handleViewJob = (job) => setSelectedJob(job);
  const handleEdit = (job) => setEditingJob(job);
  const closeViewModal = () => setSelectedJob(null);
  const closeEditModal = () => setEditingJob(null);

  return (
    <div className="overflow-x-auto bg-white shadow rounded-lg">
      <table className="min-w-full divide-y divide-gray-200 text-sm">
        <thead className="bg-gray-100 text-gray-700">
          <tr>
            <th className="px-4 py-2 text-left">Job Title</th>
            <th className="px-4 py-2 text-left">Company</th>
            <th className="px-4 py-2 text-left">Status</th>
            <th className="px-4 py-2 text-left">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100 text-gray-800">
          {jobs.map((job) => (
            <tr key={job.id}>
              <td className="px-4 py-2">{job.title}</td>
              <td className="px-4 py-2">{job.companyName || 'N/A'}</td>
              <td className="px-4 py-2">
                <StatusBadge status={job.status} />
              </td>
              <td className="px-4 py-2">
                <DropdownActionMenu
                  job={job}
                  onView={() => handleViewJob(job)}
                  onApprove={() =>
                    confirmAndExecute('Approve this job?', () =>
                      handleUpdateStatus(job.id, 'approved')
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
                      handleUpdateStatus(job.id, 'approved')
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

      {/* 🔍 View Job Modal */}
      {selectedJob && (
        <JobDetailsModal
          job={selectedJob}
          isOpen={true}
          onClose={closeViewModal}
          onApprove={() => confirmAndExecute('Approve this job?', () => handleUpdateStatus(selectedJob.id, 'approved'))}
          onReject={() => confirmAndExecute('Reject this job?', () => handleUpdateStatus(selectedJob.id, 'rejected'))}
          onPause={() => confirmAndExecute('Pause this job?', () => handleUpdateStatus(selectedJob.id, 'paused'))}
          onResume={() => confirmAndExecute('Resume this job?', () => handleUpdateStatus(selectedJob.id, 'approved'))}
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
