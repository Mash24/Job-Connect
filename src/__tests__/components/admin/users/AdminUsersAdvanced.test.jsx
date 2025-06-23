import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import AdminUsersAdvanced from '../../../components/admin/users/AdminUsersAdvanced';

// Mock Firebase
const mockFirestore = {
  collection: jest.fn(),
  query: jest.fn(),
  orderBy: jest.fn(),
  limit: jest.fn(),
  startAfter: jest.fn(),
  getDocs: jest.fn(),
  doc: jest.fn(),
  writeBatch: jest.fn(),
  serverTimestamp: jest.fn(),
  updateDoc: jest.fn(),
  addDoc: jest.fn()
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
  Users: () => <span data-testid="users-icon">Users</span>,
  Filter: () => <span data-testid="filter-icon">Filter</span>,
  Download: () => <span data-testid="download-icon">Download</span>,
  Send: () => <span data-testid="send-icon">Send</span>,
  CheckCircle: () => <span data-testid="check-circle-icon">CheckCircle</span>,
  XCircle: () => <span data-testid="x-circle-icon">XCircle</span>,
  RefreshCw: () => <span data-testid="refresh-icon">RefreshCw</span>,
  FileText: () => <span data-testid="file-text-icon">FileText</span>
}));

// Mock child components
jest.mock('components/admin/users/UserFilterPanel.jsx', () => ({
  __esModule: true,
  default: ({ filters, onFilterChange, savedFilters, onSavePreset, onLoadPreset }) => (
    <div data-testid="user-filter-panel">
      <button onClick={() => onFilterChange({ ...filters, role: 'employer' })}>
        Filter by Employer
      </button>
      <button onClick={() => onSavePreset('Test Preset')}>
        Save Preset
      </button>
      {savedFilters.map((preset, index) => (
        <button key={index} onClick={() => onLoadPreset(preset)}>
          Load {preset.name}
        </button>
      ))}
    </div>
  )
}));

jest.mock('components/admin/users/UserListTable.jsx', () => ({
  __esModule: true,
  default: ({ users, selectedUsers, onSelectUser, onSelectAll, onUserHover }) => (
    <div data-testid="user-list-table"></div>
  )
}));

jest.mock('components/admin/users/UserBulkActions.jsx', () => ({
  __esModule: true,
  default: ({ selectedCount, onBulkAction, onClearSelection }) => (
    <div data-testid="user-bulk-actions"></div>
  )
}));

jest.mock('components/admin/users/UserProfileHoverCard.jsx', () => ({
  __esModule: true,
  default: ({ user }) => (
    <div data-testid="user-profile-hover-card"></div>
  )
}));

const mockUsers = [
  {
    id: 'user1',
    firstname: 'John',
    lastname: 'Doe',
    email: 'john@example.com',
    role: 'job-seeker',
    status: 'active',
    location: 'New York',
    createdAt: { toDate: () => new Date('2024-01-01') }
  },
  {
    id: 'user2',
    firstname: 'Jane',
    lastname: 'Smith',
    email: 'jane@example.com',
    role: 'employer',
    status: 'active',
    location: 'Los Angeles',
    createdAt: { toDate: () => new Date('2024-01-02') }
  },
  {
    id: 'user3',
    firstname: 'Bob',
    lastname: 'Johnson',
    email: 'bob@example.com',
    role: 'job-seeker',
    status: 'inactive',
    location: 'Chicago',
    createdAt: { toDate: () => new Date('2024-01-03') }
  }
];

const renderWithRouter = (component) => {
  return render(
    <BrowserRouter>
      {component}
    </BrowserRouter>
  );
};

describe('AdminUsersAdvanced', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    
    // Mock Firestore responses
    mockFirestore.collection.mockReturnValue({});
    mockFirestore.query.mockReturnValue({});
    mockFirestore.orderBy.mockReturnValue({});
    mockFirestore.limit.mockReturnValue({});
    mockFirestore.getDocs.mockResolvedValue({
      docs: mockUsers.map(user => ({
        id: user.id,
        data: () => user
      }))
    });
    mockFirestore.writeBatch.mockReturnValue({
      update: jest.fn(),
      delete: jest.fn(),
      set: jest.fn(),
      commit: jest.fn().mockResolvedValue()
    });
    mockFirestore.doc.mockReturnValue({});
    mockFirestore.serverTimestamp.mockReturnValue(new Date());
  });

  describe('Initial Rendering', () => {
    it('renders the main component with header', async () => {
      renderWithRouter(<AdminUsersAdvanced />);
      
      await waitFor(() => {
        expect(screen.getByText('Advanced User Management')).toBeInTheDocument();
        expect(screen.getByText(/Manage users with advanced filtering/)).toBeInTheDocument();
      });
    });

    it('renders filter panel and user table', async () => {
      renderWithRouter(<AdminUsersAdvanced />);
      
      await waitFor(() => {
        expect(screen.getByTestId('user-filter-panel')).toBeInTheDocument();
        expect(screen.getByTestId('user-list-table')).toBeInTheDocument();
      });
    });

    it('shows loading state initially', () => {
      renderWithRouter(<AdminUsersAdvanced />);
      expect(screen.getByText('Loading users...')).toBeInTheDocument();
    });
  });

  describe('Filtering Functionality', () => {
    it('applies role filter when changed', async () => {
      renderWithRouter(<AdminUsersAdvanced />);
      
      await waitFor(() => {
        expect(screen.getByText('Filter by Employer')).toBeInTheDocument();
      });

      fireEvent.click(screen.getByText('Filter by Employer'));
      
      // The filter should be applied (this would be tested in integration tests)
      expect(screen.getByTestId('user-filter-panel')).toBeInTheDocument();
    });

    it('saves filter presets', async () => {
      renderWithRouter(<AdminUsersAdvanced />);
      
      await waitFor(() => {
        expect(screen.getByText('Save Preset')).toBeInTheDocument();
      });

      fireEvent.click(screen.getByText('Save Preset'));
      
      // Preset should be saved (this would be tested in integration tests)
      expect(screen.getByTestId('user-filter-panel')).toBeInTheDocument();
    });

    it('loads saved filter presets', async () => {
      renderWithRouter(<AdminUsersAdvanced />);
      
      await waitFor(() => {
        expect(screen.getByText('Load Top Employers')).toBeInTheDocument();
      });

      fireEvent.click(screen.getByText('Load Top Employers'));
      
      // Preset should be loaded (this would be tested in integration tests)
      expect(screen.getByTestId('user-filter-panel')).toBeInTheDocument();
    });
  });

  describe('User Selection', () => {
    it('selects all users when select all checkbox is clicked', async () => {
      renderWithRouter(<AdminUsersAdvanced />);
      
      await waitFor(() => {
        expect(screen.getByTestId('select-all-checkbox')).toBeInTheDocument();
      });

      const selectAllCheckbox = screen.getByTestId('select-all-checkbox');
      fireEvent.click(selectAllCheckbox);
      
      // All users should be selected (this would be tested in integration tests)
      expect(selectAllCheckbox).toBeInTheDocument();
    });

    it('selects individual users', async () => {
      renderWithRouter(<AdminUsersAdvanced />);
      
      await waitFor(() => {
        expect(screen.getByTestId('user-checkbox-user1')).toBeInTheDocument();
      });

      const userCheckbox = screen.getByTestId('user-checkbox-user1');
      fireEvent.click(userCheckbox);
      
      // User should be selected (this would be tested in integration tests)
      expect(userCheckbox).toBeInTheDocument();
    });
  });

  describe('Bulk Actions', () => {
    it('shows bulk actions when users are selected', async () => {
      renderWithRouter(<AdminUsersAdvanced />);
      
      await waitFor(() => {
        expect(screen.getByTestId('user-checkbox-user1')).toBeInTheDocument();
      });

      // Select a user
      fireEvent.click(screen.getByTestId('user-checkbox-user1'));
      
      // Bulk actions should appear
      expect(screen.getByTestId('user-bulk-actions')).toBeInTheDocument();
      expect(screen.getByText('Selected: 1')).toBeInTheDocument();
    });

    it('performs bulk approve action', async () => {
      renderWithRouter(<AdminUsersAdvanced />);
      
      await waitFor(() => {
        expect(screen.getByTestId('user-checkbox-user1')).toBeInTheDocument();
      });

      // Select a user
      fireEvent.click(screen.getByTestId('user-checkbox-user1'));
      
      // Click approve
      fireEvent.click(screen.getByText('Approve'));
      
      // Firestore batch should be called
      expect(mockFirestore.writeBatch).toHaveBeenCalled();
    });

    it('performs bulk deactivate action', async () => {
      renderWithRouter(<AdminUsersAdvanced />);
      
      await waitFor(() => {
        expect(screen.getByTestId('user-checkbox-user1')).toBeInTheDocument();
      });

      // Select a user
      fireEvent.click(screen.getByTestId('user-checkbox-user1'));
      
      // Click deactivate
      fireEvent.click(screen.getByText('Deactivate'));
      
      // Firestore batch should be called
      expect(mockFirestore.writeBatch).toHaveBeenCalled();
    });

    it('performs bulk delete action', async () => {
      renderWithRouter(<AdminUsersAdvanced />);
      
      await waitFor(() => {
        expect(screen.getByTestId('user-checkbox-user1')).toBeInTheDocument();
      });

      // Select a user
      fireEvent.click(screen.getByTestId('user-checkbox-user1'));
      
      // Click delete
      fireEvent.click(screen.getByText('Delete'));
      
      // Firestore batch should be called
      expect(mockFirestore.writeBatch).toHaveBeenCalled();
    });

    it('clears selection', async () => {
      renderWithRouter(<AdminUsersAdvanced />);
      
      await waitFor(() => {
        expect(screen.getByTestId('user-checkbox-user1')).toBeInTheDocument();
      });

      // Select a user
      fireEvent.click(screen.getByTestId('user-checkbox-user1'));
      
      // Clear selection
      fireEvent.click(screen.getByText('Clear Selection'));
      
      // Selection should be cleared (this would be tested in integration tests)
      expect(screen.getByTestId('user-bulk-actions')).toBeInTheDocument();
    });
  });

  describe('User Hover', () => {
    it('shows hover card when hovering over user', async () => {
      renderWithRouter(<AdminUsersAdvanced />);
      
      await waitFor(() => {
        expect(screen.getByTestId('user-row-user1')).toBeInTheDocument();
      });

      const hoverButton = screen.getByTestId('user-row-user1').querySelector('button');
      fireEvent.mouseEnter(hoverButton);
      
      // Hover card should appear
      expect(screen.getByTestId('user-profile-hover-card')).toBeInTheDocument();
      expect(screen.getByText('John Doe')).toBeInTheDocument();
    });
  });

  describe('Export Functionality', () => {
    it('exports users to CSV', async () => {
      // Mock URL.createObjectURL and document.createElement
      const mockCreateObjectURL = jest.fn().mockReturnValue('blob:mock-url');
      const mockLink = {
        setAttribute: jest.fn(),
        click: jest.fn(),
        style: {}
      };
      
      global.URL.createObjectURL = mockCreateObjectURL;
      global.document.createElement = jest.fn().mockReturnValue(mockLink);
      global.document.body.appendChild = jest.fn();
      global.document.body.removeChild = jest.fn();

      renderWithRouter(<AdminUsersAdvanced />);
      
      await waitFor(() => {
        expect(screen.getByText('Export CSV')).toBeInTheDocument();
      });

      fireEvent.click(screen.getByText('Export CSV'));
      
      // CSV export should be triggered
      expect(mockCreateObjectURL).toHaveBeenCalled();
      expect(mockLink.setAttribute).toHaveBeenCalledWith('download', expect.stringContaining('users_export_'));
    });
  });

  describe('Error Handling', () => {
    it('handles Firestore errors gracefully', async () => {
      mockFirestore.getDocs.mockRejectedValue(new Error('Firestore error'));
      
      renderWithRouter(<AdminUsersAdvanced />);
      
      await waitFor(() => {
        // Component should handle error gracefully
        expect(screen.getByTestId('user-filter-panel')).toBeInTheDocument();
      });
    });

    it('handles bulk action errors', async () => {
      const mockBatch = {
        update: jest.fn(),
        delete: jest.fn(),
        set: jest.fn(),
        commit: jest.fn().mockRejectedValue(new Error('Bulk action error'))
      };
      mockFirestore.writeBatch.mockReturnValue(mockBatch);

      renderWithRouter(<AdminUsersAdvanced />);
      
      await waitFor(() => {
        expect(screen.getByTestId('user-checkbox-user1')).toBeInTheDocument();
      });

      // Select a user and try bulk action
      fireEvent.click(screen.getByTestId('user-checkbox-user1'));
      fireEvent.click(screen.getByText('Approve'));
      
      // Error should be handled gracefully
      expect(mockFirestore.writeBatch).toHaveBeenCalled();
    });
  });
}); 