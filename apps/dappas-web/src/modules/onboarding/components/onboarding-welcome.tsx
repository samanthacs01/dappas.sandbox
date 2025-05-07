'use client';

import Image from 'next/image';
import Link from 'next/link';
import OnboardingChatInput from './chat/chat-input';

const OnboardingWelcome = () => {
  return (
    <div className="h-screen w-full max-h-screen overflow-hidden">
      <div className="flex flex-col h-full border-8 border-zinc-200">
        <OnboardingChatInput />
      </div>
    </div>
  );
};

export default OnboardingWelcome;
