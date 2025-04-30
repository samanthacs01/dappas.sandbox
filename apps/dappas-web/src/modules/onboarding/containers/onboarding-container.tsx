'use client';

import { PackagingInfo } from '@/server/schemas/brand';
import { useChat } from '@ai-sdk/react';
import { UIMessage } from 'ai';
import { useEffect, useState } from 'react';
import OnBoardingChat from '../components/chat/chat';
import OnBoardingSidePanel from '../components/side-panel';

const OnBoardingContainer = () => {
  const [packagingInfo, setPackagingInfo] = useState<PackagingInfo>({});

  const updatePackagingInfo = (key: string, value: string) => {
    setPackagingInfo((prev) => ({ ...prev, [key]: value }));
  };

  const { messages, input, handleInputChange, handleSubmit, status, append } =
    useChat({
      api: '/api/onboarding',
      body: {
        packagingInfo,
      },
      onToolCall: (toolCall) => {
        console.log('toolCall', toolCall);
      },
      onFinish: async (message) => {
        // After each AI response, try to update the packaging info
        try {
          const response = await fetch('/api/extract-info', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              messages: messages.concat(message as UIMessage),
              currentInfo: packagingInfo,
            }),
          });

          if (response.ok) {
            const data = await response.json();
            const { updatedInfo } = data;
            console.log('updatedInfo', data);
            setPackagingInfo((prev) => ({ ...prev, ...updatedInfo }));
          }
        } catch (error) {
          console.error('Error updating packaging info:', error);
        }
      },
    });

  // Initialize chat with welcome message
  useEffect(() => {
    if (messages.length === 0) {
      append({
        role: 'assistant',
        content:
          "Welcome to the AI Packaging Designer! I'm here to help you create the perfect packaging for your product. Let's get started! What product will this packaging be for? For example, is it a cake, cookies, a gift box, or something else?",
      });
    }
  }, [append, messages.length]);

  return (
    <div className="grid md:grid-cols-[1fr_1fr] h-screen w-full max-w-7xl mx-auto max-h-screen overflow-hidden">
      <OnBoardingSidePanel
        packagingInfo={packagingInfo}
        updatePackagingInfo={updatePackagingInfo}
        chatStatus={status}
        onSubmit={handleSubmit}
      />
      <OnBoardingChat
        packagingInfo={packagingInfo}
        messages={messages}
        input={input}
        handleInputChange={handleInputChange}
        handleSubmit={handleSubmit}
        chatStatus={status}
      />
    </div>
  );
};

export default OnBoardingContainer;
