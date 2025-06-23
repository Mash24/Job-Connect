import React from 'react';

const APIMetricsGraph = ({ isLiveMode }) => (
  <div data-testid="api-metrics-graph">
    <span>API Metrics Graph</span>
    <span>Live Mode: {isLiveMode ? 'true' : 'false'}</span>
  </div>
);

export default APIMetricsGraph; 