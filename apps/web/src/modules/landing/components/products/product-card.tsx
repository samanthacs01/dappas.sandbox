import Image from '@/core/commons/image-with-fallback';
import { Product } from '@/server/shopify/types';
import { Button } from '@workspace/ui/components/button';

type ProductCardProps = {
  product: Product;
};

const ProductCard = ({ product }: ProductCardProps) => {
  return (
    <div className="flex flex-col gap-4 cursor-pointer hover:opacity-80 p-4 rounded-lg transition-all duration-200 hover:shadow-lg">
      <Image
        src={product.images[0].url}
        alt={product.title}
        className="w-full h-[500px] object-cover rounded-lg"
      />
      <div className="flex flex-row gap-4 px-2 justify-between items-center">
        <h3 className="text-xl font-medium truncate">{product.title}</h3>
        <Button variant="default" size="lg">
          Start creating
        </Button>
      </div>
    </div>
  );
};

export default ProductCard;
