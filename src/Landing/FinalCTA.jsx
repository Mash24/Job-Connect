import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import TITLE from '../components/common/Title'

const FinalCTA = () => {
  return (
    <section className="w-full py-24 px-6 md:px-20 bg-gradient-to-br from-blue-900 via-blue-950 to-black text-white">
      <motion.div
        initial = {{ opacity: 0, y: 50 }}
        whileInView = {{ opacity: 1, y: 0 }}
        transition = {{ duration: 0.8 }}
        className='text-center max-w-3xl mx-auto'
      >
        <h2 className="text-4xl md:text-5xl font-bold mb-4">Your Next Big Opportunity Starts <span className="text-yellow-400">NOW!</span></h2>
        <p className="text-gray-300 text-lg mb-6">Join thousands of professionals {TITLE} to grow their careers & teams</p>

        <div className="flex flex-col md:flex-row gap-4 justify-center mb-8">
          <Link to = '/register' className='px-8 py-4 bg-yellow-500 text-black font-bold rounded-lg hover:bg-yellow-100 transition duration-300'>🔎 Find a Job Now</Link>
          <Link to = '/register' className='px-8 py-4 bg-white text-blue-800 font-bold rounded-lg hover:bg-gray-500 transition duration-300'>📌 Post a Job</Link>
        </div>

        <p className="italic text-sm text-gray-400">"Success is just one connection away. Take action now!"</p>
      </motion.div>

      {/* Trust Companies Logos */}
      <motion.div
        initial = {{ opacity: 0, scale: 0.95}}
        whileInView = {{ opacity: 1, scale: 1 }}
        transition = {{ duration: 0.6, delay: 0.3 }}
        viewport = {{ once: true }}
        className = 'mt-16 flex flex-wrap justify-center gap-16 opacity-80'
        >
          <img src="images/HubSpot-Logo.png" alt="HubSpot" className='h-10 filter invert brightness-200'/>
          <img src="images/Glassdoor_Logo_2023.svg" alt="Glassdoor" className='h-10'/>
          <img src="images/notion-logo.png" alt="Notion" className='h-10 filter invert brightness-200'/>
          <img src="images/Lorem-ipsum.avif" alt="Lorem ipsum" className='h-10'/>
          <img src="images/Slack-logo.png" alt="Slack" className='h-10 filter invert brightness-200'/>
      </motion.div>
    </section>
  )
}

export default FinalCTA