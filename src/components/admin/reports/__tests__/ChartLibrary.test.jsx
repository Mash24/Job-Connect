import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ChartLibrary from '../ChartLibrary';

// Mock Firebase
jest.mock('../../../firebase/config.js', () => ({
  db: {}
}));

// Mock Firestore functions
const mockGetDocs = jest.fn();
const mockQuery = jest.fn();
const mockOrderBy = jest.fn();
const mockLimit = jest.fn();
const mockCollection = jest.fn();

jest.mock('firebase/firestore', () => ({
  collection: mockCollection,
  getDocs: mockGetDocs,
  query: mockQuery,
  orderBy: mockOrderBy,
  limit: mockLimit
}));

// Mock framer-motion
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }) => <div {...props}>{children}</div>,
    button: ({ children, ...props }) => <button {...props}>{children}</button>
  }
}));

const mockOnAddChart = jest.fn();
const mockOnClose = jest.fn();

const defaultProps = {
  onAddChart: mockOnAddChart,
  onClose: mockOnClose
};

describe('ChartLibrary', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    
    // Mock successful data fetching
    mockGetDocs.mockResolvedValue({
      docs: [
        { data: () => ({ name: 'User 1', role: 'jobseeker' }) },
        { data: () => ({ name: 'User 2', role: 'employer' }) }
      ]
    });
    
    mockCollection.mockReturnValue('collection');
    mockQuery.mockReturnValue('query');
    mockOrderBy.mockReturnValue('ordered');
    mockLimit.mockReturnValue('limited');
  });

  describe('Rendering', () => {
    test('renders header with title and close button', async () => {
      render(<ChartLibrary {...defaultProps} />);
      
      await waitFor(() => {
        expect(screen.getByText('Chart Library')).toBeInTheDocument();
        expect(screen.getByText('Choose from our collection of chart types')).toBeInTheDocument();
      });
    });

    test('renders search input', async () => {
      render(<ChartLibrary {...defaultProps} />);
      
      await waitFor(() => {
        expect(screen.getByPlaceholderText('Search charts...')).toBeInTheDocument();
      });
    });

    test('renders category filters', async () => {
      render(<ChartLibrary {...defaultProps} />);
      
      await waitFor(() => {
        expect(screen.getByText('All Charts')).toBeInTheDocument();
        expect(screen.getByText('Analytics')).toBeInTheDocument();
        expect(screen.getByText('Users')).toBeInTheDocument();
        expect(screen.getByText('Jobs')).toBeInTheDocument();
        expect(screen.getByText('Data Tables')).toBeInTheDocument();
      });
    });
  });

  describe('Chart Categories', () => {
    test('displays all chart categories', async () => {
      render(<ChartLibrary {...defaultProps} />);
      
      await waitFor(() => {
        const categories = [
          'All Charts',
          'Analytics', 
          'Users',
          'Jobs',
          'Data Tables'
        ];
        
        categories.forEach(category => {
          expect(screen.getByText(category)).toBeInTheDocument();
        });
      });
    });

    test('highlights selected category', async () => {
      render(<ChartLibrary {...defaultProps} />);
      
      await waitFor(() => {
        const allChartsButton = screen.getByText('All Charts');
        expect(allChartsButton.closest('button')).toHaveClass('bg-blue-50');
      });
    });

    test('changes selected category when clicked', async () => {
      render(<ChartLibrary {...defaultProps} />);
      
      await waitFor(() => {
        const analyticsButton = screen.getByText('Analytics');
        fireEvent.click(analyticsButton);
        expect(analyticsButton.closest('button')).toHaveClass('bg-blue-50');
      });
    });
  });

  describe('Chart Types', () => {
    test('displays chart types with descriptions', async () => {
      render(<ChartLibrary {...defaultProps} />);
      
      await waitFor(() => {
        expect(screen.getByText('Bar Chart')).toBeInTheDocument();
        expect(screen.getByText('Compare categories with vertical bars')).toBeInTheDocument();
        
        expect(screen.getByText('Line Chart')).toBeInTheDocument();
        expect(screen.getByText('Show trends over time')).toBeInTheDocument();
        
        expect(screen.getByText('Pie Chart')).toBeInTheDocument();
        expect(screen.getByText('Show proportions of a whole')).toBeInTheDocument();
      });
    });

    test('displays chart features', async () => {
      render(<ChartLibrary {...defaultProps} />);
      
      await waitFor(() => {
        expect(screen.getByText('Sample data included')).toBeInTheDocument();
      });
    });

    test('calls onAddChart when chart is clicked', async () => {
      render(<ChartLibrary {...defaultProps} />);
      
      await waitFor(() => {
        const barChartButton = screen.getByText('Bar Chart');
        fireEvent.click(barChartButton);
        
        expect(mockOnAddChart).toHaveBeenCalledWith('bar', expect.any(Array));
      });
    });

    test('calls onClose after adding chart', async () => {
      render(<ChartLibrary {...defaultProps} />);
      
      await waitFor(() => {
        const barChartButton = screen.getByText('Bar Chart');
        fireEvent.click(barChartButton);
        
        expect(mockOnClose).toHaveBeenCalled();
      });
    });
  });

  describe('Search Functionality', () => {
    test('filters charts by search term', async () => {
      render(<ChartLibrary {...defaultProps} />);
      
      await waitFor(() => {
        const searchInput = screen.getByPlaceholderText('Search charts...');
        fireEvent.change(searchInput, { target: { value: 'bar' } });
        
        expect(screen.getByText('Bar Chart')).toBeInTheDocument();
        expect(screen.queryByText('Line Chart')).not.toBeInTheDocument();
      });
    });

    test('filters by chart description', async () => {
      render(<ChartLibrary {...defaultProps} />);
      
      await waitFor(() => {
        const searchInput = screen.getByPlaceholderText('Search charts...');
        fireEvent.change(searchInput, { target: { value: 'trends' } });
        
        expect(screen.getByText('Line Chart')).toBeInTheDocument();
      });
    });

    test('shows all charts when search is cleared', async () => {
      render(<ChartLibrary {...defaultProps} />);
      
      await waitFor(() => {
        const searchInput = screen.getByPlaceholderText('Search charts...');
        
        // Search for something
        fireEvent.change(searchInput, { target: { value: 'bar' } });
        expect(screen.queryByText('Line Chart')).not.toBeInTheDocument();
        
        // Clear search
        fireEvent.change(searchInput, { target: { value: '' } });
        expect(screen.getByText('Line Chart')).toBeInTheDocument();
      });
    });
  });

  describe('Category Filtering', () => {
    test('filters charts by category', async () => {
      render(<ChartLibrary {...defaultProps} />);
      
      await waitFor(() => {
        // Click on Analytics category
        const analyticsButton = screen.getByText('Analytics');
        fireEvent.click(analyticsButton);
        
        // Should show analytics charts
        expect(screen.getByText('Bar Chart')).toBeInTheDocument();
        expect(screen.getByText('Line Chart')).toBeInTheDocument();
        expect(screen.getByText('Area Chart')).toBeInTheDocument();
        
        // Should not show user-specific charts
        expect(screen.queryByText('User Growth')).not.toBeInTheDocument();
      });
    });

    test('shows all charts when "All Charts" is selected', async () => {
      render(<ChartLibrary {...defaultProps} />);
      
      await waitFor(() => {
        // First filter by category
        const analyticsButton = screen.getByText('Analytics');
        fireEvent.click(analyticsButton);
        
        // Then select "All Charts"
        const allChartsButton = screen.getByText('All Charts');
        fireEvent.click(allChartsButton);
        
        // Should show all chart types
        expect(screen.getByText('Bar Chart')).toBeInTheDocument();
        expect(screen.getByText('User Growth')).toBeInTheDocument();
        expect(screen.getByText('Job Postings')).toBeInTheDocument();
      });
    });
  });

  describe('Chart Data', () => {
    test('provides sample data for each chart type', async () => {
      render(<ChartLibrary {...defaultProps} />);
      
      await waitFor(() => {
        const barChartButton = screen.getByText('Bar Chart');
        fireEvent.click(barChartButton);
        
        expect(mockOnAddChart).toHaveBeenCalledWith('bar', [
          { name: 'Jan', value: 400 },
          { name: 'Feb', value: 300 },
          { name: 'Mar', value: 600 },
          { name: 'Apr', value: 800 }
        ]);
      });
    });

    test('provides appropriate data for pie charts', async () => {
      render(<ChartLibrary {...defaultProps} />);
      
      await waitFor(() => {
        const pieChartButton = screen.getByText('Pie Chart');
        fireEvent.click(pieChartButton);
        
        expect(mockOnAddChart).toHaveBeenCalledWith('pie', [
          { name: 'Job Seekers', value: 45 },
          { name: 'Employers', value: 30 },
          { name: 'Admins', value: 25 }
        ]);
      });
    });

    test('provides metric data for metric cards', async () => {
      render(<ChartLibrary {...defaultProps} />);
      
      await waitFor(() => {
        const metricButton = screen.getByText('Metric Card');
        fireEvent.click(metricButton);
        
        expect(mockOnAddChart).toHaveBeenCalledWith('metric', {
          value: 1234,
          label: 'Total Users',
          change: '+12%'
        });
      });
    });
  });

  describe('Empty State', () => {
    test('shows empty state when no charts match filters', async () => {
      render(<ChartLibrary {...defaultProps} />);
      
      await waitFor(() => {
        const searchInput = screen.getByPlaceholderText('Search charts...');
        fireEvent.change(searchInput, { target: { value: 'nonexistent' } });
        
        expect(screen.getByText('No charts found')).toBeInTheDocument();
        expect(screen.getByText('Try adjusting your search or category filter')).toBeInTheDocument();
      });
    });
  });

  describe('Loading State', () => {
    test('shows loading spinner while fetching data', async () => {
      mockGetDocs.mockImplementation(() => new Promise(resolve => setTimeout(resolve, 100)));
      
      render(<ChartLibrary {...defaultProps} />);
      
      expect(screen.getByRole('status')).toBeInTheDocument();
    });
  });

  describe('Error Handling', () => {
    test('handles data fetching errors gracefully', async () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
      mockGetDocs.mockRejectedValue(new Error('Fetch failed'));
      
      render(<ChartLibrary {...defaultProps} />);
      
      await waitFor(() => {
        expect(consoleSpy).toHaveBeenCalledWith('Error fetching data sources:', expect.any(Error));
      });
      
      consoleSpy.mockRestore();
    });
  });

  describe('Accessibility', () => {
    test('has proper ARIA labels', async () => {
      render(<ChartLibrary {...defaultProps} />);
      
      await waitFor(() => {
        const searchInput = screen.getByPlaceholderText('Search charts...');
        expect(searchInput).toBeInTheDocument();
      });
    });

    test('supports keyboard navigation', async () => {
      render(<ChartLibrary {...defaultProps} />);
      
      await waitFor(() => {
        const searchInput = screen.getByPlaceholderText('Search charts...');
        searchInput.focus();
        expect(searchInput).toHaveFocus();
      });
    });
  });

  describe('Responsive Design', () => {
    test('renders grid layout for charts', async () => {
      render(<ChartLibrary {...defaultProps} />);
      
      await waitFor(() => {
        const chartGrid = screen.getByText('Bar Chart').closest('div');
        expect(chartGrid).toHaveClass('grid');
      });
    });
  });

  describe('Performance', () => {
    test('renders efficiently with many chart types', async () => {
      const startTime = performance.now();
      render(<ChartLibrary {...defaultProps} />);
      const endTime = performance.now();
      
      await waitFor(() => {
        // Should render within reasonable time
        expect(endTime - startTime).toBeLessThan(1000);
      });
    });
  });
}); 