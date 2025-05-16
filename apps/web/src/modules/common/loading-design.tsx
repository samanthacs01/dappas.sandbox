import { ImageWithFallback } from '@/core/components/commons/image/image-with-fallback';
import { useEffect, useState } from 'react';

const LoadingDesign = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [dots, setDots] = useState<number>(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setDots((prev) => (prev + 1) % 4);
    }, 500);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const timeout = setTimeout(() => setLoading(false), 5000);
    return () => clearTimeout(timeout);
  }, []);

  if (!loading) return null;
  return (
    <div className="flex flex-col w-full h-full gap-5 items-center">
      <ImageWithFallback
        src={'/loading-design.svg'}
        alt="Loading design"
        width={96}
        height={96}
      />
      <span className="flex w-[152px]">
        Generating design{'.'.repeat(dots)}
      </span>
    </div>
  );
};

export default LoadingDesign;
