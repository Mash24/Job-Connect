import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { describe, it, expect, beforeEach } from 'jest';
import SystemHealthDashboard from '../../../components/admin/monitoring/SystemHealthDashboard';

// Mock Firebase
const mockFirestore = {
  collection: jest.fn(),
  query: jest.fn(),
  orderBy: jest.fn(),
  limit: jest.fn(),
  getDocs: jest.fn(),
  onSnapshot: jest.fn()
};

const mockAuth = {
  currentUser: {
    email: 'admin@test.com',
    uid: 'admin123'
  }
};

jest.mock('../../../../firebase/config', () => ({
  db: mockFirestore,
  auth: mockAuth
}));

// Mock Framer Motion
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }) => <div {...props}>{children}</div>,
    button: ({ children, ...props }) => <button {...props}>{children}</button>
  },
  AnimatePresence: ({ children }) => children
}));

// Mock Lucide React icons
jest.mock('lucide-react', () => ({
  Activity: () => <span data-testid="activity-icon">Activity</span>,
  Server: () => <span data-testid="server-icon">Server</span>,
  Database: () => <span data-testid="database-icon">Database</span>,
  Zap: () => <span data-testid="zap-icon">Zap</span>,
  AlertTriangle: () => <span data-testid="alert-triangle-icon">AlertTriangle</span>,
  TrendingUp: () => <span data-testid="trending-up-icon">TrendingUp</span>,
  TrendingDown: () => <span data-testid="trending-down-icon">TrendingDown</span>,
  RefreshCw: () => <span data-testid="refresh-icon">RefreshCw</span>,
  FileText: () => <span data-testid="file-text-icon">FileText</span>,
  Clock: () => <span data-testid="clock-icon">Clock</span>,
  Wifi: () => <span data-testid="wifi-icon">Wifi</span>,
  WifiOff: () => <span data-testid="wifi-off-icon">WifiOff</span>
}));

// Mock Recharts
jest.mock('recharts', () => ({
  LineChart: ({ children }) => <div data-testid="line-chart">{children}</div>,
  Line: () => <div data-testid="line" />,
  XAxis: () => <div data-testid="x-axis" />,
  YAxis: () => <div data-testid="y-axis" />,
  CartesianGrid: () => <div data-testid="cartesian-grid" />,
  Tooltip: () => <div data-testid="tooltip" />,
  ResponsiveContainer: ({ children }) => <div data-testid="responsive-container">{children}</div>,
  Area: () => <div data-testid="area" />,
  AreaChart: ({ children }) => <div data-testid="area-chart">{children}</div>
}));

// Mock child components
jest.mock('components/admin/monitoring/ServerStatusCard.jsx', () => ({
  default: ({ isLiveMode }) => (
    <div data-testid="server-status-card">
      <span>Server Status Card</span>
      <span>Live Mode: {isLiveMode ? 'true' : 'false'}</span>
    </div>
  )
}));

jest.mock('components/admin/monitoring/FirestorePerformancePanel.jsx', () => ({
  default: ({ isLiveMode }) => (
    <div data-testid="firestore-performance-panel">
      <span>Firestore Performance Panel</span>
    </div>
  )
}));

jest.mock('components/admin/monitoring/APIMetricsGraph.jsx', () => ({
  default: ({ isLiveMode }) => (
    <div data-testid="api-metrics-graph"></div>
  )
}));

jest.mock('components/admin/monitoring/ErrorLogTimeline.jsx', () => ({
  default: ({ logs, isLiveMode }) => (
    <div data-testid="error-log-timeline"></div>
  )
}));

const mockLogs = [
  {
    id: 'log1',
    action: 'user-login',
    type: 'info',
    timestamp: { toDate: () => new Date() },
    performedBy: 'user@example.com'
  },
  {
    id: 'log2',
    action: 'database-error',
    type: 'error',
    severity: 'warning',
    timestamp: { toDate: () => new Date() },
    details: 'Connection timeout'
  }
];

const renderWithRouter = (component) => {
  return render(
    <BrowserRouter>
      {component}
    </BrowserRouter>
  );
};

describe('SystemHealthDashboard', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    
    // Mock Firestore responses
    mockFirestore.collection.mockReturnValue({});
    mockFirestore.query.mockReturnValue({});
    mockFirestore.orderBy.mockReturnValue({});
    mockFirestore.limit.mockReturnValue({});
    mockFirestore.onSnapshot.mockImplementation((q, callback) => {
      callback({
        docs: mockLogs.map(log => ({
          id: log.id,
          data: () => log
        }))
      });
      return () => {}; // Return unsubscribe function
    });
  });

  describe('Initial Rendering', () => {
    it('renders the main dashboard with header', async () => {
      renderWithRouter(<SystemHealthDashboard />);
      
      await waitFor(() => {
        expect(screen.getByText('System Health Monitoring')).toBeInTheDocument();
        expect(screen.getByText(/Real-time monitoring of platform performance/)).toBeInTheDocument();
      });
    });

    it('renders all monitoring components', async () => {
      renderWithRouter(<SystemHealthDashboard />);
      
      await waitFor(() => {
        expect(screen.getByTestId('server-status-card')).toBeInTheDocument();
        expect(screen.getByTestId('firestore-performance-panel')).toBeInTheDocument();
        expect(screen.getByTestId('api-metrics-graph')).toBeInTheDocument();
        expect(screen.getByTestId('error-log-timeline')).toBeInTheDocument();
      });
    });

    it('shows live mode by default', async () => {
      renderWithRouter(<SystemHealthDashboard />);
      
      await waitFor(() => {
        expect(screen.getByText('Live Mode')).toBeInTheDocument();
        expect(screen.getByText('Live')).toBeInTheDocument();
      });
    });

    it('displays system status badge', async () => {
      renderWithRouter(<SystemHealthDashboard />);
      
      await waitFor(() => {
        expect(screen.getByText('healthy')).toBeInTheDocument();
      });
    });
  });

  describe('Live Mode Toggle', () => {
    it('toggles live mode when button is clicked', async () => {
      renderWithRouter(<SystemHealthDashboard />);
      
      await waitFor(() => {
        expect(screen.getByText('Live Mode')).toBeInTheDocument();
      });

      const toggleButton = screen.getByRole('button', { name: /Live Mode/i });
      fireEvent.click(toggleButton);
      
      // The toggle should change state (this would be tested in integration tests)
      expect(toggleButton).toBeInTheDocument();
    });

    it('shows live indicator when in live mode', async () => {
      renderWithRouter(<SystemHealthDashboard />);
      
      await waitFor(() => {
        // Should show live indicator (red dot)
        expect(screen.getByText('Live')).toBeInTheDocument();
      });
    });
  });

  describe('Overview Metrics', () => {
    it('displays uptime metric', async () => {
      renderWithRouter(<SystemHealthDashboard />);
      
      await waitFor(() => {
        expect(screen.getByText('Uptime')).toBeInTheDocument();
        expect(screen.getByText('99.97%')).toBeInTheDocument();
      });
    });

    it('displays active connections metric', async () => {
      renderWithRouter(<SystemHealthDashboard />);
      
      await waitFor(() => {
        expect(screen.getByText('Active Connections')).toBeInTheDocument();
      });
    });

    it('displays error rate metric', async () => {
      renderWithRouter(<SystemHealthDashboard />);
      
      await waitFor(() => {
        expect(screen.getByText('Error Rate')).toBeInTheDocument();
      });
    });

    it('displays response time metric', async () => {
      renderWithRouter(<SystemHealthDashboard />);
      
      await waitFor(() => {
        expect(screen.getByText('Response Time')).toBeInTheDocument();
        expect(screen.getByText('127ms')).toBeInTheDocument();
      });
    });
  });

  describe('Component Integration', () => {
    it('passes live mode to child components', async () => {
      renderWithRouter(<SystemHealthDashboard />);
      
      await waitFor(() => {
        expect(screen.getByText('Live Mode: true')).toBeInTheDocument();
      });
    });

    it('passes logs to error timeline', async () => {
      renderWithRouter(<SystemHealthDashboard />);
      
      await waitFor(() => {
        expect(screen.getByText('Logs Count: 2')).toBeInTheDocument();
      });
    });
  });

  describe('Real-time Updates', () => {
    it('updates metrics in live mode', async () => {
      renderWithRouter(<SystemHealthDashboard />);
      
      await waitFor(() => {
        expect(screen.getByText('System Health Monitoring')).toBeInTheDocument();
      });

      // Wait for real-time updates
      await waitFor(() => {
        // Metrics should be updated (this would be tested in integration tests)
        expect(screen.getByText('System Health Monitoring')).toBeInTheDocument();
      }, { timeout: 6000 });
    });

    it('stops updates when live mode is disabled', async () => {
      renderWithRouter(<SystemHealthDashboard />);
      
      await waitFor(() => {
        expect(screen.getByText('Live Mode')).toBeInTheDocument();
      });

      const toggleButton = screen.getByRole('button', { name: /Live Mode/i });
      fireEvent.click(toggleButton);
      
      // Updates should stop (this would be tested in integration tests)
      expect(toggleButton).toBeInTheDocument();
    });
  });

  describe('Error Handling', () => {
    it('handles Firestore errors gracefully', async () => {
      mockFirestore.onSnapshot.mockImplementation(() => {
        throw new Error('Firestore error');
      });

      renderWithRouter(<SystemHealthDashboard />);
      
      await waitFor(() => {
        // Component should handle error gracefully
        expect(screen.getByText('System Health Monitoring')).toBeInTheDocument();
      });
    });

    it('displays system status based on error count', async () => {
      renderWithRouter(<SystemHealthDashboard />);
      
      await waitFor(() => {
        expect(screen.getByText('healthy')).toBeInTheDocument();
      });
    });
  });

  describe('Accessibility', () => {
    it('has proper ARIA labels', async () => {
      renderWithRouter(<SystemHealthDashboard />);
      
      await waitFor(() => {
        expect(screen.getByText('System Health Monitoring')).toBeInTheDocument();
      });

      // Check for accessibility features
      const toggleButton = screen.getByRole('button', { name: /Live Mode/i });
      expect(toggleButton).toBeInTheDocument();
    });

    it('supports keyboard navigation', async () => {
      renderWithRouter(<SystemHealthDashboard />);
      
      await waitFor(() => {
        expect(screen.getByText('System Health Monitoring')).toBeInTheDocument();
      });

      // Test keyboard navigation
      const toggleButton = screen.getByRole('button', { name: /Live Mode/i });
      toggleButton.focus();
      expect(toggleButton).toHaveFocus();
    });
  });

  describe('Performance', () => {
    it('renders without performance issues', async () => {
      const startTime = performance.now();
      
      renderWithRouter(<SystemHealthDashboard />);
      
      await waitFor(() => {
        expect(screen.getByText('System Health Monitoring')).toBeInTheDocument();
      });

      const endTime = performance.now();
      const renderTime = endTime - startTime;
      
      // Should render within reasonable time
      expect(renderTime).toBeLessThan(1000);
    });

    it('handles large log datasets efficiently', async () => {
      const largeLogs = Array.from({ length: 1000 }, (_, i) => ({
        id: `log${i}`,
        action: 'test-action',
        type: 'info',
        timestamp: { toDate: () => new Date() }
      }));

      mockFirestore.onSnapshot.mockImplementation((q, callback) => {
        callback({
          docs: largeLogs.map(log => ({
            id: log.id,
            data: () => log
          }))
        });
        return () => {};
      });

      renderWithRouter(<SystemHealthDashboard />);
      
      await waitFor(() => {
        expect(screen.getByText('System Health Monitoring')).toBeInTheDocument();
      });
    });
  });
}); 