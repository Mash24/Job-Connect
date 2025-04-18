// File: src/components/admin/modals/JobDetailsModal.jsx

import React from "react";
import { Dialog } from "@headlessui/react";
import StatusBadge from "../shared/StatusBadge";

const JobDetailsModal = ({ job, isOpen, onClose, onApprove, onReject, onPause, onResume, onEdit, onDelete }) => {
  if (!job) return null;

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/40" aria-hidden="true" />

      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="w-full max-w-2xl bg-white rounded shadow p-6 space-y-4">
          <div className="flex justify-between items-center">
            <Dialog.Title className="text-xl font-bold">{job.title}</Dialog.Title>
            <StatusBadge status={job.status || 'pending'} />
          </div>

          <div className="text-sm space-y-2">
            <p><strong>Company:</strong> {job.companyName || 'N/A'}</p>
            <p><strong>Location:</strong> {job.location || 'N/A'}</p>
            <p><strong>Type:</strong> {job.employmentType || 'N/A'}</p>
            <p><strong>Salary:</strong> {job.salary || 'N/A'}</p>
            <p><strong>Description:</strong> {job.description || 'No description provided.'}</p>
          </div>

          <div className="pt-4 border-t flex flex-wrap gap-2 justify-end">
            <button onClick={onEdit} className="px-3 py-1 text-sm bg-blue-500 text-white rounded">Edit</button>
            {job.status === 'pending' && (
              <>
                <button onClick={onApprove} className="px-3 py-1 text-sm bg-green-600 text-white rounded">Approve</button>
                <button onClick={onReject} className="px-3 py-1 text-sm bg-yellow-500 text-white rounded">Reject</button>
              </>
            )}
            {job.status === 'approved' && (
              <button onClick={onPause} className="px-3 py-1 text-sm bg-yellow-600 text-white rounded">Pause</button>
            )}
            {job.status === 'paused' && (
              <button onClick={onResume} className="px-3 py-1 text-sm bg-green-600 text-white rounded">Resume</button>
            )}
            <button onClick={onDelete} className="px-3 py-1 text-sm bg-red-600 text-white rounded">Delete</button>
            <button onClick={onClose} className="px-3 py-1 text-sm border rounded">Close</button>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};

export default JobDetailsModal;