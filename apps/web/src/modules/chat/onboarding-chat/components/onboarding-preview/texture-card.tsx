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
      <img src={baseConfig} className="w-full h-full object-cover" />
      {/* <TextureBuilder
        config={baseConfig}
        className="w-full h-full object-cover rounded-lg"
        canvasId={`canvas-${baseConfig.id}`}
        fitContainer={true}
      /> */}
    </div>
  );
};

export default TextureCard;
