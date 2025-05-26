'use client';

import clsx from 'clsx';
import { Heart } from 'lucide-react';
import { useState } from 'react';

const HeartComponent = () => {
  const [saved, setSaved] = useState(false);

  return (
    <div className="flex gap-4">
      <button className="cursor-pointer" onClick={() => setSaved(!saved)}>
        <Heart
          className={clsx('transition active:scale-90', {
            'text-red-500 fill-red-500': saved,
          })}
        />
      </button>
      <span>Save for later</span>
    </div>
  );
};

export default HeartComponent;
