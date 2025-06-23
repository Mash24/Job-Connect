import React from 'react';

const UserProfileHoverCard = ({ user }) => (
  <div data-testid="user-profile-hover-card">
    <span>{user.firstname} {user.lastname}</span>
    <span>{user.email}</span>
  </div>
);

export default UserProfileHoverCard; 