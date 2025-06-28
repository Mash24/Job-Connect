import React, { useState, useRef } from 'react';
import { Reorder } from 'framer-motion';
import { X, Move, Settings, Trash2, Copy, Eye, EyeOff } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell, AreaChart, Area } from 'recharts';

const ReportCanvas = ({ 
  reportData, 
  isEditing, 
  selectedChart, 
  onChartSelect, 
  onChartUpdate, 
  onChartRemove, 
  onReportUpdate 
}) => {
  const [draggedChart, setDraggedChart] = useState(null);
  const canvasRef = useRef(null);

  // Handle chart drag start
  const handleDragStart = (chartId) => {
    setDraggedChart(chartId);
  };

  // Handle chart drop
  const handleDrop = (e, targetChartId) => {
    e.preventDefault();
    if (draggedChart && draggedChart !== targetChartId) {
      const charts = [...reportData.charts];
      const draggedIndex = charts.findIndex(chart => chart.id === draggedChart);
      const targetIndex = charts.findIndex(chart => chart.id === targetChartId);
      
      const [draggedItem] = charts.splice(draggedIndex, 1);
      charts.splice(targetIndex, 0, draggedItem);
      
      onReportUpdate({ ...reportData, charts });
    }
    setDraggedChart(null);
  };

  // Handle chart drag over
  const handleDragOver = (e) => {
    e.preventDefault();
  };

  // Render chart based on type
  const renderChart = (chart) => {
    const { type, data, config, title } = chart;
    const isSelected = selectedChart === chart.id;

    const chartContainer = (
      <div className="relative bg-white rounded-lg shadow-sm border-2 transition-all duration-200"
           style={{
             borderColor: isSelected ? '#3b82f6' : '#e5e7eb',
             minHeight: chart.size?.height || 300
           }}>
        {/* Chart Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          {isEditing && (
            <div className="flex items-center gap-2">
              <button
                onClick={() => onChartUpdate(chart.id, { visible: !chart.visible })}
                className="p-1 text-gray-400 hover:text-gray-600"
              >
                {chart.visible !== false ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
              </button>
              <button
                onClick={() => onChartSelect(chart.id)}
                className="p-1 text-gray-400 hover:text-gray-600"
              >
                <Settings className="w-4 h-4" />
              </button>
              <button
                onClick={() => onChartRemove(chart.id)}
                className="p-1 text-red-400 hover:text-red-600"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        {/* Chart Content */}
        <div className="p-4">
          {chart.visible !== false && (
            <ResponsiveContainer width="100%" height={chart.size?.height ? chart.size.height - 100 : 200}>
              {renderChartContent(type, data, config)}
            </ResponsiveContainer>
          )}
        </div>

        {/* Drag Handle */}
        {isEditing && (
          <div className="absolute top-2 left-2 p-1 bg-gray-100 rounded cursor-move opacity-0 hover:opacity-100 transition-opacity">
            <Move className="w-3 h-3 text-gray-500" />
          </div>
        )}
      </div>
    );

    if (isEditing) {
      return (
        <motion.div
          key={chart.id}
          layout
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          drag={isEditing}
          dragMomentum={false}
          onDragStart={() => handleDragStart(chart.id)}
          onDragEnd={() => setDraggedChart(null)}
          className="cursor-move"
          style={{ width: chart.size?.width || '100%' }}
        >
          {chartContainer}
        </motion.div>
      );
    }

    return (
      <motion.div
        key={chart.id}
        layout
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full"
        style={{ width: chart.size?.width || '100%' }}
      >
        {chartContainer}
      </motion.div>
    );
  };

  // Render specific chart content
  const renderChartContent = (type, data, config) => {
    const colors = config?.colors || ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

    switch (type) {
      case 'bar':
        return (
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="name" stroke="#6b7280" />
            <YAxis stroke="#6b7280" />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'white', 
                border: '1px solid #e5e7eb',
                borderRadius: '8px'
              }} 
            />
            <Legend />
            <Bar dataKey="value" fill={colors[0]} radius={[4, 4, 0, 0]} />
          </BarChart>
        );

      case 'line':
        return (
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="name" stroke="#6b7280" />
            <YAxis stroke="#6b7280" />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'white', 
                border: '1px solid #e5e7eb',
                borderRadius: '8px'
              }} 
            />
            <Legend />
            <Line 
              type="monotone" 
              dataKey="value" 
              stroke={colors[0]} 
              strokeWidth={2}
              dot={{ fill: colors[0], strokeWidth: 2, r: 4 }}
            />
          </LineChart>
        );

      case 'pie':
        return (
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
              ))}
            </Pie>
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'white', 
                border: '1px solid #e5e7eb',
                borderRadius: '8px'
              }} 
            />
          </PieChart>
        );

      case 'area':
        return (
          <AreaChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="name" stroke="#6b7280" />
            <YAxis stroke="#6b7280" />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'white', 
                border: '1px solid #e5e7eb',
                borderRadius: '8px'
              }} 
            />
            <Area 
              type="monotone" 
              dataKey="value" 
              stroke={colors[0]} 
              fill={colors[0]}
              fillOpacity={0.3}
            />
          </AreaChart>
        );

      case 'metric':
        return (
          <div className="flex flex-col items-center justify-center h-full">
            <div className="text-4xl font-bold text-gray-900 mb-2">
              {data.value?.toLocaleString()}
            </div>
            <div className="text-lg text-gray-600 mb-1">{data.label}</div>
            {data.change && (
              <div className={`text-sm ${data.change.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
                {data.change} from last month
              </div>
            )}
          </div>
        );

      case 'table':
        return (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  {Object.keys(data[0] || {}).map((key) => (
                    <th key={key} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {key}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {data.slice(0, 10).map((row, index) => (
                  <tr key={index}>
                    {Object.values(row).map((value, cellIndex) => (
                      <td key={cellIndex} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {value}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );

      default:
        return (
          <div className="flex items-center justify-center h-full text-gray-500">
            Chart type not supported
          </div>
        );
    }
  };

  // Render report title and description
  const renderHeader = () => (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
      {isEditing ? (
        <div className="space-y-4">
          <input
            type="text"
            value={reportData.title}
            onChange={(e) => onReportUpdate({ ...reportData, title: e.target.value })}
            className="text-3xl font-bold text-gray-900 bg-transparent border-none outline-none w-full"
            placeholder="Enter report title..."
          />
          <textarea
            value={reportData.description}
            onChange={(e) => onReportUpdate({ ...reportData, description: e.target.value })}
            className="text-gray-600 bg-transparent border-none outline-none w-full resize-none"
            placeholder="Enter report description..."
            rows={3}
          />
        </div>
      ) : (
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{reportData.title}</h1>
          {reportData.description && (
            <p className="text-gray-600">{reportData.description}</p>
          )}
        </div>
      )}
    </div>
  );

  return (
    <div ref={canvasRef} className="space-y-6">
      {/* Report Header */}
      {renderHeader()}

      {/* Charts Grid */}
      <div 
        className={`grid gap-6 ${
          reportData.layout === 'grid' 
            ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' 
            : 'grid-cols-1'
        }`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
      >
        {reportData.charts.length === 0 ? (
          <div className="col-span-full flex flex-col items-center justify-center py-12 text-gray-500">
            <BarChart className="w-16 h-16 mb-4 text-gray-300" />
            <p className="text-lg font-medium mb-2">No charts added yet</p>
            <p className="text-sm">Add charts from the library to start building your report</p>
          </div>
        ) : (
          reportData.charts.map((chart) => renderChart(chart))
        )}
      </div>

      {/* Empty State */}
      {reportData.charts.length === 0 && isEditing && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="col-span-full text-center py-12"
        >
          <div className="max-w-md mx-auto">
            <div className="bg-gray-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
              <BarChart className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Start building your report</h3>
            <p className="text-gray-500 mb-4">
              Add charts and metrics from the library to create a comprehensive report
            </p>
            <button
              onClick={() => {/* This would open chart library */}}
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <BarChart className="w-4 h-4" />
              Add First Chart
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default ReportCanvas; 