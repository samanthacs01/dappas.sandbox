import { parseDynamicEditToFormData } from './../../../../src/modules/admin/payable/libs/utils/parsers';

describe('parseDynamicEditToFormData', () => {
  it('should convert an object to FormData', () => {
    const data = {
      name: 'John',
      age: 30,
      email: 'john@example.com',
    };

    const formData = parseDynamicEditToFormData(data);

    expect(formData.get('name')).toBe('John');
    expect(formData.get('age')).toBe('30');
    expect(formData.get('email')).toBe('john@example.com');
  });

  it('should handle arrays by appending the first element', () => {
    const data = {
      hobbies: ['reading', 'swimming'],
    };

    const formData = parseDynamicEditToFormData(data);

    expect(formData.get('hobbies')).toBe('reading');
  });

  it('should ignore undefined values', () => {
    const data = {
      name: 'John',
      age: undefined,
      email: 'john@example.com',
    };

    const formData = parseDynamicEditToFormData(data);

    expect(formData.get('name')).toBe('John');
    expect(formData.get('age')).toBeNull(); // undefined values are ignored
    expect(formData.get('email')).toBe('john@example.com');
  });

  it('should handle nested objects by converting them to strings', () => {
    const data = {
      name: 'John',
      details: { age: 30, city: 'New York' },
    };

    const formData = parseDynamicEditToFormData(data);

    expect(formData.get('name')).toBe('John');
    expect(formData.get('details')).toBe('[object Object]'); // Nested objects are converted to strings
  });

  it('should handle empty objects', () => {
    const data = {};

    const formData = parseDynamicEditToFormData(data);

    expect([...formData.entries()]).toEqual([]); // FormData should be empty
  });

  it('should handle mixed data types', () => {
    const data = {
      name: 'John',
      age: 30,
      isActive: true,
      hobbies: ['reading', 'swimming'],
      details: { city: 'New York' },
      undefinedValue: undefined,
    };

    const formData = parseDynamicEditToFormData(data);

    expect(formData.get('name')).toBe('John');
    expect(formData.get('age')).toBe('30');
    expect(formData.get('isActive')).toBe('true');
    expect(formData.get('hobbies')).toBe('reading');
    expect(formData.get('details')).toBe('[object Object]');
    expect(formData.get('undefinedValue')).toBeNull(); // undefined values are ignored
  });

  it('should handle null values by converting them to strings', () => {
    const data = {
      name: 'John',
      age: null,
    };

    const formData = parseDynamicEditToFormData(data);

    expect(formData.get('name')).toBe('John');
    expect(formData.get('age')).toBe('null'); // null values are converted to strings
  });
});
