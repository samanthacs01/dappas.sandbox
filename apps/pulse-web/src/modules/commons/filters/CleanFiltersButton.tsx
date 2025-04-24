import { Button } from '@/core/components/ui/button';
import { cn } from '@/core/lib/utils';
import { FilterX } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import { FC } from 'react';

type CleanFiltersButtonProps = {
  expanded?: boolean;
};

export const CleanFiltersButton: FC<CleanFiltersButtonProps> = ({
  expanded = false,
}) => {
  const pathname = usePathname();
  const { replace } = useRouter();

  const clear = () => {
    replace(pathname);
  };

  return (
    <Button
      variant={'outline'}
      onClick={clear}
      className={cn('h-9', expanded ? 'w-auto' : 'w-9')}
    >
      <FilterX /> {expanded && 'Clear filters'}
    </Button>
  );
};
