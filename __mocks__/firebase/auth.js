/* global jest */

// Mock for firebase/auth
export const getAuth = jest.fn(() => ({
  currentUser: { uid: 'test-user-uid' },
  onAuthStateChanged: jest.fn(),
  signOut: jest.fn(() => Promise.resolve()),
}));

export const GoogleAuthProvider = jest.fn().mockImplementation(() => ({
  addScope: jest.fn(),
  setCustomParameters: jest.fn(),
}));

export const setPersistence = jest.fn(() => Promise.resolve());
export const browserLocalPersistence = 'local';
export const signInWithPopup = jest.fn(() => Promise.resolve());
export const signInWithEmailAndPassword = jest.fn(() => Promise.resolve());
export const createUserWithEmailAndPassword = jest.fn(() => Promise.resolve());
export const sendPasswordResetEmail = jest.fn(() => Promise.resolve());
export const updateProfile = jest.fn(() => Promise.resolve()); 