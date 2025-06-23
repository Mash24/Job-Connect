import React from 'react';

const ErrorLogTimeline = ({ logs, isLiveMode }) => (
  <div data-testid="error-log-timeline">
    <span>Error Log Timeline</span>
    <span>Live Mode: {isLiveMode ? 'true' : 'false'}</span>
    <span>Logs Count: {logs.length}</span>
  </div>
);

export default ErrorLogTimeline; 