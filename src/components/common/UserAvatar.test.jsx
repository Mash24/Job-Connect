import React from 'react';
import { render, screen } from '@testing-library/react';
import UserAvatar from './UserAvatar';

jest.mock('react-firebase-hooks/auth', () => ({
  useAuthState: () => [{ uid: 'test-user' }],
}));
jest.mock('../../firebase/config', () => ({
  auth: {},
  db: {},
}));
jest.mock('firebase/firestore', () => ({
  doc: jest.fn(),
  getDoc: jest.fn(() => ({ exists: () => false, data: () => ({}) })),
}));
jest.mock('firebase/auth', () => ({
  signOut: jest.fn(),
}));

beforeAll(() => {
  jest.spyOn(console, 'error').mockImplementation(() => {});
  jest.spyOn(console, 'warn').mockImplementation(() => {});
});
afterAll(() => {
  console.error.mockRestore();
  console.warn.mockRestore();
});

it('renders UserAvatar without crashing', () => {
  render(<UserAvatar />);
  expect(screen.getByText(/user/i)).toBeInTheDocument();
}); 