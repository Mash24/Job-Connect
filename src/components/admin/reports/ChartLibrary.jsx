import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  BarChart3, PieChart, TrendingUp, Users, Briefcase, FileText, 
  BarChart, LineChart, PieChart as PieChartIcon, Table, Image, 
  Text, Calendar, Filter, Database, Zap, Eye, Settings, Download
} from 'lucide-react';
import { collection, getDocs, query, orderBy, limit } from 'firebase/firestore';
import { db } from '../../../firebase/config';

const ChartLibrary = ({ onAddChart, onClose }) => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [dataSources, setDataSources] = useState({});
  const [loading, setLoading] = useState(true);

  // Fetch data sources
  useEffect(() => {
    const fetchDataSources = async () => {
      try {
        const sources = {};
        
        // Fetch users data
        const usersSnap = await getDocs(query(collection(db, 'users'), limit(10)));
        sources.users = usersSnap.docs.map(doc => doc.data());
        
        // Fetch jobs data
        const jobsSnap = await getDocs(query(collection(db, 'jobs'), limit(10)));
        sources.jobs = jobsSnap.docs.map(doc => doc.data());
        
        // Fetch applications data
        const appsSnap = await getDocs(query(collection(db, 'applications'), limit(10)));
        sources.applications = appsSnap.docs.map(doc => doc.data());
        
        setDataSources(sources);
      } catch (error) {
        console.error('Error fetching data sources:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDataSources();
  }, []);

  const chartCategories = [
    {
      id: 'all',
      name: 'All Charts',
      icon: BarChart3,
      color: 'text-blue-600'
    },
    {
      id: 'analytics',
      name: 'Analytics',
      icon: TrendingUp,
      color: 'text-green-600'
    },
    {
      id: 'users',
      name: 'Users',
      icon: Users,
      color: 'text-purple-600'
    },
    {
      id: 'jobs',
      name: 'Jobs',
      icon: Briefcase,
      color: 'text-orange-600'
    },
    {
      id: 'data',
      name: 'Data Tables',
      icon: Table,
      color: 'text-gray-600'
    }
  ];

  const chartTypes = [
    // Analytics Charts
    {
      type: 'bar',
      name: 'Bar Chart',
      description: 'Compare categories with vertical bars',
      category: 'analytics',
      icon: BarChart,
      color: 'bg-blue-100 text-blue-600',
      sampleData: [
        { name: 'Jan', value: 400 },
        { name: 'Feb', value: 300 },
        { name: 'Mar', value: 600 },
        { name: 'Apr', value: 800 }
      ]
    },
    {
      type: 'line',
      name: 'Line Chart',
      description: 'Show trends over time',
      category: 'analytics',
      icon: LineChart,
      color: 'bg-green-100 text-green-600',
      sampleData: [
        { name: 'Jan', value: 400 },
        { name: 'Feb', value: 300 },
        { name: 'Mar', value: 600 },
        { name: 'Apr', value: 800 }
      ]
    },
    {
      type: 'area',
      name: 'Area Chart',
      description: 'Show cumulative data over time',
      category: 'analytics',
      icon: TrendingUp,
      color: 'bg-purple-100 text-purple-600',
      sampleData: [
        { name: 'Jan', value: 400 },
        { name: 'Feb', value: 300 },
        { name: 'Mar', value: 600 },
        { name: 'Apr', value: 800 }
      ]
    },
    {
      type: 'pie',
      name: 'Pie Chart',
      description: 'Show proportions of a whole',
      category: 'analytics',
      icon: PieChartIcon,
      color: 'bg-orange-100 text-orange-600',
      sampleData: [
        { name: 'Job Seekers', value: 45 },
        { name: 'Employers', value: 30 },
        { name: 'Admins', value: 25 }
      ]
    },
    
    // User Charts
    {
      type: 'user-growth',
      name: 'User Growth',
      description: 'Track user registration over time',
      category: 'users',
      icon: Users,
      color: 'bg-purple-100 text-purple-600',
      sampleData: [
        { name: 'Jan', users: 1200 },
        { name: 'Feb', users: 1400 },
        { name: 'Mar', users: 1800 },
        { name: 'Apr', users: 2200 }
      ]
    },
    {
      type: 'user-roles',
      name: 'User Roles Distribution',
      description: 'Breakdown of user types',
      category: 'users',
      icon: PieChartIcon,
      color: 'bg-blue-100 text-blue-600',
      sampleData: [
        { name: 'Job Seekers', value: 65 },
        { name: 'Employers', value: 25 },
        { name: 'Admins', value: 10 }
      ]
    },
    {
      type: 'user-activity',
      name: 'User Activity',
      description: 'Daily active users',
      category: 'users',
      icon: TrendingUp,
      color: 'bg-green-100 text-green-600',
      sampleData: [
        { name: 'Mon', active: 850 },
        { name: 'Tue', active: 920 },
        { name: 'Wed', active: 780 },
        { name: 'Thu', active: 1100 }
      ]
    },
    
    // Job Charts
    {
      type: 'job-postings',
      name: 'Job Postings',
      description: 'Number of jobs posted over time',
      category: 'jobs',
      icon: Briefcase,
      color: 'bg-orange-100 text-orange-600',
      sampleData: [
        { name: 'Jan', jobs: 45 },
        { name: 'Feb', jobs: 52 },
        { name: 'Mar', jobs: 38 },
        { name: 'Apr', jobs: 67 }
      ]
    },
    {
      type: 'job-categories',
      name: 'Job Categories',
      description: 'Jobs by category',
      category: 'jobs',
      icon: BarChart,
      color: 'bg-blue-100 text-blue-600',
      sampleData: [
        { name: 'Technology', jobs: 25 },
        { name: 'Marketing', jobs: 18 },
        { name: 'Sales', jobs: 15 },
        { name: 'Design', jobs: 12 }
      ]
    },
    {
      type: 'application-rate',
      name: 'Application Rate',
      description: 'Applications per job',
      category: 'jobs',
      icon: TrendingUp,
      color: 'bg-green-100 text-green-600',
      sampleData: [
        { name: 'Tech Jobs', rate: 8.5 },
        { name: 'Marketing', rate: 6.2 },
        { name: 'Sales', rate: 4.8 },
        { name: 'Design', rate: 7.1 }
      ]
    },
    
    // Data Tables
    {
      type: 'table',
      name: 'Data Table',
      description: 'Display raw data in table format',
      category: 'data',
      icon: Table,
      color: 'bg-gray-100 text-gray-600',
      sampleData: [
        { id: 1, name: 'John Doe', role: 'Job Seeker', status: 'Active' },
        { id: 2, name: 'Jane Smith', role: 'Employer', status: 'Active' },
        { id: 3, name: 'Bob Johnson', role: 'Job Seeker', status: 'Inactive' }
      ]
    },
    {
      type: 'metric',
      name: 'Metric Card',
      description: 'Display key performance indicators',
      category: 'data',
      icon: Text,
      color: 'bg-indigo-100 text-indigo-600',
      sampleData: { value: 1234, label: 'Total Users', change: '+12%' }
    }
  ];

  // Filter charts based on category and search
  const filteredCharts = chartTypes.filter(chart => {
    const matchesCategory = selectedCategory === 'all' || chart.category === selectedCategory;
    const matchesSearch = chart.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         chart.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleAddChart = (chartType) => {
    onAddChart(chartType.type, chartType.sampleData);
    onClose();
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Chart Library</h2>
          <p className="text-gray-600">Choose from our collection of chart types</p>
        </div>
        <button
          onClick={onClose}
          className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Search */}
      <div className="mb-6">
        <div className="relative">
          <input
            type="text"
            placeholder="Search charts..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          <Filter className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
        </div>
      </div>

      {/* Categories */}
      <div className="mb-6">
        <div className="flex flex-wrap gap-2">
          {chartCategories.map((category) => {
            const Icon = category.icon;
            return (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors ${
                  selectedCategory === category.id
                    ? 'bg-blue-50 border-blue-200 text-blue-700'
                    : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
                }`}
              >
                <Icon className={`w-4 h-4 ${category.color}`} />
                {category.name}
              </button>
            );
          })}
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-96 overflow-y-auto">
        {filteredCharts.map((chart) => {
          const Icon = chart.icon;
          return (
            <motion.div
              key={chart.type}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <button
                onClick={() => handleAddChart(chart)}
                className="w-full p-4 bg-white border border-gray-200 rounded-lg hover:border-blue-300 hover:shadow-md transition-all text-left"
              >
                <div className="flex items-start gap-3">
                  <div className={`p-2 rounded-lg ${chart.color}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 mb-1">{chart.name}</h3>
                    <p className="text-sm text-gray-600 mb-3">{chart.description}</p>
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <Database className="w-3 h-3" />
                      Sample data included
                    </div>
                  </div>
                </div>
              </button>
            </motion.div>
          );
        })}
      </div>

      {/* Empty State */}
      {filteredCharts.length === 0 && (
        <div className="text-center py-12">
          <BarChart3 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No charts found</h3>
          <p className="text-gray-500">Try adjusting your search or category filter</p>
        </div>
      )}

      {/* Footer */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <div className="flex items-center justify-between text-sm text-gray-500">
          <div className="flex items-center gap-4">
            <span>{filteredCharts.length} charts available</span>
            <span>•</span>
            <span>All charts include sample data</span>
          </div>
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4" />
            <span>Drag & drop ready</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChartLibrary; 