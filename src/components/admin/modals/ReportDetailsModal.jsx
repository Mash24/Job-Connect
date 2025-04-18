// File: /src/components/admin/modals/ReportDetailsModal.jsx

import React, { useState } from 'react';
import { Dialog } from '@headlessui/react';

const ReportDetailsModal = ({
  report,
  isOpen,
  onClose,
  onUpdateStatus,
  onDelete,
  onAssign,
  onNoteChange
}) => {
  if (!report) return null;

  const [assignedTo, setAssignedTo] = useState(report.assignedTo || '');
  const [note, setNote] = useState(report.note || '');

  const handleStatusChange = (status) => {
    onUpdateStatus(status);
    onClose();
  };

  const handleAssign = () => {
    if (assignedTo.trim()) {
      onAssign(assignedTo.trim());
    }
  };

  const handleSaveNote = () => {
    onNoteChange(note);
  };

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/40" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="max-w-xl w-full bg-white p-6 rounded shadow space-y-4">
          <Dialog.Title className="text-xl font-bold">Report Details</Dialog.Title>

          <div className="text-sm space-y-1">
            <p><strong>Type:</strong> {report.type}</p>
            <p><strong>Reason:</strong> {report.reason}</p>
            <p><strong>Message:</strong> {report.message}</p>
            <p><strong>Reported ID:</strong> {report.reportedId}</p>
            <p><strong>Reported By:</strong> {report.reportedBy}</p>
            <p><strong>Status:</strong> {report.status}</p>
            <p><strong>Timestamp:</strong> {new Date(report.timestamp?.toDate()).toLocaleString()}</p>

            <div className="mt-3">
              <label className="text-xs text-gray-600">Assign to Admin:</label>
              <input
                type="text"
                value={assignedTo}
                onChange={(e) => setAssignedTo(e.target.value)}
                className="w-full p-2 border rounded text-sm"
                placeholder="Enter admin email or name"
              />
              <button
                onClick={handleAssign}
                className="mt-1 px-3 py-1 text-sm bg-blue-500 text-white rounded"
              >
                Assign
              </button>
            </div>

            <div className="mt-3">
              <label className="text-xs text-gray-600">Internal Notes:</label>
              <textarea
                rows="3"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                className="w-full p-2 border rounded text-sm"
                placeholder="Leave notes for this report"
              />
              <button
                onClick={handleSaveNote}
                className="mt-1 px-3 py-1 text-sm bg-gray-600 text-white rounded"
              >
                Save Note
              </button>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 justify-end pt-4 border-t">
            {report.status === 'pending' && (
              <>
                <button
                  onClick={() => handleStatusChange('resolved')}
                  className="px-3 py-1 text-sm bg-green-600 text-white rounded"
                >
                  Mark as Resolved
                </button>
                <button
                  onClick={() => handleStatusChange('rejected')}
                  className="px-3 py-1 text-sm bg-yellow-500 text-white rounded"
                >
                  Reject
                </button>
              </>
            )}
            <button
              onClick={onDelete}
              className="px-3 py-1 text-sm bg-red-600 text-white rounded"
            >
              Delete Report
            </button>
            <button
              onClick={onClose}
              className="px-3 py-1 text-sm border rounded"
            >
              Close
            </button>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};

export default ReportDetailsModal;
