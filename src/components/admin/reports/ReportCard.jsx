import React from 'react';
import { motion } from 'framer-motion';
import { 
  FileText, Calendar, User, BarChart3, Eye, Edit, 
  Download, Share2, Trash2, MoreVertical
} from 'lucide-react';

const ReportCard = ({ report, onSelect }) => {
  const getTypeIcon = (type) => {
    switch (type) {
      case 'analytics':
        return <BarChart3 className="w-4 h-4 text-blue-600" />;
      case 'market':
        return <FileText className="w-4 h-4 text-green-600" />;
      case 'metrics':
        return <BarChart3 className="w-4 h-4 text-purple-600" />;
      default:
        return <FileText className="w-4 h-4 text-gray-600" />;
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'analytics':
        return 'bg-blue-100 text-blue-800';
      case 'market':
        return 'bg-green-100 text-green-800';
      case 'metrics':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'draft':
        return 'bg-yellow-100 text-yellow-800';
      case 'archived':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
      className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-all duration-200 cursor-pointer"
      onClick={() => onSelect(report)}
    >
      {/* Header */}
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2">
            {getTypeIcon(report.type)}
            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(report.type)}`}>
              {report.type}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(report.status)}`}>
              {report.status}
            </span>
            <button className="p-1 text-gray-400 hover:text-gray-600 rounded">
              <MoreVertical className="w-4 h-4" />
            </button>
          </div>
        </div>
        
        <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
          {report.title}
        </h3>
        <p className="text-sm text-gray-600 line-clamp-2">
          {report.description}
        </p>
      </div>

      {/* Content */}
      <div className="p-6">
        <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
          <div className="flex items-center gap-1">
            <BarChart3 className="w-4 h-4" />
            <span>{report.charts} charts</span>
          </div>
          <div className="flex items-center gap-1">
            <Calendar className="w-4 h-4" />
            <span>{formatDate(report.lastModified)}</span>
          </div>
        </div>

        <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
          <User className="w-4 h-4" />
          <span className="truncate">{report.createdBy}</span>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onSelect(report);
            }}
            className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Eye className="w-4 h-4" />
            View
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              // Handle edit
            }}
            className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            title="Edit"
          >
            <Edit className="w-4 h-4" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              // Handle download
            }}
            className="p-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
            title="Download"
          >
            <Download className="w-4 h-4" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              // Handle share
            }}
            className="p-2 text-gray-600 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
            title="Share"
          >
            <Share2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default ReportCard;
