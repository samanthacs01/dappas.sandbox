'use client';

import useGenerateDesigns from '../../hooks/use-generate-designs';
import ManualAttachmentForm from './form/manual-attachment-form';
import { ManualInfoType } from './form/schemas';

const ManualOnboardingFormContainer = () => {
  const { generateDesign } = useGenerateDesigns();

  const onGenerateDesign = async (brand: ManualInfoType) => {
    await generateDesign(brand);
  };

  return <ManualAttachmentForm onGenerateDesign={onGenerateDesign} />;
};

export default ManualOnboardingFormContainer;
