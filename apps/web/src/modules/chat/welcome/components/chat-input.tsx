'use client';

import { Button } from '@workspace/ui/components/button';
import { Textarea } from '@workspace/ui/components/textarea';
import { ArrowUp, ChevronDown } from 'lucide-react';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router';

const WelcomeChatInput = () => {
  const navigate = useNavigate();
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
    <form className="flex flex-col mx-auto p-4 gap-20 items-center max-w-xl">
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: 0.8,
          delay: 0.2,
        }}
        className="text-2xl font-normal"
      >
        Lets make your brand shine!
      </motion.p>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: 1,
          delay: 0.3,
        }}
        className="flex flex-col border border-zinc-300 p-4 gap-1 "
      >
        <div className="flex items-start gap-2">
          <Textarea
            placeholder="What do you want to create today?"
            className="min-h-[100px] w-full resize-none p-0 border-0 shadow-none focus-visible:ring-0"
            rows={2}
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
                navigate('/designer?product=coffee%20cup');
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
      </motion.div>
    </form>
  );
};

export default WelcomeChatInput;
