import { parsePathname } from '@/core/lib/utils';

describe('Test parse pathname function', () => {
  it('should parse single parameter', () => {
    const path: string = '/path/to/:production';
    const params: Record<string, string> = { production: 'test' };
    expect(parsePathname(path, params)).toBe('/path/to/test');
  });
  it('should parse multiple parameters', () => {
    const path: string = '/:production/to/:production';
    const params: Record<string, string> = { production: 'test' };
    expect(parsePathname(path, params)).toBe('/test/to/test');
  });
  it('should parse multiple parameters', () => {
    const path: string = '/:path/:to/:production/';
    const params: Record<string, string> = {
      production: 'test',
      path: 'dashboard',
      to: 'payable',
    };
    expect(parsePathname(path, params)).toBe('/dashboard/payable/test/');
  });
});
