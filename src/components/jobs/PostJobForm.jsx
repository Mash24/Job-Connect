// File: /src/components/jobs/PostJobForm.jsx

import React, { useState } from 'react';
import { toast } from 'react-hot-toast';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../../firebase/config';
import { useAuthState } from 'react-firebase-hooks/auth';

/**
 * PostJobForm Component
 * Allows an employer to post a job to the Firestore `jobs` collection.
 * Stores the logo as a base64 image preview (not using Firebase Storage).
 */

const PostJobForm = () => {
  const [user] = useAuthState(auth);

  const [formData, setFormData] = useState({
    title: '',
    type: '',
    location: '',
    isRemote: false,
    salaryMin: '',
    salaryMax: '',
    currency: 'KSH',
    companyName: '',
    companyWebsite: '',
    logoUrl: '', // will hold base64 string if uploaded
    description: '',
    tags: '',
    externalApply: false,
    externalUrl: '',
    deadline: '',
  });

  const [logoPreview, setLogoPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;

    // Handle logo file preview and base64 storage
    if (name === 'logoUrl' && files?.[0]) {
      const file = files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result;
        setLogoPreview(base64String);
        setFormData((prev) => ({
          ...prev,
          logoUrl: base64String, // Save base64 directly
        }));
      };
      reader.readAsDataURL(file);
      return;
    }

    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  // Submit handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

     // ✅ Prevent submission if user is not logged in
  if (!user) {
    toast.error('You must be logged in to post a job.');
    setLoading(false);
    return;
  }

    const { title, type, location, companyName, description} = formData;

    if (!title || !type || !location || !companyName || !description) {
      toast.error('Please fill in all required fields.');
      setLoading(false);
      return;
    }

    try {
      const jobData = {
        ...formData,
        userId: user.uid, // ✅ Added userId for filtering jobs later
        tags: formData.tags.split(',').map((tag) => tag.trim()).filter(Boolean),
        createdAt: serverTimestamp(),
      };

      await addDoc(collection(db, 'jobs'), jobData);
      toast.success('Job posted successfully!');

      setFormData({
        title: '',
        type: '',
        location: '',
        isRemote: false,
        salaryMin: '',
        salaryMax: '',
        currency: 'usd',
        companyName: '',
        companyWebsite: '',
        logoUrl: '',
        description: '',
        tags: '',
        externalApply: false,
        externalUrl: '',
        deadline: '',
      });
      setLogoPreview(null);
    } catch (error) {
      console.error('Error posting job:', error);
      toast.error('Failed to post job. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-2xl shadow-md space-y-8">
      <h2 className="text-2xl font-bold text-gray-800">Post a New Job</h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Grid Inputs Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="text-sm font-medium">Job Title *</label>
            <input
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="w-full mt-1 rounded border px-4 py-2"
              placeholder="e.g. Frontend Developer"
              required
            />
          </div>

          <div>
            <label className="text-sm font-medium">Job Type *</label>
            <select
              name="type"
              value={formData.type}
              onChange={handleChange}
              className="w-full mt-1 rounded border px-4 py-2"
              required
            >
              <option value="">Select Type</option>
              <option>Full-time</option>
              <option>Part-time</option>
              <option>Contract</option>
              <option>Internship</option>
              <option>Freelance</option>
            </select>
          </div>

          <div>
            <label className="text-sm font-medium">Location *</label>
            <input
              name="location"
              value={formData.location}
              onChange={handleChange}
              className="w-full mt-1 rounded border px-4 py-2"
              placeholder="e.g. Nairobi or Remote"
              required
            />
          </div>

          <div className="flex items-center space-x-2 mt-8">
            <input type="checkbox" name="isRemote" checked={formData.isRemote} onChange={handleChange} />
            <label className="text-sm">Remote friendly?</label>
          </div>

          <div>
            <label className="text-sm font-medium">Salary Range (Min)</label>
            <input
              name="salaryMin"
              value={formData.salaryMin}
              onChange={handleChange}
              type="number"
              className="w-full mt-1 rounded border px-4 py-2"
              placeholder="e.g. 40000"
            />
          </div>

          <div>
            <label className="text-sm font-medium">Salary Range (Max)</label>
            <input
              name="salaryMax"
              value={formData.salaryMax}
              onChange={handleChange}
              type="number"
              className="w-full mt-1 rounded border px-4 py-2"
              placeholder="e.g. 80000"
            />
          </div>
        </div>

        {/* Company Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="text-sm font-medium">Company Name *</label>
            <input
              name="companyName"
              value={formData.companyName}
              onChange={handleChange}
              className="w-full mt-1 rounded border px-4 py-2"
              placeholder="e.g. Acme Inc."
              required
            />
          </div>

          <div>
            <label className="text-sm font-medium">Company Website</label>
            <input
              name="companyWebsite"
              value={formData.companyWebsite}
              onChange={handleChange}
              className="w-full mt-1 rounded border px-4 py-2"
              placeholder="e.g. https://acme.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Company Logo (optional)</label>
            <input
              type="file"
              name="logoUrl"
              accept="image/*"
              onChange={handleChange}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
            {logoPreview && (
              <div className="mt-2">
                <p className="text-xs text-gray-500 mb-1">Preview:</p>
                <img
                  src={logoPreview}
                  alt="Logo Preview"
                  className="h-16 w-auto rounded border shadow"
                />
              </div>
            )}
          </div>
        </div>

        {/* Description and Tags */}
        <div>
          <label className="text-sm font-medium">Job Description *</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows="5"
            className="w-full mt-1 rounded border px-4 py-2"
            placeholder="Describe the job responsibilities, qualifications, etc."
            required
          ></textarea>
        </div>

        <div>
          <label className="text-sm font-medium">Skills / Tags (comma-separated)</label>
          <input
            name="tags"
            value={formData.tags}
            onChange={handleChange}
            className="w-full mt-1 rounded border px-4 py-2"
            placeholder="e.g. React, Node.js, Firebase"
          />
        </div>

        {/* Application Settings */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
          <div className="flex items-center gap-2">
            <input type="checkbox" name="externalApply" checked={formData.externalApply} onChange={handleChange} />
            <label className="text-sm">Apply externally?</label>
          </div>

          {formData.externalApply && (
            <input
              name="externalUrl"
              value={formData.externalUrl}
              onChange={handleChange}
              className="w-full rounded border px-4 py-2"
              placeholder="https://apply.company.com/job123"
            />
          )}

          <div className="md:col-span-2">
            <label className="text-sm font-medium">Application Deadline</label>
            <input
              name="deadline"
              value={formData.deadline}
              onChange={handleChange}
              type="date"
              className="w-full mt-1 rounded border px-4 py-2"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="mt-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded"
        >
          {loading ? 'Posting...' : 'Post Job'}
        </button>
      </form>
    </div>
  );
};

export default PostJobForm;