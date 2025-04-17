// File: src/components/admin/shared/ActionDropdown.jsx
import React, { useState } from 'react';
import { Dialog } from '@headlessui/react';
import RoleChangeForm from '../forms/RoleChangeForm';

const ActionDropdown = ({ user, onViewProfile, onBan }) => {
  const [open, setOpen] = useState(false);
  const [showRoleModal, setShowRoleModal] = useState(false);

  const handleChangeRole = () => {
    setShowRoleModal(true);
    setOpen(false);
  };

  const handleCloseModal = () => {
    setShowRoleModal(false);
  };

  return (
    <div className="relative inline-block text-left">
      <button
        onClick={() => setOpen(!open)}
        className="px-2 py-1 border rounded text-sm bg-gray-100 hover:bg-gray-200"
      >
        Actions ⏷
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-44 bg-white border rounded shadow z-10">
          <button
            onClick={() => {
              onViewProfile(user);
              setOpen(false);
            }}
            className="block w-full text-left px-4 py-2 hover:bg-gray-100"
          >
            👁 View Profile
          </button>
          <button
            onClick={handleChangeRole}
            className="block w-full text-left px-4 py-2 hover:bg-gray-100"
          >
            🔁 Change Role
          </button>
          <button
            onClick={() => {
              onBan(user);
              setOpen(false);
            }}
            className="block w-full text-left px-4 py-2 text-red-500 hover:bg-red-50"
          >
            🚫 Ban User
          </button>
        </div>
      )}

      {/* Modal for changing role */}
      {showRoleModal && (
        <Dialog open={showRoleModal} onClose={handleCloseModal} className="relative z-50">
          <div className="fixed inset-0 bg-black/30" aria-hidden="true" />

          <div className="fixed inset-0 flex items-center justify-center p-4">
            <Dialog.Panel className="w-full max-w-md bg-white p-6 rounded shadow">
              <Dialog.Title className="text-lg font-semibold mb-2">Change Role for {user.email}</Dialog.Title>
              <RoleChangeForm user={user} onClose={handleCloseModal} />
            </Dialog.Panel>
          </div>
        </Dialog>
      )}
    </div>
  );
};

export default ActionDropdown;