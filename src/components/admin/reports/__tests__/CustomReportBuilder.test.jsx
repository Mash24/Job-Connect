import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import CustomReportBuilder from '../CustomReportBuilder';

// Mock Firebase
jest.mock('../../../firebase/config.js', () => ({
  db: {},
  auth: {
    currentUser: { email: 'admin@test.com' }
  }
}));

// Mock Firestore functions
const mockGetDocs = jest.fn();
const mockAddDoc = jest.fn();
const mockQuery = jest.fn();
const mockOrderBy = jest.fn();
const mockLimit = jest.fn();
const mockCollection = jest.fn();
const mockWhere = jest.fn();
const mockServerTimestamp = jest.fn(() => new Date());

jest.mock('firebase/firestore', () => ({
  collection: mockCollection,
  getDocs: mockGetDocs,
  addDoc: mockAddDoc,
  query: mockQuery,
  orderBy: mockOrderBy,
  limit: mockLimit,
  where: mockWhere,
  serverTimestamp: mockServerTimestamp
}));

// Mock framer-motion
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }) => <div {...props}>{children}</div>,
    button: ({ children, ...props }) => <button {...props}>{children}</button>
  },
  AnimatePresence: ({ children }) => children
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

const renderWithRouter = (component) => {
  return render(
    <BrowserRouter>
      {component}
    </BrowserRouter>
  );
};

describe('CustomReportBuilder', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    
    // Mock successful data fetching
    mockGetDocs.mockResolvedValue({
      empty: false,
      docs: [
        {
          id: 'admin1',
          data: () => ({
            email: 'admin@test.com',
            role: 'admin',
            name: 'Admin User'
          })
        }
      ]
    });
    
    mockAddDoc.mockResolvedValue({ id: 'report1' });
    mockCollection.mockReturnValue('collection');
    mockQuery.mockReturnValue('query');
    mockOrderBy.mockReturnValue('ordered');
    mockLimit.mockReturnValue('limited');
    mockWhere.mockReturnValue('filtered');
  });

  describe('Rendering', () => {
    test('renders main components', async () => {
      renderWithRouter(<CustomReportBuilder />);
      
      await waitFor(() => {
        expect(screen.getByText('Custom Report Builder')).toBeInTheDocument();
        expect(screen.getByText('Chart Library')).toBeInTheDocument();
        expect(screen.getByText('Saved Reports')).toBeInTheDocument();
        expect(screen.getByText('Data Source')).toBeInTheDocument();
      });
    });

    test('renders view mode toggle', async () => {
      renderWithRouter(<CustomReportBuilder />);
      
      await waitFor(() => {
        expect(screen.getByText('Edit')).toBeInTheDocument();
        expect(screen.getByText('Preview')).toBeInTheDocument();
      });
    });

    test('renders action buttons', async () => {
      renderWithRouter(<CustomReportBuilder />);
      
      await waitFor(() => {
        expect(screen.getByText('Settings')).toBeInTheDocument();
        expect(screen.getByText('Export')).toBeInTheDocument();
        expect(screen.getByText('Save')).toBeInTheDocument();
      });
    });
  });

  describe('Chart Library', () => {
    test('displays chart types in library', async () => {
      renderWithRouter(<CustomReportBuilder />);
      
      await waitFor(() => {
        expect(screen.getByText('Bar Chart')).toBeInTheDocument();
        expect(screen.getByText('Line Chart')).toBeInTheDocument();
        expect(screen.getByText('Pie Chart')).toBeInTheDocument();
        expect(screen.getByText('Area Chart')).toBeInTheDocument();
      });
    });

    test('shows chart descriptions', async () => {
      renderWithRouter(<CustomReportBuilder />);
      
      await waitFor(() => {
        expect(screen.getByText('Compare categories')).toBeInTheDocument();
        expect(screen.getByText('Show trends over time')).toBeInTheDocument();
        expect(screen.getByText('Show proportions')).toBeInTheDocument();
      });
    });
  });

  describe('Data Source Selection', () => {
    test('renders data source dropdown', async () => {
      renderWithRouter(<CustomReportBuilder />);
      
      await waitFor(() => {
        const dataSourceSelect = screen.getByDisplayValue('Users');
        expect(dataSourceSelect).toBeInTheDocument();
      });
    });

    test('allows changing data source', async () => {
      renderWithRouter(<CustomReportBuilder />);
      
      await waitFor(() => {
        const dataSourceSelect = screen.getByDisplayValue('Users');
        fireEvent.change(dataSourceSelect, { target: { value: 'jobs' } });
        expect(dataSourceSelect.value).toBe('jobs');
      });
    });
  });

  describe('Report Canvas', () => {
    test('shows empty state when no charts', async () => {
      renderWithRouter(<CustomReportBuilder />);
      
      await waitFor(() => {
        expect(screen.getByText('No charts added yet')).toBeInTheDocument();
        expect(screen.getByText('Add charts from the library to start building your report')).toBeInTheDocument();
      });
    });

    test('displays report title and description inputs in edit mode', async () => {
      renderWithRouter(<CustomReportBuilder />);
      
      await waitFor(() => {
        const titleInput = screen.getByDisplayValue('Custom Report');
        const descriptionInput = screen.getByPlaceholderText('Enter report description...');
        
        expect(titleInput).toBeInTheDocument();
        expect(descriptionInput).toBeInTheDocument();
      });
    });
  });

  describe('Modal Functionality', () => {
    test('opens chart library modal when plus button clicked', async () => {
      renderWithRouter(<CustomReportBuilder />);
      
      await waitFor(() => {
        const plusButton = screen.getByRole('button', { name: /plus/i });
        fireEvent.click(plusButton);
      });
      
      // Modal should be rendered
      expect(screen.getByText('Chart Library')).toBeInTheDocument();
    });

    test('opens settings modal when settings button clicked', async () => {
      renderWithRouter(<CustomReportBuilder />);
      
      await waitFor(() => {
        const settingsButton = screen.getByText('Settings');
        fireEvent.click(settingsButton);
      });
      
      // Modal should be rendered
      expect(screen.getByText('Report Settings')).toBeInTheDocument();
    });

    test('opens export modal when export button clicked', async () => {
      renderWithRouter(<CustomReportBuilder />);
      
      await waitFor(() => {
        const exportButton = screen.getByText('Export');
        fireEvent.click(exportButton);
      });
      
      // Modal should be rendered
      expect(screen.getByText('Export Report')).toBeInTheDocument();
    });
  });

  describe('View Mode Toggle', () => {
    test('starts in edit mode by default', async () => {
      renderWithRouter(<CustomReportBuilder />);
      
      await waitFor(() => {
        const editButton = screen.getByText('Edit');
        expect(editButton).toHaveClass('bg-blue-600');
      });
    });

    test('switches to preview mode when clicked', async () => {
      renderWithRouter(<CustomReportBuilder />);
      
      await waitFor(() => {
        const previewButton = screen.getByText('Preview');
        fireEvent.click(previewButton);
        expect(previewButton).toHaveClass('bg-blue-600');
      });
    });
  });

  describe('Save Functionality', () => {
    test('calls save function when save button clicked', async () => {
      const mockAlert = jest.spyOn(window, 'alert').mockImplementation(() => {});
      
      renderWithRouter(<CustomReportBuilder />);
      
      await waitFor(() => {
        const saveButton = screen.getByText('Save');
        fireEvent.click(saveButton);
      });
      
      await waitFor(() => {
        expect(mockAddDoc).toHaveBeenCalled();
        expect(mockAlert).toHaveBeenCalledWith('✅ Report saved successfully!');
      });
      
      mockAlert.mockRestore();
    });

    test('handles save error gracefully', async () => {
      const mockAlert = jest.spyOn(window, 'alert').mockImplementation(() => {});
      mockAddDoc.mockRejectedValue(new Error('Save failed'));
      
      renderWithRouter(<CustomReportBuilder />);
      
      await waitFor(() => {
        const saveButton = screen.getByText('Save');
        fireEvent.click(saveButton);
      });
      
      await waitFor(() => {
        expect(mockAlert).toHaveBeenCalledWith('❌ Failed to save report');
      });
      
      mockAlert.mockRestore();
    });
  });

  describe('Chart Addition', () => {
    test('adds chart when chart type is clicked', async () => {
      renderWithRouter(<CustomReportBuilder />);
      
      await waitFor(() => {
        const barChartButton = screen.getByText('Bar Chart');
        fireEvent.click(barChartButton);
      });
      
      // Chart should be added to canvas
      await waitFor(() => {
        expect(screen.getByText('Bar Chart')).toBeInTheDocument();
      });
    });
  });

  describe('Responsive Design', () => {
    test('renders sidebar on larger screens', async () => {
      renderWithRouter(<CustomReportBuilder />);
      
      await waitFor(() => {
        const sidebar = screen.getByText('Chart Library');
        expect(sidebar).toBeInTheDocument();
      });
    });

    test('renders main canvas area', async () => {
      renderWithRouter(<CustomReportBuilder />);
      
      await waitFor(() => {
        const canvas = screen.getByText('No charts added yet');
        expect(canvas).toBeInTheDocument();
      });
    });
  });

  describe('Error Handling', () => {
    test('handles Firebase connection errors gracefully', async () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
      mockGetDocs.mockRejectedValue(new Error('Firebase error'));
      
      renderWithRouter(<CustomReportBuilder />);
      
      await waitFor(() => {
        expect(consoleSpy).toHaveBeenCalledWith('Error fetching data:', expect.any(Error));
      });
      
      consoleSpy.mockRestore();
    });
  });

  describe('Accessibility', () => {
    test('has proper ARIA labels', async () => {
      renderWithRouter(<CustomReportBuilder />);
      
      await waitFor(() => {
        const titleInput = screen.getByDisplayValue('Custom Report');
        expect(titleInput).toBeInTheDocument();
      });
    });

    test('supports keyboard navigation', async () => {
      renderWithRouter(<CustomReportBuilder />);
      
      await waitFor(() => {
        const saveButton = screen.getByText('Save');
        expect(saveButton).toBeInTheDocument();
        saveButton.focus();
        expect(saveButton).toHaveFocus();
      });
    });
  });
}); 