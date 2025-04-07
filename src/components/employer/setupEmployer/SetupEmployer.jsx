import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, db } from '../../../firebase/config';
import { doc, setDoc } from 'firebase/firestore';

// Employer Setup Steps
import Step1_CompanyInfo from '../../employer/setupEmployer/Step1_CompanyInfo';
import Step2_CompanyLocation from '../../employer/setupEmployer/Step2_CompanyLocation';
import Step3_CompanyCulture from '../../employer/setupEmployer/Step3_CompanyCulture';
import Step4_ReviewSubmit from '../../employer/setupEmployer/Step4_ReviewSubmit';

const SetupEmployer = () => {
  const [step, setStep] = useState(1);
  const navigate = useNavigate();

  const handleNext = () => setStep((prev) => prev + 1);
  const handleBack = () => setStep((prev) => prev - 1);

  // Step 2: Save company location to Firestore
  const handleLocationSave = async (location) => {
    try {
      const user = auth.currentUser;
      if (!user) throw new Error('User not logged in');

      const ref = doc(db, 'employers', user.uid);
      await setDoc(ref, { location }, { merge: true });

      console.log('📍 Location saved');
      handleNext(); // Go to next step
    } catch (err) {
      console.error('❌ Location Save Error:', err);
      alert('Could not save location. Try again.');
    }
  };

  // Step 4: Final submit
  const handleFinalSubmit = async () => {
    try {
      const user = auth.currentUser;
      if (!user) throw new Error('User not logged in');

      const ref = doc(db, 'employers', user.uid);
      await setDoc(ref, { profileCompleted: true }, { merge: true });

      console.log('✅ Employer setup complete');
      navigate('/dashboard-employer'); // ✅ Redirects to correct dashboard
    } catch (err) {
      console.error('❌ Final Submit Error:', err);
      alert('Profile could not be completed.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Progress Bar */}
        <div className="flex items-center justify-between mb-8">
          {[1, 2, 3, 4].map((s) => (
            <div
              key={s}
              className={`flex-1 h-1 mx-1 rounded ${step >= s ? 'bg-blue-600' : 'bg-gray-300'}`}
            />
          ))}
        </div>

        {/* Step Renderer */}
        {step === 1 && <Step1_CompanyInfo onNext={handleNext} />}
        {step === 2 && (<Step2_CompanyLocation onNext={handleNext} onBack={handleBack} />)}
        {step === 3 && <Step3_CompanyCulture onNext={handleNext} onBack={handleBack} />}
        {step === 4 && (<Step4_ReviewSubmit onSubmitFinal={handleFinalSubmit} onBack={handleBack} />)}
      </div>
    </div>
  );
};

export default SetupEmployer;