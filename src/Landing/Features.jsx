import React from 'react'
import { Link } from 'react-router';
import { FaBriefcase, FaHandshake, FaBell, FaRocket, FaMagic, FaSmile } from 'react-icons/fa';
import TITLE from '../components/common/Title'

    const features = {
          jobSeekers: [
                {
                  icon: <FaRocket className='text-yellow-400 text-3xl' />,
                  title: "Premium Job Listings",
                  description: "You will get access to high quality job listings that are tailored to your skills and experience.",
                },
                {
                  icon: <FaBell className='text-green-400 text-3xl' />,
                  title: "Real-Time Alerts",
                  description: "Get notified the moment a new opportunity is available. Never miss a match.",
                },
                {
                  icon: <FaMagic className='text-red-400 text-3xl' />,
                  title: "AI Powered Matching",
                  description: "Smart algorithms match the right jobs to the right jobs—for seekers ensuring perfect fit.",
                }
            ],
              employers: [
                  {
                    icon: <FaHandshake className='text-purple-400 text-3xl' />,
                    title: "Seamless Connections",
                    description: "Chat directly with candidates and connect instantly with verified talent.",
                  },
                  {
                    icon: <FaBriefcase className='text-blue-400 text-3xl' />,
                    title: "1-Click Application & Review",
                    description: "Employers review and shortlist candidates with a single click, making the hiring process faster.",
                  },
                  {
                    icon: <FaSmile className='text-orange-400 text-3xl' />,
                    title: "Delightful User Experience",
                    description: "Modern, smooth interface for employers and candidates alike. Less stress, more success.",
                  }
                ]
      }
    

const Features = () => {
      return (
        <section id='features' className="w-full px-6 md:px-20 bg-white text-gray-800 mt-10">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-blue-800 mb-4 animate-fade-up">Why choose <span className='text-yellow-500'>{TITLE}?</span></h2>
            <p className="text-lg text-gray-600 max-w-xl mx-auto">We  make <span>job searching</span> effortless and <span>employer</span> connections seamless.</p>
            </div>

{/* Section with the feature cards- job seekers */}
            <div className="text-center mb-12">
                  <h3 className="text-3xl font-semibold text-blue-800 mb-6">For Job Seekers</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                    {features.jobSeekers.map((feature, index) =>(
                    
                    <div key={index} className="bg-gradient-to-br from-blue-50 via-white to-gray-100 rounded-xl p-6 shadow-md hover:shadow-xl transform hover:scale-105 transition duration-300 ease-in-out">
                      
                        <div className="mb-4">{feature.icon}</div>
                        <h3 className="text-xl font-semibold text-blue-900">{feature.title}</h3>
                        <p className="text-gray-600 text-sm leading-relaxed mt-2">{feature.description}</p>
                    </div>
                    ))}
                </div>

                <div className="text-center mt-16">
                    <Link to="/register" className="inline-block px-8 py-3 bg-blue-700 text-white font-semibold rounded-lg hover:bg-yellow-500 hover:text-black transition duration-300 ease-in-out">Find Your Next →</Link>
                </div>
              </div>


{/* Section with the feature cards- employers */}
            <div className="text-center mb-12">
              <h3 className="text-3xl font-semibold text-blue-800 mb-6">For Employers</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                  {features.employers.map((feature, index) => (
                
                    <div className="bg-gradient-to-br from-blue-50 via-white to-gray-100 rounded-xl p-6 shadow-md hover:shadow-xl transform hover:scale-105 transition duration-300 ease-in-out"key={index}>
                      <div className="mb-4">{feature.icon}</div>
                      <h3 className="text-xl font-semibold text-yellow-700">{feature.title}</h3>
                      <p className='text-gray-600 text-sm leading-relaxed mt-2'>{feature.description}</p>
                   </div>
                  ))}
                </div>

                <div className="text-center mt-16">
                    <Link to="/register" className="inline-block px-8 py-3 bg-yellow-700 text-white font-semibold rounded-lg hover:bg-blue-500 hover:text-black transition duration-300 ease-in-out">Hire Top Talent →</Link>
                </div>

            </div>

            <div className="text-center mt-16">
              <p className="">Join <span className="text-yellow-500">{TITLE}</span>, where success is just a click away. It's Free</p>
            </div>

        </section>
      );
    }

export default Features