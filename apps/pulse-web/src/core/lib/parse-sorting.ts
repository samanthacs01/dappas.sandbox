import { ColumnSort, SortingState } from '@tanstack/react-table';

export const parseSortToString = (sort: ColumnSort): string => {
  return sort.desc ? `-${sort.id}` : `${sort.id}`;
};

export const parseSortingStateToString = (sorting: SortingState): string[] => {
  return sorting.map(parseSortToString);
};

export const parseStringToSort = (sortString: string): ColumnSort => {
  if (sortString.startsWith('-')) {
    return {
      id: sortString.slice(1),
      desc: true
    };
  }
  
  return {
    id: sortString,
    desc: false
  };
};

export const parseStringArrayToSortingState = (sortStrings: string[]): SortingState => {
  return sortStrings.map(parseStringToSort);
};