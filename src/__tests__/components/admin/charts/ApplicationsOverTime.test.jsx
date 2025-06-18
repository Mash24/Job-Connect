import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import ApplicationsOverTime from '../../../components/admin/charts/ApplicationsOverTime';

// Mock Firebase
jest.mock('../../../firebase/config', () => ({
  db: {},
}));

// Mock Firestore
const mockOnSnapshot = jest.fn();
jest.mock('firebase/firestore', () => ({
  collection: jest.fn(),
  onSnapshot: mockOnSnapshot,
  query: jest.fn(),
  orderBy: jest.fn(),
}));

// Mock ChartCard
jest.mock('../../../components/admin/charts/ChartCard', () => {
  return function MockChartCard({ children, title, icon }) {
    return (
      <div data-testid="chart-card">
        <div data-testid="chart-title">{title}</div>
        <div data-testid="chart-icon">{icon}</div>
        {children}
      </div>
    );
  };
});

describe('ApplicationsOverTime', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render loading state initially', () => {
    mockOnSnapshot.mockImplementation((query, callback) => {
      // Don't call callback immediately to test loading state
      return jest.fn(); // unsubscribe function
    });

    render(<ApplicationsOverTime />);
    
    expect(screen.getByText('Loading chart...')).toBeInTheDocument();
  });

  it('should render chart with data', async () => {
    const mockData = [
      { date: '2024-01-01', count: 5 },
      { date: '2024-01-02', count: 10 },
    ];

    mockOnSnapshot.mockImplementation((query, callback) => {
      callback({
        docs: mockData.map(item => ({
          data: () => ({
            createdAt: { toDate: () => new Date(item.date) }
          })
        }))
      });
      return jest.fn(); // unsubscribe function
    });

    render(<ApplicationsOverTime />);

    await waitFor(() => {
      expect(screen.getByTestId('chart-card')).toBeInTheDocument();
      expect(screen.getByTestId('chart-title')).toHaveTextContent('Applications Over Time');
      expect(screen.getByTestId('chart-icon')).toHaveTextContent('📈');
    });
  });

  it('should render empty state when no data', async () => {
    mockOnSnapshot.mockImplementation((query, callback) => {
      callback({ docs: [] });
      return jest.fn(); // unsubscribe function
    });

    render(<ApplicationsOverTime />);

    await waitFor(() => {
      expect(screen.getByText('No application data yet. Encourage your users to apply!')).toBeInTheDocument();
    });
  });

  it('should handle Firestore errors gracefully', async () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    
    mockOnSnapshot.mockImplementation((query, callback, errorCallback) => {
      errorCallback(new Error('Firestore error'));
      return jest.fn(); // unsubscribe function
    });

    render(<ApplicationsOverTime />);

    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith('Error fetching applications:', expect.any(Error));
    });

    consoleSpy.mockRestore();
  });

  it('should unsubscribe from Firestore on unmount', () => {
    const unsubscribe = jest.fn();
    mockOnSnapshot.mockReturnValue(unsubscribe);

    const { unmount } = render(<ApplicationsOverTime />);
    unmount();

    expect(unsubscribe).toHaveBeenCalled();
  });
}); 