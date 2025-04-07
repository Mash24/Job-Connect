import React from 'react';
import { X, Briefcase, MapPin, DollarSign, Building2, CalendarDays } from 'lucide-react';
import { Dialog } from '@headlessui/react';

/**
 * JobDetailsModal Component 🧩
 * Shows full details of a job inside a modal. Triggered from JobCard.
 * 
 * Props:
 * - isOpen: boolean to control modal visibility
 * - onClose: function to close the modal
 * - job: the job object { title, description, company, etc. }
 */

const JobDetailsModal = ({ isOpen, onClose, job }) => {
  if (!job) return null;

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" aria-hidden="true" />

      <div className="fixed inset-0 flex items-center justify-center p-4 overflow-auto">
        <Dialog.Panel className="bg-white dark:bg-zinc-900 rounded-xl max-w-2xl w-full p-6 shadow-xl relative animate-fade-in">
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-3 right-3 text-gray-400 hover:text-red-500"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Job Title + Company */}
          <div className="mb-4">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white">{job.title}</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-2 mt-1">
              <Building2 className="w-4 h-4" />
              {job.company}
            </p>
          </div>

          {/* Job Details Info Row */}
          <div className="flex flex-wrap gap-4 text-sm text-gray-600 dark:text-gray-300 mb-6">
            <div className="flex items-center gap-1">
              <MapPin className="w-4 h-4" />
              {job.location}
            </div>
            <div className="flex items-center gap-1">
              <Briefcase className="w-4 h-4" />
              {job.type}
            </div>
            {job.salary && (
              <div className="flex items-center gap-1">
                <DollarSign className="w-4 h-4" />
                {job.salary}
              </div>
            )}
            {job.createdAt && (
              <div className="flex items-center gap-1">
                <CalendarDays className="w-4 h-4" />
                {new Date(job.createdAt).toLocaleDateString()}
              </div>
            )}
          </div>

          {/* Job Description */}
          <div className="prose dark:prose-invert max-w-none mb-6">
            <p>{job.description || "No job description provided."}</p>
          </div>

          {/* Tags */}
          {job.tags?.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {job.tags.map((tag, i) => (
                <span
                  key={i}
                  className="bg-blue-100 dark:bg-blue-800 text-blue-700 dark:text-blue-200 text-xs font-semibold px-2.5 py-0.5 rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* Apply Button */}
          {job.externalUrl && (
            <a
              href={job.externalUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block mt-4 bg-blue-600 text-white px-5 py-2 rounded-md hover:bg-blue-700 text-sm font-medium transition"
            >
              Apply on Company Website
            </a>
          )}
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};

export default JobDetailsModal;
