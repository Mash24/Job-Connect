import React, { useEffect, useState } from 'react';
import { collection, doc, getDoc, getDocs } from 'firebase/firestore';
import { useAuthState } from 'react-firebase-hooks/auth';
import { db, auth } from '../../../firebase/config';
import JobCard from '../../jobs/JobCard';
import SkeletonCard from '../../common/Skeleton';

const SavedJobs = () => {
  const [user] = useAuthState(auth);
  const [savedJobs, setSavedJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch saved job IDs from the user's profile
  useEffect(() => {
    const fetchSavedJobs = async () => {
      if (!user) return;

      try {
        setLoading(true);
        const userRef = doc(db, 'users', user.uid);
        const userSnap = await getDoc(userRef);

        if (!userSnap.exists()) {
          setError('User not found.');
          return;
        }

        const savedJobIds = userSnap.data().savedJobs || [];

        // Fetch the actual job documents
        const jobCollection = collection(db, 'jobs');
        const jobDocs = await getDocs(jobCollection);

        const jobsData = jobDocs.docs
          .filter(doc => savedJobIds.includes(doc.id))
          .map(doc => ({
            id: doc.id,
            ...doc.data(),
          }));

        setSavedJobs(jobsData);
      } catch (err) {
        console.error('Error fetching saved jobs:', err);
        setError('Failed to load saved jobs.');
      } finally {
        setLoading(false);
      }
    };

    fetchSavedJobs();
  }, [user]);

  return (
    <section>
      <h2 className="text-lg font-semibold mb-4 text-gray-800">Your Saved Jobs</h2>

      {error && <p className="text-red-500">{error}</p>}

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(3)].map((_, idx) => (
            <SkeletonCard key={idx} />
          ))}
        </div>
      ) : savedJobs.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {savedJobs.map(job => (
            <JobCard key={job.id} job={job} userId={user?.uid} isSaved={true} />
          ))}
        </div>
      ) : (
        <p className="text-gray-500">You haven’t saved any jobs yet.</p>
      )}
    </section>
  );
};

export default SavedJobs;