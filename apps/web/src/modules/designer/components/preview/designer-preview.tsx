import MainScene from '@/core/components/3d-designer/scene/main-scene';
import { downloadPdfBlob } from '@/core/lib/pdf';
import LoadingDesign from '@/modules/common/loading-design';
import { Button } from '@workspace/ui/components/button';
import { ArrowRight, DownloadCloudIcon } from 'lucide-react';
import React, { useCallback } from 'react';
import useAnimationController from '../../hooks/use-animation-controller';
import useGenerateTexture from '../../hooks/use-generate-texture';
import usePrintableProduct from '../../hooks/use-printable-product';
import { useDesignerStore } from '../../store/designer';
import { OnBoardingSteps } from '../../store/types';
import { PrintableProduct } from '../../types/product';
import { modelDictionary } from './models-dictionary';
import PreviewControlPanel from './previer-control-panel';
import TextureCardList from './texture-card-list';

type Props = {
  product: PrintableProduct;
};

const DesignerPreview: React.FC<Props> = ({ product }) => {
  const { isLoading, activeTexture, variantTextures, handleTextureChange } =
    useGenerateTexture();
  const { playAnimation, playRotation, onPlayAnimation, onStopModelRotation } =
    useAnimationController();
  const { getPrintableProductPdf } = usePrintableProduct();
  const isDesigning = useDesignerStore((state) => state.isDesigning);

  const setOnBoardingStep = useDesignerStore(
    (state) => state.setOnBoardingStep,
  );

  const isOnboardingReady = useDesignerStore(
    (state) => state.isOnBoardingReady,
  );

  const onBoardingStep = useDesignerStore((state) => state.onBoardingStep);

  const downloadPrintablePdf = async () => {
    if (product && activeTexture) {
      const pdf = await getPrintableProductPdf(product, activeTexture);
      await downloadPdfBlob(pdf, `${product.id}.pdf`);
    }
  };

  const addToCart = () => {
    setOnBoardingStep(OnBoardingSteps.ADD_TO_CART);
  };

  const renderModel = useCallback(() => {
    if (!product) return null;

    return modelDictionary[product?.model.name]({
      texture: activeTexture,
      playRotation,
      playAnimation,
    });
  }, [product, activeTexture, playRotation, playAnimation]);

  if (isLoading || isDesigning) {
    return (
      <div className="w-full bg-white relative max-h-[calc(100vh_-_64px)]">
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <LoadingDesign />
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-white relative max-h-[calc(100vh_-_64px)]">
      {activeTexture && isOnboardingReady && onBoardingStep !== OnBoardingSteps.ADD_TO_CART && (
        <div className="absolute bottom-5 transform  left-1/2  -translate-x-1/2 -translate-y-1/2 bg-white z-20 flex gap-4">
          <Button
            variant="default"
            className="cursor-pointer rounded-none"
            onClick={downloadPrintablePdf}
          >
            <DownloadCloudIcon />
          </Button>
          <Button onClick={addToCart} className="rounded-none">
            Select design <ArrowRight/>
          </Button>
        </div>
      )}
      <MainScene enableCameraControls={false} showCameraInfo={false}>
        {renderModel()}
      </MainScene>

      {isOnboardingReady && onBoardingStep !== OnBoardingSteps.ADD_TO_CART && (
        <TextureCardList
          textures={variantTextures}
          onSelect={handleTextureChange}
          activeTexture={activeTexture}
        />
      )}
      <PreviewControlPanel
        onPlay={onPlayAnimation}
        isPlaying={playAnimation}
        onStop={onStopModelRotation}
        isRotating={playRotation}
      />
    </div>
  );
};

export default DesignerPreview;
