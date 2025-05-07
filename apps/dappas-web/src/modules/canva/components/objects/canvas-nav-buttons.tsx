'use client';
import { cn } from '@workspace/ui/lib/utils';
import { Box, Shapes } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const CanvasNavButtons = () => {
  const pathname = usePathname();
  const is3D = pathname.includes('3d-view');

  return (
    <div className="absolute bottom-4 left-[50%] flex h-10 items-center rounded-full bg-white/90 p-1 shadow-md backdrop-blur-sm dark:bg-gray-800/90">
      <div className="relative flex">
        <div
          className={cn(
            'absolute inset-0 z-0 w-1/2 rounded-full bg-primary transition-all duration-300 ease-in-out',
            is3D && 'translate-x-full'
          )}
        />

        <Link href="/canva" className="relative z-10">
          <button
            className={cn(
              'flex h-8 w-12 items-center justify-center rounded-full text-sm font-medium transition-colors',
              !is3D
                ? 'text-primary-foreground'
                : 'text-foreground hover:text-primary'
            )}
          >
            <Shapes />
          </button>
        </Link>

        <Link href="/canva/3d-view" className="relative z-10">
          <button
            className={cn(
              'flex h-8 w-12 items-center justify-center rounded-full text-sm font-medium transition-colors',
              is3D
                ? 'text-primary-foreground'
                : 'text-foreground hover:text-primary'
            )}
          >
            <Box />
          </button>
        </Link>
      </div>
    </div>
  );
};

export default CanvasNavButtons;
