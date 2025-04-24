import { createNewPayerSchema, registerPayFormSchema } from './../../../../src/modules/admin/receivables/utils/schemas';


describe('registerPayFormSchema', () => {
  const maxAmount = 1000; // Example maximum amount

  it('should validate a correct payment amount', () => {
    const schema = registerPayFormSchema(maxAmount);
    const validData = { payment_amount: 500 };

    expect(() => schema.parse(validData)).not.toThrow();
  });

  it('should fail if payment_amount is zero', () => {
    const schema = registerPayFormSchema(maxAmount);
    const invalidData = { payment_amount: 0 };

    expect(() => schema.parse(invalidData)).toThrow(
      'Payment amount is required',
    );
  });

  it('should fail if payment_amount exceeds the maximum allowed', () => {
    const schema = registerPayFormSchema(maxAmount);
    const invalidData = { payment_amount: 1500 };

    expect(() => schema.parse(invalidData)).toThrow(
      'The amount to pay cannot exceed the available balance',
    );
  });

  it('should fail if payment_amount is missing', () => {
    const schema = registerPayFormSchema(maxAmount);
    const invalidData = {};

    expect(() => schema.parse(invalidData)).toThrow('Required');
  });

  it('should fail if payment_amount is not a number', () => {
    const schema = registerPayFormSchema(maxAmount);
    const invalidData = { payment_amount: 'abc' };

    expect(() => schema.parse(invalidData)).toThrow();
  });
});

describe('createNewPayerSchema', () => {
  const validData = {
    entity_name: 'Acme Corp',
    entity_address: '123 Main St',
    contact_name: 'John Doe',
    contact_phone_number: '1234567890',
    contact_email: 'john.doe@example.com',
    payment_terms: 30,
  };
  it('should validate a correct payer object', () => {
    expect(() => createNewPayerSchema.parse(validData)).not.toThrow();
  });

  it('should fail if entity_name is empty', () => {
    const invalidData = { ...validData, entity_name: '' };

    expect(() => createNewPayerSchema.parse(invalidData)).toThrow(
      'Entity name is required',
    );
  });

  it('should fail if contact_name is empty', () => {
    const invalidData = { ...validData, contact_name: '' };

    expect(() => createNewPayerSchema.parse(invalidData)).toThrow(
      'Contact name is required',
    );
  });

  it('should fail if contact_phone_number is empty', () => {
    const invalidData = { ...validData, contact_phone_number: '' };

    expect(() => createNewPayerSchema.parse(invalidData)).toThrow(
      'Contact phone number is required',
    );
  });

  it('should fail if contact_email is not a valid email', () => {
    const invalidData = { ...validData, contact_email: 'invalid-email' };

    expect(() => createNewPayerSchema.parse(invalidData)).toThrow(
      'Contact email is not valid',
    );
  });

  it('should fail if payment_terms is zero or negative', () => {
    const invalidData = { ...validData, payment_terms: 0 };

    expect(() => createNewPayerSchema.parse(invalidData)).toThrow(
      'Payment Terms is not valid',
    );
  });

  it('should fail if payment_terms is missing', () => {
    const { payment_terms, ...invalidData } = validData;

    expect(() => createNewPayerSchema.parse(invalidData)).toThrow('Required');
  });

  it('should allow a null entity_address', () => {
    const valid = {
      ...validData,
      entity_address: null,
    };

    expect(() => createNewPayerSchema.parse(valid)).not.toThrow();
  });
});
