import React, { useState, useEffect } from 'react';
import { collection, getDocs, query, orderBy, addDoc, serverTimestamp, where } from 'firebase/firestore';
import { db, auth } from '../../../firebase/config';
import { 
  BarChart3, PieChart, TrendingUp, Users, Briefcase, FileText, Download, 
  Calendar, Settings, Plus, Save, Eye, Share2, Clock, Filter, Layout, 
  BarChart, LineChart, PieChart as PieChartIcon, Table, Image, Text
} from 'lucide-react';

import ReportCanvas from './ReportCanvas';
import ChartLibrary from './ChartLibrary';
import ReportSettings from './ReportSettings';
import ExportPanel from './ExportPanel';
import ScheduledReports from './ScheduledReports';

const CustomReportBuilder = () => {
  const [reportData, setReportData] = useState({
    title: 'Custom Report',
    description: '',
    layout: 'grid',
    theme: 'light',
    charts: [],
    metrics: [],
    filters: []
  });
  
  const [isEditing, setIsEditing] = useState(true);
  const [selectedChart, setSelectedChart] = useState(null);
  const [showChartLibrary, setShowChartLibrary] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showExport, setShowExport] = useState(false);
  const [showScheduled, setShowScheduled] = useState(false);
  const [currentAdmin, setCurrentAdmin] = useState(null);
  const [savedReports, setSavedReports] = useState([]);
  const [dataSource, setDataSource] = useState('users'); // users, jobs, applications, etc.

  // Fetch current admin and saved reports
  useEffect(() => {
    const fetchAdminAndReports = async () => {
      if (!auth.currentUser) return;

      try {
        // Fetch admin data
        const userSnap = await getDocs(query(
          collection(db, 'users'),
          where('email', '==', auth.currentUser.email)
        ));
        
        if (!userSnap.empty) {
          const adminData = userSnap.docs[0].data();
          setCurrentAdmin({
            id: userSnap.docs[0].id,
            ...adminData
          });
        }

        // Fetch saved reports
        const reportsSnap = await getDocs(query(
          collection(db, 'reports'),
          orderBy('createdAt', 'desc')
        ));
        
        const reports = reportsSnap.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setSavedReports(reports);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchAdminAndReports();
  }, []);

  // Add chart to report
  const addChart = (chartType, chartData) => {
    const newChart = {
      id: `chart_${Date.now()}`,
      type: chartType,
      title: `${chartType} Chart`,
      data: chartData,
      position: { x: 0, y: 0 },
      size: { width: 400, height: 300 },
      config: getDefaultChartConfig(chartType),
      filters: []
    };

    setReportData(prev => ({
      ...prev,
      charts: [...prev.charts, newChart]
    }));
    setSelectedChart(newChart.id);
  };

  // Get default chart configuration
  const getDefaultChartConfig = (chartType) => {
    const baseConfig = {
      colors: ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'],
      showLegend: true,
      showGrid: true,
      animate: true
    };

    switch (chartType) {
      case 'bar':
        return { ...baseConfig, orientation: 'vertical' };
      case 'line':
        return { ...baseConfig, showPoints: true, smooth: true };
      case 'pie':
        return { ...baseConfig, showLabels: true, donut: false };
      case 'area':
        return { ...baseConfig, fillOpacity: 0.3 };
      default:
        return baseConfig;
    }
  };

  // Update chart
  const updateChart = (chartId, updates) => {
    setReportData(prev => ({
      ...prev,
      charts: prev.charts.map(chart => 
        chart.id === chartId ? { ...chart, ...updates } : chart
      )
    }));
  };

  // Remove chart
  const removeChart = (chartId) => {
    setReportData(prev => ({
      ...prev,
      charts: prev.charts.filter(chart => chart.id !== chartId)
    }));
    setSelectedChart(null);
  };

  // Save report
  const saveReport = async () => {
    try {
      const reportToSave = {
        ...reportData,
        createdBy: currentAdmin?.id,
        createdByEmail: currentAdmin?.email,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        isTemplate: false
      };

      const docRef = await addDoc(collection(db, 'reports'), reportToSave);
      
      setSavedReports(prev => [{
        id: docRef.id,
        ...reportToSave,
        createdAt: new Date(),
        updatedAt: new Date()
      }, ...prev]);

      alert('✅ Report saved successfully!');
    } catch (error) {
      console.error('Error saving report:', error);
      alert('❌ Failed to save report');
    }
  };

  // Load report
  const loadReport = (report) => {
    setReportData({
      title: report.title,
      description: report.description,
      layout: report.layout,
      theme: report.theme,
      charts: report.charts || [],
      metrics: report.metrics || [],
      filters: report.filters || []
    });
    setIsEditing(true);
  };

  // Export report
  const exportReport = async (format) => {
    try {
      switch (format) {
        case 'pdf':
          await exportToPDF();
          break;
        case 'excel':
          await exportToExcel();
          break;
        case 'csv':
          await exportToCSV();
          break;
        case 'image':
          await exportToImage();
          break;
        default:
          console.error('Unsupported export format:', format);
      }
    } catch (error) {
      console.error('Error exporting report:', error);
      alert('❌ Failed to export report');
    }
  };

  // Export implementations (stubbed for now)
  const exportToPDF = async () => {
    // Implementation would use jsPDF or similar
    alert('📄 PDF export functionality would be implemented here');
  };

  const exportToExcel = async () => {
    // Implementation would use xlsx or similar
    alert('📊 Excel export functionality would be implemented here');
  };

  const exportToCSV = async () => {
    // Implementation would use csv-stringify or similar
    alert('📋 CSV export functionality would be implemented here');
  };

  const exportToImage = async () => {
    // Implementation would use html2canvas or similar
    alert('🖼️ Image export functionality would be implemented here');
  };

  const chartTypes = [
    { type: 'bar', label: 'Bar Chart', icon: BarChart, description: 'Compare categories' },
    { type: 'line', label: 'Line Chart', icon: LineChart, description: 'Show trends over time' },
    { type: 'pie', label: 'Pie Chart', icon: PieChartIcon, description: 'Show proportions' },
    { type: 'area', label: 'Area Chart', icon: TrendingUp, description: 'Show cumulative data' },
    { type: 'table', label: 'Data Table', icon: Table, description: 'Display raw data' },
    { type: 'metric', label: 'Metric Card', icon: Users, description: 'Show key numbers' }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                <BarChart3 className="w-8 h-8 text-blue-600" />
                Custom Report Builder
              </h1>
              <p className="mt-2 text-gray-600">
                Create professional reports with drag-and-drop charts and analytics
              </p>
            </div>
            <div className="flex items-center gap-3">
              {/* View Mode Toggle */}
              <div className="flex items-center bg-white border border-gray-300 rounded-lg p-1">
                <button
                  onClick={() => setIsEditing(true)}
                  className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
                    isEditing 
                      ? 'bg-blue-600 text-white' 
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <Layout className="w-4 h-4 inline mr-1" />
                  Edit
                </button>
                <button
                  onClick={() => setIsEditing(false)}
                  className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
                    !isEditing 
                      ? 'bg-blue-600 text-white' 
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <Eye className="w-4 h-4 inline mr-1" />
                  Preview
                </button>
              </div>

              {/* Action Buttons */}
              <button
                onClick={() => setShowSettings(true)}
                className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                <Settings className="w-4 h-4" />
                Settings
              </button>
              <button
                onClick={() => setShowExport(true)}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                <Download className="w-4 h-4" />
                Export
              </button>
              <button
                onClick={saveReport}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                <Save className="w-4 h-4" />
                Save
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Chart Library */}
            <div>
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Chart Library</h3>
                  <button
                    onClick={() => setShowChartLibrary(true)}
                    className="p-1 text-gray-400 hover:text-gray-600"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
                <div className="space-y-2">
                  {chartTypes.slice(0, 4).map((chartType) => {
                    const Icon = chartType.icon;
                    return (
                      <button
                        key={chartType.type}
                        onClick={() => addChart(chartType.type, generateSampleData(chartType.type))}
                        className="w-full flex items-center gap-3 p-3 text-left hover:bg-gray-50 rounded-lg border border-gray-200 hover:border-blue-300 transition-colors"
                      >
                        <Icon className="w-5 h-5 text-blue-600" />
                        <div>
                          <p className="text-sm font-medium text-gray-900">{chartType.label}</p>
                          <p className="text-xs text-gray-500">{chartType.description}</p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Saved Reports */}
            <div>
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Saved Reports</h3>
                  <button
                    onClick={() => setShowScheduled(true)}
                    className="p-1 text-gray-400 hover:text-gray-600"
                  >
                    <Clock className="w-4 h-4" />
                  </button>
                </div>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {savedReports.slice(0, 5).map((report) => (
                    <button
                      key={report.id}
                      onClick={() => loadReport(report)}
                      className="w-full text-left p-3 hover:bg-gray-50 rounded-lg border border-gray-200 hover:border-blue-300 transition-colors"
                    >
                      <p className="text-sm font-medium text-gray-900 truncate">{report.title}</p>
                      <p className="text-xs text-gray-500">
                        {report.createdAt?.toLocaleDateString() || 'Unknown date'}
                      </p>
                    </button>
                  ))}
                  {savedReports.length === 0 && (
                    <p className="text-sm text-gray-500 text-center py-4">
                      No saved reports yet
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Data Source */}
            <div>
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Data Source</h3>
                <select
                  value={dataSource}
                  onChange={(e) => setDataSource(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="users">Users</option>
                  <option value="jobs">Jobs</option>
                  <option value="applications">Applications</option>
                  <option value="analytics">Analytics</option>
                </select>
              </div>
            </div>
          </div>

          {/* Main Canvas */}
          <div className="lg:col-span-3">
            <div>
              <ReportCanvas
                reportData={reportData}
                isEditing={isEditing}
                selectedChart={selectedChart}
                onChartSelect={setSelectedChart}
                onChartUpdate={updateChart}
                onChartRemove={removeChart}
                onReportUpdate={setReportData}
              />
            </div>
          </div>
        </div>

        {/* Modals */}
        {showChartLibrary && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={() => setShowChartLibrary(false)}>
            <div className="bg-white rounded-lg p-6 w-4/5 max-w-4xl max-h-[80vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
              <ChartLibrary
                onAddChart={addChart}
                onClose={() => setShowChartLibrary(false)}
              />
            </div>
          </div>
        )}

        {showSettings && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={() => setShowSettings(false)}>
            <div className="bg-white rounded-lg p-6 w-96 max-w-md" onClick={(e) => e.stopPropagation()}>
              <ReportSettings
                reportData={reportData}
                onUpdate={setReportData}
                onClose={() => setShowSettings(false)}
              />
            </div>
          </div>
        )}

        {showExport && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={() => setShowExport(false)}>
            <div className="bg-white rounded-lg p-6 w-96 max-w-md" onClick={(e) => e.stopPropagation()}>
              <ExportPanel
                onExport={exportReport}
                onClose={() => setShowExport(false)}
              />
            </div>
          </div>
        )}

        {showScheduled && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={() => setShowScheduled(false)}>
            <div className="bg-white rounded-lg p-6 w-4/5 max-w-4xl max-h-[80vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
              <ScheduledReports
                onClose={() => setShowScheduled(false)}
                currentAdmin={currentAdmin}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Helper function to generate sample data
const generateSampleData = (chartType) => {
  const baseData = [
    { name: 'Jan', value: 400 },
    { name: 'Feb', value: 300 },
    { name: 'Mar', value: 600 },
    { name: 'Apr', value: 800 },
    { name: 'May', value: 500 },
    { name: 'Jun', value: 700 }
  ];

  switch (chartType) {
    case 'pie':
      return [
        { name: 'Job Seekers', value: 45 },
        { name: 'Employers', value: 30 },
        { name: 'Admins', value: 25 }
      ];
    case 'metric':
      return { value: 1234, label: 'Total Users', change: '+12%' };
    default:
      return baseData;
  }
};

export default CustomReportBuilder; 