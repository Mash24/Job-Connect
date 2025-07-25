// File: /src/App.jsx

import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';

import Navbar from './components/layouts/Navbar';

// Public Pages
import Register from './pages/Register';
import Login from './pages/Login';
import ResetPassword from './pages/ResetPassword';
import Contact from './pages/Contact';
import Home from './pages/Home';
import RoleSelection from './pages/RoleSelection';
import SetupSeeker from './pages/SetupSeeker';

// Seeker Dashboard
import DashboardSeeker from './pages/DashboardSeeker';
import Overview from './components/jobseeker/pages/Overview';
import MyApplication from './components/jobseeker/pages/MyApplication';
import Support from './components/jobseeker/pages/Support';

// Employer Dashboard
import DashboardEmployerLayout from './components/employer/dashboard/DashboardEmployerLayout';
import OverviewEmployer from './components/employer/dashboard/OverviewEmployer';
import JobListing from './components/employer/dashboard/JobListing';
import PostJobForm from './components/jobs/PostJobForm';
import Messages from './components/employer/dashboard/Messages';
import ManageJobs from './components/employer/dashboard/ManageJobs';
import EditJobModal from './components/employer/dashboard/EditJobModal';

import SetupEmployer from './components/employer/setupEmployer/SetupEmployer';

// Route guards
import RoleBasedRoute from './routes/RoleBasedRoute';
import AdminRoutes from './routes/AdminRoutes'; // ✅ Admin routing

// import FixOldReports from './utils/FixOldReports';
import MaintenanceOverlay from './components/common/MaintenanceOverlay';

function App() {
  const location = useLocation();

  const hideNavbarRoutes = [
    '/dashboard-seeker',
    '/dashboard-employer',
    '/setup-seeker',
    '/setup-employer',
    '/admin',
    '/login',
    '/register',
    '/reset-password',
    '/contact',
    '/select-role',
    '/support',
    '/support/:userId',
  ];

  const hideNavbar = hideNavbarRoutes.some((path) =>
    location.pathname.startsWith(path)
  );

  return (
    <ThemeProvider>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
        {/* Global Maintenance Overlay */}
        <MaintenanceOverlay />
        
        {!hideNavbar && <Navbar />}

        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/select-role" element={<RoleSelection />} />
          <Route path="/setup-seeker" element={<SetupSeeker />} />

          {/* Role-Based Redirect */}
          <Route path="/dashboard" element={<RoleBasedRoute />} />
          {/* <Route path="/admin/fix-reports" element={<FixOldReports />} /> */}

          {/* Seeker Dashboard */}
          <Route path="/dashboard-seeker" element={<DashboardSeeker />}>
            <Route index element={<Overview />} />
            <Route path="my-applications" element={<MyApplication />} />
            <Route path="support" element={<Support />} />
          </Route>

          {/* Employer Setup */}
          <Route path="/setup-employer" element={<SetupEmployer />} />

          {/* Employer Dashboard */}
          <Route path="/dashboard-employer/*" element={<DashboardEmployerLayout />}>
            <Route index element={<OverviewEmployer />} />
            <Route path="jobs" element={<JobListing />} />
            <Route path="post-job" element={<PostJobForm />} />
            <Route path="manage-jobs" element={<ManageJobs />} />
            <Route path="edit-job/:jobId" element={<EditJobModal />} />
            <Route path="messages" element={<Messages />} />
            <Route path="support" element={<Support />} />
          </Route>

          {/* ✅ Admin Routes */}
          {AdminRoutes()}
        </Routes>
      </div>
    </ThemeProvider>
  );
}

export default App;