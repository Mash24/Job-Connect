import React, { useState } from 'react';
import { auth, db } from '../../../firebase/config';
import { doc, setDoc } from 'firebase/firestore';
import Select from 'react-select';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { FaPlusCircle } from 'react-icons/fa';

const employmentTypes = [
  'Full-time', 'Part-time', 'Freelance', 'Contract', 'Internship'
];

const industries = [
  'Technology', 'Finance', 'Marketing', 'Design', 'Healthcare', 'Education', 'Engineering', 'Other'
];

const companySizes = ['Startup', 'Medium', 'Large'];

const techSkills = [
  'React', 'Node.js', 'Python', 'AWS', 'Git', 'SQL', 'SEO', 'Google Ads', 'Excel', 'Project Management'
];

const Step4_Experience = ({ onNext }) => {
  const [experiences, setExperiences] = useState([createBlankExperience()]);
  const [loading, setLoading] = useState(false);

  function createBlankExperience() {
    return {
      jobTitle: '',
      companyName: '',
      companyLocation: '',
      companyWebsite: '',
      employmentType: '',
      startDate: new Date(),
      endDate: new Date(),
      currentlyWorking: false,
      responsibilities: '',
      skillsUsed: [],
      industry: '',
      companySize: '',
      summary: ''
    };
  }

  const handleChange = (index, e) => {
    const { name, value, type, checked } = e.target;
    const updated = [...experiences];
    updated[index][name] = type === 'checkbox' ? checked : value;
    setExperiences(updated);
  }

  const handleSkillChange = (index, selected) => {
    const updated = [...experiences];
    updated[index].skillsUsed = selected.map(s => s.value);
    setExperiences(updated);
  }

  const handleDateChange = (index, field, date) => {
    const updated = [...experiences];
    updated[index][field] = date;
    setExperiences(updated);
  };

  const addExperience = () => {
    setExperiences([...experiences, createBlankExperience()]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
  
    try {
      const user = auth.currentUser;
  
      if (!user) {
        alert("User is not authenticated");
        return;
      }
  
      // Safely sanitize experiences before sending to Firestore
      const cleanedExperiences = experiences.map(exp => ({
        jobTitle: exp.jobTitle || '',
        companyName: exp.companyName || '',
        companyLocation: exp.companyLocation || '',
        companyWebsite: exp.companyWebsite || '',
        employmentType: exp.employmentType || '',
        startDate: exp.startDate || null,
        endDate: exp.endDate || null,
        currentlyWorking: !!exp.currentlyWorking,
        responsibilities: exp.responsibilities || '',
        skillsUsed: exp.skillsUsed || [],
        industry: exp.industry || '',
        companySize: exp.companySize || '',
        summary: exp.summary || ''
      }));
  
      const userRef = doc(db, "jobSeekers", user.uid);
      await setDoc(userRef, { workExperience: cleanedExperiences }, { merge: true });
  
      onNext();
    } catch (err) {
      console.error("Error saving experience:", err);
      alert("Failed to save. Please try again.");
    } finally {
      setLoading(false);
    }
  };
    

  return (
    <div
      className='max-w-4xl mx-auto bg-white shadow-md p-8 rounded-lg'
    >

      <h2 className="text-2xl font-bold mb-6 text-blue-700">Step 4: Work Experience</h2>
      <form onSubmit={handleSubmit} className='space-y-6'>
        {experiences.map((exp, index) => (
          <div 
            key={index} name = 'jobTitle' 
            placeholder='Job Title' 
            value={exp.jobTitle} 
            onChange={e => handleChange(index, e)} 
            className="border p-4 rounded-md space-y-4 bg-gray-50"
            required
          >
          
          <input type="text" name="jobTitle" placeholder="Job Title" value={exp.jobTitle} onChange={e => handleChange(index, e)} className="w-full border px-4 py-2 rounded" required />
          <input type="text" name="companyName" placeholder="Company Name" value={exp.companyName} onChange={e => handleChange(index, e)} className="w-full border px-4 py-2 rounded" required />
          <input type="text" name="companyLocation" placeholder="Location (City, Country) or Remote" value={exp.companyLocation} onChange={e => handleChange(index, e)} className="w-full border px-4 py-2 rounded" />
          <input type="url" name="companyWebsite" placeholder="Company Website (optional)" value={exp.companyWebsite} onChange={e => handleChange(index, e)} className="w-full border px-4 py-2 rounded" />

          <div className="flex flex-col gap-2">
          <label>Employment Type</label>
          <select name="employmentType" value={exp.employmentType} onChange={e => handleChange(index, e)} className="w-full border px-4 py-2 rounded">
            <option value="">Select Type</option>
            {employmentTypes.map(type => <option key={type}>{type}</option>)}
          </select>
        </div>

        <div className="flex gap-4">
          <div className="flex-1">
            <label>Start Date</label>
            <DatePicker selected={exp.startDate} onChange={date => handleDateChange(index, 'startDate', date)} className="w-full border px-4 py-2 rounded" />
              </div>
              <div className="flex-1">
                <label>End Date</label>
                <DatePicker
                  selected={exp.endDate}
                  onChange={date => handleDateChange(index, 'endDate', date)}
                  disabled={exp.currentlyWorking}
                  className="w-full border px-4 py-2 rounded"
                />
                <label className="text-sm">
                  <input type="checkbox" name="currentlyWorking" checked={exp.currentlyWorking} onChange={e => handleChange(index, e)} className="mr-2" />
                  Currently Working Here
                </label>
              </div>
            </div>

            <textarea name="responsibilities" placeholder="Key Responsibilities / Achievements (Use bullet points)" value={exp.responsibilities} onChange={e => handleChange(index, e)} className="w-full border px-4 py-2 rounded" rows={4} />

            <div>
              <label className="block mb-1">Skills / Technologies Used</label>
              <Select
                isMulti
                options={techSkills.map(skill => ({ value: skill, label: skill }))}
                onChange={(selected) => handleSkillChange(index, selected)}
                className="text-sm"
              />
            </div>

            <div>
              <label className="block mb-1">Industry</label>
              <select name="industry" value={exp.industry} onChange={e => handleChange(index, e)} className="w-full border px-4 py-2 rounded">
                <option value="">Select Industry</option>
                {industries.map(ind => <option key={ind}>{ind}</option>)}
              </select>
            </div>

            <div>
              <label className="block mb-1">Company Size</label>
              <select name="companySize" value={exp.companySize} onChange={e => handleChange(index, e)} className="w-full border px-4 py-2 rounded">
                <option value="">Select Size</option>
                {companySizes.map(size => <option key={size}>{size}</option>)}
              </select>
            </div>

            <textarea name="summary" placeholder="Optional Summary (max 500 characters)" value={exp.summary} onChange={e => handleChange(index, e)} className="w-full border px-4 py-2 rounded" rows={2} maxLength={500} />
          </div>
        ))}

        <button type="button" onClick={addExperience} className="flex items-center gap-2 text-blue-600 hover:text-blue-800">
          <FaPlusCircle /> Add Another Job 
          </button>

          <div className="text-right">
          <button type="submit" disabled={loading} className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-800">
            {loading ? 'Saving...' : 'Save & Continue'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Step4_Experience