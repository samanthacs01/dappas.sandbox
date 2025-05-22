import { getProducts } from '@/server/shopify';
import { createBrowserRouter } from 'react-router';
import BaseLayout from '../layout/base-layout';
import {
  DesignerContainer,
  LandingContainer,
  OnboardingChatContainer,
  WelcomeChatContainer,
} from './exports';

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
      {
        path: 'welcome',
        Component: WelcomeChatContainer,
      },
      {
        path: 'onboarding',
        Component: OnboardingChatContainer,
      },
      {
        path: 'designer',
        Component: DesignerContainer,
      },
    ],
  },
]);
