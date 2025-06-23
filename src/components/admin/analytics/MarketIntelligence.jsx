import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Target, MapPin, DollarSign, TrendingUp, BarChart3, 
  Filter, Download, Eye, EyeOff, RefreshCw, Globe
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, 
  ResponsiveContainer, PieChart, Pie, Cell, RadarChart, 
  PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar
} from 'recharts';

const MarketIntelligence = ({ data, dateRange }) => {
  const [marketData, setMarketData] = useState({});
  const [loading, setLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedLocation, setSelectedLocation] = useState('all');
  const [viewMode, setViewMode] = useState('categories'); // categories, locations, salaries

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4'];

  const generateMarketData = async () => {
    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 50)); // Artificial delay for testability
    try {
      let filteredJobs = data.jobs;
      if (selectedCategory !== 'all') {
        filteredJobs = filteredJobs.filter(job => job.category === selectedCategory);
      }
      if (selectedLocation !== 'all') {
        filteredJobs = filteredJobs.filter(job => job.location === selectedLocation);
      }
      const categoryAnalysis = analyzeJobCategories(filteredJobs);
      const locationAnalysis = analyzeLocations(filteredJobs);
      const salaryAnalysis = analyzeSalaryTrends(filteredJobs);
      const skillsAnalysis = analyzeSkillsDemand(filteredJobs);
      const growthAnalysis = analyzeGrowthTrends(filteredJobs);
      setMarketData({
        categories: categoryAnalysis,
        locations: locationAnalysis,
        salaries: salaryAnalysis,
        skills: skillsAnalysis,
        growth: growthAnalysis
      });
    } catch (error) {
      console.error('Error generating market data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (data.jobs.length > 0) {
      (async () => { await generateMarketData(); })();
    }
    // eslint-disable-next-line
  }, [data, selectedCategory, selectedLocation]);

  const analyzeJobCategories = (jobs) => {
    const categories = {};
    
    jobs.forEach(job => {
      const category = job.category || 'Uncategorized';
      if (!categories[category]) {
        categories[category] = {
          name: category,
          count: 0,
          avgSalary: 0,
          totalSalary: 0,
          applications: 0
        };
      }
      
      categories[category].count++;
      if (job.salary) {
        categories[category].totalSalary += job.salary;
      }
      
      // Count applications for this category
      const jobApplications = data.applications.filter(app => app.jobId === job.id);
      categories[category].applications += jobApplications.length;
    });
    
    // Calculate averages
    Object.values(categories).forEach(cat => {
      cat.avgSalary = cat.count > 0 ? cat.totalSalary / cat.count : 0;
      cat.avgApplications = cat.count > 0 ? cat.applications / cat.count : 0;
    });
    
    return Object.values(categories).sort((a, b) => b.count - a.count);
  };

  const analyzeLocations = (jobs) => {
    const locations = {};
    
    jobs.forEach(job => {
      const location = job.location || 'Remote';
      if (!locations[location]) {
        locations[location] = {
          name: location,
          count: 0,
          avgSalary: 0,
          totalSalary: 0,
          categories: new Set()
        };
      }
      
      locations[location].count++;
      if (job.salary) {
        locations[location].totalSalary += job.salary;
      }
      if (job.category) {
        locations[location].categories.add(job.category);
      }
    });
    
    // Calculate averages and convert sets to arrays
    Object.values(locations).forEach(loc => {
      loc.avgSalary = loc.count > 0 ? loc.totalSalary / loc.count : 0;
      loc.categoryCount = loc.categories.size;
      loc.categories = Array.from(loc.categories);
    });
    
    return Object.values(locations).sort((a, b) => b.count - a.count);
  };

  const analyzeSalaryTrends = (jobs) => {
    // Group jobs by month
    const monthlyData = {};
    
    jobs.forEach(job => {
      if (job.salary && job.createdAt) {
        const month = new Date(job.createdAt).toISOString().slice(0, 7); // YYYY-MM
        if (!monthlyData[month]) {
          monthlyData[month] = {
            month,
            avgSalary: 0,
            totalSalary: 0,
            count: 0,
            minSalary: Infinity,
            maxSalary: 0
          };
        }
        
        monthlyData[month].count++;
        monthlyData[month].totalSalary += job.salary;
        monthlyData[month].minSalary = Math.min(monthlyData[month].minSalary, job.salary);
        monthlyData[month].maxSalary = Math.max(monthlyData[month].maxSalary, job.salary);
      }
    });
    
    // Calculate averages
    Object.values(monthlyData).forEach(month => {
      month.avgSalary = month.count > 0 ? month.totalSalary / month.count : 0;
    });
    
    return Object.values(monthlyData).sort((a, b) => a.month.localeCompare(b.month));
  };

  const analyzeSkillsDemand = (jobs) => {
    const skills = {};
    
    jobs.forEach(job => {
      if (job.skills && Array.isArray(job.skills)) {
        job.skills.forEach(skill => {
          if (!skills[skill]) {
            skills[skill] = {
              name: skill,
              count: 0,
              avgSalary: 0,
              totalSalary: 0
            };
          }
          
          skills[skill].count++;
          if (job.salary) {
            skills[skill].totalSalary += job.salary;
          }
        });
      }
    });
    
    // Calculate averages
    Object.values(skills).forEach(skill => {
      skill.avgSalary = skill.count > 0 ? skill.totalSalary / skill.count : 0;
    });
    
    return Object.values(skills).sort((a, b) => b.count - a.count).slice(0, 10);
  };

  const analyzeGrowthTrends = (jobs) => {
    // Group jobs by week for growth analysis
    const weeklyData = {};
    
    jobs.forEach(job => {
      const week = getWeekNumber(job.createdAt);
      if (!weeklyData[week]) {
        weeklyData[week] = {
          week,
          count: 0,
          categories: new Set(),
          avgSalary: 0,
          totalSalary: 0
        };
      }
      
      weeklyData[week].count++;
      if (job.category) {
        weeklyData[week].categories.add(job.category);
      }
      if (job.salary) {
        weeklyData[week].totalSalary += job.salary;
      }
    });
    
    // Calculate averages
    Object.values(weeklyData).forEach(week => {
      week.avgSalary = week.count > 0 ? week.totalSalary / week.count : 0;
      week.categoryCount = week.categories.size;
    });
    
    return Object.values(weeklyData).sort((a, b) => a.week.localeCompare(b.week));
  };

  const getWeekNumber = (date) => {
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    d.setDate(d.getDate() + 4 - (d.getDay() || 7));
    const yearStart = new Date(d.getFullYear(), 0, 1);
    const weekNo = Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
    return `${d.getFullYear()}-W${weekNo.toString().padStart(2, '0')}`;
  };

  const renderCategoryChart = () => {
    const chartData = marketData.categories?.slice(0, 8) || [];
    
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Top Job Categories</h3>
          <div className="text-sm text-gray-600">
            {chartData.length} categories
          </div>
        </div>
        
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData} layout="horizontal">
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis type="number" stroke="#6b7280" />
            <YAxis dataKey="name" type="category" stroke="#6b7280" width={100} />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'white', 
                border: '1px solid #e5e7eb',
                borderRadius: '8px'
              }}
              formatter={(value, name) => [value, 'Jobs']}
            />
            <Bar dataKey="count" fill="#3b82f6" radius={[0, 4, 4, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    );
  };

  const renderLocationChart = () => {
    const chartData = marketData.locations?.slice(0, 8) || [];
    
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Job Distribution by Location</h3>
          <div className="text-sm text-gray-600">
            {chartData.length} locations
          </div>
        </div>
        
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              outerRadius={80}
              fill="#8884d8"
              dataKey="count"
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
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
        </ResponsiveContainer>
      </div>
    );
  };

  const renderSalaryChart = () => {
    const chartData = marketData.salaries || [];
    
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Salary Trends Over Time</h3>
          <div className="text-sm text-gray-600">
            Monthly averages
          </div>
        </div>
        
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis 
              dataKey="month" 
              stroke="#6b7280"
              tickFormatter={(value) => new Date(value + '-01').toLocaleDateString('en-US', { month: 'short', year: '2-digit' })}
            />
            <YAxis stroke="#6b7280" />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'white', 
                border: '1px solid #e5e7eb',
                borderRadius: '8px'
              }}
              labelFormatter={(value) => new Date(value + '-01').toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
              formatter={(value) => [`$${value.toLocaleString()}`, 'Average Salary']}
            />
            <Bar dataKey="avgSalary" fill="#10b981" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    );
  };

  const renderSkillsRadar = () => {
    const chartData = marketData.skills?.slice(0, 6) || [];
    
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Skills Demand Radar</h3>
          <div className="text-sm text-gray-600">
            Top 6 skills
          </div>
        </div>
        
        <ResponsiveContainer width="100%" height={300}>
          <RadarChart data={chartData}>
            <PolarGrid stroke="#e5e7eb" />
            <PolarAngleAxis dataKey="name" tick={{ fontSize: 12 }} />
            <PolarRadiusAxis stroke="#6b7280" />
            <Radar
              name="Demand"
              dataKey="count"
              stroke="#3b82f6"
              fill="#3b82f6"
              fillOpacity={0.3}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'white', 
                border: '1px solid #e5e7eb',
                borderRadius: '8px'
              }}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>
    );
  };

  const renderMetricsCards = () => {
    const totalJobs = marketData.categories?.reduce((sum, cat) => sum + cat.count, 0) || 0;
    const avgSalary = marketData.categories?.reduce((sum, cat) => sum + cat.avgSalary, 0) / (marketData.categories?.length || 1) || 0;
    const topCategory = marketData.categories?.[0] || { name: 'N/A', count: 0 };
    const topLocation = marketData.locations?.[0] || { name: 'N/A', count: 0 };

    return (
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Target className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Total Jobs</p>
              <p className="text-2xl font-bold text-gray-900">{totalJobs.toLocaleString()}</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <DollarSign className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Avg Salary</p>
              <p className="text-2xl font-bold text-gray-900">${avgSalary.toLocaleString()}</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <BarChart3 className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Top Category</p>
              <p className="text-lg font-bold text-gray-900">{topCategory.name}</p>
              <p className="text-sm text-gray-600">{topCategory.count} jobs</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 bg-orange-100 rounded-lg">
              <MapPin className="w-5 h-5 text-orange-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Top Location</p>
              <p className="text-lg font-bold text-gray-900">{topLocation.name}</p>
              <p className="text-sm text-gray-600">{topLocation.count} jobs</p>
            </div>
          </div>
        </motion.div>
      </div>
    );
  };

  // Helper to get unique categories from jobs
  function getAllCategories() {
    if (marketData.categories && marketData.categories.length > 0) {
      return marketData.categories.map(cat => cat.name);
    }
    const set = new Set(data.jobs.map(job => job.category || 'Uncategorized'));
    return Array.from(set);
  }

  // Helper to get unique locations from jobs
  function getAllLocations() {
    if (marketData.locations && marketData.locations.length > 0) {
      return marketData.locations.map(loc => loc.name);
    }
    const set = new Set(data.jobs.map(job => job.location || 'Remote'));
    return Array.from(set);
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Market Intelligence</h2>
          <p className="text-gray-600">
            Identify trends in job categories, locations, and salary patterns
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => generateMarketData()}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Market Filters</h3>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setViewMode('categories')}
              className={`px-3 py-1 text-sm rounded-md ${
                viewMode === 'categories' 
                  ? 'bg-blue-100 text-blue-700' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Categories
            </button>
            <button
              onClick={() => setViewMode('locations')}
              className={`px-3 py-1 text-sm rounded-md ${
                viewMode === 'locations' 
                  ? 'bg-blue-100 text-blue-700' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Locations
            </button>
            <button
              onClick={() => setViewMode('salaries')}
              className={`px-3 py-1 text-sm rounded-md ${
                viewMode === 'salaries' 
                  ? 'bg-blue-100 text-blue-700' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Salaries
            </button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Filter by Category
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Categories</option>
              {getAllCategories().map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Filter by Location
            </label>
            <select
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Locations</option>
              {getAllLocations().map(loc => (
                <option key={loc} value={loc}>{loc}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Analyzing market data...</p>
        </div>
      )}

      {/* Content */}
      {!loading && Object.keys(marketData).length > 0 && (
        <>
          {/* Metrics Cards */}
          {renderMetricsCards()}

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {viewMode === 'categories' && (
              <>
                {renderCategoryChart()}
                {renderSkillsRadar()}
              </>
            )}
            
            {viewMode === 'locations' && (
              <>
                {renderLocationChart()}
                {renderCategoryChart()}
              </>
            )}
            
            {viewMode === 'salaries' && (
              <>
                {renderSalaryChart()}
                {renderSkillsRadar()}
              </>
            )}
          </div>
        </>
      )}

      {/* Empty State */}
      {!loading && Object.keys(marketData).length === 0 && (
        <div className="text-center py-12">
          <Globe className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No market data available</h3>
          <p className="text-gray-500">
            Start collecting job data to generate market intelligence
          </p>
        </div>
      )}
    </div>
  );
};

export default MarketIntelligence; 