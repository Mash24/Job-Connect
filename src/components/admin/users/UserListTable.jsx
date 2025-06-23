import React from 'react';

const UserListTable = ({ users, selectedUsers, onSelectUser, onSelectAll, onUserHover }) => (
  <div data-testid="user-list-table">
    <input
      type="checkbox"
      checked={selectedUsers.size === users.length && users.length > 0}
      onChange={e => onSelectAll(e.target.checked)}
      data-testid="select-all-checkbox"
    />
    {users.map(user => (
      <div key={user.id} data-testid={`user-row-${user.id}`}> 
        <input
          type="checkbox"
          checked={selectedUsers.has(user.id)}
          onChange={e => onSelectUser(user.id, e.target.checked)}
          data-testid={`user-checkbox-${user.id}`}
        />
        <span>{user.firstname} {user.lastname}</span>
        <span>{user.email}</span>
        <span>{user.role}</span>
        <button onMouseEnter={() => onUserHover({ user, x: 100, y: 100 })}>
          Hover
        </button>
      </div>
    ))}
  </div>
);

export default UserListTable; 