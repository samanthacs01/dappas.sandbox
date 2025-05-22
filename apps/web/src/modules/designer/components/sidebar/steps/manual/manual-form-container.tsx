'use client';

import useAIDesigner from '@/modules/designer/hooks/use-ai-designer';
import useGenerateTexture from '@/modules/designer/hooks/use-generate-texture';
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
  const setActiveTexture = useDesignerStore((state) => state.setActiveTexture);
  const setIsDesigning = useDesignerStore((state) => state.setIsDesigning);

  const { initTexturesConfig } = useGenerateTexture();
  const brand = useDesignerStore((state) => state.brand);

  const { generateAITextures } = useAIDesigner();

  const onGenerateDesign = async () => {
    setIsDesigning(true);
    if (!brand || !brand.logo) return;

    const textures = await generateAITextures({
      nVariants: 3,
      colors: brand?.colors ?? [],
      logo: brand.logo,
      size: {
        width: 1920,
        height: 1080,
      },
      styles: brand?.styles ?? [],
    });

    setTextures(textures);
    setActiveTexture(textures[0]);
    setIsDesigning(false);
  };

  const handleOnLocalDesign = async () => {
    setIsOnBoardingReady(true);
    initTexturesConfig();
  };

  const renderStep = (step: number) => {
    switch (step) {
      case 1:
        return <ManualCompanyInfoForm onSuccess={() => setStep(2)} />;
      case 2:
        return (
          <ManualAttachmentForm
            onGenerateDesign={onGenerateDesign}
            onGenerateLocalDesign={handleOnLocalDesign}
          />
        );
      default:
        return null;
    }
  };

  return renderStep(step);
};

export default ManualOnboardingFormContainer;
