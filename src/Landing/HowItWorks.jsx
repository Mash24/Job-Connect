import React from 'react'
import { FaUserPlus, FaRobot, FaPaperPlane, FaBuilding, FaBullhorn, FaHandshake, FaClipboard, FaBriefcase, FaUserTie, FaRegFileAlt, FaUsersCog, FaChartLine, FaSearch } from 'react-icons/fa';
import { Link } from 'react-router';
import TITLE from '../components/common/Title';

const steps = {
        jobSeekers: [
          {
            icon: <FaUserPlus className = 'text-blue-600 text-3xl'/>,
            title: 'Create Your Job Seeker Account',
            description: 'Sign up for free and build your job seeker profile.',
          },
          {
            icon: <FaClipboard className = 'text-yellow-500 text-3xl'/>,
            title: 'Fill Out Your Skills Profile',
            description:'Add your skills, experience, and preferences to stand out.',
          },
          {
            icon: <FaSearch className = 'text-green-500 text-3xl'/>,
            title: 'Explore Job Matches',
            description: 'Discover AI-powered job recommendations tailored to you.',
          },
          {
            icon: <FaPaperPlane className = 'text-purple-500 text-3xl'/>,
            title: 'Apply & Connect',
            description: 'Submit applications and engage directly with recruiters.',
          },
          {
            icon: <FaBriefcase className = 'text-pink-500 text-3xl'/>,
            title: 'Get Hired & Succeed',
            description: 'Land interviews, secure your job, and grow your career.',
          },
        ],
        employers: [
          {
            icon: <FaBuilding className = 'text-blue-700 text-3xl'/>,
            title: 'Create your business profile',
            description: 'Create a business profile and start hiring today.',
          },
          {
            icon: <FaBullhorn className = 'text-yellow-600 text-3xl'/>,
            title: 'Post Job Openings',
            description: 'List available positions and attract the best candidates.',
          },
          {
            icon: <FaUsersCog className = 'text-green-600 text-3xl'/>,
            title: 'Find Your Preferred Skills',
            description:'Use smart filtering tools to identify top applicants.',
          },
          {
            icon: <FaHandshake className = 'text-purple-600 text-3xl'/>,
            title: 'Interview & Hire',
            description:'Connect with candidates, schedule interviews, and make offers.',
          },
          {
            icon: <FaChartLine className = 'text-pink-600 text-3xl'/>,
            title: 'Grow Your Business and ease Your Life',
            description:'Onboard top talent and scale your team efficiently.',
          },
        ],
      };

const HowItWorks = () => {
  return (
    <section id='how-it-work' className="w-full px-6 md:px-20 py-20 bg-gradient-to-br from-white via-blue-200 to-white text-gray-800">
      <div className="text-center mb-16">
        <h2 className="text-4xl md:text-5xl font-bold text-blue-800 mb-4">How It Works</h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto"><span className='text-yellow-500'>{TITLE}</span> makes job searching and hiring easier and more efficient. Here's how:</p>
      </div>

{/* For Job Seekers */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
        <div className="space-y-10">
          <h3 className="text-2xl font-semibold text-blue-700 text-center md:text-left">For Job Seekers</h3>
          {steps.jobSeekers.map((step, index) =>(
            <div key={index} className="flex gap-4 items-start animate-fade-up bg-white shadow-md rounded-lg p-4 hover:shadow-xl transition duration-300 ease-in-out">
              <div>{step.icon}</div>

              <div>
                <h4 className="text-xl font-bold text-blue-900 mb-1">Step {index +1}: {step.title}</h4>
                <p className="text-gray-600 text-sm">{step.description}</p>
              </div>
            
            </div>
          ))}

          <div className="text-center mt-6">
            <Link to="/register" className="inline-block px-6 py-3 bg-blue-700 text-white rounded-lg hover:bg-yellow-500 hover:text-black font-semibold transition duration-300">Start Your Job Search</Link>
          </div>
        </div>

{/* For employers and recruiters */}
          <div className="space-y-10">
            <h3 className="text-2xl font-semibold text-blue-700 text-center md:text-left">For Employers</h3>
            {steps.employers.map((step, index) =>(
              <div key={index} className="flex gap-4 items-start animate-fade-up bg-white shadow-md rounded-lg p-4 hover:shadow-xl transition duration-300 ease-in-out">
                <div>{step.icon}</div>
                <div>
                  <h4 className="text-xl font-bold text-blue-900 mb-1">Step {index +1}: {step.title}</h4>
                  <p className="text-gray-600 text-sm">{step.description}</p>
              </div>
          </div>
            ))}
            <div className="text-center mt-6">
              <Link to="/register" className="inline-block px-6 py-3 bg-blue-700 text-white rounded-lg hover:bg-yellow-500 hover:text-black font-semibold transition duration-300">Post a Job</Link>
            </div>
          </div>
      </div>
    </section>
  )
}

export default HowItWorks