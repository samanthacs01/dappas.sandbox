import { cn, parsePathname } from '@/core/lib/utils';

describe('Test utils functions', () => {
  it('should return all string joined', () => {
    expect(cn('flex flex-col', 'gap-4')).toBe('flex flex-col gap-4');
  });

  it('should return all string joined', () => {
    expect(cn('flex flex-col', '')).toBe('flex flex-col');
  });

  it('should return all string joined', () => {
    expect(cn('', 'gap-4')).toBe('gap-4');
  });

  it('should return all string joined', () => {
    expect(cn('flex flex-col', 'gap-4', 'bg-white')).toBe(
      'flex flex-col gap-4 bg-white',
    );
  });

  it('should return all keys replaced', () => {
    expect(cn('flex flex-col', 'gap-4', 'bg-white')).toBe(
      'flex flex-col gap-4 bg-white',
    );
  });

  it('should replace single parameter in path with provided string value', () => {
    const path = '/users/:id';
    const params = { id: 'abc123' };

    const result = parsePathname(path, params);

    expect(result).toBe('/users/abc123');
  });

  it('should replace all occurrences of parameter in path', () => {
    const path = '/users/:id/posts/:id/comments';
    const params = { id: '123' };

    const result = parsePathname(path, params);

    expect(result).toBe('/users/123/posts/123/comments');
  });
});
