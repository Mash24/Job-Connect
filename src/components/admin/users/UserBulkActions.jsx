import React from 'react';

const UserBulkActions = ({ selectedCount, onBulkAction, onClearSelection }) => (
  <div data-testid="user-bulk-actions">
    <span>Selected: {selectedCount}</span>
    <button onClick={() => onBulkAction('approve')}>Approve</button>
    <button onClick={() => onBulkAction('deactivate')}>Deactivate</button>
    <button onClick={() => onBulkAction('delete')}>Delete</button>
    <button onClick={onClearSelection}>Clear Selection</button>
  </div>
);

export default UserBulkActions; 