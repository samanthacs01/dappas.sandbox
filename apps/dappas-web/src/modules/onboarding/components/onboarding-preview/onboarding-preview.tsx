'use client';
import MainScene from '@/core/components/common/scene/main-scene';
import { CoffeeCupModel } from '@/core/components/models/coffe-cup-model';
import React, { useState } from 'react';
import TextureCardList from './texture-card-list';
import { Button } from '@workspace/ui/components/button';
import { HeartIcon } from 'lucide-react';

const OnboardingPreview = () => {
  const [selectedTexture, setSelectedTexture] = useState(
    '/images/textures/texture1.png',
  );
  const textures = [
    '/images/textures/texture1.png',
    '/images/textures/texture2.png',
    '/images/textures/texture3.png',
  ];

  const handleTextureChange = (texture: string) => {
    setSelectedTexture((prevTexture) =>
      prevTexture === texture ? '' : texture,
    );
  };

  return (
    <div className="w-1/2 relative">
      <MainScene>
        <CoffeeCupModel textureUrl={selectedTexture} />
      </MainScene>

      <TextureCardList
        textures={textures}
        onSelect={handleTextureChange}
        selectedTexture={selectedTexture}
      />

      <Button
        variant={'link'}
        className="absolute bottom-[15%] left-[40%] z-[99999]"
      >
        <HeartIcon />
        Save for later
      </Button>
    </div>
  );
};

export default OnboardingPreview;
