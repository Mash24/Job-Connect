import React, { useState } from 'react';
import { X, Palette, Layout, FileText, Eye, Download, Share2, Calendar } from 'lucide-react';

const ReportSettings = ({ reportData, onUpdate, onClose }) => {
  const [activeTab, setActiveTab] = useState('appearance');

  const tabs = [
    { id: 'appearance', name: 'Appearance', icon: Palette },
    { id: 'layout', name: 'Layout', icon: Layout },
    { id: 'export', name: 'Export', icon: Download },
    { id: 'sharing', name: 'Sharing', icon: Share2 }
  ];

  const themes = [
    { id: 'light', name: 'Light', preview: 'bg-white border-gray-200' },
    { id: 'dark', name: 'Dark', preview: 'bg-gray-900 border-gray-700' },
    { id: 'blue', name: 'Blue', preview: 'bg-blue-50 border-blue-200' },
    { id: 'green', name: 'Green', preview: 'bg-green-50 border-green-200' }
  ];

  const layouts = [
    { id: 'grid', name: 'Grid', description: 'Charts arranged in a responsive grid' },
    { id: 'single', name: 'Single Column', description: 'Charts stacked vertically' },
    { id: 'dashboard', name: 'Dashboard', description: 'Compact layout for overview' }
  ];

  const exportFormats = [
    { id: 'pdf', name: 'PDF', description: 'High-quality print format', icon: FileText },
    { id: 'excel', name: 'Excel', description: 'Spreadsheet format with data', icon: FileText },
    { id: 'csv', name: 'CSV', description: 'Comma-separated values', icon: FileText },
    { id: 'image', name: 'Image', description: 'PNG or JPEG format', icon: Eye }
  ];

  const sharingOptions = [
    { id: 'public', name: 'Public Link', description: 'Anyone with the link can view' },
    { id: 'private', name: 'Private', description: 'Only you can access' },
    { id: 'team', name: 'Team Access', description: 'Share with your team members' }
  ];

  const handleSettingChange = (setting, value) => {
    onUpdate({ ...reportData, [setting]: value });
  };

  const renderAppearanceTab = () => (
    <div className="space-y-6">
      {/* Theme Selection */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Theme</h3>
        <div className="grid grid-cols-2 gap-3">
          {themes.map((theme) => (
            <button
              key={theme.id}
              onClick={() => handleSettingChange('theme', theme.id)}
              className={`p-4 border-2 rounded-lg text-left transition-colors ${
                reportData.theme === theme.id
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className={`w-full h-8 rounded ${theme.preview} mb-2`}></div>
              <p className="font-medium text-gray-900">{theme.name}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Color Palette */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Color Palette</h3>
        <div className="grid grid-cols-5 gap-2">
          {['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'].map((color) => (
            <button
              key={color}
              className="w-10 h-10 rounded-lg border-2 border-gray-200 hover:border-gray-300"
              style={{ backgroundColor: color }}
            ></button>
          ))}
        </div>
      </div>

      {/* Typography */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Typography</h3>
        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Title Font Size
            </label>
            <select
              value={reportData.titleSize || 'text-3xl'}
              onChange={(e) => handleSettingChange('titleSize', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="text-2xl">Small</option>
              <option value="text-3xl">Medium</option>
              <option value="text-4xl">Large</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Chart Title Style
            </label>
            <select
              value={reportData.chartTitleStyle || 'semibold'}
              onChange={(e) => handleSettingChange('chartTitleStyle', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="normal">Normal</option>
              <option value="semibold">Semibold</option>
              <option value="bold">Bold</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );

  const renderLayoutTab = () => (
    <div className="space-y-6">
      {/* Layout Type */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Layout Type</h3>
        <div className="space-y-3">
          {layouts.map((layout) => (
            <button
              key={layout.id}
              onClick={() => handleSettingChange('layout', layout.id)}
              className={`w-full p-4 text-left border-2 rounded-lg transition-colors ${
                reportData.layout === layout.id
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <p className="font-medium text-gray-900">{layout.name}</p>
              <p className="text-sm text-gray-600">{layout.description}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Grid Settings */}
      {reportData.layout === 'grid' && (
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Grid Settings</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Columns (Desktop)
              </label>
              <select
                value={reportData.gridColumns || '3'}
                onChange={(e) => handleSettingChange('gridColumns', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="2">2 Columns</option>
                <option value="3">3 Columns</option>
                <option value="4">4 Columns</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Gap Size
              </label>
              <select
                value={reportData.gridGap || '6'}
                onChange={(e) => handleSettingChange('gridGap', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="4">Small</option>
                <option value="6">Medium</option>
                <option value="8">Large</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Chart Sizing */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Default Chart Size</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Width (px)
            </label>
            <input
              type="number"
              value={reportData.defaultChartWidth || 400}
              onChange={(e) => handleSettingChange('defaultChartWidth', parseInt(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Height (px)
            </label>
            <input
              type="number"
              value={reportData.defaultChartHeight || 300}
              onChange={(e) => handleSettingChange('defaultChartHeight', parseInt(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>
      </div>
    </div>
  );

  const renderExportTab = () => (
    <div className="space-y-6">
      {/* Export Formats */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Export Formats</h3>
        <div className="space-y-3">
          {exportFormats.map((format) => {
            const Icon = format.icon;
            return (
              <div
                key={format.id}
                className="flex items-center justify-between p-4 border border-gray-200 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="font-medium text-gray-900">{format.name}</p>
                    <p className="text-sm text-gray-600">{format.description}</p>
                  </div>
                </div>
                <button className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700">
                  Export
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Export Settings */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Export Settings</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-900">Include Header</p>
              <p className="text-sm text-gray-600">Add report title and description</p>
            </div>
            <input
              type="checkbox"
              checked={reportData.exportIncludeHeader !== false}
              onChange={(e) => handleSettingChange('exportIncludeHeader', e.target.checked)}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-900">Include Footer</p>
              <p className="text-sm text-gray-600">Add timestamp and source info</p>
            </div>
            <input
              type="checkbox"
              checked={reportData.exportIncludeFooter !== false}
              onChange={(e) => handleSettingChange('exportIncludeFooter', e.target.checked)}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-900">High Quality</p>
              <p className="text-sm text-gray-600">Export at higher resolution</p>
            </div>
            <input
              type="checkbox"
              checked={reportData.exportHighQuality === true}
              onChange={(e) => handleSettingChange('exportHighQuality', e.target.checked)}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
          </div>
        </div>
      </div>
    </div>
  );

  const renderSharingTab = () => (
    <div className="space-y-6">
      {/* Sharing Options */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Sharing Options</h3>
        <div className="space-y-3">
          {sharingOptions.map((option) => (
            <button
              key={option.id}
              onClick={() => handleSettingChange('sharing', option.id)}
              className={`w-full p-4 text-left border-2 rounded-lg transition-colors ${
                reportData.sharing === option.id
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <p className="font-medium text-gray-900">{option.name}</p>
              <p className="text-sm text-gray-600">{option.description}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Access Control */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Access Control</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password Protection
            </label>
            <input
              type="password"
              placeholder="Enter password (optional)"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Expiration Date
            </label>
            <input
              type="date"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Generate Link */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Share Link</h3>
        <div className="flex gap-2">
          <input
            type="text"
            value="https://jobconnect.com/reports/abc123"
            readOnly
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg bg-gray-50"
          />
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            Copy
          </button>
        </div>
      </div>
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'appearance':
        return renderAppearanceTab();
      case 'layout':
        return renderLayoutTab();
      case 'export':
        return renderExportTab();
      case 'sharing':
        return renderSharingTab();
      default:
        return renderAppearanceTab();
    }
  };

  return (
    <div className="w-full max-w-2xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Report Settings</h2>
          <p className="text-gray-600">Configure your report appearance and behavior</p>
        </div>
        <button
          onClick={onClose}
          className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="flex space-x-8">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.name}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="max-h-96 overflow-y-auto">
        {renderTabContent()}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-end gap-3 mt-6 pt-6 border-t border-gray-200">
        <button
          onClick={onClose}
          className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          onClick={onClose}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Apply Settings
        </button>
      </div>
    </div>
  );
};

export default ReportSettings; 