'use client';

import MainScene from '@/core/components/common/scene/main-scene';
import { CoffeeCupModel } from '@/core/components/models/coffe-cup-model';
import React, { useState, useEffect } from 'react';
import TextureCardList from './texture-card-list';
import { TextureGenerator } from '@/core/components/common/texture/texture-generator';
import { TextureBuilderConfig } from '@/server/3d/texture';
import { textureToBlob } from '@/core/components/common/texture/texture-export';
import { renderLayer } from '@/core/components/common/texture/layer-render';

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
      "url": "/images/products/coffee-cup.png",
      "width": 120,
      "height": 120,
      "position": "center",
      "zIndex": 2
    }
  ]
}`;

const OnboardingPreview = () => {
  const [variantTextures, setVariantTextures] = useState<
    TextureBuilderConfig[]
  >([]);
  const [selectedTexture, setSelectedTexture] = useState<string>('');
  const [activeTexture, setActiveTexture] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

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
      await renderLayer(ctx, layer);
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

        const defaultConfig = TextureGenerator.fromJSON(DEFAULT_JSON_CONFIG);
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

      const blob = await textureToBlob(canvas, 'png', 0.9);
      const url = URL.createObjectURL(blob);
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
    <div className="w-1/2 relative">
      <MainScene>
        <CoffeeCupModel textureUrl={selectedTexture} />
      </MainScene>

      <TextureCardList
        textures={variantTextures}
        onSelect={handleTextureChange}
        activeTexture={activeTexture}
      />
    </div>
  );
};

export default OnboardingPreview;
