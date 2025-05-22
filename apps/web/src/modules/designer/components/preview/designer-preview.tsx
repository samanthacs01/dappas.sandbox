import MainScene from '@/core/components/3d-designer/scene/main-scene';
import { downloadPdfBlob } from '@/core/lib/pdf';
import TextureCardList from '@/modules/chat/onboarding-chat/components/onboarding-preview/texture-card-list';
import LoadingDesign from '@/modules/common/loading-design';
import { Button } from '@workspace/ui/components/button';
import React, { useCallback } from 'react';
import usePrintableProduct from '../../hooks/use-printable-product';
import { useDesignerStore } from '../../store/designer';
import { PrintableProduct } from '../../types/product';
import { modelDictionary } from './models-dictionary';
import PreviewControlPanel from './previer-control-panel';
import useGenerateTexture from '../../hooks/use-generate-texture';
import useAnimationController from '../../hooks/use-animation-controller';

type Props = {
  product: PrintableProduct;
};

const DesignerPreview: React.FC<Props> = ({ product }) => {
  const {
    isLoading,
    activeTexture,
    selectedTexture,
    variantTextures,
    handleTextureChange,
  } = useGenerateTexture();
  const { playAnimation, playRotation, onPlayAnimation, onStopModelRotation } =
    useAnimationController();
  const { getPrintableProductPdf } = usePrintableProduct();

  const isOnboardingReady = useDesignerStore(
    (state) => state.isOnBoardingReady,
  );

  const downloadPrintablePdf = async () => {
    if (product && selectedTexture) {
      const pdf = await getPrintableProductPdf(product, selectedTexture);
      await downloadPdfBlob(pdf, `${product.id}.pdf`);
    }
  };

  const renderModel = useCallback(() => {
    if (!product) return null;

    return modelDictionary[product?.model.name]({
      texture: selectedTexture,
      playRotation,
      playAnimation,
    });
  }, [product, selectedTexture, playRotation, playAnimation]);

  if (isLoading) {
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
      {activeTexture && isOnboardingReady && (
        <div className="absolute bottom-5 transform  left-1/2  -translate-x-1/2 -translate-y-1/2 bg-white z-20">
          <Button
            variant="default"
            className="cursor-pointer rounded-none"
            onClick={downloadPrintablePdf}
          >
            <span className="text-sm">Download printable PDF</span>
          </Button>
        </div>
      )}
      <MainScene enableCameraControls={false} showCameraInfo={false}>
        {renderModel()}
      </MainScene>

      {isOnboardingReady && (
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
