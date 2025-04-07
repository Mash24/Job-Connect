import React, { useState } from 'react';
import { auth, db } from '../../../firebase/config';
import { doc, setDoc } from 'firebase/firestore';

const Step1_CompanyInfo = ({ onNext }) => {
  const [form, setForm] = useState({
    companyName: '',
    industry: '',
    companySize: '',
    yearFounded: '',
    companyEmail: '',
    companyPhone: '',
    websiteURL: '',
    companyMission: '',
    whyJoinUs: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    try {
      const user = auth.currentUser;
      const ref = doc(db, 'employers', user.uid);
      await setDoc(ref, form, { merge: true });
      onNext();
    } catch (err) {
      console.error('❌ Failed to save company info:', err);
      alert('Could not save. Please try again.');
    }
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-md border max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Step 1: Company Info</h2>

      {/* Basic Info */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <input name="companyName" value={form.companyName} onChange={handleChange} placeholder="Company Name" className="p-3 border rounded-md" />
        <input name="industry" value={form.industry} onChange={handleChange} placeholder="Industry (e.g. Tech, Finance)" className="p-3 border rounded-md" />
        <input name="companySize" value={form.companySize} onChange={handleChange} placeholder="Company Size (e.g. 10-50)" className="p-3 border rounded-md" />
        <input name="yearFounded" value={form.yearFounded} onChange={handleChange} placeholder="Year Founded (e.g. 2015)" className="p-3 border rounded-md" />
      </div>

      {/* Contact Info */}
      <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
        <input name="companyEmail" value={form.companyEmail} onChange={handleChange} placeholder="Contact Email" className="p-3 border rounded-md" />
        <input name="companyPhone" value={form.companyPhone} onChange={handleChange} placeholder="Contact Phone" className="p-3 border rounded-md" />
        <input name="websiteURL" value={form.websiteURL} onChange={handleChange} placeholder="Company Website (optional)" className="p-3 border rounded-md col-span-full" />
      </div>

      {/* Optional Brand Story */}
      <div className="mt-6 space-y-4">
        <textarea name="companyMission" value={form.companyMission} onChange={handleChange} placeholder="Our Mission (optional)" className="w-full p-3 border rounded-md" rows={3} />
        <textarea name="whyJoinUs" value={form.whyJoinUs} onChange={handleChange} placeholder="Why people should join your company (optional)" className="w-full p-3 border rounded-md" rows={3} />
      </div>

      

      {/* Button */}
      <div className="mt-6 text-right">
        <button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-md">
          Save & Continue →
        </button>
      </div>
    </div>
  );
};

export default Step1_CompanyInfo;