/* eslint-env jest */

// Mock for firebase/storage
export const getStorage = jest.fn(() => ({}));

export const ref = jest.fn();
export const uploadBytes = jest.fn(() => Promise.resolve({}));
export const getDownloadURL = jest.fn(() => Promise.resolve('https://example.com/test-url'));
export const deleteObject = jest.fn(() => Promise.resolve()); 