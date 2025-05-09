'use client';

import ImageWithFallback from '@/core/commons/image-with-fallback';
import { ChevronRight } from 'lucide-react';

const OnboardingSidebar = () => {
  return (
    <div className="flex flex-col h-full mb-4 w-full px-10 bg-white">
      <div className="flex pt-12 items-center gap-2 lg:absolute">
        <p>Coffee cup</p>
        <ChevronRight className="size-4" />
      </div>
      <div className="flex flex-col h-full pt-24 lg:pt-40 items-center gap-6">
        <p className="font-medium text-sm text-red-300 ">
          *Outline illustration
        </p>
        <ImageWithFallback
          src={'/images/products/coffee-cup.png'}
          alt="Assistant icon"
          width={326}
          height={436}
        />
      </div>
    </div>
  );
};

export default OnboardingSidebar;
