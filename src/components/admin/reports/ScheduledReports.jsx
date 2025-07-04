import React, { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import { 
  X, Plus, Calendar, Clock, Mail, Users, FileText, 
  Settings, Trash2, Play, Pause, Edit, Eye, Download,
  CheckCircle, AlertCircle, Clock as ClockIcon
} from 'lucide-react';
import { collection, getDocs, addDoc, deleteDoc, doc, updateDoc, serverTimestamp, query, where, orderBy } from 'firebase/firestore';
import { db } from '../../../firebase/config';

const ScheduledReports = ({ onClose, currentAdmin }) => {
  const [scheduledReports, setScheduledReports] = useState([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [selectedReport, setSelectedReport] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    frequency: 'weekly',
    dayOfWeek: 'monday',
    time: '09:00',
    recipients: [],
    reportId: '',
    format: 'pdf',
    active: true
  });

  // Fetch scheduled reports
  useEffect(() => {
    const fetchScheduledReports = async () => {
      try {
        const reportsSnap = await getDocs(query(
          collection(db, 'scheduledReports'),
          where('createdBy', '==', currentAdmin?.id),
          orderBy('createdAt', 'desc')
        ));
        
        const reports = reportsSnap.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setScheduledReports(reports);
      } catch (error) {
        console.error('Error fetching scheduled reports:', error);
      } finally {
        setLoading(false);
      }
    };

    if (currentAdmin?.id) {
      fetchScheduledReports();
    }
  }, [currentAdmin]);

  // Create new scheduled report
  const createScheduledReport = async () => {
    try {
      const scheduledReport = {
        ...formData,
        createdBy: currentAdmin.id,
        createdByEmail: currentAdmin.email,
        createdAt: serverTimestamp(),
        lastRun: null,
        nextRun: calculateNextRun(formData.frequency, formData.dayOfWeek, formData.time),
        status: 'active'
      };

      const docRef = await addDoc(collection(db, 'scheduledReports'), scheduledReport);
      
      setScheduledReports(prev => [{
        id: docRef.id,
        ...scheduledReport,
        createdAt: new Date(),
        nextRun: scheduledReport.nextRun
      }, ...prev]);

      setShowCreateForm(false);
      setFormData({
        name: '',
        description: '',
        frequency: 'weekly',
        dayOfWeek: 'monday',
        time: '09:00',
        recipients: [],
        reportId: '',
        format: 'pdf',
        active: true
      });
    } catch (error) {
      console.error('Error creating scheduled report:', error);
      alert('Failed to create scheduled report');
    }
  };

  // Calculate next run time
  const calculateNextRun = (frequency, dayOfWeek, time) => {
    const now = new Date();
    const [hours, minutes] = time.split(':').map(Number);
    
    let nextRun = new Date();
    nextRun.setHours(hours, minutes, 0, 0);

    if (frequency === 'daily') {
      if (nextRun <= now) {
        nextRun.setDate(nextRun.getDate() + 1);
      }
    } else if (frequency === 'weekly') {
      const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
      const targetDay = days.indexOf(dayOfWeek);
      const currentDay = now.getDay();
      
      let daysToAdd = targetDay - currentDay;
      if (daysToAdd <= 0 || (daysToAdd === 0 && nextRun <= now)) {
        daysToAdd += 7;
      }
      
      nextRun.setDate(nextRun.getDate() + daysToAdd);
    } else if (frequency === 'monthly') {
      nextRun.setDate(1);
      if (nextRun <= now) {
        nextRun.setMonth(nextRun.getMonth() + 1);
      }
    }

    return nextRun;
  };

  // Toggle report status
  const toggleReportStatus = async (reportId, currentStatus) => {
    try {
      const newStatus = currentStatus === 'active' ? 'paused' : 'active';
      await updateDoc(doc(db, 'scheduledReports', reportId), {
        status: newStatus,
        nextRun: newStatus === 'active' ? calculateNextRun(
          scheduledReports.find(r => r.id === reportId)?.frequency,
          scheduledReports.find(r => r.id === reportId)?.dayOfWeek,
          scheduledReports.find(r => r.id === reportId)?.time
        ) : null
      });

      setScheduledReports(prev => prev.map(report => 
        report.id === reportId 
          ? { ...report, status: newStatus }
          : report
      ));
    } catch (error) {
      console.error('Error updating report status:', error);
    }
  };

  // Delete scheduled report
  const deleteScheduledReport = async (reportId) => {
    if (!confirm('Are you sure you want to delete this scheduled report?')) return;

    try {
      await deleteDoc(doc(db, 'scheduledReports', reportId));
      setScheduledReports(prev => prev.filter(report => report.id !== reportId));
    } catch (error) {
      console.error('Error deleting scheduled report:', error);
    }
  };

  // Run report now
  const runReportNow = async (report) => {
    try {
      // Simulate running the report
      alert(`Running report: ${report.name}`);
      
      // Update last run time
      await updateDoc(doc(db, 'scheduledReports', report.id), {
        lastRun: serverTimestamp()
      });

      setScheduledReports(prev => prev.map(r => 
        r.id === report.id 
          ? { ...r, lastRun: new Date() }
          : r
      ));
    } catch (error) {
      console.error('Error running report:', error);
    }
  };

  const frequencyOptions = [
    { value: 'daily', label: 'Daily', description: 'Every day at specified time' },
    { value: 'weekly', label: 'Weekly', description: 'Every week on specified day' },
    { value: 'monthly', label: 'Monthly', description: 'First day of each month' }
  ];

  const dayOptions = [
    { value: 'monday', label: 'Monday' },
    { value: 'tuesday', label: 'Tuesday' },
    { value: 'wednesday', label: 'Wednesday' },
    { value: 'thursday', label: 'Thursday' },
    { value: 'friday', label: 'Friday' },
    { value: 'saturday', label: 'Saturday' },
    { value: 'sunday', label: 'Sunday' }
  ];

  const formatOptions = [
    { value: 'pdf', label: 'PDF', icon: FileText },
    { value: 'excel', label: 'Excel', icon: FileText },
    { value: 'csv', label: 'CSV', icon: FileText }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'text-green-600 bg-green-100';
      case 'paused': return 'text-yellow-600 bg-yellow-100';
      case 'error': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'active': return <CheckCircle className="w-4 h-4" />;
      case 'paused': return <Pause className="w-4 h-4" />;
      case 'error': return <AlertCircle className="w-4 h-4" />;
      default: return <ClockIcon className="w-4 h-4" />;
    }
  };

  if (loading) {
    return (
      <div className="w-full max-w-4xl">
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Scheduled Reports</h2>
          <p className="text-gray-600">Manage automated report delivery</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowCreateForm(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <Plus className="w-4 h-4" />
            New Schedule
          </button>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Scheduled Reports List */}
      <div className="space-y-4">
        {scheduledReports.length === 0 ? (
          <div
            className="text-center py-12"
          >
            <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No scheduled reports</h3>
            <p className="text-gray-500 mb-4">
              Create your first scheduled report to automate delivery
            </p>
            <button
              onClick={() => setShowCreateForm(true)}
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <Plus className="w-4 h-4" />
              Create First Schedule
            </button>
          </div>
        ) : (
          scheduledReports.map((report) => (
            <div
              key={report.id}
              className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">{report.name}</h3>
                    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(report.status)}`}>
                      {getStatusIcon(report.status)}
                      {report.status}
                    </span>
                  </div>
                  <p className="text-gray-600 mb-3">{report.description}</p>
                  
                  <div className="flex items-center gap-6 text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      <span>
                        {report.frequency === 'daily' && 'Daily'}
                        {report.frequency === 'weekly' && `Weekly on ${report.dayOfWeek}`}
                        {report.frequency === 'monthly' && 'Monthly'}
                        {' at '}{report.time}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Mail className="w-4 h-4" />
                      <span>{report.recipients?.length || 0} recipients</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <FileText className="w-4 h-4" />
                      <span>{report.format?.toUpperCase()}</span>
                    </div>
                  </div>

                  {report.nextRun && (
                    <div className="mt-3 text-sm text-gray-500">
                      <strong>Next run:</strong> {report.nextRun.toLocaleString()}
                    </div>
                  )}
                  
                  {report.lastRun && (
                    <div className="mt-1 text-sm text-gray-500">
                      <strong>Last run:</strong> {report.lastRun.toLocaleString()}
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => runReportNow(report)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                    title="Run now"
                  >
                    <Play className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => toggleReportStatus(report.id, report.status)}
                    className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg"
                    title={report.status === 'active' ? 'Pause' : 'Resume'}
                  >
                    {report.status === 'active' ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                  </button>
                  <button
                    onClick={() => setSelectedReport(report)}
                    className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg"
                    title="Edit"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => deleteScheduledReport(report.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Create/Edit Form Modal */}
      <AnimatePresence>
        {(showCreateForm || selectedReport) && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            onClick={() => {
              setShowCreateForm(false);
              setSelectedReport(null);
            }}
          >
            <div
              className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[80vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900">
                  {selectedReport ? 'Edit Scheduled Report' : 'Create Scheduled Report'}
                </h3>
                <button
                  onClick={() => {
                    setShowCreateForm(false);
                    setSelectedReport(null);
                  }}
                  className="p-2 text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-6">
                {/* Basic Info */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Report Name
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter report name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    rows={3}
                    placeholder="Enter description"
                  />
                </div>

                {/* Schedule Settings */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Frequency
                    </label>
                    <select
                      value={formData.frequency}
                      onChange={(e) => setFormData(prev => ({ ...prev, frequency: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      {frequencyOptions.map(option => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  {formData.frequency === 'weekly' && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Day of Week
                      </label>
                      <select
                        value={formData.dayOfWeek}
                        onChange={(e) => setFormData(prev => ({ ...prev, dayOfWeek: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        {dayOptions.map(option => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Time
                    </label>
                    <input
                      type="time"
                      value={formData.time}
                      onChange={(e) => setFormData(prev => ({ ...prev, time: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>

                {/* Export Format */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Export Format
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    {formatOptions.map(format => {
                      const Icon = format.icon;
                      return (
                        <button
                          key={format.value}
                          onClick={() => setFormData(prev => ({ ...prev, format: format.value }))}
                          className={`p-3 border-2 rounded-lg text-center transition-colors ${
                            formData.format === format.value
                              ? 'border-blue-500 bg-blue-50'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <Icon className="w-5 h-5 mx-auto mb-1 text-gray-600" />
                          <p className="text-sm font-medium">{format.label}</p>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Recipients */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Recipients (Email addresses)
                  </label>
                  <textarea
                    value={formData.recipients.join(', ')}
                    onChange={(e) => setFormData(prev => ({ 
                      ...prev, 
                      recipients: e.target.value.split(',').map(email => email.trim()).filter(Boolean)
                    }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    rows={3}
                    placeholder="Enter email addresses separated by commas"
                  />
                </div>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-end gap-3 mt-6 pt-6 border-t border-gray-200">
                <button
                  onClick={() => {
                    setShowCreateForm(false);
                    setSelectedReport(null);
                  }}
                  className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={createScheduledReport}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  {selectedReport ? 'Update Schedule' : 'Create Schedule'}
                </button>
              </div>
            </div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ScheduledReports; 