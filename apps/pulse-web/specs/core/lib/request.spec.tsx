import { QueryParamsURLFactory } from '@/core/lib/request';
import { SearchParams } from '@/server/types/params';

describe('QueryParamsURLFactory', () => {
  it('should create a URL with query parameters', () => {
    const baseUrl = 'https://example.com';
    const params: SearchParams = {
      foo: 'bar',
      baz: 'qux',
      page: 1,
      page_size: 2,
    };
    const result = new QueryParamsURLFactory(baseUrl, params);
    expect(result.build()).toBe('https://example.com/?foo=bar&baz=qux&page=1&page_size=2');
  });

  it('should handle empty parameters', () => {
    const baseUrl = 'https://example.com';
    const params: SearchParams = {} as SearchParams;
    const result = new QueryParamsURLFactory(baseUrl, params);
    expect(result.build()).toBe('https://example.com/');
  });

  it('should encode query parameters', () => {
    const baseUrl = 'https://example.com';
    const params: SearchParams = {
      'foo bar': 'baz qux',
      page: 1,
      page_size: 10,
    };
    const result = new QueryParamsURLFactory(baseUrl, params);
    expect(result.build()).toBe('https://example.com/?foo+bar=baz+qux&page=1&page_size=10');
  });
});
