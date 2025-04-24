import { Params, SearchParams } from './params';

export type PageProps = Readonly<{
  searchParams: Promise<SearchParams>;
  params: Promise<Params>;
}>;
