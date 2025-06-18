// File: /src/pages/admin/AdminJobs.jsx

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Briefcase, Filter, Search, Download, Plus, 
  TrendingUp, MapPin, DollarSign, Calendar, 
  CheckCircle, XCircle, Clock, Eye, Edit, Trash2,
  BarChart3, Users, Target, AlertTriangle
} from 'lucide-react';
import { auth, db } from '../../firebase/config';
import { collection, getDocs, query, where, orderBy, limit, updateDoc, doc, deleteDoc } from 'firebase/firestore';

import JobTable from '../../components/admin/tables/JobTable';

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
    search: ''
  });
  const [jobStats, setJobStats] = useState({
    total: 0,
    active: 0,
    pending: 0,
    expired: 0,
    applications: 0,
    avgSalary: 0
  });
  const [selectedJobs, setSelectedJobs] = useState(new Set());
  const [viewMode, setViewMode] = useState('table'); // table, grid, analytics

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
  }, [isAdmin]);

  useEffect(() => {
    applyFilters();
  }, [filters, jobs]);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const q = query(collection(db, 'jobs'), orderBy('createdAt', 'desc'));
      const snap = await getDocs(q);
      const jobList = snap.docs.map(doc => ({ 
        id: doc.id, 
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date()
      }));
      
      setJobs(jobList);
      calculateJobStats(jobList);
    } catch (error) {
      console.error('Error fetching jobs:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateJobStats = (jobList) => {
    const stats = {
      total: jobList.length,
      active: jobList.filter(job => job.status === 'active').length,
      pending: jobList.filter(job => job.status === 'pending').length,
      expired: jobList.filter(job => job.status === 'expired').length,
      applications: jobList.reduce((sum, job) => sum + (job.applications || 0), 0),
      avgSalary: jobList.length > 0 
        ? jobList.reduce((sum, job) => sum + (job.salary || 0), 0) / jobList.length 
        : 0
    };
    setJobStats(stats);
  };

  const applyFilters = () => {
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

    // Search filter
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      filtered = filtered.filter(job => 
        job.title?.toLowerCase().includes(searchTerm) ||
        job.company?.toLowerCase().includes(searchTerm) ||
        job.location?.toLowerCase().includes(searchTerm) ||
        job.description?.toLowerCase().includes(searchTerm)
      );
    }

    setFilteredJobs(filtered);
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
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
            batch.push(updateDoc(jobRef, { status: 'active' }));
            break;
          case 'reject':
            batch.push(updateDoc(jobRef, { status: 'rejected' }));
            break;
          case 'delete':
            batch.push(deleteDoc(jobRef));
            break;
        }
      });

      await Promise.all(batch);
      setSelectedJobs(new Set());
      fetchJobs(); // Refresh data
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

    const headers = [
      'ID', 'Title', 'Company', 'Location', 'Category', 'Salary', 
      'Status', 'Applications', 'Created At', 'Description'
    ];

    const csvData = filteredJobs.map(job => [
      job.id,
      job.title || '',
      job.company || '',
      job.location || '',
      job.category || '',
      job.salary || '',
      job.status || '',
      job.applications || 0,
      job.createdAt?.toISOString() || '',
      job.description || ''
    ]);

    const csvContent = [
      headers.join(','),
      ...csvData.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `jobs_export_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getCategories = () => {
    const categories = new Set(jobs.map(job => job.category).filter(Boolean));
    return Array.from(categories);
  };

  const getLocations = () => {
    const locations = new Set(jobs.map(job => job.location).filter(Boolean));
    return Array.from(locations);
  };

  const renderStatsCards = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Total Jobs</p>
            <p className="text-2xl font-bold text-gray-900">{jobStats.total}</p>
          </div>
          <div className="p-2 bg-blue-100 rounded-lg">
            <Briefcase className="w-5 h-5 text-blue-600" />
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Active Jobs</p>
            <p className="text-2xl font-bold text-gray-900">{jobStats.active}</p>
          </div>
          <div className="p-2 bg-green-100 rounded-lg">
            <CheckCircle className="w-5 h-5 text-green-600" />
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Pending Review</p>
            <p className="text-2xl font-bold text-gray-900">{jobStats.pending}</p>
          </div>
          <div className="p-2 bg-yellow-100 rounded-lg">
            <Clock className="w-5 h-5 text-yellow-600" />
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Avg Salary</p>
            <p className="text-2xl font-bold text-gray-900">${jobStats.avgSalary.toLocaleString()}</p>
          </div>
          <div className="p-2 bg-purple-100 rounded-lg">
            <DollarSign className="w-5 h-5 text-purple-600" />
          </div>
        </div>
      </motion.div>
    </div>
  );

  const renderFilters = () => (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
        <button
          onClick={() => setFilters({
            status: 'all',
            category: 'all',
            location: 'all',
            salary: 'all',
            dateRange: 'all',
            search: ''
          })}
          className="text-sm text-blue-600 hover:text-blue-800"
        >
          Clear All
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {/* Search */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={filters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
              placeholder="Search jobs..."
              className="pl-10 pr-3 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        {/* Status */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
          <select
            value={filters.status}
            onChange={(e) => handleFilterChange('status', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="pending">Pending</option>
            <option value="rejected">Rejected</option>
            <option value="expired">Expired</option>
          </select>
        </div>

        {/* Category */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
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

        {/* Location */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
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

        {/* Salary Range */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Salary Range</label>
          <select
            value={filters.salary}
            onChange={(e) => handleFilterChange('salary', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">All Salaries</option>
            <option value="0-50000">$0 - $50k</option>
            <option value="50000-100000">$50k - $100k</option>
            <option value="100000-150000">$100k - $150k</option>
            <option value="150000-">$150k+</option>
          </select>
        </div>

        {/* Date Range */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Date Range</label>
          <select
            value={filters.dateRange}
            onChange={(e) => handleFilterChange('dateRange', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">All Time</option>
            <option value="7">Last 7 days</option>
            <option value="30">Last 30 days</option>
            <option value="90">Last 90 days</option>
          </select>
        </div>
      </div>
    </div>
  );

  const renderBulkActions = () => (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-600">
            {selectedJobs.size} jobs selected
          </span>
          
          <div className="flex gap-2">
            <button
              onClick={() => handleBulkAction('approve')}
              disabled={selectedJobs.size === 0}
              className="px-3 py-1 text-sm bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
            >
              Approve
            </button>
            <button
              onClick={() => handleBulkAction('reject')}
              disabled={selectedJobs.size === 0}
              className="px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50"
            >
              Reject
            </button>
            <button
              onClick={() => handleBulkAction('delete')}
              disabled={selectedJobs.size === 0}
              className="px-3 py-1 text-sm bg-gray-600 text-white rounded hover:bg-gray-700 disabled:opacity-50"
            >
              Delete
            </button>
          </div>
        </div>

        <div className="flex gap-2">
          <button
            onClick={exportJobs}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <Download className="w-4 h-4" />
            Export
          </button>
          <button
            onClick={() => navigate('/admin/jobs/new')}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            <Plus className="w-4 h-4" />
            Add Job
          </button>
        </div>
      </div>
    </div>
  );

  if (!isAdmin) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">💼 Job Management</h1>
              <p className="text-gray-600">Manage and monitor all job listings on the platform</p>
            </div>
            
            <div className="flex items-center gap-3">
              <button
                onClick={() => setViewMode('table')}
                className={`px-3 py-1 text-sm rounded-md ${
                  viewMode === 'table' 
                    ? 'bg-blue-100 text-blue-700' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Table
              </button>
              <button
                onClick={() => setViewMode('grid')}
                className={`px-3 py-1 text-sm rounded-md ${
                  viewMode === 'grid' 
                    ? 'bg-blue-100 text-blue-700' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Grid
              </button>
              <button
                onClick={() => setViewMode('analytics')}
                className={`px-3 py-1 text-sm rounded-md ${
                  viewMode === 'analytics' 
                    ? 'bg-blue-100 text-blue-700' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Analytics
              </button>
            </div>
          </div>

          {/* Stats Cards */}
          {renderStatsCards()}

          {/* Filters */}
          {renderFilters()}

          {/* Bulk Actions */}
          {renderBulkActions()}
        </motion.div>

        {/* Content */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading jobs...</p>
          </div>
        ) : (
          <motion.div
            key={viewMode}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
          >
            {viewMode === 'table' && (
              <JobTable 
                jobs={filteredJobs} 
                selectedJobs={selectedJobs}
                onSelectJob={(jobId, selected) => {
                  const newSelected = new Set(selectedJobs);
                  if (selected) {
                    newSelected.add(jobId);
                  } else {
                    newSelected.delete(jobId);
                  }
                  setSelectedJobs(newSelected);
                }}
                onSelectAll={(selected) => {
                  if (selected) {
                    setSelectedJobs(new Set(filteredJobs.map(job => job.id)));
                  } else {
                    setSelectedJobs(new Set());
                  }
                }}
              />
            )}
            
            {viewMode === 'grid' && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredJobs.map(job => (
                  <motion.div
                    key={job.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="font-semibold text-gray-900">{job.title}</h3>
                        <p className="text-sm text-gray-600">{job.company}</p>
                      </div>
                      <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                        job.status === 'active' ? 'bg-green-100 text-green-800' :
                        job.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        job.status === 'rejected' ? 'bg-red-100 text-red-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {job.status}
                      </div>
                    </div>
                    
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <MapPin className="w-4 h-4" />
                        {job.location}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <DollarSign className="w-4 h-4" />
                        ${job.salary?.toLocaleString() || 'Not specified'}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Users className="w-4 h-4" />
                        {job.applications || 0} applications
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <button className="flex-1 px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="flex-1 px-3 py-1 text-sm bg-green-600 text-white rounded hover:bg-green-700">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button className="flex-1 px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
            
            {viewMode === 'analytics' && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Job Analytics</h3>
                <p className="text-gray-600">Analytics view coming soon...</p>
              </div>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default AdminJobs;
