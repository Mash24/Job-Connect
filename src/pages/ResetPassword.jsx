import React, { useState } from 'react'
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from '../firebase/config';
import { Link } from 'react-router-dom';

import BackgroundWrapper from '../components/layouts/BackgroundWrapper'

const ResetPassword = () => {
  const [ email, setEmail ] = useState('')
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false);

  const handleReset = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

        try {
          setLoading(true);
          await sendPasswordResetEmail(auth, email);
          setMessage('Password reset email sent! please check your email for a reset link.');
        } catch (err) {
                console.error('Reset error:', err);
                if (err === 'auth/user-not-found') {
                  setError('No account found with that email address. Please sign up first.');
                } else {
                  setError('Error sending password reset email. Please try again.');
                }
                } finally {
                  setLoading(false);
        }
  };


  return (
    <BackgroundWrapper>
      <div className="flex flex-1 items-center justify-center p-4">
        <div className="bg-white/20 backdrop-blur-md border border-gray-300 shadow-xl p-6 rounded-xl w-full max-w-md text-white">
          <h2 className="text-2xl font-bold text-center mb-4">Reset Password</h2>

          {message && <p className='text-green-400 text-sm mb-2'>{message}</p>}
          {error && <p className='text-red-500 text-sm mb-2'>{error}</p>}

          <form onSubmit={handleReset} className='space-y-4' >
            <input 
              type="email" 
              placeholder='Enter your email address'
              value={email}
              onChange={(e)=>setEmail(e.target.value)}
              autoComplete='username'
              required
              className='w-full px-4 py-2 rounded bg-transparent border border-white placeholder-white'
            />

            <div className="flex justify-center">
            <button
                type='submit'
                disabled={loading}
                className='w-full md:w-auto flex flex-col md:flex-row gap-x-2 items-center justify-center py-2 bg-blue-500 text-white font-semibold rounded hover:bg-red-300 transition duration-300 ease-in-out focus:outline-none'
            >
                {loading ? 'Sending...' : 'Send Reset Link'}
            </button> 
            </div>
          </form>

          <div className="mt-4 text-center text-sm underline cursor-pointer hover:text-blue-500 transition duration-300 ease-in-out">
            <Link to="/login">Back to Login</Link>
          </div>

        </div>
      </div>
    </BackgroundWrapper>
  )
}

export default ResetPassword