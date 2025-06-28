import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';

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

// Mock Firebase auth and Firestore
jest.mock('../../firebase/config', () => {
  const originalModule = jest.requireActual('../../firebase/config');
  return {
    ...originalModule,
    auth: {
      ...originalModule.auth,
      currentUser: { uid: 'test-admin-uid' },
    },
    db: {},
  };
});

jest.mock('firebase/firestore', () => {
  const original = jest.requireActual('firebase/firestore');
  return {
    ...original,
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
  };
});

jest.mock('firebase/app');
jest.mock('firebase/auth');
jest.mock('firebase/analytics');

import AdminLayout from '../../components/admin/layout/AdminLayout';
import AdminDashboard from './AdminDashboard';

describe('AdminDashboard Integration', () => {
  it('renders all major regions for an admin user', async () => {
    render(
      <MemoryRouter initialEntries={["/admin/dashboard"]}>
        <Routes>
          <Route path="/admin" element={<AdminLayout />}>
            <Route path="dashboard" element={<AdminDashboard />} />
          </Route>
        </Routes>
      </MemoryRouter>
    );

    // Sidebar links
    await waitFor(() => {
      expect(screen.getByRole('link', { name: /Dashboard/i })).toBeInTheDocument();
      expect(screen.getByRole('link', { name: /Users/i })).toBeInTheDocument();
      expect(screen.getByRole('link', { name: /Jobs/i })).toBeInTheDocument();
      expect(screen.getByRole('link', { name: /Reports/i })).toBeInTheDocument();
    });

    // Topbar
    expect(screen.getByText(/Welcome, Admin/i)).toBeInTheDocument();

    // Dashboard header - updated to match actual component
    await waitFor(() => {
      expect(screen.getByText(/📊 Admin Dashboard/i)).toBeInTheDocument();
    });

    // Metric cards - updated to match actual component structure and use more specific selectors
    await waitFor(() => {
      expect(screen.getByText(/New Users/i)).toBeInTheDocument();
      expect(screen.getByText(/Active Jobs/i)).toBeInTheDocument();
      // Use a more specific selector for Applications to avoid conflicts
      expect(screen.getByText(/Applications/i, { selector: 'p' })).toBeInTheDocument();
      expect(screen.getByText(/Conversion Rate/i)).toBeInTheDocument();
    });

    // Charts
    expect(screen.getByText(/ApplicationsOverTime Chart/i)).toBeInTheDocument();
    expect(screen.getByText(/JobStatusBreakdown Chart/i)).toBeInTheDocument();

    // Activity Feed
    expect(screen.getByText(/Recent Activity Feed/i)).toBeInTheDocument();
  });
}); 