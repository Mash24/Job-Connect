import React, { useState } from 'react';
import Step1_PersonalInfo from '../components/jobseeker/setupSeeker/Step1_PersonalInfo';
import LocationInputStep from '../components/jobseeker/LocationInputStep';
import { auth, db } from '../firebase/config';
import { doc, setDoc } from 'firebase/firestore';
import Step3_JobPreferences from '../components/jobseeker/setupSeeker/Step3_JobPreferences';
import Step4_Experience from '../components/jobseeker/setupSeeker/Step4_Experience';
import Step5_Education from '../components/jobseeker/setupSeeker/Step5_Education';

// You can create more steps later: Step3_JobPreferences, Step4_Experience, etc.

const SetupSeeker = () => {
  const [step, setStep] = useState(1);

  // handle saving location to Firestore
  const saveLocationToFirestore = async (location) => {
    try {
      const user = auth.currentUser;
      if(!user) throw new Error('User is not logged in');

      const userRef = doc(db, 'jobSeekers', user.uid);
      await setDoc(userRef, { location}, { merge: true });

      console.log('Location saved successfully');
      setStep((prev)=> prev + 1); // Move to the next step after saving location
    } catch (err) {
      console.error('Error savig location:', err);
      alert('Failed to save location. please try again!');
    }
  };

  const handleNext = () => setStep((prev) => prev + 1);
  const handleBack = () => setStep((prev) => prev - 1);

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Progress Indicator */}
        <div className="flex items-center justify-between mb-10">
          <div className={`flex-1 h-1 rounded ${step >= 1 ? 'bg-blue-600' : 'bg-gray-300'}`} />
          <div className={`flex-1 h-1 rounded mx-2 ${step >= 2 ? 'bg-blue-600' : 'bg-gray-300'}`} />
          {/* Add more steps as needed */}
        </div>

        {/* Step Component Render */}
        {step === 1 && <Step1_PersonalInfo onNext={handleNext} />}
        {step === 2 && (<LocationInputStep onSave={saveLocationToFirestore}/>)}
        {step === 3 && <Step3_JobPreferences onNext = {() => setStep(4)} />}
        {step === 4 && <Step4_Experience onNext = {handleNext} />}
        {step === 5 && <Step5_Education onNext = {handleNext} />}

        {/* Add: {step === 3 && <Step3_JobPreferences />} */}
      </div>
    </div>
  );
};

export default SetupSeeker;
