import React from 'react';
import Header from '../components/common/header/header';

const BaseLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <section className="bg-gray-200 min-h-screen">
      <Header />
      <div className="mx-3">{children}</div>
    </section>
  );
};

export default BaseLayout;
