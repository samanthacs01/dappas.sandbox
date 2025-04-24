import { getChangedValues } from './../../../../src/modules/admin/payable/libs/utils/index';

describe('getChangedValues', () => {
  it('should return an empty object if no values have changed', () => {
    const initialValues = { name: 'John', age: 30 };
    const currentValues = { name: 'John', age: 30 };

    const result = getChangedValues(initialValues, currentValues);
    expect(result).toEqual({});
  });

  it('should return an object with changed values', () => {
    const initialValues = { name: 'John', age: 30 };
    const currentValues = { name: 'Jane', age: 30 };

    const result = getChangedValues(initialValues, currentValues);
    expect(result).toEqual({ name: 'Jane' });
  });

  it('should return an object with all values if all values have changed', () => {
    const initialValues = { name: 'John', age: 30 };
    const currentValues = { name: 'Jane', age: 25 };

    const result = getChangedValues(initialValues, currentValues);
    expect(result).toEqual({ name: 'Jane', age: 25 });
  });

  it('should handle nested objects', () => {
    const initialValues = {
      name: 'John',
      details: { age: 30, city: 'New York' },
    };
    const currentValues = {
      name: 'John',
      details: { age: 30, city: 'Los Angeles' },
    };

    const result = getChangedValues(initialValues, currentValues);
    expect(result).toEqual({ details: { age: 30, city: 'Los Angeles' } });
  });

  it('should handle arrays', () => {
    const initialValues = { name: 'John', hobbies: ['reading', 'swimming'] };
    const currentValues = { name: 'John', hobbies: ['reading', 'running'] };

    const result = getChangedValues(initialValues, currentValues);
    expect(result).toEqual({ hobbies: ['reading', 'running'] });
  });

  it('should handle empty objects', () => {
    const initialValues = {};
    const currentValues = {};

    const result = getChangedValues(initialValues, currentValues);
    expect(result).toEqual({});
  });

  it('should handle objects with different keys', () => {
    const initialValues = { name: 'John' };
    const currentValues = { name: 'John', age: 30 };

    const result = getChangedValues(initialValues, currentValues);
    expect(result).toEqual({ age: 30 });
  });

  it('should handle objects with missing keys in currentValues', () => {
    const initialValues = { name: 'John', age: 30 };
    const currentValues = { name: 'John' };

    const result = getChangedValues(initialValues, currentValues);
    expect(result).toEqual({});
  });

  it('should handle objects with missing keys in initialValues', () => {
    const initialValues = { name: 'John' };
    const currentValues = { name: 'John', age: 30 };

    const result = getChangedValues(initialValues, currentValues);
    expect(result).toEqual({ age: 30 });
  });
});
