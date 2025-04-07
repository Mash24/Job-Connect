import React, { useEffect, useState } from 'react';
import { collection, getDocs, doc, getDoc, query, orderBy } from 'firebase/firestore';
import { useAuthState } from 'react-firebase-hooks/auth';
import { db, auth } from '../../firebase/config';

import JobCard from './JobCard';
import JobDetailsModal from './JobDetailsModal';
import SkeletonCard from '../common/Skeleton';
import JobFilterBar from './JobFilterBar';

/**
 * AllJobs Component
 * Displays all job listings with filters and modal preview
 */

const AllJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [savedJobs, setSavedJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedJob, setSelectedJob] = useState(null);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    keyword: '',
    location: '',
    jobType: '',
    minSalary: '',
    maxSalary: '',
  });

  const [user] = useAuthState(auth);

  // Helper to safely convert text
  const safeText = (text) => (typeof text === 'string' ? text.toLowerCase() : '');

  // Fetch jobs
  useEffect(() => {
    const fetchJobs = async () => {
      setLoading(true);
      try {
        const q = query(collection(db, 'jobs'), orderBy('createdAt', 'desc'));
        const snapshot = await getDocs(q);
        const jobsData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setJobs(jobsData);
        setFilteredJobs(jobsData);
      } catch (err) {
        console.error('Error fetching jobs:', err);
        setError('Failed to load jobs.');
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  // Fetch saved jobs from Firestore user profile
  useEffect(() => {
    const fetchSaved = async () => {
      if (user?.uid) {
        try {
          const userDoc = await getDoc(doc(db, 'users', user.uid));
          const userData = userDoc.data();
          setSavedJobs(userData?.savedJobs || []);
        } catch (err) {
          console.error('Failed to load saved jobs:', err);
        }
      }
    };
    fetchSaved();
  }, [user]);

  // Apply filters
  useEffect(() => {
    const filtered = jobs.filter((job) => {
      const title = safeText(job?.title);
      const location = safeText(job?.location);
      const type = job?.type || '';
      const salaryMin = job?.salaryMin ?? 0;
      const salaryMax = job?.salaryMax ?? 999999;

      const keywordMatch = title.includes(safeText(filters.keyword));
      const locationMatch = filters.location ? location.includes(safeText(filters.location)) : true;
      const typeMatch = filters.jobType ? type === filters.jobType : true;
      const minSalaryMatch = filters.minSalary ? salaryMin >= Number(filters.minSalary) : true;
      const maxSalaryMatch = filters.maxSalary ? salaryMax <= Number(filters.maxSalary) : true;

      return keywordMatch && locationMatch && typeMatch && minSalaryMatch && maxSalaryMatch;
    });

    setFilteredJobs(filtered);
  }, [filters, jobs]);

  return (
    <section className="p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">All Available Jobs</h2>

      {/* 🔍 Filters */}
      <JobFilterBar onFilterChange={setFilters} />

      {/* ⚠️ Error */}
      {error && (
        <p className="text-red-500 text-sm mb-2">
          {error} <button onClick={() => window.location.reload()} className="underline">Retry</button>
        </p>
      )}

      {/* ⏳ Loading */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
          {[...Array(6)].map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
          {filteredJobs.length > 0 ? (
            filteredJobs.map((job) => (
              <JobCard
                key={job.id}
                job={job}
                userId={user?.uid}
                isSaved={savedJobs.includes(job.id)}
                onView={() => setSelectedJob(job)}
              />
            ))
          ) : (
            <p className="text-gray-600 col-span-full">No jobs match your criteria.</p>
          )}
        </div>
      )}

      {/* 📄 Modal */}
      {selectedJob && (
        <JobDetailsModal job={selectedJob} onClose={() => setSelectedJob(null)} />
      )}
    </section>
  );
};

export default AllJobs;