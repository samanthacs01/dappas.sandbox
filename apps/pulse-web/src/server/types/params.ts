export type SearchParams = {
  sort?: string | string[];
  q?: string;
  page?: number;
  page_size?: number;
  currentModal?: string;
  currentTab?: string;
  id?: string;
  chart?: string;
} & Record<string, string | number | string[]>;

export type Params = Record<string, string>;
