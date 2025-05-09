import { Outlet } from 'react-router';
import AmplitudeContextProvider from '../providers/amplitude';
import Navbar from './navbar';

const BaseLayout = () => {
  return (
    <AmplitudeContextProvider>
      <section className="min-h-svh w-svw p-0 m-0 bg-gray-200 ">
        <Navbar />
        <main>
          <Outlet />
        </main>
      </section>
    </AmplitudeContextProvider>
  );
};

export default BaseLayout;
