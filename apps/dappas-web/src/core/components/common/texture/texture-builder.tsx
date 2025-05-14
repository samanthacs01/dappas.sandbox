'use client';

import { TextureBuilderConfig } from '@/server/3d/texture';
import { useRef, useEffect, useState } from 'react';
import { TextureGenerator } from './texture-generator';

interface TextureBuilderProps {
  config: TextureBuilderConfig;
  onTextureGenerated?: (dataUrl: string) => void;
  className?: string;
  canvasId?: string;
  fitContainer?: boolean;
}

export const TextureBuilder = ({
  config,
  onTextureGenerated,
  className = '',
  canvasId,
  fitContainer = false,
}: TextureBuilderProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isRendering, setIsRendering] = useState(false);

  // Render all layers whenever the config changes
  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const renderTexture = async () => {
      setIsRendering(true);

      // Set original canvas dimensions for rendering
      canvas.width = config.width;
      canvas.height = config.height;

      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Render each layer in order
      for (const layer of config.layers) {
        await TextureGenerator.renderLayer(ctx, layer);
      }

      // Generate the final texture as data URL
      const dataUrl = canvas.toDataURL('image/png');
      if (onTextureGenerated) {
        onTextureGenerated(dataUrl);
      }

      setIsRendering(false);
    };

    renderTexture();
  }, [config, onTextureGenerated]);

  return (
    <div
      ref={containerRef}
      className={`relative ${className}`}
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <canvas
        ref={canvasRef}
        id={canvasId}
        style={{
          width: fitContainer ? '100%' : config.width,
          height: fitContainer ? '100%' : config.height,
          objectFit: fitContainer ? 'cover' : 'initial',
          aspectRatio: fitContainer
            ? `${config.width} / ${config.height}`
            : 'auto',
        }}
      />
      {isRendering && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/20">
          <div className="text-sm text-white">Rendering texture...</div>
        </div>
      )}
    </div>
  );
};
