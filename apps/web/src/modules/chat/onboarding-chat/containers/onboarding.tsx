'use client';
import OnboardingChat from '../components/onboarding-chat';
import OnboardingSidebar from '../components/onboarding-sidebar';

const OnBoarding = () => {
  return (
    <div className="h-[calc(100vh_-_64px)] w-full max-h-screen overflow-hidden p-3">
      <div className="grid md:grid-cols-[639px_1fr] w-full h-full bg-white">
        <OnboardingChat />
        <OnboardingSidebar />
      </div>
    </div>
  );
};

export default OnBoarding;
