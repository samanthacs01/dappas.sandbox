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

export default {
  LandingContainer,
  WelcomeChatContainer,
  OnboardingChatContainer,
};
