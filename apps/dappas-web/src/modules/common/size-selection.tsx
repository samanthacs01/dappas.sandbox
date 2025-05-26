'use client';

import { Button } from '@workspace/ui/components/button';
import clsx from 'clsx';
import React, { useState } from 'react';

interface SizeSelectionProps {
  sizeList: string[];
  onSelectSize?: (size: string) => void;
}

const SizeSelection: React.FC<SizeSelectionProps> = ({
  sizeList,
  onSelectSize,
}) => {
  const [selectedSize, setSelectedSize] = useState<string>('');

  const handleSizeSelect = (size: string) => {
    setSelectedSize(size);
    onSelectSize?.(size);
  };

  return (
    <div className="flex flex-col max-w-[460px] gap-6">
      <p>Select size</p>
      <div className="flex justify-around gap-2 overflow-x-auto">
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
            onClick={() => handleSizeSelect(size)}
          >
            {size}
          </Button>
        ))}
      </div>
    </div>
  );
};

export default SizeSelection;
