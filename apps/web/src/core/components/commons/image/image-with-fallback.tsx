'use client';

import { useState } from 'react';

interface ImageWithFallbackProps extends Omit<React.ImgHTMLAttributes<HTMLImageElement>, 'onError'> {
  fallbackSrc?: string;
  alt: string;
}

export function ImageWithFallback({
  src,
  fallbackSrc = '/default-image.svg',
  alt,
  ...props
}: ImageWithFallbackProps) {
  const [imgSrc, setImgSrc] = useState<string>(
    typeof src === 'string' ? src : fallbackSrc,
  );

  const handleError = () => {
    setImgSrc(fallbackSrc);
  };

  return <img {...props} src={imgSrc} alt={alt} onError={handleError} />;
}
