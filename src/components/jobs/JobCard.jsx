import React from 'react';
import { Bookmark, BookmarkCheck, Briefcase, MapPin, DollarSign, ExternalLink, Building2,} from 'lucide-react';
import { doc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';
import { db } from '../../firebase/config';


/**
 * JobCard Component (Enhanced 🔥)
 * Displays a single job listing with save/view functionality.
 *
 * Props:
 * - job: Job object { id, title, company, location, type, salary, tags, externalUrl, logoUrl }
 * - isSaved: Boolean indicating if the job is saved by the user
 * - userId: Logged-in user's UID (used to save job in Firestore)
 * - onView: Function to view full job details
 */

const JobCard = ({ job, isSaved = false, userId, onView }) => {
  // Firestore Save/Unsave Handler
  const handleSave = async () => {
    if (!userId || !job.id) return;

    try {
      const userRef = doc(db, 'users', userId);
      await updateDoc(userRef, {
        savedJobs: isSaved ? arrayRemove(job.id) : arrayUnion(job.id),
      });
    } catch (error) {
      console.error('Error updating saved jobs:', error);
    }
  };

  return (
    <div
      className="relative bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 
                 rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 p-6 
                 w-full max-w-md mx-auto group"
    >
      {/* Bookmark Save Button */}
      <button
        onClick={handleSave}
        className="absolute top-4 right-4 text-gray-400 hover:text-blue-500"
        aria-label={isSaved ? 'Unsave job' : 'Save job'}
      >
        {isSaved ? <BookmarkCheck className="w-5 h-5" /> : <Bookmark className="w-5 h-5" />}
      </button>

      {/* Company Logo */}
      {job.logoUrl && (
        <img
          src={job.logoUrl}
          alt={`${job.company} logo`}
          className="w-12 h-12 object-contain mb-3 rounded-md"
        />
      )}

      {/* Title & Company */}
      <h3 className="text-lg font-bold text-gray-900 dark:text-white">{job.title}</h3>
      <p className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-1 mt-1">
        <Building2 className="w-4 h-4" /> {job.company}
      </p>

      {/* Job Info */}
      <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 dark:text-gray-400 mt-4">
        <span className="flex items-center gap-1">
          <MapPin className="w-4 h-4" /> {job.location}
        </span>
        <span className="flex items-center gap-1">
          <Briefcase className="w-4 h-4" /> {job.type}
        </span>
        {job.salary && (
          <span className="flex items-center gap-1">
            <DollarSign className="w-4 h-4" /> {job.salary}
          </span>
        )}
      </div>

      {/* Tags */}
      {job.tags?.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-4">
          {job.tags.map((tag, idx) => (
            <span
              key={idx}
              className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 
                         text-xs font-semibold px-2.5 py-0.5 rounded-full"
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* Actions */}
      <div className="mt-6 flex flex-wrap justify-between items-center gap-3">
        {/* View Details */}
        <button
          onClick={() => onView(job)}
          className="inline-flex items-center text-sm font-medium text-blue-600 dark:text-blue-400 hover:underline"
        >
          View Details <ExternalLink className="w-4 h-4 ml-1" />
        </button>

        {/* Apply Button */}
        {job.externalUrl && (
          <a
            href={job.externalUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
          >
            Apply
          </a>
        )}
      </div>
    </div>
  );
};

export default JobCard;