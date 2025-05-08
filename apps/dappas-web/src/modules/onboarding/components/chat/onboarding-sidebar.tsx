'use client';

import React from 'react';
import Image from 'next/image';
import { ChevronRight } from 'lucide-react';

const OnboardingSidebar = () => {
  return (
    <div className="flex flex-col h-full w-full px-10">
      <div className="flex absolute pt-12 items-center gap-2">
        <p>Coffee cup</p>
        <ChevronRight className="size-4" />
      </div>
      <div className="flex flex-col h-full mt-40 items-center gap-6">
        <p className="font-medium text-sm text-red-300 ">
          *Outline illustration
        </p>
        <Image
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
