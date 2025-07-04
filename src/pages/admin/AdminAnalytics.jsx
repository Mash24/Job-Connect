import React, { useEffect, useState, useCallback } from 'react';
import { 
  BarChart3, Users, Briefcase, Target, Activity,
  TrendingUp, Brain, Users as UsersIcon, Globe,
  ArrowUpRight, ArrowDownRight, Minus
} from 'lucide-react';
import { auth, db } from '../../firebase/config';
import { doc, getDoc, collection, getDocs, query, orderBy, where } from 'firebase/firestore';

import PredictiveInsights from '../../components/admin/analytics/PredictiveInsights';
import CohortAnalysis from '../../components/admin/analytics/CohortAnalysis';
import MarketIntelligence from '../../components/admin/analytics/MarketIntelligence';

const AdminAnalytics = () => {
  const [loading, setLoading] = useState(true);
  const [analyticsData, setAnalyticsData] = useState({
    metrics: {
      totalUsers: 0,
      totalJobs: 0,
      totalApplications: 0,
      recentUsers: 0,
      recentJobs: 0,
      recentApplications: 0,
      userGrowth: 0,
      jobGrowth: 0,
      appGrowth: 0,
      avgApplicationsPerJob: 0,
      conversionRate: 0
    },
    users: [],
    jobs: [],
    applications: []
  });
  const [dateRange, setDateRange] = useState('30');
  const [activeModule, setActiveModule] = useState('predictive');

  const modules = [
    {
      id: 'predictive',
      name: 'Predictive Insights',
      description: 'AI-powered forecasting',
      icon: Brain,
      bgColor: 'bg-gradient-to-r from-purple-500 to-purple-600',
      borderColor: 'border-purple-500',
      color: 'text-white'
    },
    {
      id: 'cohort',
      name: 'Cohort Analysis',
      description: 'User retention tracking',
      icon: UsersIcon,
      bgColor: 'bg-gradient-to-r from-blue-500 to-blue-600',
      borderColor: 'border-blue-500',
      color: 'text-white'
    },
    {
      id: 'market',
      name: 'Market Intelligence',
      description: 'Industry trends & insights',
      icon: Globe,
      bgColor: 'bg-gradient-to-r from-green-500 to-green-600',
      borderColor: 'border-green-500',
      color: 'text-white'
    }
  ];

  const fetchAnalyticsData = useCallback(async () => {
    try {
      const now = new Date();
      const startDate = new Date(now.getTime() - (parseInt(dateRange) * 24 * 60 * 60 * 1000));
      
      // Fetch users data
      const usersQuery = query(
        collection(db, 'users'),
        where('createdAt', '>=', startDate),
        orderBy('createdAt', 'desc')
      );
      const usersSnap = await getDocs(usersQuery);
      const users = usersSnap.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date()
      }));

      // Fetch jobs data
      const jobsQuery = query(
        collection(db, 'jobs'),
        where('createdAt', '>=', startDate),
        orderBy('createdAt', 'desc')
      );
      const jobsSnap = await getDocs(jobsQuery);
      const jobs = jobsSnap.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date()
      }));

      // Fetch applications data
      const appsQuery = query(
        collection(db, 'applications'),
        where('createdAt', '>=', startDate),
        orderBy('createdAt', 'desc')
      );
      const appsSnap = await getDocs(appsQuery);
      const applications = appsSnap.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date()
      }));

      // Calculate metrics
      const metrics = calculateMetrics(users, jobs, applications, dateRange);

      setAnalyticsData({
        metrics,
        users,
        jobs,
        applications
      });
    } catch (error) {
      console.error('Error fetching analytics data:', error);
    }
  }, [dateRange]);

  useEffect(() => {
    const checkAdminAndFetchData = async () => {
      const user = auth.currentUser;
      if (!user) return;

      try {
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists() && userDoc.data().role === 'super-admin') {
          await fetchAnalyticsData();
        }
      } catch (error) {
        console.error('Error checking admin status:', error);
      } finally {
        setLoading(false);
      }
    };

    checkAdminAndFetchData();
  }, [dateRange, fetchAnalyticsData]);

  const calculateMetrics = (users, jobs, applications, range) => {
    const now = new Date();
    const startDate = new Date(now.getTime() - (parseInt(range) * 24 * 60 * 60 * 1000));
    
    // Filter data by timeframe
    const recentUsers = users.filter(user => user.createdAt >= startDate);
    const recentJobs = jobs.filter(job => job.createdAt >= startDate);
    const recentApps = applications.filter(app => app.createdAt >= startDate);

    // Previous period for comparison
    const prevStartDate = new Date(startDate.getTime() - (parseInt(range) * 24 * 60 * 60 * 1000));
    const prevUsers = users.filter(user => 
      user.createdAt >= prevStartDate && user.createdAt < startDate
    );
    const prevJobs = jobs.filter(job => 
      job.createdAt >= prevStartDate && job.createdAt < startDate
    );
    const prevApps = applications.filter(app => 
      app.createdAt >= prevStartDate && app.createdAt < startDate
    );

    // Calculate growth rates
    const userGrowth = prevUsers.length > 0 
      ? ((recentUsers.length - prevUsers.length) / prevUsers.length) * 100 
      : 0;
    const jobGrowth = prevJobs.length > 0 
      ? ((recentJobs.length - prevJobs.length) / prevJobs.length) * 100 
      : 0;
    const appGrowth = prevApps.length > 0 
      ? ((recentApps.length - prevApps.length) / prevApps.length) * 100 
      : 0;

    return {
      totalUsers: users.length,
      totalJobs: jobs.length,
      totalApplications: applications.length,
      recentUsers: recentUsers.length,
      recentJobs: recentJobs.length,
      recentApplications: recentApps.length,
      userGrowth,
      jobGrowth,
      appGrowth,
      avgApplicationsPerJob: recentJobs.length > 0 ? recentApps.length / recentJobs.length : 0,
      conversionRate: recentUsers.length > 0 ? (recentApps.length / recentUsers.length) * 100 : 0
    };
  };

  const renderModuleContent = () => {
    switch (activeModule) {
      case 'cohort':
        return <CohortAnalysis data={analyticsData} dateRange={dateRange} />;
      case 'market':
        return <MarketIntelligence data={analyticsData} dateRange={dateRange} />;
      default:
        return <PredictiveInsights data={analyticsData} dateRange={dateRange} />;
    }
  };

  const getGrowthIcon = (growth) => {
    if (growth > 0) return <ArrowUpRight className="w-4 h-4 text-green-600" />;
    if (growth < 0) return <ArrowDownRight className="w-4 h-4 text-red-600" />;
    return <Minus className="w-4 h-4 text-gray-600" />;
  };

  const getGrowthColor = (growth) => {
    if (growth > 0) return 'text-green-600';
    if (growth < 0) return 'text-red-600';
    return 'text-gray-600';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading analytics data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-blue-100 rounded-lg">
              <BarChart3 className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Advanced Analytics</h1>
              <p className="text-gray-600">
                Predictive insights, cohort analysis, and market intelligence
              </p>
            </div>
          </div>

          {/* Date Range Selector */}
          <div className="flex items-center gap-4 mb-6">
            <label className="text-sm font-medium text-gray-700">Time Range:</label>
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="7">Last 7 days</option>
              <option value="30">Last 30 days</option>
              <option value="90">Last 90 days</option>
            </select>
          </div>

          {/* Key Metrics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">New Users</p>
                  <p className="text-2xl font-bold text-gray-900">{analyticsData.metrics?.recentUsers || 0}</p>
                </div>
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Users className="w-5 h-5 text-blue-600" />
                </div>
              </div>
              <div className="flex items-center gap-2 mt-2">
                {getGrowthIcon(analyticsData.metrics?.userGrowth || 0)}
                <span className={`text-sm font-medium ${getGrowthColor(analyticsData.metrics?.userGrowth || 0)}`}>
                  {analyticsData.metrics?.userGrowth > 0 ? '+' : ''}{(analyticsData.metrics?.userGrowth || 0).toFixed(1)}%
                </span>
                <span className="text-sm text-gray-500">vs previous period</span>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">New Jobs</p>
                  <p className="text-2xl font-bold text-gray-900">{analyticsData.metrics?.recentJobs || 0}</p>
                </div>
                <div className="p-2 bg-green-100 rounded-lg">
                  <Briefcase className="w-5 h-5 text-green-600" />
                </div>
              </div>
              <div className="flex items-center gap-2 mt-2">
                {getGrowthIcon(analyticsData.metrics?.jobGrowth || 0)}
                <span className={`text-sm font-medium ${getGrowthColor(analyticsData.metrics?.jobGrowth || 0)}`}>
                  {analyticsData.metrics?.jobGrowth > 0 ? '+' : ''}{(analyticsData.metrics?.jobGrowth || 0).toFixed(1)}%
                </span>
                <span className="text-sm text-gray-500">vs previous period</span>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Applications</p>
                  <p className="text-2xl font-bold text-gray-900">{analyticsData.metrics?.recentApplications || 0}</p>
                </div>
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Target className="w-5 h-5 text-purple-600" />
                </div>
              </div>
              <div className="flex items-center gap-2 mt-2">
                {getGrowthIcon(analyticsData.metrics?.appGrowth || 0)}
                <span className={`text-sm font-medium ${getGrowthColor(analyticsData.metrics?.appGrowth || 0)}`}>
                  {analyticsData.metrics?.appGrowth > 0 ? '+' : ''}{(analyticsData.metrics?.appGrowth || 0).toFixed(1)}%
                </span>
                <span className="text-sm text-gray-500">vs previous period</span>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Conversion Rate</p>
                  <p className="text-2xl font-bold text-gray-900">{(analyticsData.metrics?.conversionRate || 0).toFixed(1)}%</p>
                </div>
                <div className="p-2 bg-orange-100 rounded-lg">
                  <Activity className="w-5 h-5 text-orange-600" />
                </div>
              </div>
              <div className="flex items-center gap-2 mt-2">
                <span className="text-sm text-gray-500">
                  {(analyticsData.metrics?.avgApplicationsPerJob || 0).toFixed(1)} apps/job
                </span>
              </div>
            </div>
          </div>

          {/* Module Tabs */}
          <div className="flex flex-wrap gap-2">
            {modules.map((module) => {
              const Icon = module.icon;
              return (
                <button
                  key={module.id}
                  onClick={() => setActiveModule(module.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-all ${
                    activeModule === module.id
                      ? `${module.bgColor} ${module.borderColor} ${module.color}`
                      : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50 hover:border-gray-300'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${activeModule === module.id ? module.color : 'text-gray-500'}`} />
                  <div className="text-left">
                    <p className="font-medium">{module.name}</p>
                    <p className="text-xs opacity-75">{module.description}</p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Module Content */}
        <div>
          {renderModuleContent()}
        </div>
      </div>
    </div>
  );
};

export default AdminAnalytics; 