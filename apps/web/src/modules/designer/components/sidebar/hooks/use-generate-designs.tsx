import useAIDesigner from '@/modules/designer/hooks/use-ai-designer';
import { useDesignerStore } from '@/modules/designer/store/designer';
import { BrandInfo, OnBoardingSteps } from '@/modules/designer/store/types';

const useGenerateDesigns = () => {
  const setTextures = useDesignerStore((state) => state.setVariantTextures);
  const setActiveTexture = useDesignerStore((state) => state.setActiveTexture);
  const setIsDesigning = useDesignerStore((state) => state.setIsDesigning);
  const setOnBoardingStep = useDesignerStore(
    (state) => state.setOnBoardingStep,
  );

  const { generateAITextures } = useAIDesigner();

  const generateDesign = async (brand: BrandInfo) => {
    setIsDesigning(true);
    setOnBoardingStep(OnBoardingSteps.REFINE_DESIGN);
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

  return { generateDesign };
};

export default useGenerateDesigns;
