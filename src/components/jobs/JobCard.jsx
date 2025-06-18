import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Bookmark, BookmarkCheck, Briefcase, MapPin, DollarSign, 
  ExternalLink, Building2, Clock, Users, Star, 
  TrendingUp, Heart, Share2, Eye
} from 'lucide-react';
import { doc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';
import { db } from '../../firebase/config';

/**
 * JobCard Component (Enhanced 🔥)
 * Displays a single job listing with save/view functionality and modern UX.
 *
 * Props:
 * - job: Job object { id, title, company, location, type, salary, tags, externalUrl, logoUrl }
 * - isSaved: Boolean indicating if the job is saved by the user
 * - userId: Logged-in user's UID (used to save job in Firestore)
 * - onView: Function to view full job details
 */

const JobCard = ({ job, isSaved = false, userId, onView }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showShareMenu, setShowShareMenu] = useState(false);

  // Firestore Save/Unsave Handler
  const handleSave = async () => {
    if (!userId || !job.id) return;

    try {
      setIsSaving(true);
      const userRef = doc(db, 'users', userId);
      await updateDoc(userRef, {
        savedJobs: isSaved ? arrayRemove(job.id) : arrayUnion(job.id),
      });
    } catch (error) {
      console.error('Error updating saved jobs:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: job.title,
          text: `${job.title} at ${job.company}`,
          url: window.location.href,
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      setShowShareMenu(!showShareMenu);
    }
  };

  const formatSalary = (salary) => {
    if (!salary) return 'Salary not specified';
    if (typeof salary === 'string') return salary;
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(salary);
  };

  const getTimeAgo = (date) => {
    if (!date) return 'Recently posted';
    const now = new Date();
    const posted = new Date(date);
    const diffInHours = Math.floor((now - posted) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just posted';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInHours < 168) return `${Math.floor(diffInHours / 24)}d ago`;
    return `${Math.floor(diffInHours / 168)}w ago`;
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'urgent': return 'bg-red-100 text-red-800 border-red-200';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'normal': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="relative bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 
                 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 p-6 
                 w-full max-w-md mx-auto group cursor-pointer"
    >
      {/* Priority Badge */}
      {job.priority && job.priority !== 'normal' && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className={`absolute top-4 left-4 px-2 py-1 rounded-full text-xs font-medium border ${getPriorityColor(job.priority)}`}
        >
          {job.priority}
        </motion.div>
      )}

      {/* Action Buttons */}
      <div className="absolute top-4 right-4 flex items-center gap-2">
        {/* Share Button */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={handleShare}
          className="p-1.5 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-full transition-all"
          aria-label="Share job"
        >
          <Share2 className="w-4 h-4" />
        </motion.button>

        {/* Save Button */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={handleSave}
          disabled={isSaving}
          className={`p-1.5 rounded-full transition-all ${
            isSaved 
              ? 'text-red-500 hover:text-red-600 hover:bg-red-50' 
              : 'text-gray-400 hover:text-blue-500 hover:bg-blue-50'
          }`}
          aria-label={isSaved ? 'Unsave job' : 'Save job'}
        >
          <AnimatePresence mode="wait">
            {isSaving ? (
              <motion.div
                key="loading"
                initial={{ rotate: 0 }}
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="w-4 h-4 border-2 border-current border-t-transparent rounded-full"
              />
            ) : isSaved ? (
              <motion.div
                key="saved"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
              >
                <Heart className="w-4 h-4 fill-current" />
              </motion.div>
            ) : (
              <motion.div
                key="unsaved"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
              >
                <Bookmark className="w-4 h-4" />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.button>
      </div>

      {/* Company Logo */}
      <div className="flex items-start gap-4 mb-4">
        {job.logoUrl ? (
          <img
            src={job.logoUrl}
            alt={`${job.company} logo`}
            className="w-12 h-12 object-contain rounded-lg border border-gray-200"
          />
        ) : (
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
            <Building2 className="w-6 h-6 text-white" />
          </div>
        )}
        
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white line-clamp-2 group-hover:text-blue-600 transition-colors">
            {job.title}
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-1 mt-1">
            <Building2 className="w-4 h-4" /> 
            <span className="truncate">{job.company}</span>
          </p>
        </div>
      </div>

      {/* Job Info Grid */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
          <MapPin className="w-4 h-4 text-gray-500" />
          <span className="truncate">{job.location}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
          <Briefcase className="w-4 h-4 text-gray-500" />
          <span>{job.type}</span>
        </div>
        {job.salary && (
          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
            <DollarSign className="w-4 h-4 text-green-500" />
            <span className="font-medium">{formatSalary(job.salary)}</span>
          </div>
        )}
        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
          <Clock className="w-4 h-4 text-gray-500" />
          <span>{getTimeAgo(job.createdAt)}</span>
        </div>
      </div>

      {/* Tags */}
      {job.tags?.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {job.tags.slice(0, 3).map((tag, idx) => (
            <motion.span
              key={idx}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.1 }}
              className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 
                         text-xs font-medium px-2.5 py-1 rounded-full border border-blue-200 dark:border-blue-800"
            >
              {tag}
            </motion.span>
          ))}
          {job.tags.length > 3 && (
            <span className="bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 
                           text-xs font-medium px-2.5 py-1 rounded-full">
              +{job.tags.length - 3} more
            </span>
          )}
        </div>
      )}

      {/* Stats Row */}
      <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
        <div className="flex items-center gap-4">
          {job.applications && (
            <span className="flex items-center gap-1">
              <Users className="w-3 h-3" />
              {job.applications} applicants
            </span>
          )}
          {job.views && (
            <span className="flex items-center gap-1">
              <Eye className="w-3 h-3" />
              {job.views} views
            </span>
          )}
        </div>
        {job.rating && (
          <div className="flex items-center gap-1">
            <Star className="w-3 h-3 text-yellow-500 fill-current" />
            <span>{job.rating}</span>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between gap-3">
        {/* View Details */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onView(job)}
          className="flex-1 flex items-center justify-center gap-2 text-sm font-medium text-blue-600 dark:text-blue-400 
                     hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
        >
          <Eye className="w-4 h-4" />
          View Details
        </motion.button>

        {/* Apply Button */}
        {job.externalUrl && (
          <motion.a
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            href={job.externalUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-4 py-2 rounded-lg 
                       hover:from-blue-700 hover:to-blue-800 transition-all duration-200 text-sm font-medium shadow-md"
          >
            <ExternalLink className="w-4 h-4" />
            Apply
          </motion.a>
        )}
      </div>

      {/* Share Menu */}
      <AnimatePresence>
        {showShareMenu && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="absolute top-12 right-4 bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 
                       rounded-lg shadow-lg p-2 z-10"
          >
            <button
              onClick={() => navigator.clipboard.writeText(window.location.href)}
              className="block w-full text-left px-3 py-2 text-sm text-gray-700 dark:text-gray-300 
                         hover:bg-gray-100 dark:hover:bg-zinc-700 rounded"
            >
              Copy Link
            </button>
            <button
              onClick={() => window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(`${job.title} at ${job.company}`)}&url=${encodeURIComponent(window.location.href)}`)}
              className="block w-full text-left px-3 py-2 text-sm text-gray-700 dark:text-gray-300 
                         hover:bg-gray-100 dark:hover:bg-zinc-700 rounded"
            >
              Share on Twitter
            </button>
            <button
              onClick={() => window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}`)}
              className="block w-full text-left px-3 py-2 text-sm text-gray-700 dark:text-gray-300 
                         hover:bg-gray-100 dark:hover:bg-zinc-700 rounded"
            >
              Share on LinkedIn
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default JobCard;