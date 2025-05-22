import MainScene from '@/core/components/3d-designer/scene/main-scene';
import { TextureGenerator } from '@/core/components/3d-designer/texture/texture-generator';
import { downloadPdfBlob } from '@/core/lib/pdf';
import { mmToPx } from '@/core/lib/units';
import TextureCardList from '@/modules/chat/onboarding-chat/components/onboarding-preview/texture-card-list';
import LoadingDesign from '@/modules/common/loading-design';
import { AITextureConfig, TextureBuilderConfig } from '@/server/models/texture';
import { Button } from '@workspace/ui/components/button';
import { useCallback, useEffect, useMemo, useState } from 'react';
import usePrintableProduct from '../../hooks/use-printable-product';
import { useDesignerStore } from '../../store/designer';
import { PrintableProduct } from '../../types/printable-product';
import { modelDictionary } from './models-dictionary';
import PreviewControlPanel from './previer-control-panel';

type Props = {
  product: PrintableProduct;
};

const DesignerPreview: React.FC<Props> = ({ product }) => {
  const [variantTextures, setVariantTextures] = useState<
    TextureBuilderConfig[]
  >([]);
  const [selectedTexture, setSelectedTexture] = useState<string>('');
  const [activeTexture, setActiveTexture] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [playAnimation, setPlayAnimation] = useState<boolean>(false);
  const [playRotation, setPlayRotation] = useState<boolean>(true);

  const { getPrintableProductPdf } = usePrintableProduct();

  const isOnboardingReady = useDesignerStore(
    (state) => state.isOnBoardingReady,
  );

  const brand = useDesignerStore((state) => state.brand);

  const DEFAULT_JSON_CONFIG: AITextureConfig = useMemo(() => {
    const width = mmToPx(product?.printableArea.width);
    const height = mmToPx(product?.printableArea.height);
    return {
      id: 'default',
      width,
      height,
      layers: [
        {
          type: 'background',
          color: '#fff',
          width,
          height,
          position: 'center',
          zIndex: 0,
          visible: true,
        },
      ],
    };
  }, [product?.printableArea]);

  const downloadPrintablePdf = async () => {
    if (product && selectedTexture) {
      const pdf = await getPrintableProductPdf(product, selectedTexture);
      await downloadPdfBlob(pdf, `${product.id}.pdf`);
    }
  };

  const generateTextureFromConfig = async (
    config: TextureBuilderConfig,
  ): Promise<string> => {
    const canvas = document.createElement('canvas');
    canvas.width = config.width;
    canvas.height = config.height;

    const ctx = canvas.getContext('2d');
    if (!ctx) {
      throw new Error('Failed to get canvas context');
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (const layer of config.layers) {
      await TextureGenerator.renderLayer(ctx, layer);
    }

    return canvas.toDataURL('image/png');
  };

  const renderModel = useCallback(() => {
    if (!product) return null;

    return modelDictionary[product?.model.name]({
      texture: selectedTexture,
      playRotation,
      playAnimation,
    });
  }, [product, selectedTexture, playRotation, playAnimation]);

  useEffect(() => {
    const initializeTextures = async () => {
      try {
        setIsLoading(true);
        if (!isOnboardingReady || !brand.colors || !brand.logo) {
          const defaultTextureUrl = await generateTextureFromConfig(
            DEFAULT_JSON_CONFIG as TextureBuilderConfig,
          );
          setSelectedTexture(defaultTextureUrl);
          setIsLoading(false);
          return;
        }

        const variantConfigs = await TextureGenerator.generateVariantsByParams(
          DEFAULT_JSON_CONFIG,
          brand.colors ?? [],
          brand.logo ? [URL.createObjectURL(brand.logo)] : [],
          3,
        );
        setVariantTextures(variantConfigs);

        const defaultTextureUrl = await generateTextureFromConfig(
          variantConfigs[0] as TextureBuilderConfig,
        );

        setActiveTexture(variantConfigs[0].id);
        setSelectedTexture(defaultTextureUrl);

        setIsLoading(false);
      } catch (error) {
        console.error('Error initializing the texture', error);
        setIsLoading(false);
      }
    };

    initializeTextures();
  }, [isOnboardingReady, DEFAULT_JSON_CONFIG, brand.colors, brand.logo]);

  const handleTextureChange = async (config: TextureBuilderConfig) => {
    try {
      const url = await generateTextureFromConfig(
        config as TextureBuilderConfig,
      );

      setSelectedTexture(url);
      setActiveTexture(config.id);
    } catch (error) {
      console.error('Error changing texture:', error);
    }
  };

  const onPlayAnimation = useCallback(() => {
    setPlayAnimation((prev) => !prev);
  }, []);

  const onStopModelRotation = useCallback(() => {
    setPlayRotation((prev) => !prev);
  }, []);

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
      <MainScene enableCameraControls={false} showCameraInfo={false} >{renderModel()}</MainScene>

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
