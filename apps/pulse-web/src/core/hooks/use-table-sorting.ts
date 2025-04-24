import { SortingState } from '@tanstack/react-table';
import { Dispatch, useCallback, useEffect, useMemo } from 'react';
import useUrlParams, { UrlParamsType } from './use-url-params';
import {
  parseSortToString,
  parseStringArrayToSortingState,
} from '../lib/parse-sorting';
import { useSearchParams } from 'next/navigation';

type UseTableSortingProps = {
  sorting: SortingState;
  setSorting: Dispatch<React.SetStateAction<SortingState>>;
};

export const useTableSorting = ({
  setSorting,
  sorting,
}: UseTableSortingProps) => {
  const { updateSearchParams } = useUrlParams();
  const searchParams = useSearchParams();
  const oldSort = useMemo(() => searchParams.getAll('sort'), [searchParams]);
  const oldSortStr = useMemo(() => oldSort.join(','), [oldSort]);
  useEffect(() => {
    const newSort: SortingState = parseStringArrayToSortingState(oldSort);
    setSorting(newSort);
  }, [oldSortStr]);

  return useCallback(
    (
      updaterOrState:
        | SortingState
        | ((prevState: SortingState) => SortingState),
    ) => {
      const newSorting =
        typeof updaterOrState === 'function'
          ? updaterOrState(sorting)
          : updaterOrState;

      const updatedSorting = [...sorting];

      newSorting.forEach((newSort) => {
        const existingIndex = updatedSorting.findIndex(
          (sort) => sort.id === newSort.id,
        );
        if (
          existingIndex !== -1 &&
          !newSort.desc &&
          sorting[existingIndex].desc !== newSort.desc
        ) {
          updatedSorting.splice(existingIndex, 1);
        } else if (existingIndex !== -1) {
          updatedSorting[existingIndex] = newSort;
        } else {
          updatedSorting.push(newSort);
        }
      });

      if (updatedSorting.length) {
        const actions: UrlParamsType[] = [
          { sort: { action: 'delete', value: '' } },
        ];
        updatedSorting.forEach((sort, index) => {
          actions.push({
            sort: {
              action: index ? 'add' : 'set',
              value: parseSortToString(sort),
            },
          });
        });
        updateSearchParams(actions);
      } else if (!updatedSorting.length) {
        updateSearchParams({ sort: { action: 'delete', value: '' } });
      }
    },
    [sorting, searchParams.toString()],
  );
};
