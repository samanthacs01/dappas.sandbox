'use client';

import { useState } from 'react';
import ManualAttachmentForm from './form/manual-attachment-form';
import ManualCompanyInfoForm from './form/manual-company-info-form';

const ManualOnboardingFormContainer = () => {
  const [step, setStep] = useState(1);

  const renderStep = (step: number) => {
    switch (step) {
      case 1:
        return <ManualCompanyInfoForm onSuccess={() => setStep(2)}/>;
      case 2:
        return <ManualAttachmentForm />;
      default:
        return null;
    }
  };


  return renderStep(step);
};

export default ManualOnboardingFormContainer;
