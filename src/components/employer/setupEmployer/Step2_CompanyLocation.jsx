import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaBuilding, FaGlobeAmericas, FaCity, FaMapPin, FaMapMarkedAlt, FaLocationArrow } from 'react-icons/fa';
import countryList from 'react-select-country-list';
import { auth, db } from '../../../firebase/config';
import { doc, setDoc } from 'firebase/firestore';

const Step2_CompanyLocation = ({ onNext, onBack }) => {
  const [useCurrentLocation, setUseCurrentLocation] = useState(false);
  const [locationData, setLocationData] = useState({
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
    setUseCurrentLocation(true);
    if (!navigator.geolocation) return alert('Geolocation is not supported by your browser.');

    navigator.geolocation.getCurrentPosition(async (position) => {
      const { latitude, longitude } = position.coords;

      try {
        const response = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`);
        const data = await response.json();

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
        alert("Failed to fetch location data");
      }
    }, (error) => {
      console.error("Geolocation error:", error);
      alert("Sorry, unable to retrieve your location");
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const user = auth.currentUser;
      if (!user) throw new Error("User not logged in");

      const ref = doc(db, 'employers', user.uid);
      await setDoc(ref, { location: locationData }, { merge: true });

      console.log("📍 Company location saved");
      await onNext(locationData); // Pass location data to the next step
    } catch (err) {
      console.error("❌ Error saving company location:", err);
      alert("Could not save location. Please try again.");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="bg-white p-8 rounded-2xl shadow-xl border max-w-2xl mx-auto"
    >
      <h2 className="text-2xl font-bold mb-6 text-gray-800 flex items-center gap-2">
        <FaBuilding className="text-blue-500" /> Step 2: Where’s Your Office?
        </h2>

      <button onClick={handleUseMyLocation} className="text-blue-600 text-sm underline mb-4 flex items-center gap-2">
        <FaLocationArrow /> Use My Current Location
      </button>

      <p className="text-gray-500 text-sm mb-4">You can either auto-fill your company’s address or manually enter your workplace location.</p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex items-center gap-3">
          <FaGlobeAmericas className="text-blue-500" />
          <select
            name="country"
            value={locationData.country}
            onChange={handleChange}
            className="w-full border px-4 py-2 rounded"
            required
          >
            <option value="">Select your country</option>
            {countries.map((country) => (
              <option key={country.label} value={country.label}>{country.label}</option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-3">
          <FaCity className="text-blue-500" />
          <input
            type="text"
            name="city"
            value={locationData.city}
            onChange={handleChange}
            placeholder="City"
            className="w-full border px-4 py-2 rounded"
            required
          />
        </div>

        <div className="flex items-center gap-3">
          <FaMapPin className="text-blue-500" />
          <input
            type="number"
            name="zip"
            value={locationData.zip}
            onChange={handleChange}
            placeholder="Zip Code"
            className="w-full border px-4 py-2 rounded"
            required
          />
        </div>

        <div className="flex items-center gap-3">
          <FaMapMarkedAlt className="text-blue-500" />
          <input
            type="text"
            name="address"
            value={locationData.address}
            onChange={handleChange}
            placeholder="Street Address (eg. 123 Main St, Apt 4B) or Company HQ"
            className="w-full border px-4 py-2 rounded"
            required
          />
        </div>

        <div className="flex justify-between mt-6">
          <button
            type="button"
            onClick={onBack}
            className="px-5 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded transition"
          >
            ← Back
          </button>
          <button
            type="submit"
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded font-semibold transition"
          >
            Save & Continue →
          </button>
        </div>
      </form>
    </motion.div>
  );
};

export default Step2_CompanyLocation;