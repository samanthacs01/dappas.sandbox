'use client';
import ChatAssistantIcon from '@/core/components/commons/icons/chat-assistant';
import SizeSelection from '@/modules/common/size-selection';
import { Button } from '@workspace/ui/components/button';
import { Separator } from '@workspace/ui/components/separator';
import { motion } from 'motion/react';
import { useState } from 'react';

type OnBoardingWelcomeProps = {
  onChangeToManualStep: () => void;
  activeProduct: string;
};

const OnBoardingWelcome: React.FC<OnBoardingWelcomeProps> = ({
  activeProduct,
  onChangeToManualStep,
}) => {
  const [size, setSize] = useState<string | null>(null);
  const handleSizeSelect = (selectedSize: string) => {
    setSize(selectedSize);
  };
  return (
    <div className="flex flex-col h-full justify-between w-full">
      <div className="flex flex-col items-start gap-6 w-full">
        <div className="flex items-start gap-6 w-full">
          <ChatAssistantIcon
            width={16}
            height={16}
            className="min-w-4 min-h-4 mt-1"
          />
          <div className="text-sm flex flex-col space-y-2 w-full ">
            <span className="text-reveal">
              Let’s create a <span className="font-bold">{activeProduct}</span>{' '}
              with your brand on it.
            </span>
            <span
              className="text-reveal"
              style={{ '--delay': '0.4s' } as React.CSSProperties}
            >
              First I’ll need to know the size you want
            </span>
            <div
              className="animate-reveal-y flex flex-col  space-y-10"
              style={{ '--delay': '0.8s' } as React.CSSProperties}
            >
              <Separator className="my-4" />
              <SizeSelection
                sizeList={['8oz', '12oz', '16oz']}
                onSelectSize={handleSizeSelect}
              />
              <Separator className="my-2 !w-[80%]" />
            </div>
          </div>
        </div>
        {size && (
          <div className="flex items-start gap-6">
            <ChatAssistantIcon
              width={16}
              height={16}
              className="min-w-4 min-h-4 mt-1"
            />
            <div className="text-sm flex flex-col space-y-2 w-full ">
              <span
                className="text-reveal"
                style={{ '--delay': '0.4s' } as React.CSSProperties}
              >
                Now I’ll need to know a bit about your brand
              </span>
            </div>
          </div>
        )}
      </div>

      {size && (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Button className="text-center w-full rounded-none" onClick={onChangeToManualStep}>
            Enter information manually
          </Button>
        </motion.div>
      )}
    </div>
  );
};

export default OnBoardingWelcome;
