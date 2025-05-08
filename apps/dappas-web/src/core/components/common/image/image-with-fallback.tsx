'use client';

import Image, { type ImageProps } from 'next/image';
import { useState } from 'react';

interface ImageWithFallbackProps extends Omit<ImageProps, 'onError' | 'src'> {
  fallbackSrc?: string;
  src: string | null;
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

  return <Image {...props} src={imgSrc} alt={alt} onError={handleError} />;
}
