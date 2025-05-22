'use client';

import ChatAssistantIcon from '@/core/components/commons/icons/chat-assistant';
import { Button } from '@workspace/ui/components/button';
import { Textarea } from '@workspace/ui/components/textarea';
import { ArrowUp } from 'lucide-react';

type OnBoardingWelcomeProps = {
  onChangeToManualStep: () => void;
  activeProduct: string;
};

const OnBoardingWelcome: React.FC<OnBoardingWelcomeProps> = ({
  activeProduct,
  onChangeToManualStep,
}) => {
  return (
    <div className="flex flex-col h-full justify-between">
      <div className="flex items-start gap-6">
        <ChatAssistantIcon
          width={16}
          height={16}
          className="min-w-4 min-h-4 mt-1"
        />
        <div className="text-sm flex flex-col space-y-2 ">
          <span className="text-reveal">
            Let’s create a <span className="font-bold">{activeProduct}</span>{' '}
            with your brand on it. First I’ll need to know some details about
            your company.
          </span>
          <span
            className="text-reveal"
            style={{ '--delay': '0.8s' } as React.CSSProperties}
          >
            If you give me your website, I can collect the information for you
            to validate.
          </span>
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
        <Button
          variant="ghost"
          className="underline text-center"
          onClick={onChangeToManualStep}
        >
          Enter information manually
        </Button>
      </form>
    </div>
  );
};

export default OnBoardingWelcome;
