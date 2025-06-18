import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  BarChart3, FileText, Download, Calendar, Plus, 
  TrendingUp, Users, Briefcase, Settings, Eye
} from 'lucide-react';
import CustomReportBuilder from '../../components/admin/reports/CustomReportBuilder';
import ReportCard from '../../components/admin/reports/ReportCard';

const AdminReports = () => {
  const [activeView, setActiveView] = useState('builder'); // 'builder', 'saved', 'scheduled'
  const [selectedReport, setSelectedReport] = useState(null);

  const views = [
    {
      id: 'builder',
      name: 'Report Builder',
      description: 'Create custom reports with drag-and-drop charts',
      icon: BarChart3,
      color: 'text-blue-600'
    },
    {
      id: 'saved',
      name: 'Saved Reports',
      description: 'View and manage your saved reports',
      icon: FileText,
      color: 'text-green-600'
    },
    {
      id: 'scheduled',
      name: 'Scheduled Reports',
      description: 'Manage automated report delivery',
      icon: Calendar,
      color: 'text-purple-600'
    }
  ];

  const sampleReports = [
    {
      id: '1',
      title: 'User Growth Report',
      description: 'Monthly user registration trends and demographics',
      type: 'analytics',
      lastModified: '2024-01-15',
      createdBy: 'admin@jobconnect.com',
      charts: 4,
      status: 'active'
    },
    {
      id: '2',
      title: 'Job Market Analysis',
      description: 'Job posting trends and category distribution',
      type: 'market',
      lastModified: '2024-01-14',
      createdBy: 'admin@jobconnect.com',
      charts: 6,
      status: 'draft'
    },
    {
      id: '3',
      title: 'Application Metrics',
      description: 'Application rates and conversion analytics',
      type: 'metrics',
      lastModified: '2024-01-13',
      createdBy: 'admin@jobconnect.com',
      charts: 3,
      status: 'active'
    }
  ];

  const renderViewContent = () => {
    switch (activeView) {
      case 'builder':
        return <CustomReportBuilder />;
      case 'saved':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Saved Reports</h2>
                <p className="text-gray-600">Manage your custom reports</p>
              </div>
              <button
                onClick={() => setActiveView('builder')}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                <Plus className="w-4 h-4" />
                Create New Report
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {sampleReports.map((report) => (
                <ReportCard
                  key={report.id}
                  report={report}
                  onSelect={() => setSelectedReport(report)}
                />
              ))}
            </div>
          </div>
        );
      case 'scheduled':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Scheduled Reports</h2>
                <p className="text-gray-600">Manage automated report delivery</p>
              </div>
              <button
                onClick={() => {/* This would open scheduled reports modal */}}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                <Plus className="w-4 h-4" />
                New Schedule
              </button>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="text-center py-12">
                <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No scheduled reports</h3>
                <p className="text-gray-500 mb-4">
                  Create scheduled reports to automate delivery to stakeholders
                </p>
                <button className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                  <Plus className="w-4 h-4" />
                  Create First Schedule
                </button>
              </div>
            </div>
          </div>
        );
      default:
        return <CustomReportBuilder />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-blue-100 rounded-lg">
              <BarChart3 className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Reports & Analytics</h1>
              <p className="text-gray-600">
                Create, manage, and schedule custom reports for stakeholders
              </p>
            </div>
          </div>

          {/* View Tabs */}
          <div className="flex flex-wrap gap-2">
            {views.map((view) => {
              const Icon = view.icon;
              return (
                <button
                  key={view.id}
                  onClick={() => setActiveView(view.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors ${
                    activeView === view.id
                      ? 'bg-blue-50 border-blue-200 text-blue-700'
                      : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50 hover:border-gray-300'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${view.color}`} />
                  <div className="text-left">
                    <p className="font-medium">{view.name}</p>
                    <p className="text-xs opacity-75">{view.description}</p>
                  </div>
                </button>
              );
            })}
          </div>
        </motion.div>

        {/* Content */}
        <motion.div
          key={activeView}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
        >
          {renderViewContent()}
        </motion.div>

        {/* Quick Stats */}
        {activeView === 'saved' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-6"
          >
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <FileText className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">{sampleReports.length}</p>
                  <p className="text-sm text-gray-600">Total Reports</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <TrendingUp className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">2</p>
                  <p className="text-sm text-gray-600">Active Reports</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Calendar className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">0</p>
                  <p className="text-sm text-gray-600">Scheduled</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-orange-100 rounded-lg">
                  <Download className="w-5 h-5 text-orange-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">12</p>
                  <p className="text-sm text-gray-600">Exports This Month</p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default AdminReports; 