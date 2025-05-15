import { FC } from 'react';
import TextureCard from './texture-card';
import { TextureBuilderConfig } from '@/server/models/texture';

type TextureCardListProps = {
  onSelect: (texture: string) => void;
  activeTexture: string | null;
  textures: TextureBuilderConfig[];
};

const TextureCardList: FC<TextureCardListProps> = ({
  onSelect,
  activeTexture: selectedTexture,
  textures,
}) => {
  return (
    <div className="flex flex-col gap-4 absolute top-[50%] right-4 translate-y-[-50%]">
      {textures.map((texture, index) => (
        <TextureCard
          key={index}
          baseConfig={texture}
          onSelect={() => onSelect(texture.id)}
          selectedTexture={selectedTexture === texture.id}
        />
      ))}
    </div>
  );
};

export default TextureCardList;
