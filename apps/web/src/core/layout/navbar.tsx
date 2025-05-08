import { Button } from '@workspace/ui/components/button';

const Navbar = () => {
  return (
    <nav className="bg-white h-16 shadow-xs sticky top-0 z-20">
      <section className="flex items-center justify-between px-10 h-full">
        <div className="flex items-center gap-2">
          <img src={'/logo.svg'} alt={'Logo'} width={100} height={20} />
        </div>
        <Button variant={'ghost'} size={'lg'}>
          Log in
        </Button>
      </section>
    </nav>
  );
};

export default Navbar;
