import React, { useState } from 'react';
import { FaQuoteLeft, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { trackFeatureUsage } from '../../services/analytics';

const SuccessStories = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const successStories = [
    {
      id: 1,
      name: 'Sarah Johnson',
      role: 'Software Engineer',
      company: 'TechCorp',
      story: 'Found my dream job through JobConnect. The platform made it easy to showcase my skills and connect with top companies.',
      image: '/images/testimonials/sarah.jpg'
    },
    {
      id: 2,
      name: 'Michael Chen',
      role: 'Product Manager',
      company: 'InnovateX',
      story: 'The AI-powered job matching helped me find opportunities that perfectly aligned with my career goals.',
      image: '/images/testimonials/michael.jpg'
    },
    {
      id: 3,
      name: 'Emily Rodriguez',
      role: 'UX Designer',
      company: 'DesignHub',
      story: 'JobConnect\'s streamlined application process helped me land multiple interviews within weeks.',
      image: '/images/testimonials/emily.jpg'
    }
  ];

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? successStories.length - 1 : prev - 1));
    trackFeatureUsage('success_story_navigation', { direction: 'previous' });
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === successStories.length - 1 ? 0 : prev + 1));
    trackFeatureUsage('success_story_navigation', { direction: 'next' });
  };

  const currentStory = successStories[currentIndex];

  return (
    <section className="w-full px-4 md:px-20 py-16 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Success Stories</h2>
          <p className="text-gray-600">Hear from professionals who found their dream jobs through JobConnect</p>
        </div>

        <div className="relative bg-white rounded-xl shadow-lg p-8 md:p-12">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/3 mb-8 md:mb-0">
              <img
                src={currentStory.image}
                alt={currentStory.name}
                className="w-32 h-32 rounded-full mx-auto object-cover border-4 border-blue-100"
              />
            </div>

            <div className="md:w-2/3 md:pl-12">
              <FaQuoteLeft className="text-blue-500 text-4xl mb-6" />
              <blockquote className="text-xl text-gray-700 mb-6">
                "{currentStory.story}"
              </blockquote>

              <div className="mb-6">
                <h3 className="text-xl font-semibold text-gray-900">{currentStory.name}</h3>
                <p className="text-blue-600 font-medium">{currentStory.role}</p>
                <p className="text-gray-600">{currentStory.company}</p>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Previous Role:</span> {currentStory.previousRole} at {currentStory.previousCompany}
                </p>
              </div>
            </div>
          </div>

          <div className="flex justify-center mt-8 space-x-4">
            <button
              onClick={handlePrevious}
              className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition duration-300"
              aria-label="Previous story"
            >
              <FaChevronLeft className="text-gray-600" />
            </button>
            <button
              onClick={handleNext}
              className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition duration-300"
              aria-label="Next story"
            >
              <FaChevronRight className="text-gray-600" />
            </button>
          </div>

          <div className="flex justify-center mt-4 space-x-2">
            {successStories.map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  setCurrentIndex(index);
                  trackFeatureUsage('success_story_navigation', { direction: 'dot', index });
                }}
                className={`w-2 h-2 rounded-full transition duration-300 ${
                  index === currentIndex ? 'bg-blue-600' : 'bg-gray-300'
                }`}
                aria-label={`Go to story ${index + 1}`}
              />
            ))}
          </div>
        </div>

        <div className="text-center mt-12">
          <a
            href="/success-stories"
            className="inline-block bg-blue-600 text-white py-3 px-8 rounded-lg hover:bg-blue-700 transition duration-300"
          >
            Read More Success Stories
          </a>
        </div>
      </div>
    </section>
  );
};

export default SuccessStories; 