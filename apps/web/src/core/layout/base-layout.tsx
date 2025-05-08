import { Outlet } from 'react-router';
import Navbar from './navbar';

const BaseLayout = () => {
  return (
    <section className="h-svh w-svw p-0 m-0 bg-gray-200">
      <Navbar />
      <main>
        <Outlet />
      </main>
    </section>
  );
};

export default BaseLayout;
