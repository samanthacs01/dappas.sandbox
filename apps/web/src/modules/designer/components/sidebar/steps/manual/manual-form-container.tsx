'use client';

import useAIDesigner from '@/modules/designer/hooks/use-ai-designer';
import { useDesignerStore } from '@/modules/designer/store/designer';
import { useState } from 'react';
import ManualAttachmentForm from './form/manual-attachment-form';
import ManualCompanyInfoForm from './form/manual-company-info-form';

const ManualOnboardingFormContainer = () => {
  const [step, setStep] = useState(1);
  const setIsOnBoardingReady = useDesignerStore(
    (state) => state.setIsOnBoardingReady,
  );
  const setTextures = useDesignerStore((state) => state.setVariantTextures);

  const brand = useDesignerStore((state) => state.brand);

  const { generateAITextures } = useAIDesigner();

  const onGenerateDesign = async () => {
    if (!brand || !brand.logo) return;

    const textures = await generateAITextures({
      nVariants: 2,
      colors: brand?.colors ?? [],
      logo: URL.createObjectURL(brand.logo),
      size: {
        width: 1920,
        height: 1080,
      },
      styles: brand?.styles ?? [],
    });
    setTextures(textures);
  };

  const renderStep = (step: number) => {
    switch (step) {
      case 1:
        return <ManualCompanyInfoForm onSuccess={() => setStep(2)} />;
      case 2:
        return (
          <ManualAttachmentForm
            onGenerateDesign={onGenerateDesign}
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
