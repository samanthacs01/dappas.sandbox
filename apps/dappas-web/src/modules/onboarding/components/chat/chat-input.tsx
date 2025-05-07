'use client';

import { Button } from '@workspace/ui/components/button';
import { Textarea } from '@workspace/ui/components/textarea';
import { ArrowUp, ChevronDown } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React from 'react';

const OnboardingChatInput = () => {
  const router = useRouter();
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
    <form className="flex flex-col mx-auto mt-52 p-4 gap-20 items-center">
      <p className="text-2xl font-medium">Lets make your brand shine!</p>
      <div className="flex flex-col border border-zinc-300 p-4 w-[576] gap-1">
        <div className="flex items-start gap-2">
          <Textarea
            placeholder="What do you want to create today?"
            className="min-h-[40px] w-full resize-none p-0 border-0 shadow-none focus-visible:ring-0"
            rows={1}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
              }
            }}
          />
          <Button
            type="submit"
            size="sm"
            className="flex items-start bg-transparent hover:bg-transparent shadow-none"
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
              onClick={(e) => {
                e.preventDefault();
                router.push('/onboarding/onboarding-chat');
              }}
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
