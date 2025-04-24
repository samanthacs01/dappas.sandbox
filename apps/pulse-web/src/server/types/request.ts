import { PaginationFilter } from './pagination';

export type ISort = {
  field: string;
  isAsc: boolean;
};

export type IPagination = {
  page: number;
  page_size: number;
};

export type IQueryable = {
  filters?: Record<string, string>[];
  q?: string;
  sorts?: ISort[];
  pagination?: PaginationFilter;
} & Record<string, unknown>;
