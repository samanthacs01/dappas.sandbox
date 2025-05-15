'use client';

import { Button } from '@workspace/ui/components/button';
import { ChevronRight } from 'lucide-react';
import { useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import ManualAttachmentForm from './form/manual-attachment-form';
import ManualCompanyInfoForm from './form/manual-company-info-form';

const ManualOnboardingFormContainer = () => {
  const [step, setStep] = useState(1);

  const methods = useForm();
  const handleOnChangeStep = (s: number) => setStep(s);

  const renderStep = (step: number) => {
    switch (step) {
      case 1:
        return <ManualCompanyInfoForm />;
      case 2:
        return <ManualAttachmentForm />;
      default:
        return null;
    }
  };

  const onSubmit = (data: any) => {
    console.log('Form submitted:', data);
    // Handle form submission logic here
  };

  const changeStep = () => {
    if (step === 1) {
      setStep(2);
    }
  };

  return (
    <FormProvider {...methods}>
      <form
        action={'#'}
        onSubmit={methods.handleSubmit(onSubmit)}
        className="w-full h-full flex flex-col justify-between"
      >
        {renderStep(step)}
        <Button type="button" className="rounded-none font-light" onClick={changeStep}>
          Continue <ChevronRight />
        </Button>
      </form>
    </FormProvider>
  );
};

export default ManualOnboardingFormContainer;
