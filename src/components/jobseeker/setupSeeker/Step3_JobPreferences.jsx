import React, { useState} from 'react'
import { auth, db } from '../../../firebase/config'
import { doc, setDoc } from 'firebase/firestore'
import Select from 'react-select';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import makeAnimated from 'react-select/animated'
import { FaBriefcase, FaMapMarkerAlt, FaMoneyBillWave, FaCalendarAlt } from 'react-icons/fa';

const employmentOptions =[
  { value: 'Full-time', label: 'Full-time' },
  { value: 'Part-time', label: 'Part-time' },
  { value: 'Freelance', label: 'Freelance' },
  { value: 'Contract', label: 'Contract' },
  { value: 'Internship', label: 'Internship' },
];

const workLocations = [ 'Remote', 'On-site', 'Hybrid', 'No Preference' ];
const animatedComponents = makeAnimated();

const industryOptions = [
  { value: 'Technology', label: 'Technology' },
  { value: 'Finance', label: 'Finance' },
  { value: 'Healthcare', label: 'Healthcare' },
  { value: 'Marketing', label: 'Marketing' },
  { value: 'Education', label: 'Education' },
  { value: 'Engineering', label: 'Engineering' },
  { value: 'Retail & E-commerce', label: 'Retail & E-commerce' },
  { value: 'Media & Entertainment', label: 'Media & Entertainment' },
  { value: 'Government & Public Sector', label: 'Government & Public Sector' },
  { value: 'Hospitality & Tourism', label: 'Hospitality & Tourism' },
  { value: 'Manufacturing', label: 'Manufacturing' },
  { value: 'Other', label: 'Other (Specify Below)' },
];

const companySizes = ['Startup', 'Medium', 'Large', 'No Preference (Any)'];
const salaryRanges = [
  { value: '$0-$10', label: '$0-$10'},
  { value: '$10-$100', label: '$10-$100'},
  { value: '$100-$500', label: '$100-$500'},
  { value: '$500-$1,000', label: '$500-$1,000'},
  { value: '$1,000-$5,000', label: '$1,000-$5,000'},
  { value: '$5,000-$10,000', label: '$5,000-$10,000'},
  { value: '$10,000+', label: '$10,000+'},
  { value: 'Open to Offers', label: 'Open to Offers'},
];

const Step3_JobPreferences = ({ onNext}) => {
  const [formData, setFormData] = useState({
    desiredJobTitle: '',
    employmentType: [],
    preferredWorkLocation: '',
    preferredWorkCities: '',
    // expectedSalaryRange: [2000, 5000],
    availability: new Date(),
    workAuthorization: 'No Sponsorship Needed',
    industryPreference: '',
    companySizePreference: '',
    willingToRelocate: false,
    preferredRelocationCities: ''
  });

  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev)=> ({...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSelect = (field, selected) => {
    setFormData((Prev) => ({...Prev, [field]: selected.map((s) => s.value) }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const user = auth.currentUser;
      const userRef = doc(db, 'jobSeekers', user.uid);
      await setDoc(userRef, { jobPreferences: formData }, { merge: true });
      onNext();
    } catch (err) {
      console.error('Error saving preferences:', err);
      alert('Failed to save. try again.')
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='max-w-3xl mx-auto bg-white shadow-md p-8 rounded-lg'
    >
      <h2 className="text-2xl font-bold mb-6 text-blue-700">Step 3: Job Preferences</h2>
      <form onSubmit={handleSubmit} className='space-y-4'>

        <input 
          type="text" 
          name="desiredJobTitle"
          placeholder="Desired Job Title"
          value={formData.desiredJobTitle}
          onChange={handleChange}
          className="w-full border px-4 py-2 rounded" 
          required
        />

        <div>
        <label className="block mb-1 text-indigo-200">Employment Type</label>
          <Select
            isMulti
            options={employmentOptions}
            onChange={(selected) => handleSelect('employmentType', selected)}
            className="text-sm"
          />
        </div>

        <div>
          <label className="block mb-1 text-indigo-200">Preferred Work Location</label>
          <div className="flex gap-4">
            {workLocations.map((loc) => (
              <button type="button" key={loc} className={`px-4 py-2 rounded border ${formData.preferredWorkLocation === loc ? 'bg-blue-500 text-white' : 'bg-white'}`} onClick={() => setFormData((prev) => ({ ...prev, preferredWorkLocation: loc }))}>{loc}</button>
            ))}
          </div>
        </div>

        {(formData.preferredWorkLocation === 'On-site' || formData.preferredWorkLocation === 'Hybrid') && (
          <input
            type="text"
            name="preferredWorkCities"
            placeholder="Preferred Cities (comma separated)"
            value={formData.preferredWorkCities}
            onChange={handleChange}
            className="w-full border px-4 py-2 rounded"
          />
        )}
{/* -------------------------------------------------------------------------------- */}
        <div>
          <label className="block mb-1 text-indigo-200">Expected Salary (USD)</label>
          <select
            name="expectedSalaryRange"
            value={formData.expectedSalaryRange}
            onChange={handleChange}
            className="w-full border px-4 py-2 rounded"
          >
          <option value="">Select Salary Range</option>
            { salaryRanges.map((range) => (
              <option key={range.value} value={range.value}>{range.label}</option>
            ))}
          </select>
        </div>
{/* -------------------------------------------------------------------------------- */}


        <div>
          <label className="block mb-1 text-indigo-200">Availability</label>
          <DatePicker
            selected={formData.availability}
            onChange={(date) => setFormData((prev) => ({ ...prev, availability: date }))}
            className="w-full border px-4 py-2 rounded"
          />
        </div>

        <div>
          <label className="block mb-1 text-indigo-200">Work Authorization</label>
          <select name="workAuthorization" value={formData.workAuthorization} onChange={handleChange} className="w-full border px-4 py-2 rounded">
            <option>No Visa Sponsorship Needed</option>
            <option>Requires Visa Sponsorship</option>
            <option>Not Sure</option>
          </select>
        </div>
{/* ------------------------------------------------------------------------------------------------------- */}
        <div>
          <label className="block mb-1 text-indigo-200">Industry Preference</label>
          <Select
            isMulti
            components={animatedComponents}
            options={industryOptions}
            onChange={(selected) => handleSelect('industryPreference', selected)}
            className='w-full'
            placeholder = 'Select preferred industries...'
          />
        </div>

        { formData.industryPreference.includes('Other')&& (
          <input 
            type="text"
            name='customIndustry'
            placeholder='Specify your industry'
            value={formData.customIndustry || ''}
            onChange={handleChange}
            className="w-full border px-4 py-2 rounded mt-2" 
          />
        )}
{/* ------------------------------------------------------------------------------------------------------- */}

        <div>
          <label className="block mb-1 text-indigo-200">Company Size Preference</label>
          <select name="companySizePreference" value={formData.companySizePreference} onChange={handleChange} className="w-full border px-4 py-2 rounded">
            <option value="">Select</option>
            {companySizes.map((size) => <option key={size}>{size}</option>)}
          </select>
        </div>

        <div>
          <label className="block mb-1 text-indigo-200">Willing to Relocate?</label>
          <input
            type="checkbox"
            name="willingToRelocate"
            checked={formData.willingToRelocate}
            onChange={handleChange}
            className="mr-2"
          /> Yes
        </div>

        {formData.willingToRelocate && (
          <input
            type="text"
            name="preferredRelocationCities"
            placeholder="Cities you're willing to relocate to (comma separated)"
            value={formData.preferredRelocationCities}
            onChange={handleChange}
            className="w-full border px-4 py-2 rounded"
          />
        )}

        <div className="text-right">
          <button type="submit" disabled={loading} className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-800">
            {loading ? 'Saving...' : 'Save & Continue'}
          </button>
        </div>

      </form>
    </div>
  );
};

export default Step3_JobPreferences