'use client';

import { ImgHTMLAttributes, useState } from 'react';

interface ImageWithFallbackProps
  extends Omit<ImgHTMLAttributes<HTMLImageElement>, 'onError'> {
  fallbackSrc?: string;
  alt: string;
}

export default function Image({
  src,
  fallbackSrc = '/default-image.svg',
  alt,
  ...props
}: ImageWithFallbackProps) {
  const [imgSrc, setImgSrc] = useState<string>(src && src.length > 0 ? src : fallbackSrc);

  const handleError = () => {
    setImgSrc(fallbackSrc);
  };

  return <img {...props} src={imgSrc} alt={alt} onError={handleError} />;
}
