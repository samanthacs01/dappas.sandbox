import { Button } from '@workspace/ui/components/button';
import React from 'react';
import BannerImageCard from './banner-image-card';

const BusinessBanner = () => {
  return (
    <div className="bg-white w-full py-18 px-20 relative h-[580px] flex items-center justify-center">
      <div className="hidden md:flex justify-between items-center w-full max-w-[70%] top-[12%] absolute">
        <BannerImageCard src={null} alt="image 1" />
        <BannerImageCard src={null} alt="image 2" />
      </div>

      <div className="hidden md:flex justify-between items-center w-full max-w-[95%] bottom-[12%] absolute">
        <BannerImageCard src={null} alt="image 1" />
        <BannerImageCard src={null} alt="image 2" />
      </div>

      <div className="flex flex-col gap-8 items-center justify-center z-20">
        <h1 className="text-5xl text-center font-normal leading-[100%] tracking-[-4%]">
          Generate customized <br /> packaging for your brand
        </h1>
        <p className="text-center max-w-sm leading-[120%] tracking-[-4%] text-base">
          Instantly see design suggestions of your brand applied to our
          products.
        </p>
        <div className="flex flex-col justify-center items-center gap-5">
          <Button
            variant={'default'}
            className="px-20 py-2.5 h-12 rounded-none"
          >
            Start creating for free
          </Button>
          <p className="text-sm leading-[120%] tracking-[-4%] text-gray-500">
            Start for free, no account needed
          </p>
        </div>
      </div>
    </div>
  );
};

export default BusinessBanner;
