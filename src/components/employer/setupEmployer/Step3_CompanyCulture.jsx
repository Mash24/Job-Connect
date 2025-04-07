import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { auth, db } from '../../../firebase/config';
import { doc, setDoc } from 'firebase/firestore';
import { FaBullseye, FaHeart, FaPlusCircle, FaTrash } from 'react-icons/fa';

const Step3_CompanyCulture = ({ onNext, onBack }) => {
  const [mission, setMission] = useState('');
  const [valueInput, setValueInput] = useState('');
  const [values, setValues] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleAddValue = () => {
    if (valueInput.trim() && !values.includes(valueInput.trim())) {
      setValues([...values, valueInput.trim()]);
      setValueInput('');
    }
  };

  const handleRemoveValue = (val) => {
    setValues(values.filter((v) => v !== val));
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      const user = auth.currentUser;
      if (!user) throw new Error("User not logged in");

      const ref = doc(db, 'employers', user.uid);
      await setDoc(ref, {
        mission,
        values,
      }, { merge: true });

      onNext();
    } catch (err) {
      console.error('❌ Failed to save culture info:', err);
      alert('Could not save. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white p-8 rounded-2xl shadow-lg border max-w-2xl mx-auto"
    >
      <h2 className="text-2xl font-bold mb-6 text-gray-800 flex items-center gap-2">
        <FaBullseye className="text-blue-500" /> Step 3: Your Culture Matters
      </h2>

      {/* Mission Statement */}
      <label className="block mb-2 text-sm font-medium text-gray-700">
        ✨ What's your company mission?
      </label>
      <textarea
        value={mission}
        onChange={(e) => setMission(e.target.value)}
        placeholder="Tell us in 1–2 sentences what drives your company..."
        rows="4"
        maxLength="300"
        className="w-full border px-4 py-3 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <div className="text-xs text-right text-gray-400 mb-4">{mission.length}/300 characters</div>

      {/* Core Values */}
      <label className="block mb-2 text-sm font-medium text-gray-700">
        💡 Core Values (one by one)
      </label>
      <div className="flex gap-2 mb-3">
        <input
          type="text"
          value={valueInput}
          onChange={(e) => setValueInput(e.target.value)}
          placeholder="e.g. Innovation"
          className="flex-1 border px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <button
          type="button"
          onClick={handleAddValue}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 flex items-center gap-1"
        >
          <FaPlusCircle /> Add
        </button>
      </div>

      {values.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-6">
          {values.map((val, idx) => (
            <div
              key={idx}
              className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full flex items-center gap-2"
            >
              {val}
              <FaTrash
                className="text-xs cursor-pointer hover:text-red-500"
                onClick={() => handleRemoveValue(val)}
              />
            </div>
          ))}
        </div>
      )}

      {/* Buttons */}
      <div className="flex justify-between mt-8">
        <button
          onClick={onBack}
          className="px-5 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded transition"
        >
          ← Back
        </button>
        <button
          onClick={handleSave}
          disabled={loading}
          className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded font-semibold transition disabled:opacity-50"
        >
          {loading ? 'Saving...' : 'Save & Continue →'}
        </button>
      </div>
    </motion.div>
  );
};

export default Step3_CompanyCulture;