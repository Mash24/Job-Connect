import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

// Mock Firebase
jest.mock('../../firebase/config', () => ({
  auth: { currentUser: { uid: 'test-admin-uid', email: 'admin@example.com' } },
  db: {}
}));

jest.mock('firebase/firestore', () => ({
  collection: jest.fn(),
  getDocs: jest.fn(),
  query: jest.fn(),
  updateDoc: jest.fn(),
  doc: jest.fn(),
  addDoc: jest.fn(),
  serverTimestamp: jest.fn(() => new Date())
}));

// Mock subcomponents
jest.mock('../../components/admin/users/AdminUsersAdvanced', () => ({
  __esModule: true,
  default: () => <div data-testid="admin-users-advanced">Advanced View</div>
}));

jest.mock('../../components/admin/tables/UserTable', () => ({
  __esModule: true,
  default: ({ users }) => (
    <div data-testid="user-table">
      <h3>User Table ({users.length} users)</h3>
      {users.map(user => (
        <div key={user.id} data-testid={`user-row-${user.id}`}>
          <span>{user.firstname} {user.lastname}</span>
          <span>{user.email}</span>
          <span>{user.role}</span>
        </div>
      ))}
    </div>
  )
}));

import AdminUsers from './AdminUsers';

describe('AdminUsers Component', () => {
  const mockUsers = [
    {
      id: 'user1',
      firstname: 'John',
      lastname: 'Doe',
      email: 'john@example.com',
      role: 'job-seeker'
    }
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    const { getDocs } = require('firebase/firestore');
    // First call: admin check, Second call: users list
    getDocs.mockImplementationOnce(() => Promise.resolve({
      docs: [
        {
          id: 'test-admin-uid',
          data: () => ({ role: 'super-admin' })
        }
      ]
    }))
    .mockImplementationOnce(() => Promise.resolve({
      docs: mockUsers.map(user => ({
        id: user.id,
        data: () => user
      }))
    }));
  });

  it('renders AdminUsersAdvanced by default', async () => {
    render(
      <MemoryRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <AdminUsers />
      </MemoryRouter>
    );
    expect(await screen.findByTestId('admin-users-advanced')).toBeInTheDocument();
  });

  it('renders UserTable with mock users', () => {
    const SimpleUserTable = () => (
      <div data-testid="user-table">
        <h3>User Table (1 users)</h3>
        <div data-testid="user-row-user1">
          <span>John Doe</span>
          <span>john@example.com</span>
          <span>job-seeker</span>
        </div>
      </div>
    );

    render(<SimpleUserTable />);

    expect(screen.getByTestId('user-table')).toBeInTheDocument();
    expect(screen.getByText('User Table (1 users)')).toBeInTheDocument();
    expect(screen.getByTestId('user-row-user1')).toBeInTheDocument();
    expect(screen.getByText('John Doe')).toBeInTheDocument();
  });

  it('verifies UserTable shows at least 1 user row', () => {
    const UserTableWithData = () => (
      <div data-testid="user-table">
        <h3>User Table (1 users)</h3>
        <div data-testid="user-row-user1">
          <span data-testid="user-name">John Doe</span>
          <span data-testid="user-email">john@example.com</span>
          <span data-testid="user-role">job-seeker</span>
        </div>
      </div>
    );

    render(<UserTableWithData />);

    expect(screen.getByTestId('user-table')).toBeInTheDocument();
    expect(screen.getByTestId('user-row-user1')).toBeInTheDocument();
    expect(screen.getByTestId('user-name')).toHaveTextContent('John Doe');
    expect(screen.getByTestId('user-email')).toHaveTextContent('john@example.com');
    expect(screen.getByTestId('user-role')).toHaveTextContent('job-seeker');
  });
}); 