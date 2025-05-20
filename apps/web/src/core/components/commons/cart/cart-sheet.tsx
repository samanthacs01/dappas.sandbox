import { Button } from '@workspace/ui/components/button';
import {
  Sheet,
  SheetContent,
  SheetFooter,
} from '@workspace/ui/components/sheet';
import CartProductComponent from './cart-product';
import { FormProvider, useForm } from 'react-hook-form';

//This type is taken from store
type CartProduct = {
  id: string;
  name: string;
  description: string;
  price: number;
  quantity: number;
  image: string;
};

interface CartSheetProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  products: CartProduct[];
}

const CartSheet: React.FC<CartSheetProps> = ({ open, setOpen, products }) => {
  const methods = useForm<CartProduct>({
    defaultValues: {
      id: '',
      name: '',
      description: '',
      price: 0,
      quantity: 0,
      image: '',
    },
  });

  const onSubmit = (data: unknown) => {
    console.log('Form submitted:', data);
    // Handle form submission logic here
  };
  return (
    <FormProvider {...methods}>
      <form action={'#'} onSubmit={methods.handleSubmit(onSubmit)}>
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetContent className="pt-10 top-16 h-[calc(100vh-4rem)]">
            <div className="overflow-y-auto">
              <div className="flex flex-col gap-10 px-5">
                {products.map((product) => (
                  <CartProductComponent key={product.id} product={product} />
                ))}
              </div>
            </div>
            <SheetFooter>
              <Button type="button" className="rounded-none">
                Keep shopping
              </Button>
              <Button
                type="submit"
                variant={'outline'}
                className="rounded-none"
              >
                Proceed to ckeckout
              </Button>
            </SheetFooter>
          </SheetContent>
        </Sheet>
      </form>
    </FormProvider>
  );
};

export default CartSheet;
