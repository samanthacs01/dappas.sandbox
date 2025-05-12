import React, { FC } from 'react';
import TextureCard from './texture-card';

type TextureCardListProps = {
  onSelect: (texture: string) => void;
  selectedTexture: string;
  textures: string[];
};

const TextureCardList: FC<TextureCardListProps> = ({
  onSelect,
  selectedTexture,
  textures,
}) => {
  return (
    <div>
      <div className="flex flex-col gap-4 absolute top-[50%] right-4 translate-y-[-50%]">
        {textures.map((texture, index) => (
          <TextureCard
            key={index}
            texture={texture}
            onSelect={() => onSelect(texture)}
            selectedTexture={selectedTexture === texture}
          />
        ))}
      </div>
    </div>
  );
};

export default TextureCardList;
