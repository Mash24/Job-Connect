import React from 'react';
import { doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../../../firebase/config';
import StatusBadge from '../shared/StatusBadge';

const JobTable = ({ jobs }) => {
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

  const renderButtons = (job) => {
    const status = job.status || 'pending'; // default fallback

    switch (status) {
      case 'pending':
        return (
          <>
            <button
              onClick={() =>
                confirmAndExecute('Approve this job?', () =>
                  handleUpdateStatus(job.id, 'approved')
                )
              }
              className="px-2 py-1 bg-green-500 hover:bg-green-600 text-white rounded"
            >
              Approve
            </button>
            <button
              onClick={() =>
                confirmAndExecute('Reject this job?', () =>
                  handleUpdateStatus(job.id, 'rejected')
                )
              }
              className="px-2 py-1 bg-yellow-500 hover:bg-yellow-600 text-white rounded"
            >
              Reject
            </button>
            <button
              onClick={() =>
                confirmAndExecute('Delete this job?', () =>
                  handleDelete(job.id)
                )
              }
              className="px-2 py-1 bg-red-500 hover:bg-red-600 text-white rounded"
            >
              Delete
            </button>
          </>
        );

      case 'approved':
        return (
          <>
            <button
              onClick={() =>
                confirmAndExecute('Pause this job?', () =>
                  handleUpdateStatus(job.id, 'paused')
                )
              }
              className="px-2 py-1 bg-yellow-500 hover:bg-yellow-600 text-white rounded"
            >
              Pause
            </button>
            <button
              onClick={() => alert('✏️ Edit modal coming soon')}
              className="px-2 py-1 bg-blue-500 hover:bg-blue-600 text-white rounded"
            >
              Edit
            </button>
            <button
              onClick={() =>
                confirmAndExecute('Delete this job?', () =>
                  handleDelete(job.id)
                )
              }
              className="px-2 py-1 bg-red-500 hover:bg-red-600 text-white rounded"
            >
              Delete
            </button>
          </>
        );

      case 'rejected':
        return (
          <>
            <button
              onClick={() => alert('✏️ Edit modal coming soon')}
              className="px-2 py-1 bg-blue-500 hover:bg-blue-600 text-white rounded"
            >
              Edit
            </button>
            <button
              onClick={() =>
                confirmAndExecute('Delete this job?', () =>
                  handleDelete(job.id)
                )
              }
              className="px-2 py-1 bg-red-500 hover:bg-red-600 text-white rounded"
            >
              Delete
            </button>
          </>
        );

      case 'paused':
        return (
          <>
            <button
              onClick={() =>
                confirmAndExecute('Resume this job?', () =>
                  handleUpdateStatus(job.id, 'approved')
                )
              }
              className="px-2 py-1 bg-green-500 hover:bg-green-600 text-white rounded"
            >
              Resume
            </button>
            <button
              onClick={() =>
                confirmAndExecute('Delete this job?', () =>
                  handleDelete(job.id)
                )
              }
              className="px-2 py-1 bg-red-500 hover:bg-red-600 text-white rounded"
            >
              Delete
            </button>
          </>
        );

      default:
        return <span className="text-gray-400 italic">No actions</span>;
    }
  };

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
              <td className="px-4 py-2 space-x-2">{renderButtons(job)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default JobTable;
