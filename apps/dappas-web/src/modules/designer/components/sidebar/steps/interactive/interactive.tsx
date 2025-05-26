'use client';

import ChatAssistantIcon from '@/core/components/commons/icons/chat-assistant';
import { useDesignerStore } from '@/modules/designer/store/designer';
import { Button } from '@workspace/ui/components/button';
import { Loader, RefreshCcw } from 'lucide-react';

type Props = {
  onGenerateNewDesigns?: () => void;
};

const InteractiveGeneration: React.FC<Props> = ({ onGenerateNewDesigns }) => {
  const isDesigning = useDesignerStore((state) => state.isDesigning);

  if (isDesigning) {
    return (
      <div className="w-full space-y-10 flex gap-6 relative">
        <div className="flex items-start gap-6">
          <ChatAssistantIcon
            width={16}
            height={16}
            className="min-w-4 min-h-4 mt-1"
          />
        </div>

        <div className="flex flex-col space-y-10 grow">
          <span className="text-reveal">Generating design..</span>
          <span className="text-reveal" style={{ '--delay': '0.4s' } as React.CSSProperties}>
            We are creating a design draft based on your input. This may take a
            few moments. Once ready, you can review the result and request
            changes or generate new alternatives.
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col justify-between">
      <div className="w-full space-y-10 flex gap-6 relative ">
        <div className="flex items-start gap-6">
          <ChatAssistantIcon
            width={16}
            height={16}
            className="min-w-4 min-h-4 mt-1"
          />
        </div>

        <div className="flex flex-col space-y-10 grow">
          <span className="text-reveal">
            Here is a first draft of your design based on your input.
          </span>

          <span className="text-reveal">
            You can generate new alternatives or write in the chat what you’d
            like to change or adjust, for example “change background color” or
            “move the logo to the top” etc.
          </span>
        </div>
      </div>
      <Button
        type="submit"
        className="rounded-none font-light"
        disabled={isDesigning}
        onClick={onGenerateNewDesigns}
      >
        Generate new designs{' '}
        {isDesigning ? <Loader className="animate-spin" /> : <RefreshCcw />}
      </Button>
    </div>
  );
};

export default InteractiveGeneration;
