// File: src/App.jsx

import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';

import Navbar from './components/layouts/Navbar';

// Public Pages
import Register from './pages/Register';
import Login from './pages/Login';
import ResetPassword from './pages/ResetPassword';
import Contact from './pages/Contact';
import Home from './pages/Home';
import RoleSelection from './pages/RoleSelection';
import SetupSeeker from './pages/SetupSeeker';

// Dashboard Route Guards
import RoleBasedRoute from './routes/RoleBasedRoute';

// Job Seeker Dashboard
import DashboardSeeker from './pages/DashboardSeeker';
import Overview from './components/jobseeker/pages/Overview';
import MyApplication from './components/jobseeker/pages/MyApplication';
import Support from './components/jobseeker/pages/Support';

// Employer Dashboard
import DashboardEmployerLayout from './components/employer/dashboard/DashboardEmployerLayout';
import OverviewEmployer from './components/employer/dashboard/OverviewEmployer'
import JobListing from './components/employer/dashboard/JobListing';
import PostJobForm from './components/jobs/PostJobForm';
import Messages from './components/employer/dashboard/Messages';
import ManageJobs from './components/employer/dashboard/ManageJobs';
import EditJobModal from './components/employer/dashboard/EditJobModal';

import SetupEmployer from './components/employer/setupEmployer/SetupEmployer';

// Admin Support Panel 
import AdminSupportPage from './components/admin/AdminSupportPage';
import SupportThreadPage from './components/admin/support/SupportThreadPage';
// Reuse Support page for both dashboards

function App() {
  const location = useLocation();

  // Hide Navbar on dashboard routes
  const hideNavbar = ['/dashboard-seeker', '/dashboard-employer', '/setup-seeker', '/setup-employer'].some((path) => location.pathname.startsWith(path));

  return (
    <>
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

        {/* Redirect based on user role */}
        <Route path="/dashboard" element={<RoleBasedRoute />} />

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

        {/* Admin Support panel */}
        <Route path="/admin/support" element={<AdminSupportPage />}/>
        <Route path="/admin/support/:userId" element={<SupportThreadPage />} />
          
      </Routes>
    </>
  );
}

export default App;