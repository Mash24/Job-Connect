import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, MapPin, Briefcase, Filter, 
  TrendingUp, Clock, Star, X
} from 'lucide-react';
import { trackJobSearch } from '../../services/analytics';

const SearchBar = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useState({
    query: '',
    location: '',
    category: ''
  });
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [recentSearches, setRecentSearches] = useState([]);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const searchRef = useRef(null);

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
    'Customer Service',
    'Data Science',
    'Product Management',
    'Human Resources',
    'Legal',
    'Consulting'
  ];

  const popularJobs = [
    'Software Engineer',
    'Data Scientist',
    'Product Manager',
    'UX Designer',
    'Marketing Manager',
    'Sales Representative',
    'Project Manager',
    'Business Analyst'
  ];

  const popularLocations = [
    'New York, NY',
    'San Francisco, CA',
    'London, UK',
    'Remote',
    'Austin, TX',
    'Seattle, WA',
    'Boston, MA',
    'Chicago, IL'
  ];

  // Load recent searches from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('recentSearches');
    if (saved) {
      setRecentSearches(JSON.parse(saved));
    }
  }, []);

  // Handle click outside to close suggestions
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const generateSuggestions = (input, type) => {
    if (!input.trim()) return [];

    const inputLower = input.toLowerCase();
    
    switch (type) {
      case 'query':
        return popularJobs.filter(job => 
          job.toLowerCase().includes(inputLower)
        ).slice(0, 5);
      case 'location':
        return popularLocations.filter(location => 
          location.toLowerCase().includes(inputLower)
        ).slice(0, 5);
      default:
        return [];
    }
  };

  const handleInputChange = (field, value) => {
    setSearchParams(prev => ({ ...prev, [field]: value }));
    
    if (field === 'query' || field === 'location') {
      const newSuggestions = generateSuggestions(value, field);
      setSuggestions(newSuggestions);
      setShowSuggestions(newSuggestions.length > 0);
    }
  };

  const handleSuggestionClick = (suggestion, field) => {
    setSearchParams(prev => ({ ...prev, [field]: suggestion }));
    setShowSuggestions(false);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    
    // Save to recent searches
    const searchString = `${searchParams.query} ${searchParams.location} ${searchParams.category}`.trim();
    if (searchString) {
      const newRecent = [searchString, ...recentSearches.filter(s => s !== searchString)].slice(0, 5);
      setRecentSearches(newRecent);
      localStorage.setItem('recentSearches', JSON.stringify(newRecent));
    }
    
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

  const clearSearch = () => {
    setSearchParams({ query: '', location: '', category: '' });
    setShowSuggestions(false);
  };

  return (
    <section className="w-full px-4 md:px-20 py-8 bg-gradient-to-r from-blue-50 to-purple-50">
      <div className="max-w-6xl mx-auto">
        <motion.form 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          onSubmit={handleSearch} 
          className="bg-white rounded-xl shadow-xl p-4 md:p-6 border border-gray-100"
          ref={searchRef}
        >
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Job Title/Keyword Search */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Briefcase className="w-5 h-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Job title or keyword"
                className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                value={searchParams.query}
                onChange={(e) => handleInputChange('query', e.target.value)}
                onFocus={() => setShowSuggestions(true)}
              />
              {searchParams.query && (
                <button
                  type="button"
                  onClick={() => handleInputChange('query', '')}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  <X className="w-4 h-4 text-gray-400 hover:text-gray-600" />
                </button>
              )}
              
              {/* Query Suggestions */}
              <AnimatePresence>
                {showSuggestions && suggestions.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg"
                  >
                    {suggestions.map((suggestion, index) => (
                      <button
                        key={index}
                        type="button"
                        onClick={() => handleSuggestionClick(suggestion, 'query')}
                        className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center gap-2"
                      >
                        <TrendingUp className="w-4 h-4 text-blue-500" />
                        {suggestion}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Location Search */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MapPin className="w-5 h-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Location"
                className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                value={searchParams.location}
                onChange={(e) => handleInputChange('location', e.target.value)}
                onFocus={() => setShowSuggestions(true)}
              />
              {searchParams.location && (
                <button
                  type="button"
                  onClick={() => handleInputChange('location', '')}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  <X className="w-4 h-4 text-gray-400 hover:text-gray-600" />
                </button>
              )}
              
              {/* Location Suggestions */}
              <AnimatePresence>
                {showSuggestions && suggestions.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg"
                  >
                    {suggestions.map((suggestion, index) => (
                      <button
                        key={index}
                        type="button"
                        onClick={() => handleSuggestionClick(suggestion, 'location')}
                        className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center gap-2"
                      >
                        <MapPin className="w-4 h-4 text-green-500" />
                        {suggestion}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Category Dropdown */}
            <div className="relative">
              <select
                className="w-full pl-4 pr-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white transition-all"
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
            <motion.button
              type="submit"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 px-6 rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-300 flex items-center justify-center font-medium shadow-lg"
            >
              <Search className="w-5 h-5 mr-2" />
              Search Jobs
            </motion.button>
          </div>

          {/* Recent Searches */}
          {recentSearches.length > 0 && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="mt-4 pt-4 border-t border-gray-200"
            >
              <div className="flex items-center gap-2 mb-2">
                <Clock className="w-4 h-4 text-gray-500" />
                <span className="text-sm text-gray-600 font-medium">Recent Searches:</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {recentSearches.map((search, index) => (
                  <motion.button
                    key={index}
                    type="button"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      // Parse recent search and populate form
                      const parts = search.split(' ');
                      setSearchParams({
                        query: parts[0] || '',
                        location: parts[1] || '',
                        category: parts[2] || ''
                      });
                    }}
                    className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm hover:bg-gray-200 transition-colors"
                  >
                    {search}
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}

          {/* Advanced Search Link */}
          <div className="mt-4 flex items-center justify-between">
            <motion.button
              type="button"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center gap-1"
            >
              <Filter className="w-4 h-4" />
              {showAdvanced ? 'Hide' : 'Show'} Advanced Options
            </motion.button>
            
            <motion.button
              type="button"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/jobs/advanced-search')}
              className="text-blue-600 hover:text-blue-800 text-sm font-medium"
            >
              Advanced Search
            </motion.button>
          </div>

          {/* Advanced Options */}
          <AnimatePresence>
            {showAdvanced && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-4 pt-4 border-t border-gray-200"
              >
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Experience Level</label>
                    <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                      <option>Any Level</option>
                      <option>Entry Level</option>
                      <option>Mid Level</option>
                      <option>Senior Level</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Salary Range</label>
                    <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                      <option>Any Salary</option>
                      <option>$0 - $50k</option>
                      <option>$50k - $100k</option>
                      <option>$100k+</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Job Type</label>
                    <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                      <option>Any Type</option>
                      <option>Full-time</option>
                      <option>Part-time</option>
                      <option>Contract</option>
                      <option>Internship</option>
                    </select>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.form>
      </div>
    </section>
  );
};

export default SearchBar; 