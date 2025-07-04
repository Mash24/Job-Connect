import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Users, Briefcase, Target, Activity, 
  AlertTriangle, CheckCircle, Clock, Zap, BarChart3,
  ArrowUpRight, ArrowDownRight, Minus, Eye, Settings,
  MessageSquare, FileText, Shield, Globe, DollarSign
} from 'lucide-react';
import { auth, db } from '../../firebase/config';
import { doc, getDoc, collection, getDocs, query, orderBy, where } from 'firebase/firestore';

import ApplicationsOverTime from '../../components/admin/charts/ApplicationsOverTime';
// import UserSignupsOverTime from '../../components/admin/charts/UserSignupsOverTime';
import JobStatusBreakdown from '../../components/admin/charts/JobStatusBreakdown';
import RecentActivityFeed from '../../pages/admin/RecentActivityFeed';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [metrics, setMetrics] = useState({
    recentUsers: 0,
    activeJobs: 0,
    recentApplications: 0,
    userGrowth: 0,
    jobGrowth: 0,
    appGrowth: 0,
    conversionRate: 0,
    avgApplicationsPerJob: 0
  });
  const [selectedTimeframe, setSelectedTimeframe] = useState('7');
  const [alerts, setAlerts] = useState([]);
  const [systemHealth, setSystemHealth] = useState({
    status: 'healthy',
    uptime: '99.9%',
    responseTime: '120ms',
    activeUsers: 0,
    errorRate: '0.1%'
  });

  const fetchDashboardData = useCallback(async () => {
    try {
      const now = new Date();
      const startDate = new Date(now.getTime() - (parseInt(selectedTimeframe) * 24 * 60 * 60 * 1000));
      
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
      const calculatedMetrics = calculateMetrics(users, jobs, applications, selectedTimeframe);
      setMetrics(calculatedMetrics);

      // Generate alerts
      const generatedAlerts = generateAlerts(users, jobs, applications);
      setAlerts(generatedAlerts);

      // Update system health
      setSystemHealth({
        status: 'healthy',
        uptime: '99.9%',
        responseTime: '120ms',
        activeUsers: users.length,
        errorRate: '0.1%'
      });
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    }
  }, [selectedTimeframe]);

  useEffect(() => {
    const checkAdmin = async () => {
      const user = auth.currentUser;
      if (!user) {
        navigate('/login');
        return;
      }

      try {
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists() && userDoc.data().role === 'super-admin') {
          setIsAdmin(true);
        } else {
          setIsAdmin(false);
        }
      } catch (error) {
        console.error('Error checking admin status:', error);
        setIsAdmin(false);
      } finally {
        setLoading(false);
      }
    };

    checkAdmin();
  }, [navigate]);

  // Fetch dashboard data
  useEffect(() => {
    if (isAdmin) {
      fetchDashboardData();
    }
  }, [isAdmin, selectedTimeframe, fetchDashboardData]);

  const calculateMetrics = (users, jobs, applications, timeframe) => {
    const now = new Date();
    const startDate = new Date(now.getTime() - (parseInt(timeframe) * 24 * 60 * 60 * 1000));
    
    // Filter data by timeframe
    const recentUsers = users.filter(user => user.createdAt >= startDate);
    const recentJobs = jobs.filter(job => job.createdAt >= startDate);
    const recentApps = applications.filter(app => app.createdAt >= startDate);

    // Previous period for comparison
    const prevStartDate = new Date(startDate.getTime() - (parseInt(timeframe) * 24 * 60 * 60 * 1000));
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
      recentUsers: recentUsers.length,
      activeJobs: jobs.filter(job => job.status === 'active').length,
      recentApplications: recentApps.length,
      userGrowth,
      jobGrowth,
      appGrowth,
      avgApplicationsPerJob: recentJobs.length > 0 ? recentApps.length / recentJobs.length : 0,
      conversionRate: recentUsers.length > 0 ? (recentApps.length / recentUsers.length) * 100 : 0
    };
  };

  const generateAlerts = useCallback((users, jobs, applications) => {
    const alerts = [];
    
    // Check for inactive jobs
    const inactiveJobs = jobs.filter(job => job.status === 'inactive');
    if (inactiveJobs.length > 10) {
      alerts.push({
        id: 'inactive-jobs',
        type: 'warning',
        title: 'High Number of Inactive Jobs',
        message: `${inactiveJobs.length} jobs are currently inactive`,
        icon: AlertTriangle,
        action: () => navigate('/admin/jobs')
      });
    }

    // Check for pending applications
    const pendingApps = applications.filter(app => app.status === 'pending');
    if (pendingApps.length > 20) {
      alerts.push({
        id: 'pending-applications',
        type: 'info',
        title: 'Applications Pending Review',
        message: `${pendingApps.length} applications need attention`,
        icon: Clock,
        action: () => navigate('/admin/applications')
      });
    }

    return alerts;
  }, [navigate]);

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

  const renderQuickActions = () => (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => navigate('/admin/analytics')}
        className="p-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg shadow-lg hover:shadow-xl transition-all"
      >
        <BarChart3 className="w-6 h-6 mb-2" />
        <p className="font-semibold">Analytics</p>
        <p className="text-sm opacity-90">View Insights</p>
      </motion.button>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => navigate('/admin/users')}
        className="p-4 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg shadow-lg hover:shadow-xl transition-all"
      >
        <Users className="w-6 h-6 mb-2" />
        <p className="font-semibold">Users</p>
        <p className="text-sm opacity-90">Manage Users</p>
      </motion.button>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => navigate('/admin/jobs')}
        className="p-4 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-lg shadow-lg hover:shadow-xl transition-all"
      >
        <Briefcase className="w-6 h-6 mb-2" />
        <p className="font-semibold">Jobs</p>
        <p className="text-sm opacity-90">Manage Jobs</p>
      </motion.button>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => navigate('/admin/reports')}
        className="p-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg shadow-lg hover:shadow-xl transition-all"
      >
        <FileText className="w-6 h-6 mb-2" />
        <p className="font-semibold">Reports</p>
        <p className="text-sm opacity-90">Generate Reports</p>
      </motion.button>
    </div>
  );

  const renderSystemHealth = () => (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">System Health</h3>
        <div className="flex items-center gap-2">
          <div className={`w-3 h-3 rounded-full ${systemHealth.status === 'healthy' ? 'bg-green-500' : 'bg-red-500'}`}></div>
          <span className="text-sm text-gray-600">{systemHealth.status}</span>
        </div>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="text-center">
          <p className="text-sm text-gray-600">Uptime</p>
          <p className="text-lg font-semibold text-gray-900">{systemHealth.uptime}</p>
        </div>
        <div className="text-center">
          <p className="text-sm text-gray-600">Response Time</p>
          <p className="text-lg font-semibold text-gray-900">{systemHealth.responseTime}</p>
        </div>
        <div className="text-center">
          <p className="text-sm text-gray-600">Error Rate</p>
          <p className="text-lg font-semibold text-gray-900">{systemHealth.errorRate}</p>
        </div>
        <div className="text-center">
          <p className="text-sm text-gray-600">Active Users</p>
          <p className="text-lg font-semibold text-gray-900">{systemHealth.activeUsers}</p>
        </div>
      </div>
    </div>
  );

  const renderAlerts = () => (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Alerts</h3>
      
      {alerts.length === 0 ? (
        <div className="text-center py-4">
          <CheckCircle className="w-8 h-8 text-green-500 mx-auto mb-2" />
          <p className="text-gray-600">All systems operational</p>
        </div>
      ) : (
        <div className="space-y-3">
          {alerts.map((alert) => {
            const Icon = alert.icon;
            return (
              <motion.div
                key={alert.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className={`p-3 rounded-lg border-l-4 ${
                  alert.type === 'error' ? 'border-red-500 bg-red-50' :
                  alert.type === 'warning' ? 'border-yellow-500 bg-yellow-50' :
                  'border-blue-500 bg-blue-50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-5 h-5 ${
                    alert.type === 'error' ? 'text-red-600' :
                    alert.type === 'warning' ? 'text-yellow-600' :
                    'text-blue-600'
                  }`} />
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{alert.title}</p>
                    <p className="text-sm text-gray-600">{alert.message}</p>
                  </div>
                  <button
                    onClick={alert.action}
                    className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                  >
                    View
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500 text-lg">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500 text-lg">
        ❌ Access denied: Admins only
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">📊 Admin Dashboard</h1>
              <p className="text-gray-600">Real-time overview of platform performance and metrics</p>
            </div>
            
            <div className="flex items-center gap-3">
              <select
                value={selectedTimeframe}
                onChange={(e) => setSelectedTimeframe(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="7">Last 7 days</option>
                <option value="30">Last 30 days</option>
                <option value="90">Last 90 days</option>
              </select>
              
              <button
                onClick={fetchDashboardData}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                <Zap className="w-4 h-4" />
                Refresh
              </button>
            </div>
          </div>

          {/* Quick Actions */}
          {renderQuickActions()}

          {/* System Health */}
          {renderSystemHealth()}

          {/* Alerts */}
          {renderAlerts()}
        </motion.div>

        {/* Key Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">New Users</p>
                <p className="text-2xl font-bold text-gray-900">{metrics.recentUsers}</p>
              </div>
              <div className="p-2 bg-blue-100 rounded-lg">
                <Users className="w-5 h-5 text-blue-600" />
              </div>
            </div>
            <div className="flex items-center gap-2 mt-2">
              {getGrowthIcon(metrics.userGrowth)}
              <span className={`text-sm font-medium ${getGrowthColor(metrics.userGrowth)}`}>
                {metrics.userGrowth > 0 ? '+' : ''}{metrics.userGrowth.toFixed(1)}%
              </span>
              <span className="text-sm text-gray-500">vs previous period</span>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Jobs</p>
                <p className="text-2xl font-bold text-gray-900">{metrics.activeJobs}</p>
              </div>
              <div className="p-2 bg-green-100 rounded-lg">
                <Briefcase className="w-5 h-5 text-green-600" />
              </div>
            </div>
            <div className="flex items-center gap-2 mt-2">
              {getGrowthIcon(metrics.jobGrowth)}
              <span className={`text-sm font-medium ${getGrowthColor(metrics.jobGrowth)}`}>
                {metrics.jobGrowth > 0 ? '+' : ''}{metrics.jobGrowth.toFixed(1)}%
              </span>
              <span className="text-sm text-gray-500">vs previous period</span>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Applications</p>
                <p className="text-2xl font-bold text-gray-900">{metrics.recentApplications}</p>
              </div>
              <div className="p-2 bg-purple-100 rounded-lg">
                <Target className="w-5 h-5 text-purple-600" />
              </div>
            </div>
            <div className="flex items-center gap-2 mt-2">
              {getGrowthIcon(metrics.appGrowth)}
              <span className={`text-sm font-medium ${getGrowthColor(metrics.appGrowth)}`}>
                {metrics.appGrowth > 0 ? '+' : ''}{metrics.appGrowth.toFixed(1)}%
              </span>
              <span className="text-sm text-gray-500">vs previous period</span>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Conversion Rate</p>
                <p className="text-2xl font-bold text-gray-900">{metrics.conversionRate.toFixed(1)}%</p>
              </div>
              <div className="p-2 bg-orange-100 rounded-lg">
                <Activity className="w-5 h-5 text-orange-600" />
              </div>
            </div>
            <div className="flex items-center gap-2 mt-2">
              <span className="text-sm text-gray-500">
                {metrics.avgApplicationsPerJob.toFixed(1)} apps/job
              </span>
            </div>
          </motion.div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
          <ApplicationsOverTime />
          <JobStatusBreakdown />
        </div>

        {/* Activity Feed */}
        <RecentActivityFeed />
      </div>
    </div>
  );
};

export default AdminDashboard; 