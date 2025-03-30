import React from 'react'
import { Link } from 'react-router-dom'
import { FaFacebookF, FaTwitter, FaLinkedinIn, FaInstagram } from 'react-icons/fa';
import TITLE from '../common/Title'

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-10 px-6 md:px-20">
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10">

        {/* Brand and About */}
        <div>
        <Link to="/" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="text-2xl font-bold text-yellow-400 hover:text-white transition duration-300">
              {TITLE}
          </Link>          
          <p className="mt-4 text-gray-400 text-sm">Connecting job seekers with top employers and companies across the globe.</p>
        </div>

        {/* Quick links */}
        <div>
          <h3 className="text-lg font-semibold mb-2">Quick Links</h3>
          <ul className="space-y-2 text-gray-400 text-sm">
            <li><a href="#features" className='hover:text-white'>Features</a></li>
            <li><a href="#how-it-work" className='hover:text-white'>How It Works</a></li>
            <li><a href="#testimonials" className='hover:text-white'>Testimonials</a></li>
            <li><a href="#contact" className='hover:text-white'>Contact</a></li>
          </ul>
        </div>

        {/* Account */}
        <div>
          <h3 className="text-lg font-semibold mb-2">Account</h3>
          <ul className="space-y-2 text-gray-400 text-sm">
            <li><Link to= '/login' className="hover:text-white">Login</Link></li>
            <li><Link to= '/register' className="hover:text-white">Sign Up</Link></li>
            <li><Link to= '/reset-password' className="hover:text-white">Reset Password</Link></li>
          </ul>
        </div>

        {/* Social Media Links */}
        <div>
          <h3 className="text-lg font-semibold mb-2">Follow Us</h3>
          <div className="flex space-x-4 mt-2">
            <a href="https://web.facebook.com/" target='_blank' rel='noopener noreferrer' className='text-gray-400 hover:text-white-xl'><FaFacebookF/></a>
            <a href="https://twitter.com/" target='_blank' rel='noopener noreferrer' className='text-gray-400 hover:text-white-xl'><FaTwitter/></a>
            <a href="https://www.linkedin.com/" target='_blank' rel='noopener noreferrer' className='text-gray-400 hover:text-white-xl'><FaLinkedinIn/></a>
            <a href="https://www.instagram.com/" target='_blank' rel='noopener noreferrer' className='text-gray-400 hover:text-white-xl'><FaInstagram/></a>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="text-center text-gray-500 text-sm-10 border-t border-gray-700 py-4">
        &copy; {new Date().getFullYear()} <span className="text-yellow-400">{TITLE}</span>. All rights reserved.
      </div>
    </footer>
  )
}

export default Footer