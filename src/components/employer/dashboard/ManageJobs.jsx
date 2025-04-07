// File: /src/components/employer/dashboard/ManageJobs.jsx

import React, { useEffect, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { collection, deleteDoc, doc, onSnapshot, query, where } from 'firebase/firestore';
import { db, auth } from '../../../firebase/config';
import { toast } from 'react-hot-toast';
import { Trash2, Pencil, ChevronDown, ChevronUp } from 'lucide-react';
import EditJobModal from './EditJobModal';
import JobFilterBar from '../../jobs/JobFilterBar'; 

const ManageJobs = () => {
  const [user] = useAuthState(auth);
  const [jobs, setJobs] = useState([]);
  const [expandedJobId, setExpandedJobId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedJob, setSelectedJob] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filters, setFilters] = useState({ search: '', type: '', location: '' });

  useEffect(() => {
    if (!user) return;
    const q = query(collection(db, 'jobs'), where('userId', '==', user.uid));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const jobList = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setJobs(jobList);
      setLoading(false);
    });
    return () => unsubscribe();
  }, [user]);

  const handleDelete = async (jobId) => {
    const confirm = window.confirm('Are you sure you want to delete this job?');
    if (!confirm) return;
    try {
      await deleteDoc(doc(db, 'jobs', jobId));
      toast.success('Job deleted successfully.');
    } catch (error) {
      console.error('Error deleting job:', error);
      toast.error('Failed to delete job.');
    }
  };

  const toggleExpand = (jobId) => {
    setExpandedJobId((prevId) => (prevId === jobId ? null : jobId));
  };

  const filteredJobs = jobs.filter((job) => {
    return (
      (!filters.search || job.title.toLowerCase().includes(filters.search.toLowerCase())) &&
      (!filters.type || job.type === filters.type) &&
      (!filters.location || job.location.toLowerCase().includes(filters.location.toLowerCase()))
    );
  });

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Manage Your Jobs</h2>

      <JobFilterBar onFilterChange={setFilters} /> {/* ✅ Render Filter Bar */}

      {loading ? (
        <p className="text-gray-500">Loading jobs...</p>
      ) : filteredJobs.length === 0 ? (
        <p className="text-gray-500">No jobs match your filter.</p>
      ) : (
        <div className="grid gap-6">
          {filteredJobs.map((job) => (
            <div key={job.id} className="bg-white rounded-xl shadow hover:shadow-lg transition-shadow border p-5">
              <div className="flex justify-between items-start">
                <div className="flex gap-4">
                  {job.logoUrl && (
                    <img src={job.logoUrl} alt="Logo" className="w-14 h-14 object-cover rounded border" />
                  )}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{job.title}</h3>
                    <p className="text-sm text-gray-600">{job.companyName} · {job.type}</p>
                    <p className="text-sm text-gray-500">Location: {job.location}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => { setSelectedJob(job); setIsModalOpen(true); }} className="text-gray-600 hover:text-blue-600">
                    <Pencil size={18} />
                  </button>
                  <button onClick={() => handleDelete(job.id)} className="text-red-500 hover:text-red-600">
                    <Trash2 size={18} />
                  </button>
                  <button onClick={() => toggleExpand(job.id)} className="text-gray-400 hover:text-black">
                    {expandedJobId === job.id ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                  </button>
                </div>
              </div>
              {expandedJobId === job.id && (
                <div className="mt-4 text-sm text-gray-700 border-t pt-4 space-y-1">
                  <p><strong>Description:</strong> {job.description || 'No description'}</p>
                  <p><strong>Tags:</strong> {job.tags?.join(', ') || 'N/A'}</p>
                  {job.externalApply && (
                    <p><strong>External URL:</strong> <a href={job.externalUrl} className="text-blue-500 underline" target="_blank" rel="noreferrer">{job.externalUrl}</a></p>
                  )}
                  <p><strong>Deadline:</strong> {job.deadline || 'N/A'}</p>
                  <p><strong>Salary:</strong> {job.currency} {job.salaryMin} - {job.salaryMax}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {isModalOpen && selectedJob && (
        <EditJobModal
          job={selectedJob}
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedJob(null);
          }}
        />
      )}
    </div>
  );
};

export default ManageJobs;
