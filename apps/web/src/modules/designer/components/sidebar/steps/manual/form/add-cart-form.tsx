import { Button } from '@workspace/ui/components/button';
import { Separator } from '@workspace/ui/components/separator';
import { ArrowLeft, Truck } from 'lucide-react';
import { Link } from 'react-router';
import ImageWithFallback from '../../../../../../../core/components/commons/image-with-fallback.js';
import RHFSelect from '@/core/components/commons/form-inputs/rhf-select';
import { FormProvider, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { CartInfoSchema, CartInfoType } from './schemas';
import { useDesignerStore } from '@/core/store/cart/store.js';
import { CartProduct } from '@/core/store/cart/type.js';

interface AddCartFormProps {
  product: CartProduct;
}

const AddCartForm: React.FC<AddCartFormProps> = ({ product }) => {
  const addProduct = useDesignerStore((state) => state.addProduct);
  const updateProductQuantity = useDesignerStore(
    (state) => state.updateProductQuantity,
  );
  const setShowCart = useDesignerStore((state) => state.setShowCart);
  const methods = useForm<CartInfoType>({
    defaultValues: {
      quantity: 0,
    },
    resolver: zodResolver(CartInfoSchema),
  });

  const quenatityList = [
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

  const addProductToCart = () => {
    addProduct(product);
    setShowCart(true);
  };

  return (
    <FormProvider {...methods}>
      <form
        action={'#'}
        className="w-full h-full flex flex-col items-center justify-between"
      >
        <div className="flex flex-col gap-6">
          <div className="flex items-center gap-2">
            <ArrowLeft />
            <Link to={'/designer'}>Back to designs</Link>
          </div>
          <Separator className="bg-zinc-400" />
          <div className="flex items-start gap-6">
            <ImageWithFallback
              src={'/assistant-logo.svg'}
              alt="Assistant icon"
              width={16}
              height={16}
              className="mt-1"
            />
            <div className="text-sm">
              Great choice! Now select the quantity you’d like to order
            </div>
          </div>
          <RHFSelect
            name="quantity"
            placeholder="Select quantity"
            options={quenatityList}
            labelOrientation="horizontal"
            className="rounded-none border-0 border-b"
            value={product.quantity.toString()}
            onValueChange={(value) => {
              updateProductQuantity(product.id, Number(value));
            }}
          />
        </div>
        <div className="flex flex-col w-[380px] justify-start gap-8">
          <div className="flex flex-col gap-3">
            <div className="flex justify-between items-start">
              <div className="flex gap-3">
                <Truck />
                <div className="flex flex-col w-[80%]">
                  <span>Delivered in 3-5 business days</span>
                  <span className="text-sm font-light">
                    Shipping calculated to Atlanta, GA. Adjust in next step if
                    necessary
                  </span>
                </div>
              </div>
              <span>${product.price}</span>
            </div>
            <Separator className="bg-zinc-400" />
            <div className="flex justify-between">
              <span>Total (excl VAT)</span>
              <span>${product.price * product.quantity}</span>
            </div>
          </div>
          <Button className="w-full rounded-none" onClick={addProductToCart}>
            Add to cart
          </Button>
        </div>
      </form>
    </FormProvider>
  );
};

export default AddCartForm;
