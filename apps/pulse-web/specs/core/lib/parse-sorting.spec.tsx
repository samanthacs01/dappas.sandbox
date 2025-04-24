import {
  parseSortingStateToString,
  parseSortToString,
  parseStringArrayToSortingState,
  parseStringToSort,
} from '@/core/lib/parse-sorting';
import { ColumnSort, SortingState } from '@tanstack/react-table';

describe('Test parse sorting functions', () => {
  it('should return impressions', () => {
    const sorting: ColumnSort = { id: 'impressions', desc: false };
    expect(parseSortToString(sorting)).toBe('impressions');
  });

  it('should return -impressions', () => {
    const sorting: ColumnSort = { id: 'impressions', desc: true };
    expect(parseSortToString(sorting)).toBe('-impressions');
  });

  it('should return sort column', () => {
    const sorting: ColumnSort = { id: 'impressions', desc: true };
    expect(parseStringToSort('-impressions')).toEqual(sorting);
  });

  it('should return sort column', () => {
    const sorting: ColumnSort = { id: 'impressions', desc: false };
    expect(parseStringToSort('impressions')).toEqual(sorting);
  });

  it('should return sort column', () => {
    const sorting: ColumnSort = { id: 'impressions', desc: false };
    expect(parseStringToSort('impressions')).toEqual(sorting);
  });

  it('should return string array', () => {
    const sorting: SortingState = [
      { id: 'impressions', desc: false },
      { id: 'cost', desc: true },
      { id: 'revenue', desc: false },
    ];
    const result: string[] = ['impressions', '-cost', 'revenue'];
    expect(parseSortingStateToString(sorting)).toEqual(result);
  });

  it('should return string sorting state', () => {
    const result: SortingState = [
      { id: 'impressions', desc: false },
      { id: 'cost', desc: true },
      { id: 'revenue', desc: false },
    ];
    const state: string[] = ['impressions', '-cost', 'revenue'];
    expect(parseStringArrayToSortingState(state)).toEqual(result);
  });
});
