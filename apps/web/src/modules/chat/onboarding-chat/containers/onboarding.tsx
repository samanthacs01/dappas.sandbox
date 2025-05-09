'use client';
import OnboardingChat from '../components/onboarding-chat';
import OnboardingSidebar from '../components/onboarding-sidebar';

const OnBoarding = () => {
  return (
    <div className="w-full max-h-[calc(100vh_-_64px)] lg:max-h-screen lg:h-[calc(100vh_-_64px)] overflow-y-auto p-3">
      <div className="flex flex-col lg:flex-row w-full h-full gap-2">
        <OnboardingChat />
        <OnboardingSidebar />
      </div>
    </div>
  );
};

export default OnBoarding;
