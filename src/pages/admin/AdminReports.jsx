// File: src/pages/admin/AdminReports.jsx

import React, { useEffect, useState } from 'react';
import {
  collection,
  onSnapshot,
  query,
  orderBy,
  doc,
  updateDoc,
  deleteDoc,
} from 'firebase/firestore';
import { db } from '../../firebase/config';
import ReportCard from '../../components/admin/reports/ReportCard';
import ReportDetailsModal from '../../components/admin/modals/ReportDetailsModal';

const AdminReports = () => {
  const [reports, setReports] = useState([]);
  const [selectedReport, setSelectedReport] = useState(null);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    const q = query(collection(db, 'reports'), orderBy('timestamp', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const list = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setReports(list);
    });
    return () => unsubscribe();
  }, []);

  const handleView = (report) => setSelectedReport(report);
  const closeModal = () => setSelectedReport(null);

  const handleUpdateStatus = async (reportId, newStatus) => {
    try {
      const ref = doc(db, 'reports', reportId);
      await updateDoc(ref, { status: newStatus });
      alert('✅ Report status updated.');
    } catch (error) {
      console.error('Error updating status:', error);
      alert('❌ Failed to update report status.');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this report?')) {
      try {
        await deleteDoc(doc(db, 'reports', id));
        alert('🗑️ Report deleted.');
      } catch (err) {
        console.error('Error deleting:', err);
        alert('❌ Failed to delete report.');
      }
    }
  };

  const handleAssignAdmin = async (reportId, adminName) => {
    try {
      const ref = doc(db, 'reports', reportId);
      await updateDoc(ref, { assignedTo: adminName });
      alert('✅ Assigned to admin.');
    } catch (err) {
      console.error('Failed to assign:', err);
      alert('❌ Could not assign admin.');
    }
  };

  const handleNoteChange = async (reportId, note) => {
    try {
      const ref = doc(db, 'reports', reportId);
      await updateDoc(ref, { note });
      alert('📝 Note saved.');
    } catch (err) {
      console.error('Failed to save note:', err);
      alert('❌ Could not save note.');
    }
  };

  const filteredReports =
    filter === 'all' ? reports : reports.filter((r) => r.status === filter);

  return (
    <div className="min-h-screen p-6 bg-gray-50">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">📝 Admin Reports</h2>
        <div className="flex gap-2">
          {['all', 'pending', 'resolved', 'rejected'].map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-3 py-1 rounded text-sm border ${
                filter === status
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700'
              }`}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {filteredReports.length === 0 ? (
        <p className="text-gray-500 italic">No reports found.</p>
      ) : (
        <div className="space-y-4">
          {filteredReports.map((report) => (
            <ReportCard
              key={report.id}
              report={report}
              onView={() => handleView(report)}
            />
          ))}
        </div>
      )}

      {selectedReport && (
        <ReportDetailsModal
          report={selectedReport}
          isOpen={!!selectedReport}
          onClose={closeModal}
          onUpdateStatus={(status) =>
            handleUpdateStatus(selectedReport.id, status)
          }
          onDelete={() => handleDelete(selectedReport.id)}
          onAssign={(adminName) => handleAssignAdmin(selectedReport.id, adminName)}
          onNoteChange={(note) => handleNoteChange(selectedReport.id, note)}
        />
      )}
    </div>
  );
};

export default AdminReports;
