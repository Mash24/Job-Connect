// File: src/components/admin/forms/RoleChangeForm.jsx

import React, { useState } from 'react';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../../../firebase/config';

const RoleChangeForm = ({ user, onClose }) => {
  const [newRole, setNewRole] = useState(user.role);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const roles = ['job-seeker', 'employer', 'super-admin'];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (newRole === user.role) {
      setError('No changes made. Choose a different role.');
      return;
    }

    try {
      setLoading(true);
      const userRef = doc(db, 'users', user.id);
      await updateDoc(userRef, { role: newRole });

      setSuccess(`✅ Role updated to ${newRole}`);
      setTimeout(() => {
        onClose(); // Close modal
        window.location.reload(); // Refresh to reflect change
      }, 1500);
    } catch (err) {
      console.error('Error updating role:', err);
      setError('Failed to update role. Try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && <p className="text-red-500 text-sm">{error}</p>}
      {success && <p className="text-green-600 text-sm">{success}</p>}

      <label className="block font-medium text-gray-700">
        Select New Role:
        <select
          className="mt-1 w-full border rounded px-3 py-2"
          value={newRole}
          onChange={(e) => setNewRole(e.target.value)}
        >
          {roles.map((role) => (
            <option key={role} value={role}>
              {role.charAt(0).toUpperCase() + role.slice(1)}
            </option>
          ))}
        </select>
      </label>

      <div className="flex justify-between mt-4">
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 text-sm rounded border border-gray-300 text-gray-700 hover:bg-gray-100"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 text-sm rounded bg-blue-600 text-white hover:bg-blue-700"
        >
          {loading ? 'Updating...' : 'Update Role'}
        </button>
      </div>
    </form>
  );
};

export default RoleChangeForm;
