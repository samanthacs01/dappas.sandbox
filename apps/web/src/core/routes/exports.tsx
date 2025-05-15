import React from 'react';

const LandingContainer = React.lazy(
  () => import('@/modules/landing/containers/landing-container'),
);

const WelcomeChatContainer = React.lazy(
  () => import('@/modules/chat/welcome/containers/welcome-chat-container'),
);

const OnboardingChatContainer = React.lazy(
  () => import('@/modules/chat/onboarding-chat/containers/onboarding'),
);

const DesignerContainer = React.lazy(
  () => import('@/modules/designer/containers/product-designer'),
);

export { DesignerContainer, LandingContainer, OnboardingChatContainer, WelcomeChatContainer };


