import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  X, Download, FileText, BarChart3, Image, Calendar, 
  Settings, Eye, Share2, Mail, Clock, CheckCircle
} from 'lucide-react';

const ExportPanel = ({ onExport, onClose }) => {
  const [selectedFormat, setSelectedFormat] = useState('pdf');
  const [exportOptions, setExportOptions] = useState({
    includeHeader: true,
    includeFooter: true,
    highQuality: false,
    watermark: false,
    password: ''
  });
  const [isExporting, setIsExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);

  const exportFormats = [
    {
      id: 'pdf',
      name: 'PDF Document',
      description: 'High-quality print format with vector graphics',
      icon: FileText,
      color: 'bg-red-100 text-red-600',
      features: ['Print ready', 'Vector graphics', 'Professional layout']
    },
    {
      id: 'excel',
      name: 'Excel Spreadsheet',
      description: 'Interactive spreadsheet with raw data',
      icon: BarChart3,
      color: 'bg-green-100 text-green-600',
      features: ['Interactive charts', 'Raw data included', 'Editable']
    },
    {
      id: 'csv',
      name: 'CSV File',
      description: 'Comma-separated values for data analysis',
      icon: FileText,
      color: 'bg-blue-100 text-blue-600',
      features: ['Data only', 'Import friendly', 'Lightweight']
    },
    {
      id: 'image',
      name: 'Image (PNG/JPEG)',
      description: 'High-resolution image for presentations',
      icon: Image,
      color: 'bg-purple-100 text-purple-600',
      features: ['High resolution', 'Presentation ready', 'Universal format']
    }
  ];

  const scheduledOptions = [
    { id: 'once', name: 'Export Once', description: 'Download immediately' },
    { id: 'daily', name: 'Daily', description: 'Every day at 9:00 AM' },
    { id: 'weekly', name: 'Weekly', description: 'Every Monday at 9:00 AM' },
    { id: 'monthly', name: 'Monthly', description: 'First day of month at 9:00 AM' }
  ];

  const handleExport = async () => {
    setIsExporting(true);
    setExportProgress(0);

    // Simulate export progress
    const interval = setInterval(() => {
      setExportProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsExporting(false);
          onExport(selectedFormat);
          onClose();
          return 100;
        }
        return prev + 10;
      });
    }, 200);
  };

  const selectedFormatData = exportFormats.find(f => f.id === selectedFormat);

  return (
    <div className="w-full max-w-2xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Export Report</h2>
          <p className="text-gray-600">Choose format and export options</p>
        </div>
        <button
          onClick={onClose}
          className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Export Format Selection */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Export Format</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {exportFormats.map((format) => {
            const Icon = format.icon;
            return (
              <button
                key={format.id}
                onClick={() => setSelectedFormat(format.id)}
                className={`p-4 border-2 rounded-lg text-left transition-all ${
                  selectedFormat === format.id
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className={`p-2 rounded-lg ${format.color}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900 mb-1">{format.name}</h4>
                    <p className="text-sm text-gray-600 mb-2">{format.description}</p>
                    <div className="flex flex-wrap gap-1">
                      {format.features.map((feature, index) => (
                        <span
                          key={index}
                          className="inline-block px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded"
                        >
                          {feature}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Export Options */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Export Options</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-900">Include Report Header</p>
              <p className="text-sm text-gray-600">Add title, description, and metadata</p>
            </div>
            <input
              type="checkbox"
              checked={exportOptions.includeHeader}
              onChange={(e) => setExportOptions(prev => ({ ...prev, includeHeader: e.target.checked }))}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-900">Include Footer</p>
              <p className="text-sm text-gray-600">Add timestamp and source information</p>
            </div>
            <input
              type="checkbox"
              checked={exportOptions.includeFooter}
              onChange={(e) => setExportOptions(prev => ({ ...prev, includeFooter: e.target.checked }))}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-900">High Quality</p>
              <p className="text-sm text-gray-600">Export at maximum resolution (larger file)</p>
            </div>
            <input
              type="checkbox"
              checked={exportOptions.highQuality}
              onChange={(e) => setExportOptions(prev => ({ ...prev, highQuality: e.target.checked }))}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-900">Add Watermark</p>
              <p className="text-sm text-gray-600">Include "Job Connect" watermark</p>
            </div>
            <input
              type="checkbox"
              checked={exportOptions.watermark}
              onChange={(e) => setExportOptions(prev => ({ ...prev, watermark: e.target.checked }))}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Scheduled Export */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Scheduled Export</h3>
        <div className="space-y-3">
          {scheduledOptions.map((option) => (
            <button
              key={option.id}
              className="w-full p-3 text-left border border-gray-200 rounded-lg hover:border-gray-300 hover:bg-gray-50"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900">{option.name}</p>
                  <p className="text-sm text-gray-600">{option.description}</p>
                </div>
                <Calendar className="w-4 h-4 text-gray-400" />
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Export Progress */}
      {isExporting && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg"
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
            <p className="font-medium text-blue-900">Exporting {selectedFormatData?.name}...</p>
          </div>
          <div className="w-full bg-blue-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${exportProgress}%` }}
            ></div>
          </div>
          <p className="text-sm text-blue-700 mt-2">{exportProgress}% complete</p>
        </motion.div>
      )}

      {/* File Size Estimate */}
      <div className="mb-6 p-4 bg-gray-50 border border-gray-200 rounded-lg">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium text-gray-900">Estimated File Size</p>
            <p className="text-sm text-gray-600">
              {selectedFormat === 'pdf' && '~2.5 MB'}
              {selectedFormat === 'excel' && '~1.8 MB'}
              {selectedFormat === 'csv' && '~0.5 MB'}
              {selectedFormat === 'image' && '~3.2 MB'}
            </p>
          </div>
          <div className="text-right">
            <p className="font-medium text-gray-900">Format</p>
            <p className="text-sm text-gray-600">{selectedFormatData?.name}</p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-6 border-t border-gray-200">
        <div className="flex items-center gap-4 text-sm text-gray-500">
          <div className="flex items-center gap-1">
            <Eye className="w-4 h-4" />
            <span>Preview available</span>
          </div>
          <div className="flex items-center gap-1">
            <Share2 className="w-4 h-4" />
            <span>Share after export</span>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={handleExport}
            disabled={isExporting}
            className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isExporting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Exporting...
              </>
            ) : (
              <>
                <Download className="w-4 h-4" />
                Export {selectedFormatData?.name}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExportPanel; 