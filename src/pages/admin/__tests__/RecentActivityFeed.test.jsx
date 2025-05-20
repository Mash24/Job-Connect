import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { act } from 'react-dom/test-utils';
import RecentActivityFeed from '../RecentActivityFeed';
import { db } from '../../../firebase/config';

// Mock Firebase
jest.mock('../../../firebase/config', () => ({
  db: {},
}));

jest.mock('firebase/firestore', () => ({
  collection: jest.fn(),
  query: jest.fn(),
  orderBy: jest.fn(),
  limit: jest.fn(),
  onSnapshot: jest.fn(),
}));

describe('RecentActivityFeed', () => {
  const mockLogs = [
    {
      id: '1',
      type: 'user',
      performedBy: 'John Doe',
      action: 'created',
      target: 'a new account',
      timestamp: { seconds: Date.now() / 1000 - 60 }, // 1 minute ago
    },
    {
      id: '2',
      type: 'job',
      performedBy: 'Jane Smith',
      action: 'posted',
      target: 'a new job',
      timestamp: { seconds: Date.now() / 1000 - 3600 }, // 1 hour ago
    },
  ];

  let unsubscribeMock;

  beforeEach(() => {
    jest.clearAllMocks();
    unsubscribeMock = jest.fn();
  });

  it('renders loading state initially', () => {
    const { onSnapshot } = require('firebase/firestore');
    onSnapshot.mockImplementation(() => unsubscribeMock);
    
    render(<RecentActivityFeed />);
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });

  it('renders no activity message when logs are empty', async () => {
    const { onSnapshot } = require('firebase/firestore');
    onSnapshot.mockImplementation((query, callback) => {
      callback({ docs: [] });
      return unsubscribeMock;
    });

    render(<RecentActivityFeed />);
    
    await waitFor(() => {
      expect(screen.getByText(/no recent activity found/i)).toBeInTheDocument();
    });
  });

  it('renders activity logs correctly', async () => {
    const { onSnapshot } = require('firebase/firestore');
    onSnapshot.mockImplementation((query, callback) => {
      callback({
        docs: mockLogs.map(log => ({
          id: log.id,
          data: () => log,
        })),
      });
      return unsubscribeMock;
    });

    render(<RecentActivityFeed />);

    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
      expect(screen.getByText('Jane Smith')).toBeInTheDocument();
      expect(screen.getByText(/created/i)).toBeInTheDocument();
      expect(screen.getByText(/posted/i)).toBeInTheDocument();
    });
  });

  it('handles error state gracefully', async () => {
    const { onSnapshot } = require('firebase/firestore');
    onSnapshot.mockImplementation((query, callback, errorCallback) => {
      errorCallback(new Error('Failed to fetch'));
      return unsubscribeMock;
    });

    const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
    render(<RecentActivityFeed />);

    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith('Error fetching logs:', expect.any(Error));
    });

    consoleSpy.mockRestore();
  });

  it('formats timestamps correctly', async () => {
    const { onSnapshot } = require('firebase/firestore');
    onSnapshot.mockImplementation((query, callback) => {
      callback({
        docs: mockLogs.map(log => ({
          id: log.id,
          data: () => log,
        })),
      });
      return unsubscribeMock;
    });

    render(<RecentActivityFeed />);

    await waitFor(() => {
      expect(screen.getByText(/1m ago/i)).toBeInTheDocument();
      expect(screen.getByText(/1h ago/i)).toBeInTheDocument();
    });
  });

  it('cleans up subscription on unmount', () => {
    const { onSnapshot } = require('firebase/firestore');
    onSnapshot.mockImplementation(() => unsubscribeMock);

    const { unmount } = render(<RecentActivityFeed />);
    unmount();

    expect(unsubscribeMock).toHaveBeenCalled();
  });
}); 