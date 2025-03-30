import React from 'react'

const Contact = () => {
  return (
    <div className='min-h-screen flex items-center justify-center p-6 bg-gradient-to-br from-blue-200 to-white'>
        <div className="max-w-2xl w-full bg-white p-8 rounded-xl shadow-md">
            <h2 className="text-3xl font-bold text-blue-800 mb-6">Contact Us</h2>

            <form  className="space-y-4">
                <input type="text" className="w-full border px-4 py-2 rounded" placeholder="Name"/>
                <input type="email" className="w-full border px-4 py-2 rounded" placeholder="Email"/>
                <textarea placeholder='Your message' rows={5} className="w-full border px-4 py-2 rounded"></textarea>
                <button type="submit" className="bg-blue-700 text-white px-6 py-2 rounded-lg hover:bg-blue-300 transition">Send Message</button>
            </form>

        </div>
    </div>
  )
}

export default Contact