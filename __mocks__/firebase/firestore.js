// Mock for firebase/firestore
export const getFirestore = jest.fn(() => ({}));

export const collection = jest.fn();
export const doc = jest.fn();
export const getDoc = jest.fn(() => Promise.resolve({
  exists: () => true,
  data: () => ({}),
}));
export const getDocs = jest.fn(() => Promise.resolve({ docs: [] }));
export const addDoc = jest.fn(() => Promise.resolve({ id: 'test-doc-id' }));
export const updateDoc = jest.fn(() => Promise.resolve());
export const deleteDoc = jest.fn(() => Promise.resolve());
export const query = jest.fn();
export const where = jest.fn();
export const orderBy = jest.fn();
export const limit = jest.fn();
export const onSnapshot = jest.fn();
export const serverTimestamp = jest.fn(() => new Date()); 