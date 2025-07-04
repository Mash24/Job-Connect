import React, { useEffect, useState, useCallback } from 'react';
import { AnimatePresence } from 'framer-motion';
import { 
  Megaphone, Loader2, Trash2, Plus, Edit, Eye, 
  Calendar, Users, Target, Bell, Clock, CheckCircle,
  AlertTriangle, Info, Globe, Shield, Filter, Search,
  Download, Archive, Send
} from 'lucide-react';
import {
  collection,
  onSnapshot,
  addDoc,
  deleteDoc,
  updateDoc,
  serverTimestamp,
  doc,
  query,
  orderBy,
} from 'firebase/firestore';
import { db, auth } from '../../firebase/config';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AdminAnnouncements = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [filteredAnnouncements, setFilteredAnnouncements] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingAnnouncement, setEditingAnnouncement] = useState(null);
  
  // Form state
  const [formData, setFormData] = useState({
    title: '',
    message: '',
    visibleTo: 'all',
    priority: 'normal',
    category: 'general',
    scheduledFor: '',
    expiresAt: '',
    isActive: true
  });

  // Filters
  const [filters, setFilters] = useState({
    status: 'all',
    category: 'all',
    priority: 'all',
    visibleTo: 'all',
    search: ''
  });

  const [announcementStats, setAnnouncementStats] = useState({
    total: 0,
    active: 0,
    scheduled: 0,
    expired: 0,
    highPriority: 0
  });

  const applyFilters = useCallback(() => {
    let filtered = [...announcements];

    // Status filter
    if (filters.status !== 'all') {
      const now = new Date();
      switch (filters.status) {
        case 'active':
          filtered = filtered.filter(a => a.isActive && (!a.expiresAt || new Date(a.expiresAt) > now));
          break;
        case 'scheduled':
          filtered = filtered.filter(a => a.scheduledFor && new Date(a.scheduledFor) > now);
          break;
        case 'expired':
          filtered = filtered.filter(a => a.expiresAt && new Date(a.expiresAt) <= now);
          break;
        case 'inactive':
          filtered = filtered.filter(a => !a.isActive);
          break;
      }
    }

    // Category filter
    if (filters.category !== 'all') {
      filtered = filtered.filter(a => a.category === filters.category);
    }

    // Priority filter
    if (filters.priority !== 'all') {
      filtered = filtered.filter(a => a.priority === filters.priority);
    }

    // Visible to filter
    if (filters.visibleTo !== 'all') {
      filtered = filtered.filter(a => a.visibleTo === filters.visibleTo);
    }

    // Search filter
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      filtered = filtered.filter(a => 
        a.title?.toLowerCase().includes(searchTerm) ||
        a.message?.toLowerCase().includes(searchTerm) ||
        a.category?.toLowerCase().includes(searchTerm)
      );
    }

    setFilteredAnnouncements(filtered);
  }, [announcements, filters]);

  useEffect(() => {
    const q = query(
      collection(db, 'announcements'),
      orderBy('timestamp', 'desc')
    );
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ 
        id: doc.id, 
        ...doc.data(),
        timestamp: doc.data().timestamp?.toDate() || new Date()
      }));
      setAnnouncements(data);
      calculateStats(data);
    });
    
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [filters, announcements, applyFilters]);

  const calculateStats = (announcementList) => {
    const now = new Date();
    const stats = {
      total: announcementList.length,
      active: announcementList.filter(a => a.isActive && (!a.expiresAt || new Date(a.expiresAt) > now)).length,
      scheduled: announcementList.filter(a => a.scheduledFor && new Date(a.scheduledFor) > now).length,
      expired: announcementList.filter(a => a.expiresAt && new Date(a.expiresAt) <= now).length,
      highPriority: announcementList.filter(a => a.priority === 'high').length
    };
    setAnnouncementStats(stats);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.message.trim()) return;
    
    setLoading(true);

    try {
      const announcementData = {
        title: formData.title.trim(),
        message: formData.message.trim(),
        createdBy: auth.currentUser?.email || 'admin',
        visibleTo: formData.visibleTo,
        priority: formData.priority,
        category: formData.category,
        isActive: formData.isActive,
        timestamp: serverTimestamp(),
        ...(formData.scheduledFor && { scheduledFor: new Date(formData.scheduledFor) }),
        ...(formData.expiresAt && { expiresAt: new Date(formData.expiresAt) })
      };

      if (editingAnnouncement) {
        await updateDoc(doc(db, 'announcements', editingAnnouncement.id), announcementData);
        toast.success('📢 Announcement updated successfully');
        setEditingAnnouncement(null);
      } else {
        await addDoc(collection(db, 'announcements'), announcementData);
        toast.success('📢 Announcement posted successfully');
      }
      
      resetForm();
    } catch (err) {
      console.error('Error posting announcement:', err);
      toast.error('❌ Failed to post announcement');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this announcement?')) return;
    
    try {
      await deleteDoc(doc(db, 'announcements', id));
      toast.success('🗑️ Announcement deleted');
    } catch (err) {
      console.error('Error deleting announcement:', err);
      toast.error('❌ Failed to delete announcement');
    }
  };

  const handleEdit = (announcement) => {
    setEditingAnnouncement(announcement);
    setFormData({
      title: announcement.title || '',
      message: announcement.message || '',
      visibleTo: announcement.visibleTo || 'all',
      priority: announcement.priority || 'normal',
      category: announcement.category || 'general',
      scheduledFor: announcement.scheduledFor ? new Date(announcement.scheduledFor).toISOString().slice(0, 16) : '',
      expiresAt: announcement.expiresAt ? new Date(announcement.expiresAt).toISOString().slice(0, 16) : '',
      isActive: announcement.isActive !== false
    });
    setShowForm(true);
  };

  const resetForm = () => {
    setFormData({
      title: '',
      message: '',
      visibleTo: 'all',
      priority: 'normal',
      category: 'general',
      scheduledFor: '',
      expiresAt: '',
      isActive: true
    });
    setShowForm(false);
    setEditingAnnouncement(null);
  };

  const getPriorityIcon = (priority) => {
    switch (priority) {
      case 'high':
        return <AlertTriangle className="w-4 h-4 text-red-600" />;
      case 'normal':
        return <Info className="w-4 h-4 text-blue-600" />;
      case 'low':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      default:
        return <Info className="w-4 h-4 text-gray-600" />;
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return 'bg-red-50 border-red-200 text-red-800';
      case 'normal':
        return 'bg-blue-50 border-blue-200 text-blue-800';
      case 'low':
        return 'bg-green-50 border-green-200 text-green-800';
      default:
        return 'bg-gray-50 border-gray-200 text-gray-800';
    }
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'maintenance':
        return <Shield className="w-4 h-4" />;
      case 'update':
        return <Globe className="w-4 h-4" />;
      case 'general':
        return <Megaphone className="w-4 h-4" />;
      default:
        return <Bell className="w-4 h-4" />;
    }
  };

  const formatTimestamp = (timestamp) => {
    const date = timestamp?.toDate?.() || new Date(timestamp);
    return date.toLocaleString();
  };

  const exportAnnouncements = () => {
    if (filteredAnnouncements.length === 0) {
      alert('No announcements to export');
      return;
    }

    const headers = [
      'Title', 'Message', 'Category', 'Priority', 'Visible To', 'Status', 'Created By', 'Created At', 'Scheduled For', 'Expires At'
    ];

    const csvData = filteredAnnouncements.map(announcement => [
      announcement.title || '',
      announcement.message || '',
      announcement.category || '',
      announcement.priority || '',
      announcement.visibleTo || '',
      announcement.isActive ? 'Active' : 'Inactive',
      announcement.createdBy || '',
      formatTimestamp(announcement.timestamp),
      announcement.scheduledFor ? formatTimestamp(announcement.scheduledFor) : '',
      announcement.expiresAt ? formatTimestamp(announcement.expiresAt) : ''
    ]);

    const csvContent = [
      headers.join(','),
      ...csvData.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `announcements_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const renderStatsCards = () => (
    <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-6">
      <div
        className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Total</p>
            <p className="text-2xl font-bold text-gray-900">{announcementStats.total}</p>
          </div>
          <div className="p-2 bg-gray-100 rounded-lg">
            <Megaphone className="w-5 h-5 text-gray-600" />
          </div>
        </div>
      </div>

      <div
        className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Active</p>
            <p className="text-2xl font-bold text-green-600">{announcementStats.active}</p>
          </div>
          <div className="p-2 bg-green-100 rounded-lg">
            <CheckCircle className="w-5 h-5 text-green-600" />
          </div>
        </div>
      </div>

      <div
        className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Scheduled</p>
            <p className="text-2xl font-bold text-blue-600">{announcementStats.scheduled}</p>
          </div>
          <div className="p-2 bg-blue-100 rounded-lg">
            <Calendar className="w-5 h-5 text-blue-600" />
          </div>
        </div>
      </div>

      <div
        className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Expired</p>
            <p className="text-2xl font-bold text-red-600">{announcementStats.expired}</p>
          </div>
          <div className="p-2 bg-red-100 rounded-lg">
            <Clock className="w-5 h-5 text-red-600" />
          </div>
        </div>
      </div>

      <div
        className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">High Priority</p>
            <p className="text-2xl font-bold text-orange-600">{announcementStats.highPriority}</p>
          </div>
          <div className="p-2 bg-orange-100 rounded-lg">
            <AlertTriangle className="w-5 h-5 text-orange-600" />
          </div>
        </div>
      </div>
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
            priority: 'all',
            visibleTo: 'all',
            search: ''
          })}
          className="text-sm text-blue-600 hover:text-blue-800"
        >
          Clear All
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Search */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={filters.search}
              onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
              placeholder="Search announcements..."
              className="pl-10 pr-3 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        {/* Status */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
          <select
            value={filters.status}
            onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="scheduled">Scheduled</option>
            <option value="expired">Expired</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>

        {/* Category */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
          <select
            value={filters.category}
            onChange={(e) => setFilters(prev => ({ ...prev, category: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">All Categories</option>
            <option value="general">General</option>
            <option value="maintenance">Maintenance</option>
            <option value="update">Update</option>
          </select>
        </div>

        {/* Priority */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
          <select
            value={filters.priority}
            onChange={(e) => setFilters(prev => ({ ...prev, priority: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">All Priorities</option>
            <option value="high">High</option>
            <option value="normal">Normal</option>
            <option value="low">Low</option>
          </select>
        </div>

        {/* Visible To */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Visible To</label>
          <select
            value={filters.visibleTo}
            onChange={(e) => setFilters(prev => ({ ...prev, visibleTo: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">All Users</option>
            <option value="admin">Admins Only</option>
            <option value="job-seeker">Job Seekers</option>
            <option value="employer">Employers</option>
          </select>
        </div>
      </div>
    </div>
  );

  const renderForm = () => (
    <div
      className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">
          {editingAnnouncement ? 'Edit Announcement' : 'Create New Announcement'}
        </h3>
        <button
          onClick={resetForm}
          className="text-sm text-gray-600 hover:text-gray-800"
        >
          Cancel
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              placeholder="Announcement title..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
            <select
              value={formData.category}
              onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="general">General</option>
              <option value="maintenance">Maintenance</option>
              <option value="update">Update</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
          <textarea
            value={formData.message}
            onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
            placeholder="Type your announcement message here..."
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
            <select
              value={formData.priority}
              onChange={(e) => setFormData(prev => ({ ...prev, priority: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="low">Low</option>
              <option value="normal">Normal</option>
              <option value="high">High</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Visible To</label>
            <select
              value={formData.visibleTo}
              onChange={(e) => setFormData(prev => ({ ...prev, visibleTo: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Users</option>
              <option value="admin">Admins Only</option>
              <option value="job-seeker">Job Seekers</option>
              <option value="employer">Employers</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Scheduled For</label>
            <input
              type="datetime-local"
              value={formData.scheduledFor}
              onChange={(e) => setFormData(prev => ({ ...prev, scheduledFor: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Expires At</label>
            <input
              type="datetime-local"
              value={formData.expiresAt}
              onChange={(e) => setFormData(prev => ({ ...prev, expiresAt: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        <div className="flex items-center gap-4">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={formData.isActive}
              onChange={(e) => setFormData(prev => ({ ...prev, isActive: e.target.checked }))}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <span className="text-sm text-gray-700">Active</span>
          </label>

          <button
            type="submit"
            disabled={loading}
            className="ml-auto flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
            {loading ? 'Posting...' : (editingAnnouncement ? 'Update' : 'Post')}
          </button>
        </div>
      </form>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">📢 Announcements</h1>
              <p className="text-gray-600">Manage platform announcements and notifications</p>
            </div>
            
            <div className="flex items-center gap-3">
              <button
                onClick={exportAnnouncements}
                className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
              >
                <Download className="w-4 h-4" />
                Export
              </button>
              <button
                onClick={() => setShowForm(true)}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                <Plus className="w-4 h-4" />
                New Announcement
              </button>
            </div>
          </div>

          {/* Stats Cards */}
          {renderStatsCards()}

          {/* Filters */}
          {renderFilters()}
        </div>

        {/* Form */}
        <AnimatePresence>
          {(showForm || editingAnnouncement) && renderForm()}
        </AnimatePresence>

        {/* Announcements List */}
        <div className="space-y-4">
          {filteredAnnouncements.length === 0 ? (
            <div className="text-center py-12">
              <Megaphone className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No announcements found</h3>
              <p className="text-gray-500">Try adjusting your filters or create a new announcement</p>
            </div>
          ) : (
            <AnimatePresence>
              {filteredAnnouncements.map((announcement) => (
                <div
                  key={announcement.id}
                  className={`bg-white rounded-lg shadow-sm border p-6 ${getPriorityColor(announcement.priority)}`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3 flex-1">
                      <div className="flex-shrink-0 mt-1">
                        {getPriorityIcon(announcement.priority)}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                          {announcement.title && (
                            <h3 className="font-semibold text-gray-900">{announcement.title}</h3>
                          )}
                          <div className="flex items-center gap-1">
                            {getCategoryIcon(announcement.category)}
                            <span className="text-sm text-gray-600">{announcement.category}</span>
                          </div>
                          <span className="text-xs text-gray-500">•</span>
                          <span className="text-sm text-gray-600">{announcement.visibleTo}</span>
                        </div>
                        
                        <p className="text-gray-800 leading-relaxed mb-3">{announcement.message}</p>
                        
                        <div className="flex items-center gap-4 text-xs text-gray-600">
                          <span>By {announcement.createdBy}</span>
                          <span>•</span>
                          <span>{formatTimestamp(announcement.timestamp)}</span>
                          {announcement.scheduledFor && (
                            <>
                              <span>•</span>
                              <span>Scheduled: {formatTimestamp(announcement.scheduledFor)}</span>
                            </>
                          )}
                          {announcement.expiresAt && (
                            <>
                              <span>•</span>
                              <span>Expires: {formatTimestamp(announcement.expiresAt)}</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2 ml-4">
                      <button
                        onClick={() => handleEdit(announcement)}
                        className="p-2 text-gray-400 hover:text-blue-600 rounded-lg hover:bg-blue-50"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(announcement.id)}
                        className="p-2 text-gray-400 hover:text-red-600 rounded-lg hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </AnimatePresence>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminAnnouncements; 