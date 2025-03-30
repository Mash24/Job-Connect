import React from 'react'
import { Link } from "react-router-dom";

import TITLE from '../common/Title'

const Navbar = () => {
  return (
    <nav className="w-full fixed top-0 left-0 z-50 bg-white/30 backdrop-blur-md shadow-md px-4 py-2">
      <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
        <Link to = "/" 
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="text-2xl font-bold text-blue-700 hover:text-red-600 transition-all duration-150 ease-in-out">
                {TITLE}
          </Link>

        <ul className="hidden md:flex gap-6 text-gray-800 font-medium cursor-pointer">
          <li> <a href='#features' className="hover:text-blue-500">Feature</a></li>
          <li> <a href='#how-it-work' className="hover:text-blue-500">How It Works</a></li>
          <li> <a href='#testimonials' className="hover:text-blue-500">Testimonials</a></li>
          <li> <Link to = '/contact' className="hover:text-blue-500">Contact</Link></li>
        </ul>

        {/* Auth Buttons */}
        <div className="flex gap-3">
          <Link to="/login" className="px-4 py-1 border border-blue-600 text-blue-600 rounded hover:bg-green-600 hover:text-white transition-all duration-150 ease-in-out">Login</Link>
          <Link to="/register" className="px-4 py-1 bg-blue-600 text-white rounded hover:bg-red-600 hover:text-white transition-all duration-150 ease-in-out">Sign Up</Link>
        </div>

      </div>
    </nav>
  )
}

export default Navbar