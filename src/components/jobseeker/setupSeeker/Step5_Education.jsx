import React, { useState } from 'react';
import { auth, db } from '../../../firebase/config';
import { doc, setDoc } from 'firebase/firestore';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { FaPlusCircle } from 'react-icons/fa';

const educationLevels = [
  'High School Diploma',
  'Associate Degree',
  "Bachelor's Degree",
  "Master's Degree",
  'PhD / Doctorate',
  'Diploma / Certificate',
  'Other'
];

const Step5_Education = ({ onNext }) => {
  const [educationList, setEducationList] = useState([createBlankEducation()]);
  const [loading, setLoading] = useState(false);

  function createBlankEducation() {
    return {
      institution: '',
      educationLevel: '',
      fieldOfStudy: '',
      startDate: null,
      endDate: null,
      currentlyStudying: false,
      notes: ''
    };
  }

  const handleChange = (index, e) => {
    const { name, value, type, checked } = e.target;
    const updated = [...educationList];
    updated[index][name] = type === 'checkbox' ? checked : value;
    setEducationList(updated);
  };

  const handleDateChange = (index, field, date) => {
    const updated = [...educationList];
    updated[index][field] = date;
    setEducationList(updated);
  };

  const addEducation = () => {
    setEducationList([...educationList, createBlankEducation()]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const user = auth.currentUser;
      if (!user) throw new Error('User not authenticated');

      const userRef = doc(db, 'jobSeekers', user.uid);
      await setDoc(userRef, { education: educationList }, { merge: true });

      onNext();
    } catch (err) {
      console.error('Error saving education:', err);
      alert('Failed to save. Try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='max-w-4xl mx-auto bg-white shadow-md p-8 rounded-lg'>
      <h2 className="text-2xl font-bold mb-6 text-blue-700">Step 5: Education & Certifications</h2>

      <form onSubmit={handleSubmit} className='space-y-6'>
        {educationList.map((edu, index) => (
          <div key={index} className='border p-4 rounded-md space-y-4 bg-gray-50'>
            <input
              type='text'
              name='institution'
              placeholder='Institution Name'
              value={edu.institution}
              onChange={(e) => handleChange(index, e)}
              className='w-full border px-4 py-2 rounded'
            />

            <select
              name='educationLevel'
              value={edu.educationLevel}
              onChange={(e) => handleChange(index, e)}
              className='w-full border px-4 py-2 rounded'
            >
              <option value=''>Select Education Level</option>
              {educationLevels.map((level) => (
                <option key={level}>{level}</option>
              ))}
            </select>

            <input
              type='text'
              name='fieldOfStudy'
              placeholder='Field of Study'
              value={edu.fieldOfStudy}
              onChange={(e) => handleChange(index, e)}
              className='w-full border px-4 py-2 rounded'
            />

            <div className='flex gap-4'>
              <div className='flex-1'>
                <label className='block text-sm mb-1'>Start Date</label>
                <DatePicker
                  selected={edu.startDate}
                  onChange={(date) => handleDateChange(index, 'startDate', date)}
                  className='w-full border px-4 py-2 rounded'
                />
              </div>
              <div className='flex-1'>
                <label className='block text-sm mb-1'>End Date</label>
                <DatePicker
                  selected={edu.endDate}
                  onChange={(date) => handleDateChange(index, 'endDate', date)}
                  disabled={edu.currentlyStudying}
                  className='w-full border px-4 py-2 rounded'
                />
                <label className='text-sm'>
                  <input
                    type='checkbox'
                    name='currentlyStudying'
                    checked={edu.currentlyStudying}
                    onChange={(e) => handleChange(index, e)}
                    className='mr-2'
                  /> Currently Studying Here
                </label>
              </div>
            </div>

            <textarea
              name='notes'
              placeholder='Additional Notes or Certifications (Optional)'
              value={edu.notes}
              onChange={(e) => handleChange(index, e)}
              className='w-full border px-4 py-2 rounded'
              rows={3}
            />
          </div>
        ))}

        <button
          type='button'
          onClick={addEducation}
          className='flex items-center gap-2 text-blue-600 hover:text-blue-800'
        >
          <FaPlusCircle /> Add Another Education
        </button>

        <div className='text-right'>
          <button
            type='submit'
            disabled={loading}
            className='bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-800'
          >
            {loading ? 'Saving...' : 'Save & Continue'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Step5_Education;