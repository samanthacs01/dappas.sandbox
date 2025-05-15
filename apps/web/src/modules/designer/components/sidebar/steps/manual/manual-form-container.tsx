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

  const isReadyToGenerate = false;
  const onSubmit = (data: any) => {
    console.log('Form submitted:', data);
    // Handle form submission logic here
  };

  const renderSubmitButton = () => {
    switch (step) {
      case 1:
        return (
          <div className="flex flex-col gap-4 mt-6">
            <Button
              type="button"
              className="rounded-none"
              onClick={() => handleOnChangeStep(2)}
            >
              Continue <ChevronRight />
            </Button>
            {step > 1 && (
              <Button
                type="button"
                variant={'link'}
                onClick={() => handleOnChangeStep(1)}
                className="rounded-none"
              >
                Back
              </Button>
            )}
          </div>
        );
      case 2:
        return (
          <div className="flex flex-col gap-4 mt-6">
            <Button
              type="submit"
              disabled={!isReadyToGenerate}
              className="w-full"
            >
              Generate design <ChevronRight />
            </Button>
            {step > 1 && (
              <Button
                type="button"
                variant={'link'}
                onClick={() => handleOnChangeStep(1)}
                className="rounded-none"
              >
                Back
              </Button>
            )}
          </div>
        );
      default:
        return null;
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
        {renderSubmitButton()}
      </form>
    </FormProvider>
  );
};

export default ManualOnboardingFormContainer;
