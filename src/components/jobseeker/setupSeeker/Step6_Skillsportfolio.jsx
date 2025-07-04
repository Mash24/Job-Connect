import React, { useState } from 'react';
import { auth, db } from '../../../firebase/config';
import { doc, setDoc } from 'firebase/firestore';
import Select from 'react-select';
import makeAnimated from 'react-select/animated';
import { FaPlusCircle } from 'react-icons/fa';

const animatedComponents = makeAnimated();

const skillOptions = [
  { label: 'JavaScript', value: 'JavaScript' },
  { label: 'Python', value: 'Python' },
  { label: 'React', value: 'React' },
  { label: 'Excel', value: 'Excel' },
  { label: 'Figma', value: 'Figma' },
  { label: 'Copywriting', value: 'Copywriting' },
  { label: 'Sales Strategy', value: 'Sales Strategy' },
];

const softSkillOptions = [
  { label: 'Teamwork', value: 'Teamwork' },
  { label: 'Leadership', value: 'Leadership' },
  { label: 'Communication', value: 'Communication' },
  { label: 'Problem Solving', value: 'Problem Solving' },
];

const Step6_Skillsportfolio = ({ onNext }) => {
  const [formData, setFormData] = useState({
    hardSkills: [],
    softSkills: [],
    languages: '',
    portfolioLinks: [''],
    resumeFile: null,
    otherFiles: []
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePortfolioLinkChange = (index, value) => {
    const updatedLinks = [...formData.portfolioLinks];
    updatedLinks[index] = value;
    setFormData((prev) => ({ ...prev, portfolioLinks: updatedLinks }));
  };

  const addPortfolioLink = () => {
    setFormData((prev) => ({ ...prev, portfolioLinks: [...prev.portfolioLinks, ''] }));
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    if (name === 'resumeFile') {
      setFormData((prev) => ({ ...prev, resumeFile: files[0] }));
    } else {
      setFormData((prev) => ({ ...prev, otherFiles: [...prev.otherFiles, ...files] }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const user = auth.currentUser;
      if (!user) throw new Error('User not authenticated');
      const userRef = doc(db, 'jobSeekers', user.uid);
      const data = {
        skillsPortfolio: {
          hardSkills: formData.hardSkills,
          softSkills: formData.softSkills,
          languages: formData.languages,
          portfolioLinks: formData.portfolioLinks,
          // Uploading files to Firebase Storage would go here
        }
      };
      await setDoc(userRef, data, { merge: true });
      onNext();
    } catch (err) {
      console.error('Error saving:', err);
      alert('Failed to save. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto bg-white shadow-md p-8 rounded-lg">
      <h2 className="text-2xl font-bold mb-6 text-blue-700">Step 6: Skills & Portfolio</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block mb-1">Hard Skills</label>
          <Select
            isMulti
            options={skillOptions}
            components={animatedComponents}
            onChange={(selected) => setFormData((prev) => ({ ...prev, hardSkills: selected.map(s => s.value) }))}
          />
        </div>

        <div>
          <label className="block mb-1">Soft Skills</label>
          <Select
            isMulti
            options={softSkillOptions}
            components={animatedComponents}
            onChange={(selected) => setFormData((prev) => ({ ...prev, softSkills: selected.map(s => s.value) }))}
          />
        </div>

        <label className='block mb-1'>Languages Spoken</label>
        <input
          type="text"
          name="languages"
          placeholder="(e.g., English, Swahili)"
          value={formData.languages}
          onChange={handleChange}
          className="w-full border px-4 py-2 rounded"
        />

        <div className="space-y-2">
          <label className="block">Portfolio Links</label>
          {formData.portfolioLinks.map((link, i) => (
            <input
              key={i}
              type="url"
              placeholder="https://..."
              value={link}
              onChange={(e) => handlePortfolioLinkChange(i, e.target.value)}
              className="w-full border px-4 py-2 rounded"
            />
          ))}
          <button type="button" onClick={addPortfolioLink} className="text-blue-600 flex items-center gap-1">
            <FaPlusCircle /> Add another link
          </button>
        </div>

        <div>
          <label className="block mb-1">Upload Resume</label>
          <input type="file" name="resumeFile" accept=".pdf,.doc,.docx" onChange={handleFileChange} />
        </div>

        <div>
          <label className="block mb-1">Upload Work Samples</label>
          <input type="file" name="otherFiles" multiple onChange={handleFileChange} />
        </div>

        <div className="text-right">
          <button type="submit" disabled={loading} className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-800">
            {loading ? 'Saving...' : 'Save & Continue'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Step6_Skillsportfolio;
// This code is a React component for a job seeker's setup process, specifically the skills and portfolio step. It uses Firebase for authentication and Firestore for data storage. The component allows users to select hard and soft skills, input languages, add portfolio links, and upload files. The component is styled with Tailwind CSS classes.
// The code also includes a button to add more portfolio links dynamically. The component is designed to be part of a multi-step setup process for job seekers.