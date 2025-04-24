export type PaginatedData<T> = {
  items: T[];
  pagination: Pagination;
};

export type Pagination = {
  page: number;
  per_page: number;
  total: number;
};


export type PaginationFilter = {
  page?: number;
  page_size?: number;
};
