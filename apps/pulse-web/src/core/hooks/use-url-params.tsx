import { useRouter, useSearchParams } from 'next/navigation';

const useUrlParams = () => {
  const { replace } = useRouter();
  const searchParams = useSearchParams();

  const updateSearchParams = (
    _params: UrlParamsType | UrlParamsType[],
    scroll: boolean = false,
  ) => {
    const params = new URLSearchParams(searchParams);
    if (Array.isArray(_params)) {
      _params.forEach((_param) => {
        Object.keys(_param).forEach((key) => {
          const _d = _param[key];
          if (_d.action === 'delete') {
            params.delete(key);
          } else if (_d.action === 'add') {
            params.append(key, _d.value.toString());
          } else if (_d.action === 'set') {
            params.set(key, _d.value.toString());
          }
        });
      });
    } else {
      Object.keys(_params).forEach((key) => {
        const _d = _params[key];
        if (_d.action === 'delete') {
          params.delete(key);
        } else if (_d.action === 'add') {
          params.append(key, _d.value.toString());
        } else if (_d.action === 'set') {
          params.set(key, _d.value.toString());
        }
      });
    }

    replace(`?${params.toString()}`, { scroll });
  };

  const getUrlParams = () => {
    const obj: Record<string, string | string[]> = {};
    for (const [key, value] of Object.entries(searchParams)) {
      if (!obj[key]) {
        obj[key] = value;
      } else {
        if (!Array.isArray(obj[key])) {
          obj[key] = [obj[key]];
        }
        obj[key].push(value);
      }
    }
    return obj;
  };

  return { updateSearchParams, getUrlParams };
};

export type UrlAction = 'add' | 'delete' | 'set';
export type UrlParamsType = Record<
  string,
  { action: UrlAction; value: string | number }
>;

export default useUrlParams;
