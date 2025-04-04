import React, { useEffect, useState } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../../../firebase/config';
import { Loader2 } from 'lucide-react';

const ProfileProgress = () => {
  const [completion, setCompletion] = useState(0);
  const [loading, setLoading] = useState(true);
  const [missingSteps, setMissingSteps] = useState([]);

  // Define the required steps in Firestore
  const expectedKeys = [
    'personalInfo',
    'location',
    'jobPreferences',
    'workExperience',
    'education',
    'skillsPortfolio',
    'profileCompleted',
  ];

  useEffect(() => {
    const calculateProgress = async () => {
      try {
        const user = auth.currentUser;
        if (!user) return;

        const docRef = doc(db, 'jobSeekers', user.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          const presentKeys = expectedKeys.filter((key) => data[key]);
          const percent = Math.round((presentKeys.length / expectedKeys.length) * 100);
          const missing = expectedKeys.filter((key) => !data[key]);

          setCompletion(percent);
          setMissingSteps(missing);
        }
      } catch (err) {
        console.error('Error checking profile progress:', err);
      } finally {
        setLoading(false);
      }
    };

    calculateProgress();
  }, []);

  if (loading) {
    return (
      <div className="bg-white p-4 rounded-lg shadow flex items-center justify-center">
        <Loader2 className="animate-spin w-6 h-6 text-blue-600" />
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow space-y-4">
      <h3 className="text-lg font-semibold text-gray-800">Profile Completion</h3>

      {/* Progress Bar */}
      <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
        <div
          className="bg-blue-600 h-4 rounded-full transition-all duration-500"
          style={{ width: `${completion}%` }}
        />
      </div>

      {/* Percentage Label */}
      <div className="text-sm text-gray-600">
        {completion}% complete
      </div>

      {/* List Missing Steps */}
      {completion < 100 && (
        <div className="text-sm text-gray-600">
          <p className="font-medium text-red-500 mb-1">Incomplete sections:</p>
          <ul className="list-disc pl-5 text-xs text-gray-500 space-y-1">
            {missingSteps.map((step) => (
              <li key={step}>{step}</li>
            ))}
          </ul>
          <button
            onClick={() => window.location.href = '/setup-seeker'}
            className="mt-3 inline-block bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-4 py-2 rounded"
          >
            Complete My Profile
          </button>
        </div>
      )}
    </div>
  );
};

export default ProfileProgress;