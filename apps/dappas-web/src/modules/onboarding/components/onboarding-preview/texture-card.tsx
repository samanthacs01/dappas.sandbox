import React, { FC } from 'react';
import { ImageWithFallback } from '@/core/components/common/image/image-with-fallback';

type TextureCardProps = {
  texture: string;
  onSelect: VoidFunction;
  selectedTexture: boolean;
};

const TextureCard: FC<TextureCardProps> = ({
  texture,
  onSelect,
  selectedTexture,
}) => {
  return (
    <div
      className={`size-24 border-2 rounded-lg cursor-pointer relative ${
        selectedTexture ? 'border-blue-500' : 'border-gray-300'
      }`}
      onClick={onSelect}
    >
      <ImageWithFallback
        src={texture}
        alt={texture}
        fill
        className="w-full h-full object-cover absolute rounded-lg"
      />
    </div>
  );
};

export default TextureCard;
