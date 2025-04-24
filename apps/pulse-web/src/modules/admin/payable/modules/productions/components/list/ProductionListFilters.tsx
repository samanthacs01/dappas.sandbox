'use client';
import useUrlParams, { UrlAction } from '@/core/hooks/use-url-params';
import SearchFilter from '@/modules/commons/filters/SearchFilter';

const ProductionListFilters = () => {
  const { updateSearchParams, getUrlParams } = useUrlParams();

  const { q } = getUrlParams();

  const handleUpdateFilter = (
    id: string,
    value: string,
    action: UrlAction = 'add',
  ) => {
    if (value) {
      updateSearchParams({
        [id]: { action, value },
      });
    } else {
      updateSearchParams({
        [id]: { action: 'delete', value: '' },
      });
    }
  };

  return (
    <div className="flex gap-4">
      <SearchFilter
        onChange={(value) => handleUpdateFilter('q', value, 'set')}
        value={(q as string) ?? ''}
      />
    </div>
  );
};

export default ProductionListFilters;
