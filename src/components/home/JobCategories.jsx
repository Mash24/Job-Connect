import React from 'react';
import { Link } from 'react-router-dom';
import {
  FaCode,
  FaChartLine,
  FaUserMd,
  FaGraduationCap,
  FaPencilRuler,
  FaShoppingCart,
  FaHeadset,
  FaTools
} from 'react-icons/fa';
import { trackFeatureUsage } from '../../services/analytics';

const JobCategories = () => {
  const categories = [
    {
      id: 1,
      name: 'Technology',
      icon: FaCode,
      count: 1250,
      color: 'bg-blue-100 text-blue-600'
    },
    {
      id: 2,
      name: 'Finance',
      icon: FaChartLine,
      count: 850,
      color: 'bg-green-100 text-green-600'
    },
    {
      id: 3,
      name: 'Healthcare',
      icon: FaUserMd,
      count: 920,
      color: 'bg-red-100 text-red-600'
    },
    {
      id: 4,
      name: 'Education',
      icon: FaGraduationCap,
      count: 680,
      color: 'bg-purple-100 text-purple-600'
    },
    {
      id: 5,
      name: 'Design',
      icon: FaPencilRuler,
      count: 450,
      color: 'bg-pink-100 text-pink-600'
    },
    {
      id: 6,
      name: 'Sales',
      icon: FaShoppingCart,
      count: 780,
      color: 'bg-yellow-100 text-yellow-600'
    },
    {
      id: 7,
      name: 'Customer Service',
      icon: FaHeadset,
      count: 620,
      color: 'bg-indigo-100 text-indigo-600'
    },
    {
      id: 8,
      name: 'Engineering',
      icon: FaTools,
      count: 950,
      color: 'bg-orange-100 text-orange-600'
    }
  ];

  const handleCategoryClick = (categoryId) => {
    trackFeatureUsage('job_category_click', { categoryId });
  };

  return (
    <section className="w-full px-4 md:px-20 py-16 bg-white">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Popular Job Categories</h2>
          <p className="text-gray-600">Browse jobs by category and find your perfect match</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {categories.map((category) => (
            <Link
              key={category.id}
              to={`/jobs/category/${category.name.toLowerCase()}`}
              onClick={() => handleCategoryClick(category.id)}
              className="group"
            >
              <div className="bg-white rounded-xl shadow-md p-6 transition duration-300 hover:shadow-lg">
                <div className={`w-12 h-12 rounded-lg ${category.color} flex items-center justify-center mb-4`}>
                  <category.icon className="text-2xl" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{category.name}</h3>
                <p className="text-gray-600">
                  {category.count.toLocaleString()} jobs available
                </p>
                <div className="mt-4 text-blue-600 font-medium group-hover:text-blue-800 transition duration-300">
                  Browse Jobs →
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link
            to="/jobs/categories"
            className="inline-block bg-white text-blue-600 py-3 px-8 rounded-lg border border-blue-600 hover:bg-blue-50 transition duration-300"
          >
            View All Categories
          </Link>
        </div>
      </div>
    </section>
  );
};

export default JobCategories; 