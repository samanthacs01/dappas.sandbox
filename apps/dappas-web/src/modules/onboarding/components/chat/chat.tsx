'use client';

import { Button } from '@/core/components/ui/button';
import { Textarea } from '@/core/components/ui/textarea';
import { cn } from '@/core/lib/utils';
import { PackagingInfo } from '@/server/schemas/brand';
import { ChatRequestOptions, UIMessage } from 'ai';
import { Send } from 'lucide-react';
import { useEffect, useRef } from 'react';
import { ChatStatus } from '../../types/chat';
import ChatThinking from './thinking';
import PackagingSelector from './packaging-selector';
import InspirationsButton from './inspiration-button';

type Props = {
  packagingInfo: PackagingInfo;
  messages: UIMessage[];
  input: string;
  handleInputChange: (
    e:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLTextAreaElement>
  ) => void;
  handleSubmit: (
    event?: {
      preventDefault?: () => void;
    },
    chatRequestOptions?: ChatRequestOptions
  ) => void;
  chatStatus: ChatStatus;
};

const OnBoardingChat: React.FC<Props> = ({
  packagingInfo,
  input,
  handleInputChange,
  messages,
  handleSubmit,
  chatStatus,
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  // Initialize the chat with AI SDK

  const handlePackageIcon = (packageIconId: number) => {
    console.log(`Selected package: ${packageIconId}`);
  };

  // Scroll to bottom of messages
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  return (
    <div className="flex flex-col h-full">
      <div className="flex justify-between items-center p-4 border-b">
        <h2 className="text-lg font-semibold">
          AI Packaging Design for{' '}
          {packagingInfo.brand ? packagingInfo.brand : '...'}
        </h2>
        <Button
          variant="outline"
          size="sm"
          className="rounded-full"
          onClick={() => console.log('create new')}
        >
          Create new
        </Button>
      </div>

      <div className="grow overflow-y-auto p-4 space-y-4 max-h-[calc(100vh_-_160px)]">
        {messages.map((message, index) => (
          <div
            key={index}
            className={cn(
              'flex flex-col max-w-[80%]',
              message.role === 'user' ? 'ml-auto items-end' : 'items-start'
            )}
          >
            <div
              className={cn(
                'rounded-lg p-3',
                message.role === 'user' ? 'bg-purple-100' : 'bg-gray-100'
              )}
            >
              {message.content}
            </div>
          </div>
        ))}
        {chatStatus !== 'ready' && <ChatThinking />}
        <div ref={messagesEndRef} />
        <PackagingSelector onSelectPackage={handlePackageIcon} />
      </div>

      <form
        onSubmit={handleSubmit}
        className="p-4 border-t flex flex-col gap-1"
      >
        <InspirationsButton />
        <div className="flex items-center gap-2">
          <Textarea
            placeholder="Type your packaging requirements"
            value={input}
            onChange={handleInputChange}
            className="min-h-[40px] resize-none"
            rows={1}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSubmit(e);
              }
            }}
          />
          <Button
            type="submit"
            size="sm"
            className="bg-purple-500 hover:bg-purple-600"
            disabled={chatStatus !== 'ready' || !input.trim()}
          >
            <Send className="h-4 w-4" />
            <span className="sr-only">Send</span>
          </Button>
        </div>
        <p className="text-xs text-gray-500">Shift + Enter for line break</p>
      </form>
    </div>
  );
};

export default OnBoardingChat;
