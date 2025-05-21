import { Button } from '@workspace/ui/components/button';
import clsx from 'clsx';
import React, { useState } from 'react';

interface SizeSelectionProps {
  sizeList: string[];
}

const SizeSelection: React.FC<SizeSelectionProps> = ({ sizeList }) => {
  const [selectedSize, setSelectedSize] = useState<string>('');
  return (
    <div className="flex flex-col max-w-[460px] gap-6">
      <p>Select size</p>
      <div className="flex justify-around gap-2 overflow-x-auto border-b border-zinc-400 pb-4">
        {sizeList.map((size) => (
          <Button
            key={size}
            variant={'outline'}
            className={clsx(
              'flex w-[102px] h-[61px] rounded-none border border-zinc-400 text-zinc-400 hover:border-black hover:text-black',
              {
                'border-black text-black': selectedSize === size,
              },
            )}
            onClick={() => setSelectedSize(size)}
          >
            {size} oz
          </Button>
        ))}
      </div>
    </div>
  );
};

export default SizeSelection;
