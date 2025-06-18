import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import CohortAnalysis from '../../../../components/admin/analytics/CohortAnalysis';

// Mock recharts components
jest.mock('recharts', () => ({
  BarChart: ({ children }) => <div data-testid="bar-chart">{children}</div>,
  Bar: () => <div data-testid="bar" />,
  XAxis: () => <div data-testid="x-axis" />,
  YAxis: () => <div data-testid="y-axis" />,
  CartesianGrid: () => <div data-testid="cartesian-grid" />,
  Tooltip: () => <div data-testid="tooltip" />,
  Legend: () => <div data-testid="legend" />,
  ResponsiveContainer: ({ children }) => <div data-testid="responsive-container">{children}</div>,
  HeatMap: ({ children }) => <div data-testid="heatmap">{children}</div>,
  Cell: () => <div data-testid="cell" />,
}));

// Mock lucide-react icons
jest.mock('lucide-react', () => ({
  Users: () => <div data-testid="users-icon" />,
  Calendar: () => <div data-testid="calendar-icon" />,
  TrendingUp: () => <div data-testid="trending-up-icon" />,
  BarChart3: () => <div data-testid="bar-chart3-icon" />,
  Filter: () => <div data-testid="filter-icon" />,
  Download: () => <div data-testid="download-icon" />,
  Eye: () => <div data-testid="eye-icon" />,
  EyeOff: () => <div data-testid="eye-off-icon" />,
  RefreshCw: () => <div data-testid="refresh-cw-icon" />,
}));

const mockData = {
  users: [
    { id: '1', createdAt: new Date('2024-01-01') },
    { id: '2', createdAt: new Date('2024-01-02') },
    { id: '3', createdAt: new Date('2024-01-03') },
    { id: '4', createdAt: new Date('2024-02-01') },
    { id: '5', createdAt: new Date('2024-02-02') },
  ],
  applications: [
    { id: '1', userId: '1', jobId: 'job1', createdAt: new Date('2024-01-05') },
    { id: '2', userId: '1', jobId: 'job2', createdAt: new Date('2024-01-10') },
    { id: '3', userId: '2', jobId: 'job3', createdAt: new Date('2024-01-08') },
    { id: '4', userId: '4', jobId: 'job4', createdAt: new Date('2024-02-05') },
  ],
  jobs: [
    { id: 'job1', createdAt: new Date('2024-01-01') },
    { id: 'job2', createdAt: new Date('2024-01-02') },
    { id: 'job3', createdAt: new Date('2024-01-03') },
    { id: 'job4', createdAt: new Date('2024-02-01') },
  ],
  metrics: {
    totalUsers: 5,
    totalJobs: 4,
    totalApplications: 4,
    recentUsers: 5,
    recentJobs: 4,
    recentApplications: 4,
    userGrowth: 10.5,
    jobGrowth: 5.2,
    appGrowth: 15.8,
    avgApplicationsPerJob: 1.0,
    conversionRate: 80.0,
  },
};

describe('CohortAnalysis', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders without crashing', () => {
    render(<CohortAnalysis data={mockData} dateRange="30" />);
    expect(screen.getByText('Cohort Analysis')).toBeInTheDocument();
  });

  it('displays the correct header text', () => {
    render(<CohortAnalysis data={mockData} dateRange="30" />);
    expect(screen.getByText('Track user retention and engagement patterns over time')).toBeInTheDocument();
  });

  it('renders cohort period selector', () => {
    render(<CohortAnalysis data={mockData} dateRange="30" />);
    expect(screen.getByDisplayValue('month')).toBeInTheDocument();
  });

  it('allows changing cohort period', () => {
    render(<CohortAnalysis data={mockData} dateRange="30" />);
    const select = screen.getByDisplayValue('month');
    fireEvent.change(select, { target: { value: 'week' } });
    expect(select.value).toBe('week');
  });

  it('renders analysis settings section', () => {
    render(<CohortAnalysis data={mockData} dateRange="30" />);
    expect(screen.getByText('Analysis Settings')).toBeInTheDocument();
  });

  it('renders retention periods checkboxes', () => {
    render(<CohortAnalysis data={mockData} dateRange="30" />);
    expect(screen.getByText('D+7')).toBeInTheDocument();
    expect(screen.getByText('D+14')).toBeInTheDocument();
    expect(screen.getByText('D+30')).toBeInTheDocument();
    expect(screen.getByText('D+60')).toBeInTheDocument();
    expect(screen.getByText('D+90')).toBeInTheDocument();
  });

  it('allows toggling retention periods', () => {
    render(<CohortAnalysis data={mockData} dateRange="30" />);
    const d7Checkbox = screen.getByText('D+7').closest('label').querySelector('input');
    fireEvent.click(d7Checkbox);
    expect(d7Checkbox.checked).toBe(false);
  });

  it('displays cohort period information', () => {
    render(<CohortAnalysis data={mockData} dateRange="30" />);
    expect(screen.getByText('Currently grouping by:')).toBeInTheDocument();
    expect(screen.getByText('month')).toBeInTheDocument();
  });

  it('renders view mode toggle buttons', () => {
    render(<CohortAnalysis data={mockData} dateRange="30" />);
    expect(screen.getByText('Heatmap')).toBeInTheDocument();
    expect(screen.getByText('Charts')).toBeInTheDocument();
  });

  it('switches to chart view when clicked', () => {
    render(<CohortAnalysis data={mockData} dateRange="30" />);
    const chartsButton = screen.getByText('Charts');
    fireEvent.click(chartsButton);
    expect(chartsButton).toHaveClass('bg-blue-100');
  });

  it('switches to heatmap view when clicked', () => {
    render(<CohortAnalysis data={mockData} dateRange="30" />);
    const heatmapButton = screen.getByText('Heatmap');
    fireEvent.click(heatmapButton);
    expect(heatmapButton).toHaveClass('bg-blue-100');
  });

  it('renders refresh button', () => {
    render(<CohortAnalysis data={mockData} dateRange="30" />);
    expect(screen.getByText('Refresh')).toBeInTheDocument();
  });

  it('shows loading state when refreshing', async () => {
    render(<CohortAnalysis data={mockData} dateRange="30" />);
    const refreshButton = screen.getByText('Refresh');
    fireEvent.click(refreshButton);
    
    await waitFor(() => {
      expect(screen.getByText('Analyzing cohorts...')).toBeInTheDocument();
    });
  });

  it('renders metrics cards when data is available', () => {
    render(<CohortAnalysis data={mockData} dateRange="30" />);
    expect(screen.getByText('Total Users')).toBeInTheDocument();
    expect(screen.getByText('Avg Retention')).toBeInTheDocument();
    expect(screen.getByText('Best Cohort')).toBeInTheDocument();
  });

  it('displays total users count', () => {
    render(<CohortAnalysis data={mockData} dateRange="30" />);
    expect(screen.getByText('5')).toBeInTheDocument(); // Total users from mock data
  });

  it('shows average retention percentage', () => {
    render(<CohortAnalysis data={mockData} dateRange="30" />);
    expect(screen.getByText(/^\d+\.\d+%$/)).toBeInTheDocument(); // Matches percentage format
  });

  it('displays best cohort information', () => {
    render(<CohortAnalysis data={mockData} dateRange="30" />);
    expect(screen.getByText(/retention$/)).toBeInTheDocument();
  });

  it('renders retention heatmap in heatmap view', () => {
    render(<CohortAnalysis data={mockData} dateRange="30" />);
    expect(screen.getByText('Retention Heatmap')).toBeInTheDocument();
  });

  it('shows cohort count in heatmap', () => {
    render(<CohortAnalysis data={mockData} dateRange="30" />);
    expect(screen.getByText(/cohorts analyzed/)).toBeInTheDocument();
  });

  it('renders charts in chart view', () => {
    render(<CohortAnalysis data={mockData} dateRange="30" />);
    const chartsButton = screen.getByText('Charts');
    fireEvent.click(chartsButton);
    
    expect(screen.getByText('Average Retention by Period')).toBeInTheDocument();
    expect(screen.getByText('Cohort Sizes')).toBeInTheDocument();
  });

  it('displays average retention chart', () => {
    render(<CohortAnalysis data={mockData} dateRange="30" />);
    const chartsButton = screen.getByText('Charts');
    fireEvent.click(chartsButton);
    
    expect(screen.getByText('Average Retention by Period')).toBeInTheDocument();
  });

  it('displays cohort sizes chart', () => {
    render(<CohortAnalysis data={mockData} dateRange="30" />);
    const chartsButton = screen.getByText('Charts');
    fireEvent.click(chartsButton);
    
    expect(screen.getByText('Cohort Sizes')).toBeInTheDocument();
  });

  it('shows total users in cohort sizes chart', () => {
    render(<CohortAnalysis data={mockData} dateRange="30" />);
    const chartsButton = screen.getByText('Charts');
    fireEvent.click(chartsButton);
    
    expect(screen.getByText(/Total users:/)).toBeInTheDocument();
  });

  it('handles empty data gracefully', () => {
    const emptyData = {
      users: [],
      applications: [],
      jobs: [],
      metrics: {},
    };
    render(<CohortAnalysis data={emptyData} dateRange="30" />);
    expect(screen.getByText('Cohort Analysis')).toBeInTheDocument();
  });

  it('shows empty state when no cohort data', () => {
    const emptyData = {
      users: [],
      applications: [],
      jobs: [],
      metrics: {},
    };
    render(<CohortAnalysis data={emptyData} dateRange="30" />);
    expect(screen.getByText('No cohort data available')).toBeInTheDocument();
  });

  it('displays correct icons in metrics cards', () => {
    render(<CohortAnalysis data={mockData} dateRange="30" />);
    expect(screen.getByTestId('users-icon')).toBeInTheDocument();
    expect(screen.getByTestId('trending-up-icon')).toBeInTheDocument();
    expect(screen.getByTestId('bar-chart3-icon')).toBeInTheDocument();
  });

  it('renders chart components correctly', () => {
    render(<CohortAnalysis data={mockData} dateRange="30" />);
    const chartsButton = screen.getByText('Charts');
    fireEvent.click(chartsButton);
    
    expect(screen.getByTestId('bar-chart')).toBeInTheDocument();
    expect(screen.getByTestId('bar')).toBeInTheDocument();
    expect(screen.getByTestId('x-axis')).toBeInTheDocument();
    expect(screen.getByTestId('y-axis')).toBeInTheDocument();
  });

  it('shows tooltip in charts', () => {
    render(<CohortAnalysis data={mockData} dateRange="30" />);
    const chartsButton = screen.getByText('Charts');
    fireEvent.click(chartsButton);
    
    expect(screen.getByTestId('tooltip')).toBeInTheDocument();
  });

  it('handles different cohort periods correctly', () => {
    const { rerender } = render(<CohortAnalysis data={mockData} dateRange="7" />);
    expect(screen.getByText('Cohort Analysis')).toBeInTheDocument();
    
    rerender(<CohortAnalysis data={mockData} dateRange="90" />);
    expect(screen.getByText('Cohort Analysis')).toBeInTheDocument();
  });

  it('updates cohort period when changed', () => {
    render(<CohortAnalysis data={mockData} dateRange="30" />);
    const select = screen.getByDisplayValue('month');
    fireEvent.change(select, { target: { value: 'quarter' } });
    
    expect(select.value).toBe('quarter');
  });

  it('displays refresh icon correctly', () => {
    render(<CohortAnalysis data={mockData} dateRange="30" />);
    expect(screen.getByTestId('refresh-cw-icon')).toBeInTheDocument();
  });

  it('shows spinning animation during loading', async () => {
    render(<CohortAnalysis data={mockData} dateRange="30" />);
    const refreshButton = screen.getByText('Refresh');
    fireEvent.click(refreshButton);
    
    await waitFor(() => {
      const refreshIcon = screen.getByTestId('refresh-cw-icon');
      expect(refreshIcon.closest('button')).toHaveClass('disabled:opacity-50');
    });
  });
}); 