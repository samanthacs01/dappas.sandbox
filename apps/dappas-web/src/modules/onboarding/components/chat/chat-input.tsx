'use client';

import { Button } from '@workspace/ui/components/button';
import { Textarea } from '@workspace/ui/components/textarea';
import { ChatRequestOptions } from 'ai';
import { ArrowUp, ChevronDown } from 'lucide-react';
import React from 'react';
import { ChatStatus } from '../../types/chat';

type Props = {
  input: string;
  handleInputChange: (
    e:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLTextAreaElement>,
  ) => void;
  handleSubmit: (
    event?: {
      preventDefault?: () => void;
    },
    chatRequestOptions?: ChatRequestOptions,
  ) => void;
  chatStatus: ChatStatus;
};

const OnboardingChatInput: React.FC<Props> = ({
  input,
  handleInputChange,
  handleSubmit,
  chatStatus,
}) => {
  const productTypesList: string[] = [
    'Coffee cup',
    'Food box',
    'Signs/banners',
    'Labels & stickers',
    'Grab Bag',
    'Clothing',
    'Business',
  ];

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col mx-auto mt-52 p-4 gap-20 items-center"
    >
      <p className="text-2xl font-medium">Lets make your brand shine!</p>
      <div className="flex flex-col border border-zinc-300 p-4 w-[576] gap-1">
        <div className="flex items-start gap-2">
          <Textarea
            placeholder="What do you want to create today?"
            value={input}
            onChange={handleInputChange}
            className="min-h-[40px] w-full resize-none p-0 border-0 shadow-none focus-visible:ring-0"
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
            className="flex items-start bg-transparent hover:bg-transparent shadow-none"
            disabled={chatStatus !== 'ready' || !input.trim()}
          >
            <ArrowUp className="text-black dark:text-white" />
            <span className="sr-only">Send</span>
          </Button>
        </div>
        <div>
          {productTypesList.map((product, index) => (
            <Button
              key={index}
              variant={'outline'}
              className="py-3 rounded-none m-1 border border-zinc-300"
            >
              {product}
            </Button>
          ))}
          <Button
            variant={'outline'}
            className="py-3 rounded-none m-1 border border-black"
          >
            More
            <ChevronDown />
          </Button>
        </div>
      </div>
    </form>
  );
};

export default OnboardingChatInput;
