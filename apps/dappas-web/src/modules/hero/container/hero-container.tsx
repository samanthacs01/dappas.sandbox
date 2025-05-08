import React from 'react';
import ProductListContainer from './product-list-container';

const HeroContainer = () => {
  return (
    <div className="bg-white p-6 md:p-12 space-y-16">
      <h3 className="text-2xl leading-[100%] tracking-[-4%] max-w-3xs font-normal">
        Explore products and add your brand
      </h3>
      <ProductListContainer />
    </div>
  );
};

export default HeroContainer;
