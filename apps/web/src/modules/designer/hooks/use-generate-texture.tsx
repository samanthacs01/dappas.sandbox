import {
  AIBackgroundLayer,
  AITextureConfig,
  TextureBuilderConfig,
} from '@/server/models/texture';
import { useEffect, useMemo, useState } from 'react';
import { useDesignerStore } from '../store/designer';
import { mmToPx } from '@/core/lib/units';
import { TextureGenerator } from '@/core/components/3d-designer/texture/texture-generator';

const useGenerateTexture = () => {
  const product = useDesignerStore((state) => state.activeProduct);
  const brand = useDesignerStore((state) => state.brand);
  const isOnboardingReady = useDesignerStore(
    (state) => state.isOnBoardingReady,
  );
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [selectedTexture, setSelectedTexture] = useState<string>('');
  const [variantTextures, setVariantTextures] = useState<
    TextureBuilderConfig[]
  >([]);
  const [activeTexture, setActiveTexture] = useState<string | null>(null);

  const DEFAULT_JSON_CONFIG: AITextureConfig = useMemo(() => {
    if (!product) {
      return {
        id: 'default',
        width: 1920,
        height: 1080,
        layers: [],
      };
    }
    const layers = product?.model.layers.map(
      (layer, index) =>
        ({
          type: 'background',
          color: '#fff',
          width: mmToPx(layer.size.width),
          height: mmToPx(layer.size.height),
          position: layer.position || 'center',
          zIndex: index,
          visible: true,
        }) as AIBackgroundLayer,
    );

    return {
      id: 'default',
      width: 1920,
      height: 1080,
      layers,
    };
  }, [product]);

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

  useEffect(() => {
    initializeTextures();
  }, [isOnboardingReady, DEFAULT_JSON_CONFIG, brand.colors, brand.logo]);
  return {
    isLoading,
    selectedTexture,
    variantTextures,
    activeTexture,
    handleTextureChange,
  };
};

export default useGenerateTexture;
