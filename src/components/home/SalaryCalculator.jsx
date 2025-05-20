import React, { useState } from 'react';
import { FaCalculator, FaMapMarkerAlt, FaBriefcase, FaGraduationCap } from 'react-icons/fa';
import { trackFeatureUsage } from '../../services/analytics';

const SalaryCalculator = () => {
  const [formData, setFormData] = useState({
    jobTitle: '',
    location: '',
    experience: '1-3',
    education: 'bachelors'
  });

  const [estimatedSalary, setEstimatedSalary] = useState(null);

  const experienceOptions = [
    { value: '0-1', label: '0-1 years' },
    { value: '1-3', label: '1-3 years' },
    { value: '3-5', label: '3-5 years' },
    { value: '5-10', label: '5-10 years' },
    { value: '10+', label: '10+ years' }
  ];

  const educationOptions = [
    { value: 'high-school', label: 'High School' },
    { value: 'associates', label: "Associate's Degree" },
    { value: 'bachelors', label: "Bachelor's Degree" },
    { value: 'masters', label: "Master's Degree" },
    { value: 'phd', label: 'PhD' }
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const calculateSalary = (e) => {
    e.preventDefault();
    
    // This is a mock calculation. In a real application, this would use actual salary data
    const baseSalary = {
      '0-1': 45000,
      '1-3': 65000,
      '3-5': 85000,
      '5-10': 110000,
      '10+': 150000
    }[formData.experience];

    const educationMultiplier = {
      'high-school': 0.8,
      'associates': 0.9,
      'bachelors': 1,
      'masters': 1.2,
      'phd': 1.4
    }[formData.education];

    const locationMultiplier = 1.1; // Mock location multiplier

    const calculatedSalary = Math.round(baseSalary * educationMultiplier * locationMultiplier);

    setEstimatedSalary(calculatedSalary);
    trackFeatureUsage('salary_calculator_used', {
      jobTitle: formData.jobTitle,
      location: formData.location,
      experience: formData.experience,
      education: formData.education,
      estimatedSalary: calculatedSalary
    });
  };

  return (
    <section className="w-full px-4 md:px-20 py-16 bg-gray-50">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Salary Calculator</h2>
          <p className="text-gray-600">Get an estimate of your potential salary based on your qualifications</p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-8">
          <form onSubmit={calculateSalary} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Job Title */}
              <div>
                <label htmlFor="jobTitle" className="block text-sm font-medium text-gray-700 mb-2">
                  Job Title
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaBriefcase className="text-gray-400" />
                  </div>
                  <input
                    type="text"
                    id="jobTitle"
                    name="jobTitle"
                    value={formData.jobTitle}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g., Software Engineer"
                    required
                  />
                </div>
              </div>

              {/* Location */}
              <div>
                <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2">
                  Location
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaMapMarkerAlt className="text-gray-400" />
                  </div>
                  <input
                    type="text"
                    id="location"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g., San Francisco, CA"
                    required
                  />
                </div>
              </div>

              {/* Experience */}
              <div>
                <label htmlFor="experience" className="block text-sm font-medium text-gray-700 mb-2">
                  Years of Experience
                </label>
                <select
                  id="experience"
                  name="experience"
                  value={formData.experience}
                  onChange={handleInputChange}
                  className="w-full pl-4 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                >
                  {experienceOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Education */}
              <div>
                <label htmlFor="education" className="block text-sm font-medium text-gray-700 mb-2">
                  Education Level
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaGraduationCap className="text-gray-400" />
                  </div>
                  <select
                    id="education"
                    name="education"
                    value={formData.education}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  >
                    {educationOptions.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div className="text-center">
              <button
                type="submit"
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <FaCalculator className="mr-2" />
                Calculate Salary
              </button>
            </div>
          </form>

          {estimatedSalary && (
            <div className="mt-8 p-6 bg-blue-50 rounded-lg">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Estimated Salary Range</h3>
              <p className="text-3xl font-bold text-blue-600">
                ${estimatedSalary.toLocaleString()}
                <span className="text-lg font-normal text-gray-600">/year</span>
              </p>
              <p className="mt-2 text-sm text-gray-600">
                This is an estimate based on industry data and may vary based on specific factors.
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default SalaryCalculator; 