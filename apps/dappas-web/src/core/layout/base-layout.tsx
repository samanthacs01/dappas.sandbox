import React from 'react';
import Header from '../components/common/header/header';

const BaseLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <section className="bg-gray-200 h-full">
      <Header />
      <div className="mx-4">{children}</div>
    </section>
  );
};

export default BaseLayout;
