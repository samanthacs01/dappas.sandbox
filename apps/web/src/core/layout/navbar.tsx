import { Button } from '@workspace/ui/components/button';
import { Link } from 'react-router';
import CartSheet from '../components/commons/cart/cart-sheet';
import { useState } from 'react';
import { _products } from '@/_mock/_products';

const Navbar = () => {
  const [open, setOpen] = useState(false);
  return (
    <nav className="bg-white h-16 shadow-xs sticky top-0 z-50">
      <section className="flex items-center justify-between px-10 h-full">
        <div className="flex items-center gap-2">
          <Link to="/">
            <img src={'/logo.svg'} alt={'Logo'} width={100} height={20} />
          </Link>
        </div>
        <div className="">
          <Button variant={'ghost'} size={'lg'} onClick={() => setOpen(!open)}>
            Cart
          </Button>
          <Button variant={'ghost'} size={'lg'}>
            Log in
          </Button>
          <CartSheet open={open} setOpen={setOpen} products={_products} />
        </div>
      </section>
    </nav>
  );
};

export default Navbar;
