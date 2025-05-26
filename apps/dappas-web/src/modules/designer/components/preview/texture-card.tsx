import Image from 'next/image';
import { FC } from 'react';

type TextureCardProps = {
  baseConfig: string;
  onSelect: VoidFunction;
  selectedTexture: boolean;
};

const TextureCard: FC<TextureCardProps> = ({
  baseConfig,
  onSelect,
  selectedTexture,
}) => {
  return (
    <div
      className={`size-24 border-2 cursor-pointer relative overflow-hidden ${
        selectedTexture ? 'border-gray-800' : 'border-gray-300'
      }`}
      onClick={onSelect}
    >
      <Image src={baseConfig} alt='texture-card' className="w-full h-full object-cover" />
    </div>
  );
};

export default TextureCard;
