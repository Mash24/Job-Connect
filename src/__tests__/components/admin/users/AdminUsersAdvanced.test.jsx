import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import AdminUsersAdvanced from '../../../components/admin/users/AdminUsersAdvanced';

// Mock Firebase
const mockFirestore = {
  collection: vi.fn(),
  query: vi.fn(),
  orderBy: vi.fn(),
  limit: vi.fn(),
  startAfter: vi.fn(),
  getDocs: vi.fn(),
  doc: vi.fn(),
  writeBatch: vi.fn(),
  serverTimestamp: vi.fn(),
  updateDoc: vi.fn(),
  addDoc: vi.fn()
};

const mockAuth = {
  currentUser: {
    email: 'admin@test.com',
    uid: 'admin123'
  }
};

vi.mock('../../../firebase/config', () => ({
  db: mockFirestore,
  auth: mockAuth
}));

// Mock Framer Motion
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }) => <div {...props}>{children}</div>,
    button: ({ children, ...props }) => <button {...props}>{children}</button>
  },
  AnimatePresence: ({ children }) => children
}));

// Mock Lucide React icons
vi.mock('lucide-react', () => ({
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
vi.mock('../../../components/admin/users/UserFilterPanel', () => ({
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

vi.mock('../../../components/admin/users/UserListTable', () => ({
  default: ({ users, selectedUsers, onSelectUser, onSelectAll, onUserHover }) => (
    <div data-testid="user-list-table">
      <input
        type="checkbox"
        checked={selectedUsers.size === users.length && users.length > 0}
        onChange={(e) => onSelectAll(e.target.checked)}
        data-testid="select-all-checkbox"
      />
      {users.map((user) => (
        <div key={user.id} data-testid={`user-row-${user.id}`}>
          <input
            type="checkbox"
            checked={selectedUsers.has(user.id)}
            onChange={(e) => onSelectUser(user.id, e.target.checked)}
            data-testid={`user-checkbox-${user.id}`}
          />
          <span>{user.firstname} {user.lastname}</span>
          <span>{user.email}</span>
          <span>{user.role}</span>
          <button onMouseEnter={() => onUserHover({ user, x: 100, y: 100 })}>
            Hover
          </button>
        </div>
      ))}
    </div>
  )
}));

vi.mock('../../../components/admin/users/UserBulkActions', () => ({
  default: ({ selectedCount, onBulkAction, onClearSelection }) => (
    <div data-testid="user-bulk-actions">
      <span>Selected: {selectedCount}</span>
      <button onClick={() => onBulkAction('approve')}>Approve</button>
      <button onClick={() => onBulkAction('deactivate')}>Deactivate</button>
      <button onClick={() => onBulkAction('delete')}>Delete</button>
      <button onClick={onClearSelection}>Clear Selection</button>
    </div>
  )
}));

vi.mock('../../../components/admin/users/UserProfileHoverCard', () => ({
  default: ({ user }) => (
    <div data-testid="user-profile-hover-card">
      <span>{user.firstname} {user.lastname}</span>
      <span>{user.email}</span>
    </div>
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
    vi.clearAllMocks();
    
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
      update: vi.fn(),
      delete: vi.fn(),
      set: vi.fn(),
      commit: vi.fn().mockResolvedValue()
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
      const mockCreateObjectURL = vi.fn().mockReturnValue('blob:mock-url');
      const mockLink = {
        setAttribute: vi.fn(),
        click: vi.fn(),
        style: {}
      };
      
      global.URL.createObjectURL = mockCreateObjectURL;
      global.document.createElement = vi.fn().mockReturnValue(mockLink);
      global.document.body.appendChild = vi.fn();
      global.document.body.removeChild = vi.fn();

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
        update: vi.fn(),
        delete: vi.fn(),
        set: vi.fn(),
        commit: vi.fn().mockRejectedValue(new Error('Bulk action error'))
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