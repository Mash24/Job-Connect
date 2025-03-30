import React from 'react'
import { Link } from "react-router-dom"
import TITLE from '../components/common/Title'

const Hero = () => {
  return (
    <section className="w-full min-h-[90vh]  flex flex-col-reverse md:flex-row items-center justify-between px-6 md:px-20 py-16 bg-gradient-to-r from-blue-700 via-blue-800 to-gray-900 text-white">
      <div className="w-full md:w-1/2 text-center md:text-left space-y-8">
        <h1 className="text-4xl md:text-6xl font-bold leading-tight animate-fade-up"><span className="text-yellow-400 hover:text-yellow-900 transition duration-300 ease-in-out">{TITLE}</span> <br /> Your One Stop For All <br className='hidden md:block' /> <span className='text-gray-500 hover:text-gray-900 transition duration-300 ease-in-out'>Great Job Opportunity</span></h1>
        <p className="text-lg md:text-xl text-gray-200">
          Find your dream job, connect with top employers, and get hired faster with <span className="text-yellow-400 hover:text-yellow-900 transition duration-300 ease-in-out">{TITLE}</span>
        </p>

        <div className="flex flex-col md:flex-row gap-4 md:gap-0">
          <Link to = '/register' className='px-6 py-3 bg-white text-blue-700 font-bold rounded-lg hover:bg-blue-300 transition duration-300 ease-in-out mr-4'>Sign Up Free</Link>
          <Link to = '/login' className='px-6 py-3 border border-white text-white rounded-lg hover:bg-white hover:text-blue-700 transition duration-300 ease-in-out'>Login</Link>
        </div>

      </div>

      <div className="w-full md:w-1/2 mb-10 md:mb-0">
        <img src="/images/job_4.png" alt="People searching for jobs on Job Connect platform" className="w-full max-w-md mx-auto rounded-lg shadow-none border-none"/>
      </div>

    </section>
  )
}

export default Hero
