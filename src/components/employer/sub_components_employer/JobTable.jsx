// File: /src/components/employer/sub_components_employer/JobTable.jsx
import React from 'react';

const JobTable = () => {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white border border-gray-200">
        <thead>
          <tr className="bg-gray-100 text-gray-600 uppercase text-sm">
            <th className="py-3 px-6 text-left">Job Title</th>
            <th className="py-3 px-6 text-left">Applicants</th>
            <th className="py-3 px-6 text-left">Posted On</th>
            <th className="py-3 px-6 text-left">Status</th>
            <th className="py-3 px-6 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr className="border-b hover:bg-gray-50">
            <td className="py-3 px-6">Senior React Developer</td>
            <td className="py-3 px-6">35</td>
            <td className="py-3 px-6">April 5, 2025</td>
            <td className="py-3 px-6 text-green-600 font-semibold">Active</td>
            <td className="py-3 px-6">
              <button className="text-blue-500 hover:underline text-sm">Edit</button>
              <button className="ml-4 text-red-500 hover:underline text-sm">Delete</button>
            </td>
          </tr>
          {/* Add more rows dynamically later */}
        </tbody>
      </table>
    </div>
  );
};

export default JobTable;
