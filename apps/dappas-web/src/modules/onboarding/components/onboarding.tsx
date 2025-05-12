'use client';

import { continueChat } from '@/server/ai/lib/packaging';
import { usePackageContext } from '@/store/package-info';
import { useChat } from '@ai-sdk/react';
import { UIMessage } from 'ai';
import { useEffect } from 'react';
import OnboardingChat from './chat/onboarding-chat';
import OnboardingSidebar from './chat/onboarding-sidebar';

const OnBoarding = () => {
  const { state, dispatch } = usePackageContext();
  const { packageInfo } = state;

  const updatePackagingInfo = (key: string, value: string) => {
    dispatch({
      type: 'UPDATE_PACKAGE_INFO',
      payload: { ...state.packageInfo, [key]: value },
    });
  };

  const { messages, input, handleInputChange, handleSubmit, status, append } =
    useChat({
      api: '/api/onboarding',
      body: {
        packageInfo,
      },
    });

  const extractInfo = async () => {
    try {
      const response = await fetch('/api/extract-info', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages,
          currentInfo: packageInfo,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const { updatedInfo } = data;
        dispatch({ type: 'UPDATE_PACKAGE_INFO', payload: updatedInfo });
      }
    } catch (error) {
      console.error('Error updating packaging info:', error);
    }
  };

  useEffect(() => {
    if (messages.length === 0) {
      // Initialize chat with welcome message
      append({
        role: 'assistant',
        content:
          "Welcome to the AI Packaging Designer! I'm here to help you create the perfect packaging for your product. Let's get started! What product will this packaging be for? For example, is it a cake, cookies, a gift box, or something else?",
      });
    } else {
      extractInfo();
    }
  }, [messages.length]);

  const onCustomMessage = async (message: UIMessage) => {
    try {
      const nextMessage = await continueChat(messages, message);
      if (nextMessage) {
        append({
          role: 'assistant',
          content: nextMessage,
        });
      }
    } catch {
      console.log('Error getting custom message');
    }
  };

  return (
    <div className="grid md:grid-cols-[639px_1fr] h-full w-full">
      <OnboardingChat />
      <OnboardingSidebar />
    </div>
  );
};

export default OnBoarding;
