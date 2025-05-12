import React from 'react';
import Header from '../components/common/header/header';

const BaseLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <section className="bg-gray-200 min-h-screen flex flex-col">
      <Header />
      <div className="flex-grow mx-4 mb-4 h-[calc(100vh-8rem)]">{children}</div>
    </section>
  );
};

export default BaseLayout;
