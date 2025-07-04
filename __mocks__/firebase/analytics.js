/* global jest */

// Mock for firebase/analytics
export const getAnalytics = jest.fn(() => ({}));
export const isSupported = jest.fn(() => Promise.resolve(true));
export const logEvent = jest.fn();
export const setUserId = jest.fn();
export const setUserProperties = jest.fn(); 