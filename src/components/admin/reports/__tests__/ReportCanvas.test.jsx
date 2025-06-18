import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ReportCanvas from '../ReportCanvas';

// Mock framer-motion
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }) => <div {...props}>{children}</div>,
    button: ({ children, ...props }) => <button {...props}>{children}</button>
  },
  Reorder: ({ children, ...props }) => <div {...props}>{children}</div>
}));

// Mock Recharts
jest.mock('recharts', () => ({
  BarChart: ({ children }) => <div data-testid="bar-chart">{children}</div>,
  Bar: () => <div data-testid="bar" />,
  XAxis: () => <div data-testid="x-axis" />,
  YAxis: () => <div data-testid="y-axis" />,
  CartesianGrid: () => <div data-testid="cartesian-grid" />,
  Tooltip: () => <div data-testid="tooltip" />,
  Legend: () => <div data-testid="legend" />,
  LineChart: ({ children }) => <div data-testid="line-chart">{children}</div>,
  Line: () => <div data-testid="line" />,
  PieChart: ({ children }) => <div data-testid="pie-chart">{children}</div>,
  Pie: ({ children }) => <div data-testid="pie">{children}</div>,
  Cell: () => <div data-testid="cell" />,
  AreaChart: ({ children }) => <div data-testid="area-chart">{children}</div>,
  Area: () => <div data-testid="area" />,
  ResponsiveContainer: ({ children }) => <div data-testid="responsive-container">{children}</div>
}));

const mockReportData = {
  title: 'Test Report',
  description: 'A test report description',
  layout: 'grid',
  theme: 'light',
  charts: [
    {
      id: 'chart1',
      type: 'bar',
      title: 'Test Bar Chart',
      data: [
        { name: 'Jan', value: 400 },
        { name: 'Feb', value: 300 }
      ],
      position: { x: 0, y: 0 },
      size: { width: 400, height: 300 },
      config: { colors: ['#3b82f6'] },
      visible: true
    },
    {
      id: 'chart2',
      type: 'pie',
      title: 'Test Pie Chart',
      data: [
        { name: 'A', value: 45 },
        { name: 'B', value: 55 }
      ],
      position: { x: 0, y: 0 },
      size: { width: 400, height: 300 },
      config: { colors: ['#3b82f6', '#10b981'] },
      visible: true
    }
  ],
  metrics: [],
  filters: []
};

const defaultProps = {
  reportData: mockReportData,
  isEditing: true,
  selectedChart: null,
  onChartSelect: jest.fn(),
  onChartUpdate: jest.fn(),
  onChartRemove: jest.fn(),
  onReportUpdate: jest.fn()
};

describe('ReportCanvas', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendering', () => {
    test('renders report header with title and description', () => {
      render(<ReportCanvas {...defaultProps} />);
      
      expect(screen.getByDisplayValue('Test Report')).toBeInTheDocument();
      expect(screen.getByDisplayValue('A test report description')).toBeInTheDocument();
    });

    test('renders empty state when no charts', () => {
      const emptyReportData = { ...mockReportData, charts: [] };
      render(<ReportCanvas {...defaultProps} reportData={emptyReportData} />);
      
      expect(screen.getByText('No charts added yet')).toBeInTheDocument();
      expect(screen.getByText('Add charts from the library to start building your report')).toBeInTheDocument();
    });

    test('renders charts when present', () => {
      render(<ReportCanvas {...defaultProps} />);
      
      expect(screen.getByText('Test Bar Chart')).toBeInTheDocument();
      expect(screen.getByText('Test Pie Chart')).toBeInTheDocument();
    });
  });

  describe('Chart Rendering', () => {
    test('renders bar chart correctly', () => {
      render(<ReportCanvas {...defaultProps} />);
      
      expect(screen.getByTestId('bar-chart')).toBeInTheDocument();
      expect(screen.getByTestId('bar')).toBeInTheDocument();
      expect(screen.getByTestId('x-axis')).toBeInTheDocument();
      expect(screen.getByTestId('y-axis')).toBeInTheDocument();
    });

    test('renders pie chart correctly', () => {
      render(<ReportCanvas {...defaultProps} />);
      
      expect(screen.getByTestId('pie-chart')).toBeInTheDocument();
      expect(screen.getByTestId('pie')).toBeInTheDocument();
    });

    test('renders metric card correctly', () => {
      const metricChart = {
        id: 'metric1',
        type: 'metric',
        title: 'Test Metric',
        data: { value: 1234, label: 'Total Users', change: '+12%' },
        visible: true
      };
      
      const reportWithMetric = {
        ...mockReportData,
        charts: [metricChart]
      };
      
      render(<ReportCanvas {...defaultProps} reportData={reportWithMetric} />);
      
      expect(screen.getByText('1,234')).toBeInTheDocument();
      expect(screen.getByText('Total Users')).toBeInTheDocument();
      expect(screen.getByText('+12% from last month')).toBeInTheDocument();
    });

    test('renders data table correctly', () => {
      const tableChart = {
        id: 'table1',
        type: 'table',
        title: 'Test Table',
        data: [
          { id: 1, name: 'John', role: 'Admin' },
          { id: 2, name: 'Jane', role: 'User' }
        ],
        visible: true
      };
      
      const reportWithTable = {
        ...mockReportData,
        charts: [tableChart]
      };
      
      render(<ReportCanvas {...defaultProps} reportData={reportWithTable} />);
      
      expect(screen.getByText('John')).toBeInTheDocument();
      expect(screen.getByText('Jane')).toBeInTheDocument();
      expect(screen.getByText('Admin')).toBeInTheDocument();
      expect(screen.getByText('User')).toBeInTheDocument();
    });
  });

  describe('Edit Mode Functionality', () => {
    test('shows edit controls when in edit mode', () => {
      render(<ReportCanvas {...defaultProps} isEditing={true} />);
      
      // Should show settings and delete buttons for each chart
      const settingsButtons = screen.getAllByRole('button', { name: /settings/i });
      const deleteButtons = screen.getAllByRole('button', { name: /trash/i });
      
      expect(settingsButtons.length).toBeGreaterThan(0);
      expect(deleteButtons.length).toBeGreaterThan(0);
    });

    test('hides edit controls when not in edit mode', () => {
      render(<ReportCanvas {...defaultProps} isEditing={false} />);
      
      // Should not show edit controls
      const settingsButtons = screen.queryAllByRole('button', { name: /settings/i });
      const deleteButtons = screen.queryAllByRole('button', { name: /trash/i });
      
      expect(settingsButtons.length).toBe(0);
      expect(deleteButtons.length).toBe(0);
    });

    test('calls onChartSelect when settings button clicked', () => {
      render(<ReportCanvas {...defaultProps} />);
      
      const settingsButtons = screen.getAllByRole('button', { name: /settings/i });
      fireEvent.click(settingsButtons[0]);
      
      expect(defaultProps.onChartSelect).toHaveBeenCalledWith('chart1');
    });

    test('calls onChartRemove when delete button clicked', () => {
      render(<ReportCanvas {...defaultProps} />);
      
      const deleteButtons = screen.getAllByRole('button', { name: /trash/i });
      fireEvent.click(deleteButtons[0]);
      
      expect(defaultProps.onChartRemove).toHaveBeenCalledWith('chart1');
    });
  });

  describe('Chart Visibility', () => {
    test('hides chart when visible is false', () => {
      const hiddenChart = {
        ...mockReportData.charts[0],
        visible: false
      };
      
      const reportWithHiddenChart = {
        ...mockReportData,
        charts: [hiddenChart]
      };
      
      render(<ReportCanvas {...defaultProps} reportData={reportWithHiddenChart} />);
      
      // Chart title should still be visible but content should be hidden
      expect(screen.getByText('Test Bar Chart')).toBeInTheDocument();
      expect(screen.queryByTestId('bar-chart')).not.toBeInTheDocument();
    });

    test('toggles chart visibility when eye button clicked', () => {
      render(<ReportCanvas {...defaultProps} />);
      
      const eyeButtons = screen.getAllByRole('button', { name: /eye/i });
      fireEvent.click(eyeButtons[0]);
      
      expect(defaultProps.onChartUpdate).toHaveBeenCalledWith('chart1', { visible: false });
    });
  });

  describe('Chart Selection', () => {
    test('highlights selected chart', () => {
      render(<ReportCanvas {...defaultProps} selectedChart="chart1" />);
      
      // The selected chart should have different styling
      const chartContainers = screen.getAllByText(/Test.*Chart/);
      expect(chartContainers.length).toBeGreaterThan(0);
    });
  });

  describe('Layout Modes', () => {
    test('renders grid layout by default', () => {
      render(<ReportCanvas {...defaultProps} />);
      
      const canvas = screen.getByText('No charts added yet').closest('div');
      expect(canvas).toHaveClass('grid');
    });

    test('renders single column layout', () => {
      const singleLayoutData = { ...mockReportData, layout: 'single' };
      render(<ReportCanvas {...defaultProps} reportData={singleLayoutData} />);
      
      const canvas = screen.getByText('No charts added yet').closest('div');
      expect(canvas).toHaveClass('grid-cols-1');
    });
  });

  describe('Chart Configuration', () => {
    test('applies chart configuration', () => {
      const chartWithConfig = {
        ...mockReportData.charts[0],
        config: {
          colors: ['#ff0000', '#00ff00'],
          showLegend: true,
          showGrid: false
        }
      };
      
      const reportWithConfig = {
        ...mockReportData,
        charts: [chartWithConfig]
      };
      
      render(<ReportCanvas {...defaultProps} reportData={reportWithConfig} />);
      
      expect(screen.getByTestId('bar-chart')).toBeInTheDocument();
    });
  });

  describe('Error Handling', () => {
    test('handles unsupported chart types gracefully', () => {
      const unsupportedChart = {
        ...mockReportData.charts[0],
        type: 'unsupported'
      };
      
      const reportWithUnsupported = {
        ...mockReportData,
        charts: [unsupportedChart]
      };
      
      render(<ReportCanvas {...defaultProps} reportData={reportWithUnsupported} />);
      
      expect(screen.getByText('Chart type not supported')).toBeInTheDocument();
    });
  });

  describe('Responsive Design', () => {
    test('renders responsive container for charts', () => {
      render(<ReportCanvas {...defaultProps} />);
      
      expect(screen.getAllByTestId('responsive-container').length).toBeGreaterThan(0);
    });
  });

  describe('Accessibility', () => {
    test('has proper ARIA labels for interactive elements', () => {
      render(<ReportCanvas {...defaultProps} />);
      
      const settingsButtons = screen.getAllByRole('button', { name: /settings/i });
      const deleteButtons = screen.getAllByRole('button', { name: /trash/i });
      
      expect(settingsButtons[0]).toBeInTheDocument();
      expect(deleteButtons[0]).toBeInTheDocument();
    });

    test('supports keyboard navigation', () => {
      render(<ReportCanvas {...defaultProps} />);
      
      const settingsButtons = screen.getAllByRole('button', { name: /settings/i });
      settingsButtons[0].focus();
      expect(settingsButtons[0]).toHaveFocus();
    });
  });

  describe('Performance', () => {
    test('renders multiple charts efficiently', () => {
      const manyCharts = Array.from({ length: 10 }, (_, i) => ({
        ...mockReportData.charts[0],
        id: `chart${i}`,
        title: `Chart ${i}`
      }));
      
      const reportWithManyCharts = {
        ...mockReportData,
        charts: manyCharts
      };
      
      const startTime = performance.now();
      render(<ReportCanvas {...defaultProps} reportData={reportWithManyCharts} />);
      const endTime = performance.now();
      
      // Should render within reasonable time (adjust threshold as needed)
      expect(endTime - startTime).toBeLessThan(1000);
    });
  });
}); 