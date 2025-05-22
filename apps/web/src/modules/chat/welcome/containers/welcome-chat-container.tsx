'use client';

import WelcomeChatInput from '../components/chat-input';

const WelcomeChatContainer = () => {
  return (
    <div className="h-[calc(100vh_-_64px)] w-full max-h-screen overflow-hidden p-3">
      <div className="w-full h-full flex justify-center items-center bg-white">
        <WelcomeChatInput />
      </div>
    </div>
  );
};

export default WelcomeChatContainer;
