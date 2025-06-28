import React, { useState, useEffect } from 'react';
import { 
  Users, Calendar, TrendingUp, BarChart3, 
  Filter, Download, Eye, EyeOff, RefreshCw
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, 
  ResponsiveContainer
} from 'recharts';

const CohortAnalysis = ({ data, dateRange }) => {
  const [cohortPeriod, setCohortPeriod] = useState('month'); // week, month, quarter
  const [retentionPeriods, setRetentionPeriods] = useState(['7', '14', '30', '60', '90']);
  const [cohortData, setCohortData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [viewMode, setViewMode] = useState('heatmap'); // heatmap, chart

  useEffect(() => {
    if (data.users.length > 0) {
      generateCohortData();
    }
  }, [data, cohortPeriod, retentionPeriods]);

  const generateCohortData = () => {
    setLoading(true);
    
    try {
      // Group users by cohort period
      const cohorts = groupUsersByCohort(data.users, cohortPeriod);
      
      // Calculate retention for each cohort
      const cohortAnalysis = cohorts.map(cohort => {
        const retention = calculateRetention(cohort, data.applications, retentionPeriods);
        return {
          cohort: cohort.period,
          size: cohort.users.length,
          retention
        };
      });

      setCohortData(cohortAnalysis);
    } catch (error) {
      console.error('Error generating cohort data:', error);
    } finally {
      setLoading(false);
    }
  };

  const groupUsersByCohort = (users, period) => {
    const cohorts = {};
    
    users.forEach(user => {
      const userDate = new Date(user.createdAt);
      let cohortKey;
      
      switch (period) {
        case 'week':
          const weekStart = new Date(userDate);
          weekStart.setDate(userDate.getDate() - userDate.getDay());
          cohortKey = weekStart.toISOString().split('T')[0];
          break;
        case 'month':
          cohortKey = `${userDate.getFullYear()}-${String(userDate.getMonth() + 1).padStart(2, '0')}`;
          break;
        case 'quarter':
          const quarter = Math.floor(userDate.getMonth() / 3) + 1;
          cohortKey = `${userDate.getFullYear()}-Q${quarter}`;
          break;
        default:
          cohortKey = userDate.toISOString().split('T')[0];
      }
      
      if (!cohorts[cohortKey]) {
        cohorts[cohortKey] = {
          period: cohortKey,
          users: []
        };
      }
      cohorts[cohortKey].users.push(user);
    });
    
    return Object.values(cohorts).sort((a, b) => a.period.localeCompare(b.period));
  };

  const calculateRetention = (cohort, applications, periods) => {
    const retention = {};
    
    periods.forEach(period => {
      const days = parseInt(period);
      const periodEnd = new Date();
      periodEnd.setDate(periodEnd.getDate() - days);
      
      // Count users who applied within the retention period
      let retainedUsers = 0;
      
      cohort.users.forEach(user => {
        const userApplications = applications.filter(app => 
          app.userId === user.id && 
          new Date(app.createdAt) >= new Date(user.createdAt) &&
          new Date(app.createdAt) <= new Date(user.createdAt.getTime() + days * 24 * 60 * 60 * 1000)
        );
        
        if (userApplications.length > 0) {
          retainedUsers++;
        }
      });
      
      retention[`d${period}`] = {
        count: retainedUsers,
        percentage: cohort.users.length > 0 ? (retainedUsers / cohort.users.length) * 100 : 0
      };
    });
    
    return retention;
  };

  const renderHeatmap = () => {
    const heatmapData = cohortData.map(cohort => {
      const row = { cohort: cohort.cohort, size: cohort.size };
      retentionPeriods.forEach(period => {
        row[`d${period}`] = cohort.retention[`d${period}`]?.percentage || 0;
      });
      return row;
    });

    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Retention Heatmap</h3>
          <div className="text-sm text-gray-600">
            {cohortData.length} cohorts analyzed
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr>
                <th className="text-left p-2 font-medium text-gray-700">Cohort</th>
                <th className="text-center p-2 font-medium text-gray-700">Size</th>
                {retentionPeriods.map(period => (
                  <th key={period} className="text-center p-2 font-medium text-gray-700">
                    D+{period}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {heatmapData.map((row, index) => (
                <tr key={row.cohort} className="border-t border-gray-100">
                  <td className="p-2 font-medium text-gray-900">{row.cohort}</td>
                  <td className="p-2 text-center text-gray-600">{row.size}</td>
                  {retentionPeriods.map(period => {
                    const value = row[`d${period}`];
                    const intensity = Math.min(value / 100, 1);
                    const bgColor = `rgba(59, 130, 246, ${intensity * 0.8})`;
                    
                    return (
                      <td key={period} className="p-2 text-center">
                        <div 
                          className="inline-block px-2 py-1 rounded text-sm font-medium"
                          style={{ 
                            backgroundColor: bgColor,
                            color: intensity > 0.5 ? 'white' : '#374151'
                          }}
                        >
                          {value.toFixed(1)}%
                        </div>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  const renderRetentionChart = () => {
    const chartData = retentionPeriods.map(period => {
      const avgRetention = cohortData.reduce((sum, cohort) => 
        sum + (cohort.retention[`d${period}`]?.percentage || 0), 0
      ) / cohortData.length;
      
      return {
        period: `D+${period}`,
        retention: avgRetention
      };
    });

    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Average Retention by Period</h3>
          <div className="text-sm text-gray-600">
            Across {cohortData.length} cohorts
          </div>
        </div>
        
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="period" stroke="#6b7280" />
            <YAxis stroke="#6b7280" />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'white', 
                border: '1px solid #e5e7eb',
                borderRadius: '8px'
              }}
              formatter={(value) => [`${value.toFixed(1)}%`, 'Retention']}
            />
            <Bar dataKey="retention" fill="#3b82f6" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    );
  };

  const renderCohortSizeChart = () => {
    const chartData = cohortData.map(cohort => ({
      cohort: cohort.cohort,
      size: cohort.size
    }));

    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Cohort Sizes</h3>
          <div className="text-sm text-gray-600">
            Total users: {cohortData.reduce((sum, cohort) => sum + cohort.size, 0)}
          </div>
        </div>
        
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="cohort" stroke="#6b7280" />
            <YAxis stroke="#6b7280" />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'white', 
                border: '1px solid #e5e7eb',
                borderRadius: '8px'
              }}
            />
            <Bar dataKey="size" fill="#10b981" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    );
  };

  const renderMetricsCards = () => {
    const totalUsers = cohortData.reduce((sum, cohort) => sum + cohort.size, 0);
    const avgRetention = retentionPeriods.reduce((sum, period) => {
      const periodRetention = cohortData.reduce((cohortSum, cohort) => 
        cohortSum + (cohort.retention[`d${period}`]?.percentage || 0), 0
      ) / cohortData.length;
      return sum + periodRetention;
    }, 0) / retentionPeriods.length;

    const bestCohort = cohortData.reduce((best, cohort) => {
      const avgCohortRetention = retentionPeriods.reduce((sum, period) => 
        sum + (cohort.retention[`d${period}`]?.percentage || 0), 0
      ) / retentionPeriods.length;
      return avgCohortRetention > best.retention ? { cohort: cohort.cohort, retention: avgCohortRetention } : best;
    }, { cohort: '', retention: 0 });

    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Users className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Total Users</p>
              <p className="text-2xl font-bold text-gray-900">{totalUsers.toLocaleString()}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <TrendingUp className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Avg Retention</p>
              <p className="text-2xl font-bold text-gray-900">{avgRetention.toFixed(1)}%</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <BarChart3 className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Best Cohort</p>
              <p className="text-lg font-bold text-gray-900">{bestCohort.cohort}</p>
              <p className="text-sm text-gray-600">{bestCohort.retention.toFixed(1)}% retention</p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Cohort Analysis</h2>
          <p className="text-gray-600">
            Track user retention and engagement patterns over time
          </p>
        </div>
        <div className="flex items-center gap-3">
          <select
            value={cohortPeriod}
            onChange={(e) => setCohortPeriod(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="week">Weekly</option>
            <option value="month">Monthly</option>
            <option value="quarter">Quarterly</option>
          </select>
          <button
            onClick={generateCohortData}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>
      </div>

      {/* Controls */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Analysis Settings</h3>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setViewMode('heatmap')}
              className={`px-3 py-1 text-sm rounded-md ${
                viewMode === 'heatmap' 
                  ? 'bg-blue-100 text-blue-700' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Heatmap
            </button>
            <button
              onClick={() => setViewMode('chart')}
              className={`px-3 py-1 text-sm rounded-md ${
                viewMode === 'chart' 
                  ? 'bg-blue-100 text-blue-700' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Charts
            </button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Retention Periods
            </label>
            <div className="flex flex-wrap gap-2">
              {['7', '14', '30', '60', '90'].map(period => (
                <label key={period} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={retentionPeriods.includes(period)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setRetentionPeriods([...retentionPeriods, period]);
                      } else {
                        setRetentionPeriods(retentionPeriods.filter(p => p !== period));
                      }
                    }}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">D+{period}</span>
                </label>
              ))}
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Cohort Period
            </label>
            <p className="text-sm text-gray-600">
              Currently grouping by: <span className="font-medium">{cohortPeriod}</span>
            </p>
          </div>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Analyzing cohorts...</p>
        </div>
      )}

      {/* Content */}
      {!loading && cohortData.length > 0 && (
        <>
          {/* Metrics Cards */}
          {renderMetricsCards()}

          {/* Charts */}
          {viewMode === 'chart' ? (
            <div className="space-y-6">
              {renderRetentionChart()}
              {renderCohortSizeChart()}
            </div>
          ) : (
            renderHeatmap()
          )}
        </>
      )}

      {/* Empty State */}
      {!loading && cohortData.length === 0 && (
        <div className="text-center py-12">
          <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No cohort data available</h3>
          <p className="text-gray-500">
            Start collecting user data to generate cohort analysis
          </p>
        </div>
      )}
    </div>
  );
};

export default CohortAnalysis; 