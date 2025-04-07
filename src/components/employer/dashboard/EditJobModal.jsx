import React, { useEffect, useState } from 'react';
import { updateDoc, doc, deleteDoc } from 'firebase/firestore';
import { db } from '../../../firebase/config';
import { toast } from 'react-hot-toast';

const EditJobModal = ({ job, isOpen, onClose }) => {
  const [formData, setFormData] = useState({ ...job });
  const [logoPreview, setLogoPreview] = useState(job.logoUrl || '');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (job) {
      setFormData({ ...job });
      setLogoPreview(job.logoUrl || '');
    }
  }, [job]);

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    if (name === 'logoUrl' && files?.[0]) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result);
        setFormData((prev) => ({ ...prev, logoUrl: reader.result }));
      };
      reader.readAsDataURL(files[0]);
      return;
    }
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleUpdate = async () => {
    if (!formData.title || !formData.companyName || !formData.description) {
      toast.error('Please fill in all required fields.');
      return;
    }
  
    const confirmed = window.confirm('Are you sure you want to update this job?');
    if (!confirmed) return;
  
    setLoading(true);
    try {
      const jobRef = doc(db, 'jobs', job.id);
      const updatedData = {
        ...formData,
        tags: typeof formData.tags === 'string'
          ? formData.tags.split(',').map(tag => tag.trim()).filter(Boolean)
          : formData.tags,
      };
  
      await updateDoc(jobRef, updatedData);
      toast.success('Job updated successfully!');
      onClose();
    } catch (err) {
      console.error(err);
      toast.error('Failed to update job.');
    } finally {
      setLoading(false);
    }
  };
   

  const handleDelete = async () => {
    const confirmed = window.confirm('Are you sure you want to delete this job?');
    if (!confirmed) return;

    try {
      await deleteDoc(doc(db, 'jobs', job.id));
      toast.success('Job deleted');
      onClose();
    } catch (err) {
      console.error(err);
      toast.error('Failed to delete job');
    }
  };

  if (!isOpen || !job) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl p-6 overflow-y-auto max-h-[90vh]">
        <h2 className="text-xl font-bold mb-4">Edit Job</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input name="title" value={formData.title} onChange={handleChange} placeholder="Job Title" className="border rounded p-2" />
          <select name="type" value={formData.type} onChange={handleChange} className="border rounded p-2">
            <option value="">Select Type</option>
            <option>Full-time</option>
            <option>Part-time</option>
            <option>Contract</option>
            <option>Internship</option>
            <option>Freelance</option>
          </select>
          <input name="location" value={formData.location} onChange={handleChange} placeholder="Location" className="border rounded p-2" />
          <input type="number" name="salaryMin" value={formData.salaryMin} onChange={handleChange} placeholder="Min Salary" className="border rounded p-2" />
          <input type="number" name="salaryMax" value={formData.salaryMax} onChange={handleChange} placeholder="Max Salary" className="border rounded p-2" />
          <input name="companyName" value={formData.companyName} onChange={handleChange} placeholder="Company Name" className="border rounded p-2" />
          <input name="companyWebsite" value={formData.companyWebsite} onChange={handleChange} placeholder="Company Website" className="border rounded p-2" />
          <input name="deadline" value={formData.deadline} onChange={handleChange} type="date" className="border rounded p-2" />
          <input name="tags" value={formData.tags} onChange={handleChange} placeholder="Tags (comma-separated)" className="border rounded p-2" />
        </div>

        <textarea name="description" value={formData.description} onChange={handleChange} rows="4" placeholder="Job Description" className="border rounded p-2 w-full mt-4" />

        <div className="mt-4">
          <label className="block text-sm mb-1">Company Logo</label>
          <input type="file" name="logoUrl" accept="image/*" onChange={handleChange} />
          {logoPreview && <img src={logoPreview} alt="Logo preview" className="h-16 mt-2 rounded border" />}
        </div>

        <div className="mt-6 flex justify-between">
          <button
            onClick={handleDelete}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
            disabled={loading}
          >
            Delete Job
          </button>
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-gray-300"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              onClick={handleUpdate}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              disabled={loading}
            >
              {loading ? 'Updating...' : 'Update Job'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditJobModal;
