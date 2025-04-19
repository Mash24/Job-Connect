// File: src/components/admin/tables/UserTable.jsx
import React from 'react';
import RoleBadge from '../shared/RoleBadge';
import ActionDropdown from '../shared/ActionDropdown';

const UserTable = ({ users, onUpdateRole }) => {
  const handleViewProfile = (user) => {
    alert(`View profile for ${user.firstname} ${user.lastname}`);
  };

  const handleBan = (user) => {
    alert(`Ban user ${user.email}`);
  };

  return (
    <div className="overflow-x-auto bg-white shadow rounded-lg">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-100 text-gray-700 text-sm">
          <tr>
            <th className="px-4 py-2 text-left">Name</th>
            <th className="px-4 py-2 text-left">Email</th>
            <th className="px-4 py-2 text-left">Role</th>
            <th className="px-4 py-2 text-left">Actions</th>
          </tr>
        </thead>
        <tbody className="text-sm text-gray-700 divide-y divide-gray-100">
          {users.map((user) => (
            <tr key={user.id}>
              <td className="px-4 py-2">{user.firstname} {user.lastname}</td>
              <td className="px-4 py-2">{user.email}</td>
              <td className="px-4 py-2">
                <RoleBadge role={user.role} />
              </td>
              <td className="px-4 py-2">
                <ActionDropdown
                  user={user}
                  onViewProfile={handleViewProfile}
                  onChangeRole={onUpdateRole}
                  onBan={handleBan}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserTable;
