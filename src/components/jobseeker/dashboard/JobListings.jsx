// File: src/components/jobseeker/dashboard/JobListings.jsx

import React, { useEffect, useState } from 'react';
import { collection,  getDocs,  query,  orderBy,  doc,  onSnapshot,  setDoc} from 'firebase/firestore';
import { db } from '../../../firebase/config';
import JobCard from '../../../components/jobs/JobCard'; // JobCard component to display individual job listings
import Skeleton from '../../common/Skeleton'; // Optional loading placeholder

/**
 * JobListings Component
 * Fetches job listings and user's saved jobs from Firestore.
 * Props:
 *  - userId (string): current logged-in user ID for tracking saved jobs.
 */
const JobListings = ({ userId }) => {
  const [jobs, setJobs] = useState([]);
  const [savedJobs, setSavedJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  /**
   * Fetch all jobs from Firestore (ordered by most recent)
   */
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const q = query(collection(db, 'jobs'), orderBy('createdAt', 'desc'));
        const snapshot = await getDocs(q);
        const jobData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setJobs(jobData);
      } catch (err) {
        console.error('Error fetching jobs:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  /**
   * Real-time listener for user's saved job IDs
   */
  useEffect(() => {
    if (!userId) return;
    const userRef = doc(db, 'users', userId);

    const unsubscribe = onSnapshot(userRef, (docSnap) => {
      if (docSnap.exists()) {
        setSavedJobs(docSnap.data()?.savedJobs || []);
      }
    });

    return () => unsubscribe(); // Clean up on unmount
  }, [userId]);

  /**
   * Save or unsave a job for the current user
   * @param {string} jobId
   */
  const handleSave = async (jobId) => {
    if (!userId) return;
    const userRef = doc(db, 'users', userId);
    const updated = savedJobs.includes(jobId)
      ? savedJobs.filter(id => id !== jobId) // Unsave
      : [...savedJobs, jobId]; // Save

    try {
      await setDoc(userRef, { savedJobs: updated }, { merge: true });
    } catch (error) {
      console.error('Error saving job:', error);
    }
  };

  /**
   * Optional: Handle viewing job details (e.g., modal or route)
   */
  const handleView = (job) => {
    console.log('Job viewed:', job);
    // You can expand this to open modal or navigate
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mt-4">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">All Job Listings</h2>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => <Skeleton key={i} height="200px" />)}
        </div>
      ) : jobs.length === 0 ? (
        <p className="text-gray-500 text-center">No jobs found at the moment.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {jobs.map((job) => (
            <JobCard
              key={job.id}
              job={job}
              isSaved={savedJobs.includes(job.id)}
              onSave={handleSave}
              onView={handleView}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default JobListings;
