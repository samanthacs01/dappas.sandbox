'use client';

import { TextureGenerator } from '@/core/components/3d-designer/texture/texture-generator';
import { TextureBuilderConfig } from '@/server/models/texture';

const useTextureDesigner = () => {
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

  return { generateTextureFromConfig };
};

export default useTextureDesigner;
