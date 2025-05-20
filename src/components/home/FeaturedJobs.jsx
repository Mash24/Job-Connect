import React from 'react';
import { Link } from 'react-router-dom';
import { FaBuilding, FaMapMarkerAlt, FaBriefcase, FaMoneyBillWave } from 'react-icons/fa';
import { trackFeatureUsage } from '../../services/analytics';

const FeaturedJobs = () => {
  const featuredJobs = [
    {
      id: 1,
      title: 'Senior Software Engineer',
      company: 'TechCorp',
      location: 'San Francisco, CA',
      salary: '$120k - $180k',
      logo: '/images/company-logos/techcorp.png',
      type: 'Full-time',
      posted: '2 days ago'
    },
    {
      id: 2,
      title: 'Product Manager',
      company: 'InnovateX',
      location: 'New York, NY',
      salary: '$100k - $150k',
      logo: '/images/company-logos/innovatex.png',
      type: 'Full-time',
      posted: '1 day ago'
    },
    {
      id: 3,
      title: 'UX Designer',
      company: 'DesignHub',
      location: 'Remote',
      salary: '$90k - $130k',
      logo: '/images/company-logos/designhub.png',
      type: 'Full-time',
      posted: '3 days ago'
    }
  ];

  const handleJobClick = (jobId) => {
    trackFeatureUsage('featured_job_click', { jobId });
  };

  return (
    <section className="w-full px-4 md:px-20 py-12 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Featured Jobs</h2>
          <p className="text-gray-600">Discover the most exciting opportunities from top companies</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredJobs.map((job) => (
            <Link
              key={job.id}
              to={`/jobs/${job.id}`}
              onClick={() => handleJobClick(job.id)}
              className="block bg-white rounded-lg shadow-md hover:shadow-lg transition duration-300"
            >
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center">
                    <img
                      src={job.logo}
                      alt={`${job.company} logo`}
                      className="w-12 h-12 rounded-lg object-cover"
                    />
                    <div className="ml-4">
                      <h3 className="text-lg font-semibold text-gray-900">{job.title}</h3>
                      <p className="text-gray-600">{job.company}</p>
                    </div>
                  </div>
                  <span className="text-sm text-gray-500">{job.posted}</span>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center text-gray-600">
                    <FaMapMarkerAlt className="mr-2" />
                    <span>{job.location}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <FaBriefcase className="mr-2" />
                    <span>{job.type}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <FaMoneyBillWave className="mr-2" />
                    <span>{job.salary}</span>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-gray-100">
                  <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition duration-300">
                    Apply Now
                  </button>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="text-center mt-8">
          <Link
            to="/jobs"
            className="inline-block bg-white text-blue-600 py-3 px-6 rounded-lg border border-blue-600 hover:bg-blue-50 transition duration-300"
          >
            View All Jobs
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FeaturedJobs; 