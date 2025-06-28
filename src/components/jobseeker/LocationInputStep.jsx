import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaCity, FaGlobeAmericas, FaLocationArrow, FaMapMarkedAlt, FaMapPin } from 'react-icons/fa';
import countryList from 'react-select-country-list';

const LocationInputStep = ( {onSave}) => {
  const [ locationData, setLocationData ] = useState({
    country: '',
    city: '',
    zip: '',
    address: '',
  });

  const countries = countryList().getData();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLocationData((prev) => ({ ...prev, [name]: value }));
  };

  const handleUseMyLocation = () => {
    if (!navigator.geolocation) return alert ('Geolocation is not supported by your browser.');

    navigator.geolocation.getCurrentPosition(async(position) => {
      const { latitude, longitude } = position.coords;

      try {
        const response = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`);

        const data = await response.json();
        console.log(data); // Debugging: Checking the response data structure

        if (data) {
          const formatted = {
            country: data.address?.country || '',
            city: data.address?.city || data.address?.town || data.address?.village || '',
            zip: data.address?.postcode || '',
            address: data.address?.road || data.address?.display_name || '',
          };

          setLocationData(formatted);
        }
        
      } catch (error) {
        console.error("Error fetching location:", error);
        alert("Failed to fetch location data")
      }
    }, (error) => {
      console.error("Geolocation error:", error);
      alert("Sorry, unable to retrieve your location");
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(locationData);
  };

  return (
    <motion.div>
      <h2 className="text-xl p-6 rounded-lg shadow-lg w-full max-w-2xl mx-auto">📍 Location Information</h2>
      <button onClick={handleUseMyLocation} className="text-blue-600 text-sm underline mb-4">
        <FaLocationArrow className='inline mr-2' /> Use My Current Location
      </button>

      <p className="text-gray-400 text-sm mb-4">Or fill out manually below:</p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex items-center gap-2">
          <FaGlobeAmericas className='text-blue-500' />
          <select 
            name="country"
            value={locationData.country}
            onChange={handleChange}
            className='w-full border px-4 py-2 rounded'
            required
          >
            <option value="">Select a country</option>
            {countries.map((country) => (
              <option key={country.label} value={country.label}>{country.label}</option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2">
          <FaCity className='text-blue-500' />
          <input
            type='text'
            name='city'
            value={locationData.city}
            onChange={handleChange}
            placeholder='City'
            className='w-full border px-4 py-2 rounded'
            required
          />
        </div>

        <div className="flex items-center gap-2">
          <FaMapPin className='text-blue-500' />
          <input
            type='number'
            name='zip'
            value={locationData.zip}
            onChange={handleChange}
            placeholder='Zip Code'
            className='w-full border px-4 py-2 rounded'
            required
          />
        </div>

        <div className="flex items-center gap-2">
          <FaMapMarkedAlt className='text-blue-500' />
          <input
            type='text'
            name='address'
            value={locationData.address}
            onChange={handleChange}
            placeholder='Full Address'
            className='w-full border px-4 py-2 rounded'
            required
          />
        </div>

        <div className="text-right">
          <button type='submit' className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-800">Save & Continue </button>
        </div>
      </form>
    </motion.div>
  );
};

export default LocationInputStep