// File: /src/pages/admin/AdminJobs.jsx

import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { 
  Briefcase, Filter, Search, Download, Plus, 
  TrendingUp, MapPin, DollarSign, Calendar, 
  CheckCircle, XCircle, Clock, Eye, Edit, Trash2,
  BarChart3, Users, Target, AlertTriangle, Hash,
  Copy, ExternalLink, Tag, Building, UserCheck
} from 'lucide-react';
import { auth, db } from '../../firebase/config';
import { collection, getDocs, query, orderBy, updateDoc, doc, deleteDoc, addDoc, serverTimestamp } from 'firebase/firestore';

import JobTable from '../../components/admin/tables/JobTable';

/**
 * @function generateJobId
 * @description Generates a unique job identifier with prefix and timestamp
 * @param {string} company - Company name for prefix
 * @returns {string} Unique job ID (e.g., "JOB-ABC-2024-001")
 */
const generateJobId = (company) => {
  const prefix = company?.substring(0, 3).toUpperCase() || 'JOB';
  const year = new Date().getFullYear();
  const timestamp = Date.now().toString().slice(-3);
  return `${prefix}-${year}-${timestamp}`;
};

/**
 * @function formatJobId
 * @description Formats job ID for display with copy functionality
 * @param {string} jobId - The job ID to format
 * @returns {JSX.Element} Formatted job ID with copy button
 */
const JobIdDisplay = ({ jobId, onCopy }) => (
  <div className="flex items-center gap-2">
    <Hash className="w-4 h-4 text-blue-600" />
    <span className="font-mono text-sm bg-blue-50 text-blue-700 px-2 py-1 rounded">
      {jobId}
    </span>
    <button
      onClick={() => onCopy(jobId)}
      className="p-1 hover:bg-blue-100 rounded transition-colors"
      title="Copy Job ID"
    >
      <Copy className="w-3 h-3 text-blue-600" />
    </button>
  </div>
);

const AdminJobs = () => {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [filters, setFilters] = useState({
    status: 'all',
    category: 'all',
    location: 'all',
    salary: 'all',
    dateRange: 'all',
    search: '',
    jobId: '',
    employer: 'all',
    priority: 'all'
  });
  const [jobStats, setJobStats] = useState({
    total: 0,
    active: 0,
    pending: 0,
    expired: 0,
    applications: 0,
    avgSalary: 0,
    uniqueEmployers: 0,
    highPriority: 0
  });
  const [selectedJobs, setSelectedJobs] = useState(new Set());
  const [viewMode, setViewMode] = useState('table'); // table, grid, analytics
  const [showFilters, setShowFilters] = useState(false);
  const [copiedJobId, setCopiedJobId] = useState(null);

  const fetchJobs = useCallback(async () => {
    try {
      setLoading(true);
      const q = query(collection(db, 'jobs'), orderBy('createdAt', 'desc'));
      const snap = await getDocs(q);
      const jobList = snap.docs.map(doc => {
        const data = doc.data();
        return { 
          id: doc.id, 
          ...data,
          jobId: data.jobId || generateJobId(data.company),
          createdAt: data.createdAt?.toDate() || new Date(),
          priority: data.priority || 'normal',
          applications: data.applications || 0,
          views: data.views || 0
        };
      });
      
      setJobs(jobList);
      calculateJobStats(jobList);
    } catch (error) {
      console.error('Error fetching jobs:', error);
    } finally {
      setLoading(false);
    }
  }, [calculateJobStats]);

  const calculateJobStats = useCallback((jobList) => {
    const uniqueEmployers = new Set(jobList.map(job => job.employerId || job.company)).size;
    const stats = {
      total: jobList.length,
      active: jobList.filter(job => job.status === 'active').length,
      pending: jobList.filter(job => job.status === 'pending').length,
      expired: jobList.filter(job => job.status === 'expired').length,
      applications: jobList.reduce((sum, job) => sum + (job.applications || 0), 0),
      avgSalary: jobList.length > 0 
        ? jobList.reduce((sum, job) => sum + (job.salary || 0), 0) / jobList.length 
        : 0,
      uniqueEmployers,
      highPriority: jobList.filter(job => job.priority === 'high').length
    };
    setJobStats(stats);
  }, []);

  const applyFilters = useCallback(() => {
    let filtered = [...jobs];

    // Status filter
    if (filters.status !== 'all') {
      filtered = filtered.filter(job => job.status === filters.status);
    }

    // Category filter
    if (filters.category !== 'all') {
      filtered = filtered.filter(job => job.category === filters.category);
    }

    // Location filter
    if (filters.location !== 'all') {
      filtered = filtered.filter(job => job.location === filters.location);
    }

    // Salary filter
    if (filters.salary !== 'all') {
      const [min, max] = filters.salary.split('-').map(Number);
      filtered = filtered.filter(job => {
        const salary = job.salary || 0;
        return salary >= min && (max ? salary <= max : true);
      });
    }

    // Date range filter
    if (filters.dateRange !== 'all') {
      const now = new Date();
      const daysAgo = parseInt(filters.dateRange);
      const cutoffDate = new Date(now.getTime() - (daysAgo * 24 * 60 * 60 * 1000));
      
      filtered = filtered.filter(job => {
        const jobDate = job.createdAt?.toDate?.() || new Date(job.createdAt);
        return jobDate >= cutoffDate;
      });
    }

    // Job ID filter
    if (filters.jobId) {
      const jobIdTerm = filters.jobId.toLowerCase();
      filtered = filtered.filter(job => 
        job.jobId?.toLowerCase().includes(jobIdTerm)
      );
    }

    // Employer filter
    if (filters.employer !== 'all') {
      filtered = filtered.filter(job => 
        job.employerId === filters.employer || job.company === filters.employer
      );
    }

    // Priority filter
    if (filters.priority !== 'all') {
      filtered = filtered.filter(job => job.priority === filters.priority);
    }

    // Search filter (enhanced)
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      filtered = filtered.filter(job => 
        job.title?.toLowerCase().includes(searchTerm) ||
        job.company?.toLowerCase().includes(searchTerm) ||
        job.location?.toLowerCase().includes(searchTerm) ||
        job.description?.toLowerCase().includes(searchTerm) ||
        job.jobId?.toLowerCase().includes(searchTerm) ||
        job.employerId?.toLowerCase().includes(searchTerm)
      );
    }

    setFilteredJobs(filtered);
  }, [jobs, filters]);

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const copyJobId = async (jobId) => {
    try {
      await navigator.clipboard.writeText(jobId);
      setCopiedJobId(jobId);
      setTimeout(() => setCopiedJobId(null), 2000);
    } catch (error) {
      console.error('Failed to copy job ID:', error);
    }
  };

  const handleBulkAction = async (action) => {
    if (selectedJobs.size === 0) {
      alert('Please select jobs to perform bulk actions');
      return;
    }

    try {
      const batch = [];
      selectedJobs.forEach(jobId => {
        const jobRef = doc(db, 'jobs', jobId);
        switch (action) {
          case 'approve':
            batch.push(updateDoc(jobRef, { 
              status: 'active',
              approvedAt: serverTimestamp(),
              approvedBy: auth.currentUser?.email
            }));
            break;
          case 'reject':
            batch.push(updateDoc(jobRef, { 
              status: 'rejected',
              rejectedAt: serverTimestamp(),
              rejectedBy: auth.currentUser?.email
            }));
            break;
          case 'delete':
            batch.push(deleteDoc(jobRef));
            break;
          case 'priority-high':
            batch.push(updateDoc(jobRef, { priority: 'high' }));
            break;
          case 'priority-normal':
            batch.push(updateDoc(jobRef, { priority: 'normal' }));
            break;
        }
      });

      await Promise.all(batch);
      setSelectedJobs(new Set());
      fetchJobs(); // Refresh data
      
      // Log the bulk action
      await addDoc(collection(db, 'logs'), {
        action: `bulk-${action}`,
        type: 'job-management',
        performedBy: auth.currentUser?.email || 'admin',
        target: `${selectedJobs.size} jobs`,
        details: `Bulk ${action} performed on ${selectedJobs.size} jobs`,
        timestamp: serverTimestamp(),
      });
    } catch (error) {
      console.error('Error performing bulk action:', error);
      alert('Error performing bulk action');
    }
  };

  const exportJobs = () => {
    if (filteredJobs.length === 0) {
      alert('No jobs to export');
      return;
    }

    const csvContent = [
      ['Job ID', 'Title', 'Company', 'Location', 'Salary', 'Status', 'Priority', 'Applications', 'Created Date', 'Category'],
      ...filteredJobs.map(job => [
        job.jobId || 'N/A',
        job.title || 'N/A',
        job.company || 'N/A',
        job.location || 'N/A',
        job.salary || 'N/A',
        job.status || 'N/A',
        job.priority || 'normal',
        job.applications || 0,
        job.createdAt?.toLocaleDateString() || 'N/A',
        job.category || 'N/A'
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `jobs-export-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const getCategories = () => {
    const categories = [...new Set(jobs.map(job => job.category).filter(Boolean))];
    return categories.sort();
  };

  const getLocations = () => {
    const locations = [...new Set(jobs.map(job => job.location).filter(Boolean))];
    return locations.sort();
  };

  const getEmployers = () => {
    const employers = [...new Set(jobs.map(job => job.employerId || job.company).filter(Boolean))];
    return employers.sort();
  };

  const renderStatsCards = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl shadow-lg border border-gray-200 p-6"
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Total Jobs</p>
            <p className="text-3xl font-bold text-gray-900">{jobStats.total}</p>
          </div>
          <div className="p-3 bg-blue-100 rounded-xl">
            <Briefcase className="w-6 h-6 text-blue-600" />
          </div>
        </div>
        <div className="mt-4 flex items-center gap-4 text-sm">
          <span className="text-green-600">Active: {jobStats.active}</span>
          <span className="text-yellow-600">Pending: {jobStats.pending}</span>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-xl shadow-lg border border-gray-200 p-6"
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Total Applications</p>
            <p className="text-3xl font-bold text-gray-900">{jobStats.applications}</p>
          </div>
          <div className="p-3 bg-green-100 rounded-xl">
            <Users className="w-6 h-6 text-green-600" />
          </div>
        </div>
        <div className="mt-4 text-sm text-gray-600">
          Avg: {Math.round(jobStats.applications / Math.max(jobStats.total, 1))} per job
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white rounded-xl shadow-lg border border-gray-200 p-6"
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Unique Employers</p>
            <p className="text-3xl font-bold text-gray-900">{jobStats.uniqueEmployers}</p>
          </div>
          <div className="p-3 bg-purple-100 rounded-xl">
            <Building className="w-6 h-6 text-purple-600" />
          </div>
        </div>
        <div className="mt-4 text-sm text-gray-600">
          Active companies
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white rounded-xl shadow-lg border border-gray-200 p-6"
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">High Priority</p>
            <p className="text-3xl font-bold text-gray-900">{jobStats.highPriority}</p>
          </div>
          <div className="p-3 bg-red-100 rounded-xl">
            <AlertTriangle className="w-6 h-6 text-red-600" />
          </div>
        </div>
        <div className="mt-4 text-sm text-gray-600">
          Needs attention
        </div>
      </motion.div>
    </div>
  );

  const renderFilters = () => (
    <motion.div
      initial={{ height: 0, opacity: 0 }}
      animate={{ height: showFilters ? 'auto' : 0, opacity: showFilters ? 1 : 0 }}
      className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 mb-6 overflow-hidden"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {/* Job ID Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Job ID
          </label>
          <div className="relative">
            <Hash className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search by Job ID..."
              value={filters.jobId}
              onChange={(e) => handleFilterChange('jobId', e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        {/* Status Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Status
          </label>
          <select
            value={filters.status}
            onChange={(e) => handleFilterChange('status', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">All Statuses</option>
            <option value="active">Active</option>
            <option value="pending">Pending</option>
            <option value="expired">Expired</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>

        {/* Priority Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Priority
          </label>
          <select
            value={filters.priority}
            onChange={(e) => handleFilterChange('priority', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">All Priorities</option>
            <option value="high">High Priority</option>
            <option value="normal">Normal</option>
            <option value="low">Low</option>
          </select>
        </div>

        {/* Category Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Category
          </label>
          <select
            value={filters.category}
            onChange={(e) => handleFilterChange('category', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">All Categories</option>
            {getCategories().map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </div>

        {/* Location Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Location
          </label>
          <select
            value={filters.location}
            onChange={(e) => handleFilterChange('location', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">All Locations</option>
            {getLocations().map(location => (
              <option key={location} value={location}>{location}</option>
            ))}
          </select>
        </div>

        {/* Employer Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Employer
          </label>
          <select
            value={filters.employer}
            onChange={(e) => handleFilterChange('employer', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">All Employers</option>
            {getEmployers().map(employer => (
              <option key={employer} value={employer}>{employer}</option>
            ))}
          </select>
        </div>

        {/* Salary Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Salary Range
          </label>
          <select
            value={filters.salary}
            onChange={(e) => handleFilterChange('salary', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">All Salaries</option>
            <option value="0-30000">$0 - $30,000</option>
            <option value="30000-60000">$30,000 - $60,000</option>
            <option value="60000-100000">$60,000 - $100,000</option>
            <option value="100000-0">$100,000+</option>
          </select>
        </div>

        {/* Date Range Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Date Range
          </label>
          <select
            value={filters.dateRange}
            onChange={(e) => handleFilterChange('dateRange', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">All Time</option>
            <option value="1">Last 24 hours</option>
            <option value="7">Last 7 days</option>
            <option value="30">Last 30 days</option>
            <option value="90">Last 90 days</option>
          </select>
        </div>
      </div>

      {/* Search Bar */}
      <div className="mt-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Search Jobs
        </label>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search by title, company, location, description, or Job ID..."
            value={filters.search}
            onChange={(e) => handleFilterChange('search', e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>
    </motion.div>
  );

  const renderBulkActions = () => (
    <AnimatePresence>
      {selectedJobs.size > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 sticky top-0 z-10"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <span className="text-sm font-medium text-blue-900">
                {selectedJobs.size} job(s) selected
              </span>
              <button
                onClick={() => setSelectedJobs(new Set())}
                className="text-sm text-blue-600 hover:text-blue-800"
              >
                Clear selection
              </button>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleBulkAction('approve')}
                className="px-3 py-1.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
              >
                <CheckCircle className="w-4 h-4 inline mr-1" />
                Approve
              </button>
              <button
                onClick={() => handleBulkAction('reject')}
                className="px-3 py-1.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm"
              >
                <XCircle className="w-4 h-4 inline mr-1" />
                Reject
              </button>
              <button
                onClick={() => handleBulkAction('priority-high')}
                className="px-3 py-1.5 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors text-sm"
              >
                <AlertTriangle className="w-4 h-4 inline mr-1" />
                High Priority
              </button>
              <button
                onClick={() => handleBulkAction('delete')}
                className="px-3 py-1.5 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm"
              >
                <Trash2 className="w-4 h-4 inline mr-1" />
                Delete
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  useEffect(() => {
    const checkAdmin = async () => {
      const user = auth.currentUser;
      if (!user) return navigate('/login');

      try {
        const userDoc = await getDocs(query(collection(db, 'users')));
        const adminDoc = userDoc.docs.find(doc => doc.id === user.uid);
        if (adminDoc?.data()?.role === 'super-admin') {
          setIsAdmin(true);
        } else {
          navigate('/login');
        }
      } catch (error) {
        console.error('Error checking admin status:', error);
        navigate('/login');
      }
    };

    checkAdmin();
  }, [navigate]);

  useEffect(() => {
    if (isAdmin) {
      fetchJobs();
    }
  }, [isAdmin, fetchJobs]);

  useEffect(() => {
    applyFilters();
  }, [applyFilters]);

  if (!isAdmin) return null;

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">💼 Job Management</h1>
          <p className="text-gray-600 mt-1">Manage and monitor all job listings on the platform</p>
        </div>
        
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Filter className="w-4 h-4" />
            {showFilters ? 'Hide' : 'Show'} Filters
          </button>
          
          <button
            onClick={exportJobs}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <Download className="w-4 h-4" />
            Export
          </button>
          
          <div className="flex items-center gap-2 bg-white border border-gray-300 rounded-lg p-1">
            <button
              onClick={() => setViewMode('table')}
              className={`px-3 py-1.5 rounded text-sm transition-colors ${
                viewMode === 'table' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <BarChart3 className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`px-3 py-1.5 rounded text-sm transition-colors ${
                viewMode === 'grid' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <Target className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      {renderStatsCards()}

      {/* Filters */}
      {renderFilters()}

      {/* Bulk Actions */}
      {renderBulkActions()}

      {/* Jobs Table/Grid */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-3"></div>
              <p className="text-gray-600">Loading jobs...</p>
            </div>
          </div>
        ) : filteredJobs.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Briefcase className="w-8 h-8 text-gray-400" />
            </div>
            <p className="text-gray-600 font-medium">No jobs found</p>
            <p className="text-gray-400 text-sm mt-1">
              {filters.search || filters.jobId ? 'Try adjusting your search criteria' : 'Jobs will appear here once posted'}
            </p>
          </div>
        ) : (
          <JobTable 
            jobs={filteredJobs}
            selectedJobs={selectedJobs}
            setSelectedJobs={setSelectedJobs}
            onUpdateStatus={(jobId, status) => {
              // Handle individual job status update
              const jobRef = doc(db, 'jobs', jobId);
              updateDoc(jobRef, { status }).then(() => fetchJobs());
            }}
            jobIdDisplay={JobIdDisplay}
            copyJobId={copyJobId}
            copiedJobId={copiedJobId}
          />
        )}
      </div>

      {/* Copy Success Toast */}
      <AnimatePresence>
        {copiedJobId && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-4 right-4 bg-green-600 text-white px-4 py-2 rounded-lg shadow-lg z-50"
          >
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4" />
              <span>Job ID copied to clipboard!</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminJobs;
