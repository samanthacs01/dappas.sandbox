import useUrlParams, { UrlAction, UrlParamsType } from '@/core/hooks/use-url-params';

const useUpdateFilters = () => {
  const { updateSearchParams } = useUrlParams();

  const updateFilter = (
    id: string,
    value: string | string[],
    action: UrlAction = 'set',
  ) => {
    const updates: UrlParamsType[] = [];

    if (value) {
      if (typeof value === 'string') {
        updates.push({
          [id]: { action, value },
        });
      } else if (Array.isArray(value)) {
        updates.push({
          [id]: { action: 'delete', value: '' },
        });
        updates.push(
          ...value.map((v) => ({
            [id]: { action: 'add' as UrlAction, value: v },
          })),
        );
      }
    } else {
      updates.push({
        [id]: { action: 'delete', value: '' },
      });
    }

    updates.push({
      page: { action: 'set', value: '1' },
    });
    updateSearchParams(updates);
  };

  return { updateFilter };
};

export default useUpdateFilters;
