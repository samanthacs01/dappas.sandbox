import LandingContainer from '@/modules/landing/containers/landing-container';
import { getProducts } from '@/server/shopify';
import { createBrowserRouter } from 'react-router';
import BaseLayout from '../layout/base-layout';

export const router = createBrowserRouter([
  {
    path: '/',
    Component: BaseLayout,
    children: [
      {
        index: true,
        Component: LandingContainer,
        loader: async () => {
          return { products: await getProducts({ first: 10 }) };
        },
      },
    ],
  },
]);
