'use client';

import { PackagingInfo } from '@/server/schemas/brand';
import { Button } from '@workspace/ui/components/button';
import { Textarea } from '@workspace/ui/components/textarea';
import { ChatRequestOptions, UIMessage } from 'ai';
import { Send } from 'lucide-react';
import React from 'react';
import { ChatStatus } from '../../types/chat';
import InspirationsButton from './inspiration-button';
import ChatMessages from './messages';

type Props = {
  packageInfo: PackagingInfo;
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
  onCustomMessage: (message: UIMessage) => void;
};

const OnBoardingChat: React.FC<Props> = ({
  packageInfo: packagingInfo,
  input,
  handleInputChange,
  messages,
  handleSubmit,
  chatStatus,
  onCustomMessage,
}) => {
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

      <ChatMessages messages={messages} chatStatus={chatStatus} onCustomMessage={onCustomMessage}/>
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
