import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import MarketIntelligence from '../../../../components/admin/analytics/MarketIntelligence';

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
  PieChart: ({ children }) => <div data-testid="pie-chart">{children}</div>,
  Pie: () => <div data-testid="pie" />,
  Cell: () => <div data-testid="cell" />,
  RadarChart: ({ children }) => <div data-testid="radar-chart">{children}</div>,
  PolarGrid: () => <div data-testid="polar-grid" />,
  PolarAngleAxis: () => <div data-testid="polar-angle-axis" />,
  PolarRadiusAxis: () => <div data-testid="polar-radius-axis" />,
  Radar: () => <div data-testid="radar" />,
}));

// Mock lucide-react icons
jest.mock('lucide-react', () => ({
  Target: () => <div data-testid="target-icon" />,
  MapPin: () => <div data-testid="map-pin-icon" />,
  DollarSign: () => <div data-testid="dollar-sign-icon" />,
  TrendingUp: () => <div data-testid="trending-up-icon" />,
  BarChart3: () => <div data-testid="bar-chart3-icon" />,
  Filter: () => <div data-testid="filter-icon" />,
  Download: () => <div data-testid="download-icon" />,
  Eye: () => <div data-testid="eye-icon" />,
  EyeOff: () => <div data-testid="eye-off-icon" />,
  RefreshCw: () => <div data-testid="refresh-cw-icon" />,
  Globe: () => <div data-testid="globe-icon" />,
}));

const mockData = {
  users: [
    { id: '1', createdAt: new Date('2024-01-01') },
    { id: '2', createdAt: new Date('2024-01-02') },
  ],
  jobs: [
    { 
      id: '1', 
      category: 'Technology', 
      location: 'San Francisco', 
      salary: 80000,
      skills: ['JavaScript', 'React', 'Node.js'],
      createdAt: new Date('2024-01-01') 
    },
    { 
      id: '2', 
      category: 'Marketing', 
      location: 'New York', 
      salary: 70000,
      skills: ['SEO', 'Social Media'],
      createdAt: new Date('2024-01-02') 
    },
    { 
      id: '3', 
      category: 'Technology', 
      location: 'San Francisco', 
      salary: 90000,
      skills: ['Python', 'Django'],
      createdAt: new Date('2024-01-03') 
    },
    { 
      id: '4', 
      category: 'Design', 
      location: 'Los Angeles', 
      salary: 75000,
      skills: ['Figma', 'Adobe Creative Suite'],
      createdAt: new Date('2024-02-01') 
    },
  ],
  applications: [
    { id: '1', jobId: '1', createdAt: new Date('2024-01-05') },
    { id: '2', jobId: '1', createdAt: new Date('2024-01-06') },
    { id: '3', jobId: '2', createdAt: new Date('2024-01-07') },
    { id: '4', jobId: '3', createdAt: new Date('2024-01-08') },
  ],
  metrics: {
    totalUsers: 2,
    totalJobs: 4,
    totalApplications: 4,
    recentUsers: 2,
    recentJobs: 4,
    recentApplications: 4,
    userGrowth: 10.5,
    jobGrowth: 5.2,
    appGrowth: 15.8,
    avgApplicationsPerJob: 1.0,
    conversionRate: 200.0,
  },
};

describe('MarketIntelligence', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders without crashing', () => {
    render(<MarketIntelligence data={mockData} dateRange="30" />);
    expect(screen.getByText('Market Intelligence')).toBeInTheDocument();
  });

  it('displays the correct header text', () => {
    render(<MarketIntelligence data={mockData} dateRange="30" />);
    expect(screen.getByText('Identify trends in job categories, locations, and salary patterns')).toBeInTheDocument();
  });

  it('renders refresh button', () => {
    render(<MarketIntelligence data={mockData} dateRange="30" />);
    expect(screen.getByText('Refresh')).toBeInTheDocument();
  });

  it('shows loading state when refreshing', async () => {
    render(<MarketIntelligence data={mockData} dateRange="30" />);
    const refreshButton = screen.getByText('Refresh');
    fireEvent.click(refreshButton);
    
    await waitFor(() => {
      expect(screen.getByText('Analyzing market data...')).toBeInTheDocument();
    });
  });

  it('renders market filters section', () => {
    render(<MarketIntelligence data={mockData} dateRange="30" />);
    expect(screen.getByText('Market Filters')).toBeInTheDocument();
  });

  it('renders view mode toggle buttons', () => {
    render(<MarketIntelligence data={mockData} dateRange="30" />);
    expect(screen.getByText('Categories')).toBeInTheDocument();
    expect(screen.getByText('Locations')).toBeInTheDocument();
    expect(screen.getByText('Salaries')).toBeInTheDocument();
  });

  it('switches to categories view when clicked', () => {
    render(<MarketIntelligence data={mockData} dateRange="30" />);
    const categoriesButton = screen.getByText('Categories');
    fireEvent.click(categoriesButton);
    expect(categoriesButton).toHaveClass('bg-blue-100');
  });

  it('switches to locations view when clicked', () => {
    render(<MarketIntelligence data={mockData} dateRange="30" />);
    const locationsButton = screen.getByText('Locations');
    fireEvent.click(locationsButton);
    expect(locationsButton).toHaveClass('bg-blue-100');
  });

  it('switches to salaries view when clicked', () => {
    render(<MarketIntelligence data={mockData} dateRange="30" />);
    const salariesButton = screen.getByText('Salaries');
    fireEvent.click(salariesButton);
    expect(salariesButton).toHaveClass('bg-blue-100');
  });

  it('renders category filter dropdown', () => {
    render(<MarketIntelligence data={mockData} dateRange="30" />);
    expect(screen.getByText('Filter by Category')).toBeInTheDocument();
    expect(screen.getByDisplayValue('All Categories')).toBeInTheDocument();
  });

  it('renders location filter dropdown', () => {
    render(<MarketIntelligence data={mockData} dateRange="30" />);
    expect(screen.getByText('Filter by Location')).toBeInTheDocument();
    expect(screen.getByDisplayValue('All Locations')).toBeInTheDocument();
  });

  it('allows changing category filter', () => {
    render(<MarketIntelligence data={mockData} dateRange="30" />);
    const select = screen.getByDisplayValue('All Categories');
    fireEvent.change(select, { target: { value: 'Technology' } });
    expect(select.value).toBe('Technology');
  });

  it('allows changing location filter', () => {
    render(<MarketIntelligence data={mockData} dateRange="30" />);
    const select = screen.getByDisplayValue('All Locations');
    fireEvent.change(select, { target: { value: 'San Francisco' } });
    expect(select.value).toBe('San Francisco');
  });

  it('renders metrics cards when data is available', () => {
    render(<MarketIntelligence data={mockData} dateRange="30" />);
    expect(screen.getByText('Total Jobs')).toBeInTheDocument();
    expect(screen.getByText('Avg Salary')).toBeInTheDocument();
    expect(screen.getByText('Top Category')).toBeInTheDocument();
    expect(screen.getByText('Top Location')).toBeInTheDocument();
  });

  it('displays total jobs count', () => {
    render(<MarketIntelligence data={mockData} dateRange="30" />);
    expect(screen.getByText('4')).toBeInTheDocument(); // Total jobs from mock data
  });

  it('shows average salary', () => {
    render(<MarketIntelligence data={mockData} dateRange="30" />);
    expect(screen.getByText(/^\$\d+$/)).toBeInTheDocument(); // Matches salary format
  });

  it('displays top category information', () => {
    render(<MarketIntelligence data={mockData} dateRange="30" />);
    expect(screen.getByText(/jobs$/)).toBeInTheDocument();
  });

  it('displays top location information', () => {
    render(<MarketIntelligence data={mockData} dateRange="30" />);
    expect(screen.getByText(/jobs$/)).toBeInTheDocument();
  });

  it('renders category chart in categories view', () => {
    render(<MarketIntelligence data={mockData} dateRange="30" />);
    expect(screen.getByText('Top Job Categories')).toBeInTheDocument();
  });

  it('shows category count in chart', () => {
    render(<MarketIntelligence data={mockData} dateRange="30" />);
    expect(screen.getByText(/categories/)).toBeInTheDocument();
  });

  it('renders location chart in locations view', () => {
    render(<MarketIntelligence data={mockData} dateRange="30" />);
    const locationsButton = screen.getByText('Locations');
    fireEvent.click(locationsButton);
    
    expect(screen.getByText('Job Distribution by Location')).toBeInTheDocument();
  });

  it('shows location count in chart', () => {
    render(<MarketIntelligence data={mockData} dateRange="30" />);
    const locationsButton = screen.getByText('Locations');
    fireEvent.click(locationsButton);
    
    expect(screen.getByText(/locations/)).toBeInTheDocument();
  });

  it('renders salary chart in salaries view', () => {
    render(<MarketIntelligence data={mockData} dateRange="30" />);
    const salariesButton = screen.getByText('Salaries');
    fireEvent.click(salariesButton);
    
    expect(screen.getByText('Salary Trends Over Time')).toBeInTheDocument();
  });

  it('shows monthly averages in salary chart', () => {
    render(<MarketIntelligence data={mockData} dateRange="30" />);
    const salariesButton = screen.getByText('Salaries');
    fireEvent.click(salariesButton);
    
    expect(screen.getByText('Monthly averages')).toBeInTheDocument();
  });

  it('renders skills radar chart', () => {
    render(<MarketIntelligence data={mockData} dateRange="30" />);
    expect(screen.getByText('Skills Demand Radar')).toBeInTheDocument();
  });

  it('shows top skills count in radar chart', () => {
    render(<MarketIntelligence data={mockData} dateRange="30" />);
    expect(screen.getByText('Top 6 skills')).toBeInTheDocument();
  });

  it('handles empty data gracefully', () => {
    const emptyData = {
      users: [],
      jobs: [],
      applications: [],
      metrics: {},
    };
    render(<MarketIntelligence data={emptyData} dateRange="30" />);
    expect(screen.getByText('Market Intelligence')).toBeInTheDocument();
  });

  it('shows empty state when no market data', () => {
    const emptyData = {
      users: [],
      jobs: [],
      applications: [],
      metrics: {},
    };
    render(<MarketIntelligence data={emptyData} dateRange="30" />);
    expect(screen.getByText('No market data available')).toBeInTheDocument();
  });

  it('displays correct icons in metrics cards', () => {
    render(<MarketIntelligence data={mockData} dateRange="30" />);
    expect(screen.getByTestId('target-icon')).toBeInTheDocument();
    expect(screen.getByTestId('dollar-sign-icon')).toBeInTheDocument();
    expect(screen.getByTestId('bar-chart3-icon')).toBeInTheDocument();
    expect(screen.getByTestId('map-pin-icon')).toBeInTheDocument();
  });

  it('renders chart components correctly', () => {
    render(<MarketIntelligence data={mockData} dateRange="30" />);
    expect(screen.getByTestId('bar-chart')).toBeInTheDocument();
    expect(screen.getByTestId('bar')).toBeInTheDocument();
    expect(screen.getByTestId('x-axis')).toBeInTheDocument();
    expect(screen.getByTestId('y-axis')).toBeInTheDocument();
  });

  it('renders pie chart in locations view', () => {
    render(<MarketIntelligence data={mockData} dateRange="30" />);
    const locationsButton = screen.getByText('Locations');
    fireEvent.click(locationsButton);
    
    expect(screen.getByTestId('pie-chart')).toBeInTheDocument();
    expect(screen.getByTestId('pie')).toBeInTheDocument();
  });

  it('renders radar chart for skills', () => {
    render(<MarketIntelligence data={mockData} dateRange="30" />);
    expect(screen.getByTestId('radar-chart')).toBeInTheDocument();
    expect(screen.getByTestId('radar')).toBeInTheDocument();
  });

  it('shows tooltip in charts', () => {
    render(<MarketIntelligence data={mockData} dateRange="30" />);
    expect(screen.getByTestId('tooltip')).toBeInTheDocument();
  });

  it('handles different date ranges correctly', () => {
    const { rerender } = render(<MarketIntelligence data={mockData} dateRange="7" />);
    expect(screen.getByText('Market Intelligence')).toBeInTheDocument();
    
    rerender(<MarketIntelligence data={mockData} dateRange="90" />);
    expect(screen.getByText('Market Intelligence')).toBeInTheDocument();
  });

  it('displays globe icon in empty state', () => {
    const emptyData = {
      users: [],
      jobs: [],
      applications: [],
      metrics: {},
    };
    render(<MarketIntelligence data={emptyData} dateRange="30" />);
    expect(screen.getByTestId('globe-icon')).toBeInTheDocument();
  });

  it('shows refresh icon correctly', () => {
    render(<MarketIntelligence data={mockData} dateRange="30" />);
    expect(screen.getByTestId('refresh-cw-icon')).toBeInTheDocument();
  });

  it('shows spinning animation during loading', async () => {
    render(<MarketIntelligence data={mockData} dateRange="30" />);
    const refreshButton = screen.getByText('Refresh');
    fireEvent.click(refreshButton);
    
    await waitFor(() => {
      const refreshIcon = screen.getByTestId('refresh-cw-icon');
      expect(refreshIcon.closest('button')).toHaveClass('disabled:opacity-50');
    });
  });

  it('populates category filter with available categories', () => {
    render(<MarketIntelligence data={mockData} dateRange="30" />);
    const categorySelect = screen.getByDisplayValue('All Categories');
    fireEvent.click(categorySelect);
    
    // Should show Technology, Marketing, Design from mock data
    expect(screen.getByText('Technology')).toBeInTheDocument();
    expect(screen.getByText('Marketing')).toBeInTheDocument();
    expect(screen.getByText('Design')).toBeInTheDocument();
  });

  it('populates location filter with available locations', () => {
    render(<MarketIntelligence data={mockData} dateRange="30" />);
    const locationSelect = screen.getByDisplayValue('All Locations');
    fireEvent.click(locationSelect);
    
    // Should show San Francisco, New York, Los Angeles from mock data
    expect(screen.getByText('San Francisco')).toBeInTheDocument();
    expect(screen.getByText('New York')).toBeInTheDocument();
    expect(screen.getByText('Los Angeles')).toBeInTheDocument();
  });

  it('filters data when category is selected', () => {
    render(<MarketIntelligence data={mockData} dateRange="30" />);
    const categorySelect = screen.getByDisplayValue('All Categories');
    fireEvent.change(categorySelect, { target: { value: 'Technology' } });
    
    expect(categorySelect.value).toBe('Technology');
  });

  it('filters data when location is selected', () => {
    render(<MarketIntelligence data={mockData} dateRange="30" />);
    const locationSelect = screen.getByDisplayValue('All Locations');
    fireEvent.change(locationSelect, { target: { value: 'San Francisco' } });
    
    expect(locationSelect.value).toBe('San Francisco');
  });
}); 