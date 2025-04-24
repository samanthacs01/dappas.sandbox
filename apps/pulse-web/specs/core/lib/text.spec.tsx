import { normalizeText } from '@/core/lib/text';

describe('normalizeText', () => {
  it('should normalize text with diacritics', () => {
    expect(normalizeText('café')).toBe('cafe');
  });

  it('should convert text to lowercase', () => {
    expect(normalizeText('Hello World')).toBe('hello world');
  });

  it('should replace multiple spaces with a single space', () => {
    expect(normalizeText('hello    world')).toBe('hello world');
  });

  it('should trim leading and trailing spaces', () => {
    expect(normalizeText('  hello world  ')).toBe('hello world');
  });

  it('should handle combined cases', () => {
    expect(normalizeText('  Héllo    Wörld  ')).toBe('hello world');
  });
});