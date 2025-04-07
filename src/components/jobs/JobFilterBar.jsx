import React, { useState, useEffect } from 'react';
import { Search, X } from 'lucide-react';

const JobFilterBar = ({ onFilterChange }) => {
  const [search, setSearch] = useState('');
  const [type, setType] = useState('');
  const [location, setLocation] = useState('');

  // Send filters to parent on change
  useEffect(() => {
    onFilterChange({ search, type, location });
  }, [search, type, location, onFilterChange]);

  const clearFilters = () => {
    setSearch('');
    setType('');
    setLocation('');
  };

  return (
    <div className="bg-white p-4 mb-6 rounded-xl shadow border flex flex-col md:flex-row md:items-center md:justify-between gap-4">
      {/* Search */}
      <div className="flex items-center border rounded-md px-3 py-2 w-full md:w-1/3">
        <Search size={18} className="text-gray-400 mr-2" />
        <input
          type="text"
          placeholder="Search by title..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="outline-none w-full text-sm"
        />
      </div>

      {/* Job Type */}
      <select
        value={type}
        onChange={(e) => setType(e.target.value)}
        className="border px-3 py-2 rounded-md text-sm w-full md:w-auto"
      >
        <option value="">All Types</option>
        <option value="Full-time">Full-time</option>
        <option value="Part-time">Part-time</option>
        <option value="Contract">Contract</option>
        <option value="Internship">Internship</option>
        <option value="Freelance">Freelance</option>
      </select>

      {/* Location */}
      <input
        type="text"
        placeholder="Location"
        value={location}
        onChange={(e) => setLocation(e.target.value)}
        className="border px-3 py-2 rounded-md text-sm w-full md:w-auto"
      />

      {/* Clear Button */}
      <button
        onClick={clearFilters}
        className="flex items-center gap-1 text-sm text-red-500 hover:text-red-600"
      >
        <X size={16} /> Clear
      </button>
    </div>
  );
};

export default JobFilterBar;