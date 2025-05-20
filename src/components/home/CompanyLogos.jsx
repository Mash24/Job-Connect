import React from 'react';
import { trackFeatureUsage } from '../../services/analytics';
import { motion } from 'framer-motion';

const CompanyLogos = () => {
  const companies = [
    {
      id: 1,
      name: 'Google',
      logo: '/images/google-logo.png',
      website: 'https://google.com'
    },
    {
      id: 2,
      name: 'Microsoft',
      logo: '/images/microsoft-logo.png',
      website: 'https://microsoft.com'
    },
    {
      id: 3,
      name: 'Amazon',
      logo: '/images/amazon-logo.png',
      website: 'https://amazon.com'
    },
    {
      id: 4,
      name: 'Apple',
      logo: '/images/apple-logo.png',
      website: 'https://apple.com'
    },
    {
      id: 5,
      name: 'Meta',
      logo: '/images/meta-logo.png',
      website: 'https://meta.com'
    }
  ];

  const handleCompanyClick = (companyId) => {
    trackFeatureUsage('company_logo_click', { companyId });
  };

  return (
    <section className="w-full px-4 md:px-20 py-12 bg-white">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">Trusted by Top Companies</h2>
          <p className="text-gray-600">Join thousands of professionals working at leading companies</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 items-center justify-items-center">
          {companies.map((company) => (
            <a
              key={company.id}
              href={company.website}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => handleCompanyClick(company.id)}
              className="block transition duration-300 hover:opacity-75"
            >
              <img
                src={company.logo}
                alt={`${company.name} logo`}
                className="h-12 object-contain"
              />
            </a>
          ))}
        </div>

        <div className="mt-12 text-center">
          <p className="text-gray-600">
            Join our growing network of partner companies and find your next opportunity
          </p>
          <a
            href="/companies"
            className="inline-block mt-4 text-blue-600 hover:text-blue-800 font-medium"
          >
            View All Companies →
          </a>
        </div>
      </div>
    </section>
  );
};

export default CompanyLogos; 