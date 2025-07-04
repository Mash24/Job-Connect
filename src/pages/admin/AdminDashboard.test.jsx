import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';

// Increase timeout for this test suite
jest.setTimeout(30000);

// Mock useAdminCheck to always return true (simulate admin)
jest.mock('../../hooks/useAdminCheck', () => ({
  __esModule: true,
  default: () => true,
}));

// Mock heavy subcomponents
jest.mock('../../components/admin/charts/ApplicationsOverTime', () => ({
  __esModule: true,
  default: () => <div>ApplicationsOverTime Chart</div>,
}));
jest.mock('../../components/admin/charts/JobStatusBreakdown', () => ({
  __esModule: true,
  default: () => <div>JobStatusBreakdown Chart</div>,
}));
jest.mock('./RecentActivityFeed', () => ({
  __esModule: true,
  default: () => <div>Recent Activity Feed</div>,
}));

// Mock Firebase modules
jest.mock('firebase/auth', () => ({
  getAuth: jest.fn(() => ({
    currentUser: { uid: 'test-admin-uid' },
    onAuthStateChanged: jest.fn(),
  })),
  GoogleAuthProvider: jest.fn().mockImplementation(() => ({
    addScope: jest.fn(),
    setCustomParameters: jest.fn(),
  })),
  setPersistence: jest.fn(() => Promise.resolve()),
  browserLocalPersistence: 'local',
}));

jest.mock('firebase/firestore', () => ({
  getFirestore: jest.fn(() => ({})),
  getDoc: jest.fn(() => Promise.resolve({
    exists: () => true,
    data: () => ({ role: 'super-admin' }),
  })),
  collection: jest.fn(),
  query: jest.fn(),
  orderBy: jest.fn(),
  where: jest.fn(),
  getDocs: jest.fn(() => Promise.resolve({ docs: [] })),
  doc: jest.fn(),
}));

jest.mock('firebase/storage', () => ({
  getStorage: jest.fn(() => ({})),
}));

jest.mock('firebase/analytics', () => ({
  getAnalytics: jest.fn(() => ({})),
  isSupported: jest.fn(() => Promise.resolve(true)),
}));

// Mock the Firebase config module
jest.mock('../../firebase/config', () => ({
  auth: {
    currentUser: { uid: 'test-admin-uid' },
    onAuthStateChanged: jest.fn(),
  },
  db: {},
  storage: {},
  googleProvider: {},
  analytics: {},
}));

import AdminLayout from '../../components/admin/layout/AdminLayout';
import AdminDashboard from './AdminDashboard';

describe('AdminDashboard Integration', () => {
  it('renders all major regions for an admin user', async () => {
    render(
      <MemoryRouter initialEntries={["/admin/dashboard"]} future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <Routes>
          <Route path="/admin" element={<AdminLayout />}>
            <Route path="dashboard" element={<AdminDashboard />} />
          </Route>
        </Routes>
      </MemoryRouter>
    );

    // Wait for the component to load and check for basic elements
    await waitFor(() => {
      expect(screen.getByText(/Admin Dashboard/i)).toBeInTheDocument();
    }, { timeout: 10000 });

    // Check for sidebar links
    expect(screen.getByRole('link', { name: /Dashboard/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Users/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Jobs/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Reports/i })).toBeInTheDocument();

    // Check for topbar
    expect(screen.getByText(/Welcome, Admin/i)).toBeInTheDocument();

    // Check for charts
    expect(screen.getByText(/ApplicationsOverTime Chart/i)).toBeInTheDocument();
    expect(screen.getByText(/JobStatusBreakdown Chart/i)).toBeInTheDocument();

    // Check for activity feed
    expect(screen.getByText(/Recent Activity Feed/i)).toBeInTheDocument();
  });
}); 