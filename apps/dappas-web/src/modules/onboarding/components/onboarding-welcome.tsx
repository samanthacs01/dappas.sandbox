'use client';

import OnboardingChatInput from './chat/chat-input';

const OnboardingWelcome = () => {
  return (
    <div className="h-full w-full">
      <div className="flex flex-col h-full border-8 bg-white border-zinc-200">
        <OnboardingChatInput />
      </div>
    </div>
  );
};

export default OnboardingWelcome;
