import React from 'react';
import RoleBadge from '../shared/RoleBadge';
import ActionDropdown from '../shared/ActionDropdown';

const UserTable = ({ users }) => {
  const handleViewProfile = (user) => {
    alert(`View profile for ${user.firstname} ${user.lastname}`);
    // 🔁 In future: open a profile modal or navigate
  };

  const handleChangeRole = (user) => {
    alert(`Change role for ${user.firstname}`);
    // 🔁 In future: open a RoleChangeForm modal
  };

  const handleBan = (user) => {
    alert(`Ban user ${user.email}`);
    // 🔁 In future: call Firestore update or disable logic
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
                  onChangeRole={handleChangeRole}
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
