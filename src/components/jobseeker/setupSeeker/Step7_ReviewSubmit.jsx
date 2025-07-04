import React, { useState, useEffect } from 'react';
import { auth, db } from '../../../firebase/config';
import { doc, getDoc } from 'firebase/firestore';

const Step7_ReviewSubmit = ({ onSubmitFinal, onBack }) => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const user = auth.currentUser;
        if (!user) throw new Error('User not authenticated');

        const docRef = doc(db, 'jobSeekers', user.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setUserData(docSnap.data());
        } else {
          console.warn('No data found');
        }
      } catch (err) {
        console.error('Error fetching user data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <div className="text-center py-10">Loading your details...</div>;

  if (!userData) return <div className="text-center py-10 text-red-500">No data available.</div>;

  return (
    <div className="max-w-4xl mx-auto bg-white shadow-md p-8 rounded-lg">
      <h2 className="text-2xl font-bold mb-6 text-blue-700">Step 7: Review & Submit</h2>

      <div className="space-y-4">
        <section>
          <h3 className="text-lg font-semibold mb-1">Personal Info</h3>
          <pre className="bg-gray-100 p-3 rounded text-sm overflow-x-auto">{JSON.stringify(userData.personalInfo || {}, null, 2)}</pre>
        </section>

        <section>
          <h3 className="text-lg font-semibold mb-1">Location</h3>
          <pre className="bg-gray-100 p-3 rounded text-sm overflow-x-auto">{JSON.stringify(userData.location || {}, null, 2)}</pre>
        </section>

        <section>
          <h3 className="text-lg font-semibold mb-1">Job Preferences</h3>
          <pre className="bg-gray-100 p-3 rounded text-sm overflow-x-auto">{JSON.stringify(userData.jobPreferences || {}, null, 2)}</pre>
        </section>

        <section>
          <h3 className="text-lg font-semibold mb-1">Work Experience</h3>
          <pre className="bg-gray-100 p-3 rounded text-sm overflow-x-auto">{JSON.stringify(userData.workExperience || {}, null, 2)}</pre>
        </section>

        <section>
          <h3 className="text-lg font-semibold mb-1">Education</h3>
          <pre className="bg-gray-100 p-3 rounded text-sm overflow-x-auto">{JSON.stringify(userData.education || {}, null, 2)}</pre>
        </section>

        <section>
          <h3 className="text-lg font-semibold mb-1">Skills & Portfolio</h3>
          <pre className="bg-gray-100 p-3 rounded text-sm overflow-x-auto">{JSON.stringify(userData.skillsPortfolio || {}, null, 2)}</pre>
        </section>
      </div>

      <div className="flex justify-between mt-8">
        <button onClick={onBack} className="bg-gray-300 px-6 py-2 rounded hover:bg-gray-400">Back</button>
        <button onClick={onSubmitFinal} className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-800">Confirm & Submit</button>
      </div>
    </div>
  );
};

export default Step7_ReviewSubmit;
// import { FaPlusCircle } from 'react-icons/fa';
// import Select from 'react-select';