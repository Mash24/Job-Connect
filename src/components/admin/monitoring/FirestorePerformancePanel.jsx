import React from 'react';

const FirestorePerformancePanel = ({ isLiveMode }) => (
  <div data-testid="firestore-performance-panel">
    <span>Firestore Performance Panel</span>
    <span>Live Mode: {isLiveMode ? 'true' : 'false'}</span>
  </div>
);

export default FirestorePerformancePanel; 