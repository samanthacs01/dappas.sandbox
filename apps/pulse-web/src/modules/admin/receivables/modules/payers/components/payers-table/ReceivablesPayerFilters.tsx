import useUpdateFilters from '@/core/hooks/use-update-filters';
import useUrlParams from '@/core/hooks/use-url-params';
import SearchFilter from '@/modules/commons/filters/SearchFilter';

const ReceivablesPayerFilters = () => {
  const { getUrlParams } = useUrlParams();
  const { updateFilter } = useUpdateFilters();
  const { q } = getUrlParams();

  return (
    <SearchFilter
      {...{
        onChange: (value) => updateFilter('q', value, 'set'),
        value: (q as string) ?? '',
      }}
      className="w-full max-w-md"
    />
  );
};

export default ReceivablesPayerFilters;
