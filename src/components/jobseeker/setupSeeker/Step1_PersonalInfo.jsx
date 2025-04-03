import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { auth, db } from  '../../../firebase/config'
import { doc, setDoc } from 'firebase/firestore';

const Step1_PersonalInfo = ({ onNext }) => {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: auth.currentUser?.email || '',
        phone: '',
        location: '',
        profilePicture: null
    });


    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect (() =>{
        const user = auth.currentUser;
        if (user) {
            setFormData(prev => ({...prev, email: user.email}));
        }
    }, [])

    const handleChange = (e) => {
        const { name, value, files } = e.target;

        if (files && files[0]) {
            const file = files[0];
            setFormData((prev) => ({ ...prev, [name]: file, profilePicturePreview: URL.createObjectURL(file), }));
        } else {
            setFormData((prev) => ({ ...prev, [name]: value }));
            }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const user = auth.currentUser;
            const userRef = doc(db, 'jobSeekers', user.uid);
            const payload = {...formData};
            delete payload.profilePicture; // remove the profile picture from the payload and handle it separately.

            await setDoc(userRef, payload, { merge: true});
                console.log('Data saved successfully');
            onNext();
        } catch (err) {
            setError('Failed to save. Please try again.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };


  return (
    <motion.div
        className="max-w-2xl mx-auto bg-white shadow-lg p-8 rounded-lg"
        initial={{ opacity: 0, y:30 }}
        animate={{ opacity: 1, y:0 }}
        transition={{ duration: 0.5 }}
    >
        <h2 className='text-2xl font-bold mb-6 text-blue-700'>Step 1: Personal Information</h2>
         {/* <p>Debug: Component is rendering</p>                                       Debug */}
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <form onSubmit={handleSubmit} className='space-y-4'>
            <input 
                type="text"
                name="firstName"
                placeholder="First Name"
                value={formData.firstName}
                onChange={handleChange}
                required
                className='w-full border px-4 py-4 rounded'
            />

            <input 
                type="text"
                name="lastName"
                placeholder="Last Name"
                value={formData.lastName}
                onChange={handleChange}
                required
                className='w-full border px-4 py-2 rounded'
            />

            <input 
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                readOnly
                className="w-full border px-4 py-2 rounded bg-gray-100 cursor-not-allowed" 
            />

            <input 
                type="tel"
                name="phone"
                placeholder="Phone Number"
                value={formData.phone}
                onChange={handleChange}
                required
                className="w-full border px-4 py-2 rounded" 
            />

            <label htmlFor="dob" className='block text-gray-700 font-medium'>Date of Birth</label>
            <input 
            type="date"
            id='dob' 
            name='dob'
            value={formData.dob}
            onChange={handleChange}
            max={new Date(). toISOString().split("T")[0]} // Restricts fure dates. Late filter to ensure no one below age of 18 years can proceed
            className="w-full border px-4 py-2 rounded focus:ring-2 focus:ring-blue-500 focus:outline-none" 
            />

            <label htmlFor="profilePicture" className='block text-gray-700 font-medium'>Upload Profile Picture</label>
            <input 
            type="file"
            name="profilePicture"
            onChange={handleChange}
            className="w-full px-4" 
            />

            {formData.profilePicturePreview && (
                <img src={formData.profilePicturePreview} alt="Profile Preview" className="w-auto h-24 object-cover border-2 border-gray-300 shadow-md rounded-full mt-2" />
            )}

            <div className="flex justify-end">
                <button 
                    type="submit"
                    disabled = {loading}
                    className="bg-blue-500 text-white px-6 py-2 mt-6 rounded hover:bg-blue-900" 
                >
                    {loading ? 'Saving...' : 'Next'}
                </button>
            </div>
        </form>
    </motion.div>
  );
};

export default Step1_PersonalInfo;