// File: /src/components/employer/setupEmployer/Step4_ReviewSubmit.jsx
import React, { useState, useEffect } from 'react';
import { auth, db } from '../../../firebase/config';
import { doc, getDoc, setDoc } from 'firebase/firestore';

const Step4_ReviewSubmit = ({ onSubmitFinal, onBack }) => {
  const [employerData, setEmployerData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const user = auth.currentUser;
      if (!user) return; // Prevent unauthenticated access
  
      try {
        const ref = doc(db, 'employers', user.uid);
        const snap = await getDoc(ref);
        if (snap.exists()) {
          setEmployerData(snap.data());
        }
      } catch (error) {
        console.error("🔥 Failed to fetch employer data:", error);
        alert("You don't have permission to access this profile.");
      }
    };
  
    fetchData();
  }, []);
  

  return (
    <div className="bg-white p-6 rounded shadow-md">
      <h2 className="text-xl font-bold mb-4">Review & Submit</h2>
      {!employerData ? (
        <p>Loading...</p>
      ) : (
        <div className="space-y-4">
          <p><strong>Company:</strong> {employerData.companyName}</p>
          <p><strong>Industry:</strong> {employerData.industry}</p>
          <p><strong>Location:</strong>{' '}{employerData.location?.address}, {employerData.location?.city}, {employerData.location?.zip}, {employerData.location?.country}</p>
          <p><strong>Mission:</strong> {employerData.mission}</p>
          <p><strong>Values:</strong> {employerData.values}</p>

          <div className="flex justify-between mt-6">
            <button onClick={onBack} className="px-4 py-2 bg-gray-300 rounded">Back</button>
            <button onClick={onSubmitFinal} className="px-4 py-2 bg-green-600 text-white rounded">Submit</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Step4_ReviewSubmit;