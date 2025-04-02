import React, { useState } from 'react';
import Step1_PersonalInfo from '../components/jobseeker/setupSeeker/Step1_PersonalInfo';
import LocationInputStep from '../components/jobseeker/LocationInputStep';

// You can create more steps later: Step3_JobPreferences, Step4_Experience, etc.

const SetupSeeker = () => {
  const [step, setStep] = useState(1);

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
        {step === 2 && <LocationInputStep onNext={handleNext} onBack={handleBack} />}

        {/* Add: {step === 3 && <Step3_JobPreferences />} */}
      </div>
    </div>
  );
};

export default SetupSeeker;
