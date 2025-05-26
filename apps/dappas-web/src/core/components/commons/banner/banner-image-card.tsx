import { FC } from 'react';
import { ImageWithFallback } from '../image/image-with-fallback';

type BannerImageCardProps = {
  src: string;
  alt: string;
};

const BannerImageCard: FC<BannerImageCardProps> = ({ src, alt }) => {
  return (
    <div className="w-36 h-36 bg-gray-200 relative flex justify-center items-center">
      <ImageWithFallback
        src={src}
        alt={alt}
        width={36}
        height={36}
        className="w-9 h-9 absolute"
      />
    </div>
  );
};

export default BannerImageCard;
