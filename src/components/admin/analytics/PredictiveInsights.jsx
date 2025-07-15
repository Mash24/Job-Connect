import React, { useState, useEffect, useCallback } from 'react';
import { 
  TrendingUp, Calendar, Users, Briefcase, Target, 
  Zap, Eye, EyeOff, Filter, Download, RefreshCw
} from 'lucide-react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, 
  ResponsiveContainer, AreaChart, Area, BarChart, Bar
} from 'recharts';

const PredictiveInsights = ({ data }) => {
  const [forecastPeriod, setForecastPeriod] = useState('90'); // 30, 60, 90 days
  const [showTrendLines, setShowTrendLines] = useState(true);
  const [selectedMetrics, setSelectedMetrics] = useState(['users', 'jobs', 'applications']);
  const [forecastData, setForecastData] = useState({});
  const [loading, setLoading] = useState(false);

  const calculateLinearRegression = useCallback((xValues, yValues) => {
    const n = xValues.length;
    const xMean = xValues.reduce((sum, x) => sum + x, 0) / n;
    const yMean = yValues.reduce((sum, y) => sum + y, 0) / n;
    let numerator = 0;
    let denominator = 0;
    for (let i = 0; i < n; i++) {
      numerator += (xValues[i] - xMean) * (yValues[i] - yMean);
      denominator += (xValues[i] - xMean) ** 2;
    }
    const slope = denominator !== 0 ? numerator / denominator : 0;
    const intercept = yMean - slope * xMean;
    return { slope, intercept };
  }, []);

  const calculateForecast = useCallback((historicalData, forecastDays) => {
    if (historicalData.length < 2) {
      return historicalData;
    }
    // Calculate linear trend
    const n = historicalData.length;
    const xValues = Array.from({ length: n }, (_, i) => i);
    const yValues = historicalData.map(d => d.count);
    // Linear regression: y = mx + b
    const { slope, intercept } = calculateLinearRegression(xValues, yValues);
    // Generate forecast data
    const forecastData = [...historicalData];
    const lastDate = new Date(historicalData[historicalData.length - 1].date);
    for (let i = 1; i <= forecastDays; i++) {
      const forecastDate = new Date(lastDate);
      forecastDate.setDate(forecastDate.getDate() + i);
      const forecastValue = Math.max(0, slope * (n + i - 1) + intercept);
      forecastData.push({
        date: forecastDate.toISOString().split('T')[0],
        count: Math.round(forecastValue),
        isForecast: true
      });
    }
    return forecastData;
  }, [calculateLinearRegression]);

  // Generate historical data for forecasting
  const generateForecastData = useCallback(() => {
    setLoading(true);
    
    // Group data by date
    const userData = groupDataByDate(data.users, 'createdAt');
    const jobData = groupDataByDate(data.jobs, 'createdAt');
    const appData = groupDataByDate(data.applications, 'createdAt');

    // Calculate trends and generate forecasts
    const userForecast = calculateForecast(userData, parseInt(forecastPeriod));
    const jobForecast = calculateForecast(jobData, parseInt(forecastPeriod));
    const appForecast = calculateForecast(appData, parseInt(forecastPeriod));

    setForecastData({
      users: userForecast,
      jobs: jobForecast,
      applications: appForecast
    });
    
    setLoading(false);
  }, [data, forecastPeriod, calculateForecast]);

  useEffect(() => {
    if (data.users.length > 0) {
      generateForecastData();
    }
  }, [data, generateForecastData]);

  const groupDataByDate = (items, dateField) => {
    const grouped = {};
    items.forEach(item => {
      const date = new Date(item[dateField]).toISOString().split('T')[0];
      grouped[date] = (grouped[date] || 0) + 1;
    });
    
    // Convert to array and sort by date
    return Object.entries(grouped)
      .map(([date, count]) => ({ date, count }))
      .sort((a, b) => new Date(a.date) - new Date(b.date));
  };

  const getMetricColor = (metric) => {
    switch (metric) {
      case 'users': return '#3b82f6';
      case 'jobs': return '#10b981';
      case 'applications': return '#8b5cf6';
      default: return '#6b7280';
    }
  };

  const getMetricIcon = (metric) => {
    switch (metric) {
      case 'users': return Users;
      case 'jobs': return Briefcase;
      case 'applications': return Target;
      default: return TrendingUp;
    }
  };

  const getMetricName = (metric) => {
    switch (metric) {
      case 'users': return 'User Registrations';
      case 'jobs': return 'Job Postings';
      case 'applications': return 'Applications';
      default: return metric;
    }
  };

  const renderForecastChart = (metric) => {
    const chartData = forecastData[metric] || [];
    const color = getMetricColor(metric);
    
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            {React.createElement(getMetricIcon(metric), { className: "w-5 h-5", style: { color } })}
            <h3 className="text-lg font-semibold text-gray-900">{getMetricName(metric)}</h3>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowTrendLines(!showTrendLines)}
              className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
            >
              {showTrendLines ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>
        
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis 
              dataKey="date" 
              stroke="#6b7280"
              tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
            />
            <YAxis stroke="#6b7280" />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'white', 
                border: '1px solid #e5e7eb',
                borderRadius: '8px'
              }}
              labelFormatter={(value) => new Date(value).toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            />
            <Legend />
            
            {/* Historical data */}
            <Line
              type="monotone"
              dataKey="count"
              stroke={color}
              strokeWidth={2}
              dot={{ fill: color, strokeWidth: 2, r: 4 }}
              data={chartData.filter(d => !d.isForecast)}
            />
            
            {/* Forecast data */}
            {showTrendLines && (
              <Line
                type="monotone"
                dataKey="count"
                stroke={color}
                strokeWidth={2}
                strokeDasharray="5 5"
                dot={{ fill: color, strokeWidth: 2, r: 3 }}
                data={chartData.filter(d => d.isForecast)}
              />
            )}
          </LineChart>
        </ResponsiveContainer>
        
        {/* Forecast Summary */}
        <div className="mt-4 p-4 bg-gray-50 rounded-lg">
          <h4 className="font-medium text-gray-900 mb-2">Forecast Summary ({forecastPeriod} days)</h4>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-gray-600">Projected Growth</p>
              <p className="font-semibold text-gray-900">
                {calculateProjectedGrowth(chartData)}%
              </p>
            </div>
            <div>
              <p className="text-gray-600">Total Projected</p>
              <p className="font-semibold text-gray-900">
                {calculateTotalProjected(chartData)}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const calculateProjectedGrowth = (chartData) => {
    if (chartData.length < 2) return 0;
    
    const historical = chartData.filter(d => !d.isForecast);
    const forecast = chartData.filter(d => d.isForecast);
    
    if (historical.length === 0 || forecast.length === 0) return 0;
    
    const avgHistorical = historical.reduce((sum, d) => sum + d.count, 0) / historical.length;
    const avgForecast = forecast.reduce((sum, d) => sum + d.count, 0) / forecast.length;
    
    return avgHistorical > 0 ? ((avgForecast - avgHistorical) / avgHistorical * 100).toFixed(1) : 0;
  };

  const calculateTotalProjected = (chartData) => {
    const forecast = chartData.filter(d => d.isForecast);
    return forecast.reduce((sum, d) => sum + d.count, 0);
  };

  const renderMetricsToggle = () => (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Metrics to Display</h3>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setSelectedMetrics(['users', 'jobs', 'applications'])}
            className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200"
          >
            All
          </button>
          <button
            onClick={() => setSelectedMetrics([])}
            className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
          >
            None
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {['users', 'jobs', 'applications'].map((metric) => (
          <label key={metric} className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={selectedMetrics.includes(metric)}
              onChange={(e) => {
                if (e.target.checked) {
                  setSelectedMetrics([...selectedMetrics, metric]);
                } else {
                  setSelectedMetrics(selectedMetrics.filter(m => m !== metric));
                }
              }}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <div className="flex items-center gap-2">
              {React.createElement(getMetricIcon(metric), { 
                className: "w-4 h-4", 
                style: { color: getMetricColor(metric) } 
              })}
              <span className="text-sm font-medium text-gray-700">{getMetricName(metric)}</span>
            </div>
          </label>
        ))}
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Predictive Insights</h2>
          <p className="text-gray-600">
            Forecast user growth, job postings, and applications using advanced trend analysis
          </p>
        </div>
        <div className="flex items-center gap-3">
          <select
            value={forecastPeriod}
            onChange={(e) => setForecastPeriod(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="30">30 days</option>
            <option value="60">60 days</option>
            <option value="90">90 days</option>
          </select>
          <button
            onClick={generateForecastData}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>
      </div>

      {/* Metrics Toggle */}
      {renderMetricsToggle()}

      {/* Loading State */}
      {loading && (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Generating forecasts...</p>
        </div>
      )}

      {/* Forecast Charts */}
      {!loading && (
        <div className="space-y-6">
          {selectedMetrics.map((metric) => (
            <div
              key={metric}
            >
              {renderForecastChart(metric)}
            </div>
          ))}
        </div>
      )}

      {/* Insights Summary */}
      {!loading && Object.keys(forecastData).length > 0 && (
        <div
          className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
        >
          <div className="flex items-center gap-2 mb-4">
            <Zap className="w-5 h-5 text-yellow-600" />
            <h3 className="text-lg font-semibold text-gray-900">Key Insights</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {selectedMetrics.map((metric) => {
              const chartData = forecastData[metric] || [];
              const growth = calculateProjectedGrowth(chartData);
              const total = calculateTotalProjected(chartData);
              
              return (
                <div key={metric} className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    {React.createElement(getMetricIcon(metric), { 
                      className: "w-4 h-4", 
                      style: { color: getMetricColor(metric) } 
                    })}
                    <span className="font-medium text-gray-900">{getMetricName(metric)}</span>
                  </div>
                  <p className="text-sm text-gray-600 mb-1">
                    Projected growth over {forecastPeriod} days
                  </p>
                  <p className={`text-lg font-bold ${growth > 0 ? 'text-green-600' : growth < 0 ? 'text-red-600' : 'text-gray-600'}`}>
                    {growth > 0 ? '+' : ''}{growth}%
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    Total projected: {total.toLocaleString()}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default PredictiveInsights; 