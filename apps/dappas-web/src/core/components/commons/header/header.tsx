import { Button } from '@workspace/ui/components/button';
import Image from 'next/image';

const Header = () => {
  return (
    <header className="bg-white px-16 h-16 py-6 shadow-xs flex items-center justify-between sticky top-0 z-20">
      <div className="flex items-center gap-2">
        <Image src={'/logo.svg'} alt={'Logo'} width={100} height={20.6} />
      </div>
      <Button variant={'ghost'} size={'sm'}>
        Log in
      </Button>
    </header>
  );
};

export default Header;
