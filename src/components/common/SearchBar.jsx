import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaSearch, FaMapMarkerAlt, FaBriefcase } from 'react-icons/fa';
import { trackJobSearch } from '../../services/analytics';

const SearchBar = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useState({
    query: '',
    location: '',
    category: ''
  });

  const jobCategories = [
    'All Categories',
    'Technology',
    'Healthcare',
    'Finance',
    'Marketing',
    'Education',
    'Engineering',
    'Design',
    'Sales',
    'Customer Service'
  ];

  const handleSearch = (e) => {
    e.preventDefault();
    
    // Track search event
    trackJobSearch({
      query: searchParams.query,
      filters: {
        location: searchParams.location,
        category: searchParams.category
      }
    });

    // Navigate to search results
    navigate('/jobs/search', {
      state: { searchParams }
    });
  };

  return (
    <section className="w-full px-4 md:px-20 py-8 bg-white">
      <div className="max-w-6xl mx-auto">
        <form onSubmit={handleSearch} className="bg-white rounded-xl shadow-lg p-4 md:p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Job Title/Keyword Search */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaBriefcase className="text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Job title or keyword"
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={searchParams.query}
                onChange={(e) => setSearchParams(prev => ({ ...prev, query: e.target.value }))}
              />
            </div>

            {/* Location Search */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaMapMarkerAlt className="text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Location"
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={searchParams.location}
                onChange={(e) => setSearchParams(prev => ({ ...prev, location: e.target.value }))}
              />
            </div>

            {/* Category Dropdown */}
            <div className="relative">
              <select
                className="w-full pl-4 pr-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
                value={searchParams.category}
                onChange={(e) => setSearchParams(prev => ({ ...prev, category: e.target.value }))}
              >
                {jobCategories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </div>
            </div>

            {/* Search Button */}
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition duration-300 flex items-center justify-center"
            >
              <FaSearch className="mr-2" />
              Search Jobs
            </button>
          </div>

          {/* Advanced Search Link */}
          <div className="mt-4 text-right">
            <button
              type="button"
              onClick={() => navigate('/jobs/advanced-search')}
              className="text-blue-600 hover:text-blue-800 text-sm font-medium"
            >
              Advanced Search
            </button>
          </div>
        </form>
      </div>
    </section>
  );
};

export default SearchBar; 