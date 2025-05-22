'use client';

import { useDesignerStore } from '@/modules/designer/store/designer';
import { useState } from 'react';
import ManualAttachmentForm from './form/manual-attachment-form';
import ManualCompanyInfoForm from './form/manual-company-info-form';

const ManualOnboardingFormContainer = () => {
  const [step, setStep] = useState(1);
  const setIsOnBoardingReady = useDesignerStore(
    (state) => state.setIsOnBoardingReady,
  );



  const renderStep = (step: number) => {
    switch (step) {
      case 1:
        return <ManualCompanyInfoForm onSuccess={() => setStep(2)} />;
      case 2:
        return (
          <ManualAttachmentForm
            // onGenerateDesign={() => setIsOnBoardingReady(true)}
            onGenerateLocalDesign={() => setIsOnBoardingReady(true)}
          />
        );
      default:
        return null;
    }
  };

  return renderStep(step);
};

export default ManualOnboardingFormContainer;
