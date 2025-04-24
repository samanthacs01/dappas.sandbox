import { z } from 'zod';
import { expenseSchema } from './../../../../src/modules/admin/expenses/libs/schemas';

describe('expenseSchema', () => {
  it('should validate correct input with File', () => {
    const validInput = {
      files: [new File(['content'], 'test.txt', { type: 'text/plain' })],
      month: '2023-10',
      production_id: 1,
      total_deduction: 100,
    };

    expect(() => expenseSchema.parse(validInput)).not.toThrow();
  });

  it('should validate correct input with existingFileSchema', () => {
    const validInput = {
      files: [{ name: 'test.txt', path: 'https://example.com/test.txt' }],
      month: '2023-10',
      production_id: 1,
      total_deduction: 100,
    };

    expect(() => expenseSchema.parse(validInput)).not.toThrow();
  });

  it('should throw an error if files contain invalid types', () => {
    const invalidInput = {
      files: ['invalid-file'],
      month: '2023-10',
      production_id: 1,
      total_deduction: 100,
    };

    expect(() => expenseSchema.parse(invalidInput)).toThrow(z.ZodError);
  });

  it('should throw an error if month is missing', () => {
    const invalidInput = {
      files: [new File(['content'], 'test.txt', { type: 'text/plain' })],
      production_id: 1,
      total_deduction: 100,
    };

    expect(() => expenseSchema.parse(invalidInput)).toThrow(z.ZodError);
  });

  it('should throw an error if production_id is missing', () => {
    const invalidInput = {
      files: [new File(['content'], 'test.txt', { type: 'text/plain' })],
      month: '2023-10',
      total_deduction: 100,
    };

    expect(() => expenseSchema.parse(invalidInput)).toThrow(z.ZodError);
  });

  it('should throw an error if production_id is not a number', () => {
    const invalidInput = {
      files: [new File(['content'], 'test.txt', { type: 'text/plain' })],
      month: '2023-10',
      production_id: 'not-a-number',
      total_deduction: 100,
    };

    expect(() => expenseSchema.parse(invalidInput)).toThrow(z.ZodError);
  });

  it('should throw an error if total_deduction is missing', () => {
    const invalidInput = {
      files: [new File(['content'], 'test.txt', { type: 'text/plain' })],
      month: '2023-10',
      production_id: 1,
    };

    expect(() => expenseSchema.parse(invalidInput)).toThrow(z.ZodError);
  });

  it('should throw an error if total_deduction is not a number', () => {
    const invalidInput = {
      files: [new File(['content'], 'test.txt', { type: 'text/plain' })],
      month: '2023-10',
      production_id: 1,
      total_deduction: 'not-a-number',
    };

    expect(() => expenseSchema.parse(invalidInput)).toThrow(z.ZodError);
  });

  it('should throw an error if production_id is less than 1', () => {
    const invalidInput = {
      files: [new File(['content'], 'test.txt', { type: 'text/plain' })],
      month: '2023-10',
      production_id: 0,
      total_deduction: 100,
    };

    expect(() => expenseSchema.parse(invalidInput)).toThrow(z.ZodError);
  });

  it('should throw an error if total_deduction is less than 1', () => {
    const invalidInput = {
      files: [new File(['content'], 'test.txt', { type: 'text/plain' })],
      month: '2023-10',
      production_id: 1,
      total_deduction: 0,
    };

    expect(() => expenseSchema.parse(invalidInput)).toThrow(z.ZodError);
  });
});
