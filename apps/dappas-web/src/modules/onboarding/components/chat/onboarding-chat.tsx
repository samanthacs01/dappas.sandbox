'use client';

import { Button } from '@workspace/ui/components/button';
import { Textarea } from '@workspace/ui/components/textarea';
import { ArrowUp } from 'lucide-react';
import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

const OnboardingChat = () => {
  return (
    <div className="flex flex-col h-full px-20 py-12 justify-between border-r-4">
      <div className="flex items-start gap-6">
        <Image
          src={'/group2.svg'}
          alt="Assistant icon"
          width={16}
          height={16}
          className="mt-1"
        />
        <div className="text-sm">
          Let’s create a coffee cup with your brand on it. First I’ll need to
          know some details about your company. <br />
          <br />
          If you give me your website, I can collect the information for you to
          validate.
        </div>
      </div>
      <form className="flex flex-col gap-4 p-4">
        <div className="flex items-start gap-2 border border-zinc-300">
          <Textarea
            placeholder="Type in your website"
            className="min-h-[40px] resize-none border-0 shadow-none focus-visible:ring-0"
            rows={1}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                console.log(e);
              }
            }}
          />
          <Button
            type="submit"
            size="sm"
            className="bg-transparent hover:bg-transparent shadow-none"
          >
            <ArrowUp className="text-black dark:text-white" />
            <span className="sr-only">Send</span>
          </Button>
        </div>
        <Link href={'/'} className="underline text-center">
          Enter information manually
        </Link>
      </form>
    </div>
  );
};

export default OnboardingChat;
