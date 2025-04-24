import { LoaderCircle } from 'lucide-react';
import { FC } from 'react';

type CircularLoadingProps = {
  loading?: boolean;
};

export const CircularLoading: FC<CircularLoadingProps> = ({ loading }) => {
  return (
    loading && <LoaderCircle className="animate-spin w-4 h-4 text-secondary" />
  );
};
