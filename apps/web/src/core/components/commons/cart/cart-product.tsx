import RHFSelect from '../form-inputs/rhf-select';
import { ImageWithFallback } from '../image/image-with-fallback';
import { Trash2 } from 'lucide-react';

//This type is taken from store
type CartProduct = {
  id: string;
  name: string;
  description: string;
  price: number;
  quantity: number;
  image: string;
};

interface CartProductProps {
  product: CartProduct;
}

const CartProduct: React.FC<CartProductProps> = ({ product }) => {
  const quantitySelectionList = [
    { label: '50', value: '50' },
    { label: '100', value: '100' },
    { label: '150', value: '150' },
    { label: '200', value: '200' },
    { label: '250', value: '250' },
    { label: '300', value: '300' },
    { label: '350', value: '350' },
    { label: '400', value: '400' },
    { label: '450', value: '450' },
    { label: '500', value: '500' },
  ];

  //These functions are taken from store
  const updateProductQuantity = (id: string, value: string) => {
    console.log(id, value);
  };
  const removeProduct = (id: string) => {
    console.log('Removed product: ', id);
  };

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
        <RHFSelect
          name={product.id}
          placeholder="Account"
          options={quantitySelectionList}
          labelOrientation="horizontal"
          onValueChange={(value) => updateProductQuantity(product.id, value)}
          className="rounded-none border-0 border-b-2 shadow-none p-0 w-fit min-w-[83px]"
        />
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

export default CartProduct;
