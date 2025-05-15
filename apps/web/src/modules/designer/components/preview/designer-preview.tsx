import MainScene from '@/core/components/3d-designer/scene/main-scene';
import { TextureConverter } from '@/core/components/3d-designer/texture/texture-converter';
import { TextureGenerator } from '@/core/components/3d-designer/texture/texture-generator';
import TextureCardList from '@/modules/chat/onboarding-chat/components/onboarding-preview/texture-card-list';
import { TextureBuilderConfig } from '@/server/models/texture';
import { useEffect, useState } from 'react';
import { useDesignerStore } from '../../store/designer';
import { modelDictionary } from './models-dictionaary';

const DEFAULT_JSON_CONFIG = `{
  "width": 512,
  "height": 512,
  "layers": [
    {
      "type": "background",
      "color": "#CC3E50",
      "height": 256,
      "position": "top",
      "zIndex": 0
    },
    {
      "type": "background",
      "color": "#5ac8fa",
      "y": 256,
      "height": 256,
      "zIndex": 1
    },
    {
      "type": "image",
      "url": "/logo.svg",
      "width": 80,
      "height": 120,
      "position": "center",
      "zIndex": 2
    }
  ]
}`;

const DesignerPreview = () => {
  const [variantTextures, setVariantTextures] = useState<
    TextureBuilderConfig[]
  >([]);
  const [selectedTexture, setSelectedTexture] = useState<string>('');
  const [activeTexture, setActiveTexture] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const product = useDesignerStore((state) => state.activeProduct);

  console.log('product', product);

  const generateTextureFromConfig = async (
    config: TextureBuilderConfig,
  ): Promise<string> => {
    const canvas = document.createElement('canvas');
    canvas.width = config.width;
    canvas.height = config.height;

    const ctx = canvas.getContext('2d');
    if (!ctx) {
      throw new Error('No se pudo obtener el contexto del canvas');
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (const layer of config.layers) {
      await TextureGenerator.renderLayer(ctx, layer);
    }

    return canvas.toDataURL('image/png');
  };

  useEffect(() => {
    const initializeTextures = async () => {
      try {
        setIsLoading(true);

        const variantConfigs =
          TextureGenerator.generateVariants(DEFAULT_JSON_CONFIG);
        setVariantTextures(variantConfigs);

        const defaultConfig = TextureConverter.fromJSON(DEFAULT_JSON_CONFIG);
        const defaultTextureUrl =
          await generateTextureFromConfig(defaultConfig);
        setSelectedTexture(defaultTextureUrl);

        setIsLoading(false);
      } catch (error) {
        console.error('Error al inicializar texturas:', error);
        setIsLoading(false);
      }
    };

    initializeTextures();
  }, []);

  const handleTextureChange = async (textureId: string) => {
    try {
      const canvas = document.querySelector(`#canvas-${textureId}`);

      if (!(canvas instanceof HTMLCanvasElement)) {
        throw new Error('Canvas missing');
      }

      const url = await TextureGenerator.textureToUrl(canvas, 'png');

      setActiveTexture(textureId === activeTexture ? null : textureId);

      setSelectedTexture(url);
    } catch (error) {
      console.error('Error changing texture:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="w-1/2 flex items-center justify-center">
        <div className="text-lg">Loading textures...</div>
      </div>
    );
  }

  return (
    <div className="w-full bg-white relative">
      <MainScene>
        {modelDictionary[product?.id as 'coffee-cup']({
          texture: selectedTexture,
        })}
      </MainScene>

      <TextureCardList
        textures={variantTextures}
        onSelect={handleTextureChange}
        activeTexture={activeTexture}
      />
    </div>
  );
};

export default DesignerPreview;
