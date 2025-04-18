import React, { useState } from "react";
import { Dialog } from "@headlessui/react";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../../../firebase/config";

const EditJobModal = ({ job, isOpen, onClose }) => {
  const [form, setForm] = useState({
    title: job?.title || "",
    description: job?.description || "",
    companyName: job?.companyName || "",
    location: job?.location || "",
    salary: job?.salary || "",
    employmentType: job?.employmentType || "",
  });

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleUpdate = async () => {
    try {
      const jobRef = doc(db, "jobs", job.id);
      await updateDoc(jobRef, form);
      alert("✅ Job updated successfully!");
      onClose();
      window.location.reload();
    } catch (err) {
      console.error("❌ Failed to update job:", err);
      alert("Something went wrong.");
    }
  };

  if (!isOpen || !job) return null;

  return (
    <Dialog open={isOpen} onClose={onClose} className="z-50 relative">
      <div className="fixed inset-0 bg-black/40" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="w-full max-w-xl bg-white rounded-lg shadow p-6 space-y-4">
          <Dialog.Title className="text-lg font-bold">Edit Job</Dialog.Title>

          <div className="space-y-3">
            {["title", "companyName", "location", "salary", "employmentType"].map((field) => (
              <input
                key={field}
                type="text"
                name={field}
                value={form[field]}
                onChange={handleChange}
                placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                className="w-full border p-2 rounded"
              />
            ))}

            <textarea
              name="description"
              rows={4}
              value={form.description}
              onChange={handleChange}
              placeholder="Job Description"
              className="w-full border p-2 rounded"
            />
          </div>

          <div className="pt-4 flex justify-end gap-2 border-t">
            <button
              onClick={onClose}
              className="px-4 py-1 border rounded text-sm hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              onClick={handleUpdate}
              className="px-4 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
            >
              Save Changes
            </button>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};

export default EditJobModal;
