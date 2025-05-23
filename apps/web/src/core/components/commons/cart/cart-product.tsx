import { useCartStore } from '@/core/store/cart/store';
import { CartProduct } from '@/core/store/cart/type';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@workspace/ui/components/select';
import { Trash2 } from 'lucide-react';
import { ImageWithFallback } from '../image/image-with-fallback';

interface CartProductProps {
  product: CartProduct;
}

const CartProductComponent: React.FC<CartProductProps> = ({ product }) => {
  const updateProductQuantity = useCartStore(
    (state) => state.updateProductQuantity,
  );
  const removeProduct = useCartStore((state) => state.removeProduct);
  const quantityList = [
    '50',
    '100',
    '150',
    '200',
    '250',
    '300',
    '350',
    '400',
    '450',
    '500',
  ];

  return (
    <div className="flex items-center h-[120px] gap-4">
      <ImageWithFallback
        src={'/images/products/coffee-cup.png'}
        alt="Assistant icon"
        width={80}
        height={100}
        draggable={false}
      />
      <div className="flex flex-col h-full w-full justify-between">
        <div className="flex flex-col gap-2">
          <span className="font-semibold">{product.name}</span>
          <span className="font-light">{product.description}</span>
        </div>
        <Select
          onValueChange={(value) =>
            updateProductQuantity(product.id, Number(value))
          }
        >
          <SelectTrigger className="rounded-none border-0 border-b-2 shadow-none p-0 w-fit min-w-[83px]">
            <SelectValue placeholder="Amount" />
          </SelectTrigger>
          <SelectContent className="h-[200px] overflow-y-auto">
            {quantityList.map((value) => (
              <SelectItem key={`item-${value}`} value={value}>
                {value}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="flex flex-col h-full justify-between items-end">
        <span className="font-semibold">
          ${product.price * product.quantity}
        </span>
        <button
          className="cursor-pointer"
          onClick={() => removeProduct(product.id)}
        >
          <Trash2 className="size-6" color="gray" />
        </button>
      </div>
    </div>
  );
};

export default CartProductComponent;
