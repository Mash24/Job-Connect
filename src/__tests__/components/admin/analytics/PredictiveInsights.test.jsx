import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import PredictiveInsights from '../../../../components/admin/analytics/PredictiveInsights';

// Mock recharts components
jest.mock('recharts', () => ({
  LineChart: ({ children }) => <div data-testid="line-chart">{children}</div>,
  Line: () => <div data-testid="line" />,
  XAxis: () => <div data-testid="x-axis" />,
  YAxis: () => <div data-testid="y-axis" />,
  CartesianGrid: () => <div data-testid="cartesian-grid" />,
  Tooltip: () => <div data-testid="tooltip" />,
  Legend: () => <div data-testid="legend" />,
  ResponsiveContainer: ({ children }) => <div data-testid="responsive-container">{children}</div>,
  AreaChart: ({ children }) => <div data-testid="area-chart">{children}</div>,
  Area: () => <div data-testid="area" />,
  BarChart: ({ children }) => <div data-testid="bar-chart">{children}</div>,
  Bar: () => <div data-testid="bar" />,
}));

// Mock lucide-react icons
jest.mock('lucide-react', () => ({
  TrendingUp: () => <div data-testid="trending-up-icon" />,
  Calendar: () => <div data-testid="calendar-icon" />,
  Users: () => <div data-testid="users-icon" />,
  Briefcase: () => <div data-testid="briefcase-icon" />,
  Target: () => <div data-testid="target-icon" />,
  Zap: () => <div data-testid="zap-icon" />,
  Eye: () => <div data-testid="eye-icon" />,
  EyeOff: () => <div data-testid="eye-off-icon" />,
  Filter: () => <div data-testid="filter-icon" />,
  Download: () => <div data-testid="download-icon" />,
  RefreshCw: () => <div data-testid="refresh-cw-icon" />,
}));

const mockData = {
  users: [
    { id: '1', createdAt: new Date('2024-01-01') },
    { id: '2', createdAt: new Date('2024-01-02') },
    { id: '3', createdAt: new Date('2024-01-03') },
  ],
  jobs: [
    { id: '1', createdAt: new Date('2024-01-01') },
    { id: '2', createdAt: new Date('2024-01-02') },
  ],
  applications: [
    { id: '1', createdAt: new Date('2024-01-01') },
    { id: '2', createdAt: new Date('2024-01-02') },
    { id: '3', createdAt: new Date('2024-01-03') },
    { id: '4', createdAt: new Date('2024-01-04') },
  ],
  metrics: {
    totalUsers: 3,
    totalJobs: 2,
    totalApplications: 4,
    recentUsers: 3,
    recentJobs: 2,
    recentApplications: 4,
    userGrowth: 10.5,
    jobGrowth: 5.2,
    appGrowth: 15.8,
    avgApplicationsPerJob: 2.0,
    conversionRate: 133.3,
  },
};

describe('PredictiveInsights', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders without crashing', () => {
    render(<PredictiveInsights data={mockData} dateRange="30" />);
    expect(screen.getByText('Predictive Insights')).toBeInTheDocument();
  });

  it('displays the correct header text', () => {
    render(<PredictiveInsights data={mockData} dateRange="30" />);
    expect(screen.getByText('Forecast user growth, job postings, and applications using advanced trend analysis')).toBeInTheDocument();
  });

  it('renders forecast period selector', () => {
    render(<PredictiveInsights data={mockData} dateRange="30" />);
    expect(screen.getByDisplayValue('90')).toBeInTheDocument();
  });

  it('allows changing forecast period', () => {
    render(<PredictiveInsights data={mockData} dateRange="30" />);
    const select = screen.getByDisplayValue('90');
    fireEvent.change(select, { target: { value: '30' } });
    expect(select.value).toBe('30');
  });

  it('renders metrics toggle section', () => {
    render(<PredictiveInsights data={mockData} dateRange="30" />);
    expect(screen.getByText('Metrics to Display')).toBeInTheDocument();
  });

  it('renders all metric checkboxes', () => {
    render(<PredictiveInsights data={mockData} dateRange="30" />);
    expect(screen.getByText('User Registrations')).toBeInTheDocument();
    expect(screen.getByText('Job Postings')).toBeInTheDocument();
    expect(screen.getByText('Applications')).toBeInTheDocument();
  });

  it('allows toggling metrics on/off', () => {
    render(<PredictiveInsights data={mockData} dateRange="30" />);
    const userCheckbox = screen.getByText('User Registrations').closest('label').querySelector('input');
    fireEvent.click(userCheckbox);
    expect(userCheckbox.checked).toBe(false);
  });

  it('renders "All" and "None" buttons for metrics', () => {
    render(<PredictiveInsights data={mockData} dateRange="30" />);
    expect(screen.getByText('All')).toBeInTheDocument();
    expect(screen.getByText('None')).toBeInTheDocument();
  });

  it('selects all metrics when "All" button is clicked', () => {
    render(<PredictiveInsights data={mockData} dateRange="30" />);
    const allButton = screen.getByText('All');
    fireEvent.click(allButton);
    
    const checkboxes = screen.getAllByRole('checkbox');
    checkboxes.forEach(checkbox => {
      expect(checkbox.checked).toBe(true);
    });
  });

  it('deselects all metrics when "None" button is clicked', () => {
    render(<PredictiveInsights data={mockData} dateRange="30" />);
    const noneButton = screen.getByText('None');
    fireEvent.click(noneButton);
    
    const checkboxes = screen.getAllByRole('checkbox');
    checkboxes.forEach(checkbox => {
      expect(checkbox.checked).toBe(false);
    });
  });

  it('renders refresh button', () => {
    render(<PredictiveInsights data={mockData} dateRange="30" />);
    expect(screen.getByText('Refresh')).toBeInTheDocument();
  });

  it('shows loading state when refreshing', async () => {
    render(<PredictiveInsights data={mockData} dateRange="30" />);
    const refreshButton = screen.getByText('Refresh');
    fireEvent.click(refreshButton);
    
    await waitFor(() => {
      expect(screen.getByText('Generating forecasts...')).toBeInTheDocument();
    });
  });

  it('renders forecast charts for selected metrics', () => {
    render(<PredictiveInsights data={mockData} dateRange="30" />);
    expect(screen.getByTestId('responsive-container')).toBeInTheDocument();
  });

  it('displays forecast summary section', () => {
    render(<PredictiveInsights data={mockData} dateRange="30" />);
    expect(screen.getByText('Forecast Summary (90 days)')).toBeInTheDocument();
  });

  it('shows projected growth information', () => {
    render(<PredictiveInsights data={mockData} dateRange="30" />);
    expect(screen.getByText('Projected Growth')).toBeInTheDocument();
    expect(screen.getByText('Total Projected')).toBeInTheDocument();
  });

  it('renders key insights section', () => {
    render(<PredictiveInsights data={mockData} dateRange="30" />);
    expect(screen.getByText('Key Insights')).toBeInTheDocument();
  });

  it('displays insights for each metric', () => {
    render(<PredictiveInsights data={mockData} dateRange="30" />);
    expect(screen.getByText('Projected growth over 90 days')).toBeInTheDocument();
  });

  it('handles empty data gracefully', () => {
    const emptyData = {
      users: [],
      jobs: [],
      applications: [],
      metrics: {},
    };
    render(<PredictiveInsights data={emptyData} dateRange="30" />);
    expect(screen.getByText('Predictive Insights')).toBeInTheDocument();
  });

  it('renders trend line toggle button', () => {
    render(<PredictiveInsights data={mockData} dateRange="30" />);
    expect(screen.getByTestId('eye-icon')).toBeInTheDocument();
  });

  it('toggles trend lines visibility', () => {
    render(<PredictiveInsights data={mockData} dateRange="30" />);
    const toggleButton = screen.getByTestId('eye-icon').closest('button');
    fireEvent.click(toggleButton);
    expect(screen.getByTestId('eye-off-icon')).toBeInTheDocument();
  });

  it('displays correct forecast period in summary', () => {
    render(<PredictiveInsights data={mockData} dateRange="30" />);
    expect(screen.getByText('Forecast Summary (90 days)')).toBeInTheDocument();
  });

  it('updates forecast period when changed', () => {
    render(<PredictiveInsights data={mockData} dateRange="30" />);
    const select = screen.getByDisplayValue('90');
    fireEvent.change(select, { target: { value: '30' } });
    
    // The component should re-render with new period
    expect(select.value).toBe('30');
  });

  it('renders chart components correctly', () => {
    render(<PredictiveInsights data={mockData} dateRange="30" />);
    expect(screen.getByTestId('line-chart')).toBeInTheDocument();
    expect(screen.getByTestId('line')).toBeInTheDocument();
    expect(screen.getByTestId('x-axis')).toBeInTheDocument();
    expect(screen.getByTestId('y-axis')).toBeInTheDocument();
  });

  it('shows tooltip and legend in charts', () => {
    render(<PredictiveInsights data={mockData} dateRange="30" />);
    expect(screen.getByTestId('tooltip')).toBeInTheDocument();
    expect(screen.getByTestId('legend')).toBeInTheDocument();
  });

  it('handles different date ranges correctly', () => {
    const { rerender } = render(<PredictiveInsights data={mockData} dateRange="7" />);
    expect(screen.getByText('Predictive Insights')).toBeInTheDocument();
    
    rerender(<PredictiveInsights data={mockData} dateRange="90" />);
    expect(screen.getByText('Predictive Insights')).toBeInTheDocument();
  });

  it('displays metric icons correctly', () => {
    render(<PredictiveInsights data={mockData} dateRange="30" />);
    expect(screen.getByTestId('users-icon')).toBeInTheDocument();
    expect(screen.getByTestId('briefcase-icon')).toBeInTheDocument();
    expect(screen.getByTestId('target-icon')).toBeInTheDocument();
  });

  it('shows zap icon in key insights section', () => {
    render(<PredictiveInsights data={mockData} dateRange="30" />);
    expect(screen.getByTestId('zap-icon')).toBeInTheDocument();
  });
}); 