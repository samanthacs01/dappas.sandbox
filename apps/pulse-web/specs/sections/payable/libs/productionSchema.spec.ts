import { productionsSchema } from './../../../../src/modules/admin/payable/libs/utils/schema';

describe('productionsSchema', () => {
  const validData = {
    entity_name: 'Acme Productions',
    entity_address: '123 Main St',
    contact_name: 'John Doe',
    contact_phone_number: '1234567890',
    contact_email: 'john.doe@example.com',
    production_split: 50.5,
    production_billing_type: 'billing',
    net_payment_terms: 30,
    production_expense_recoupment_type: 'before',
    contract_file: {
      name: 'contract.pdf',
      path: 'https://example.com/contract.pdf',
    },
  };
  it('should validate a correct production object', () => {
    expect(() => productionsSchema.parse(validData)).not.toThrow();
  });

  it('should fail if entity_name is less than 2 characters', () => {
    const invalidData = { ...validData, entity_name: 'A' };

    expect(() => productionsSchema.parse(invalidData)).toThrow(
      'Entity name must be at least 2 characters',
    );
  });

  it('should fail if contact_name is less than 2 characters', () => {
    const invalidData = { ...validData, contact_name: 'J' };

    expect(() => productionsSchema.parse(invalidData)).toThrow(
      'Contact name must be at least 2 characters',
    );
  });

  it('should fail if contact_phone_number is less than 10 characters', () => {
    const invalidData = { ...validData, contact_phone_number: '12345' };

    expect(() => productionsSchema.parse(invalidData)).toThrow(
      'Contact phone number must be at least 10 characters',
    );
  });

  it('should fail if contact_email is not a valid email', () => {
    const invalidData = { ...validData, contact_email: 'invalid-email' };

    expect(() => productionsSchema.parse(invalidData)).toThrow(
      'Invalid email address',
    );
  });

  it('should fail if production_split is not between 1 and 100', () => {
    const invalidData = { ...validData, production_split: 150 };

    expect(() => productionsSchema.parse(invalidData)).toThrow(
      'Please enter a number between 1 and 100, with up to one digit after the decimal point',
    );
  });

  it('should fail if net_payment_terms is not an integer', () => {
    const invalidData = { ...validData, net_payment_terms: 10.5 };

    expect(() => productionsSchema.parse(invalidData)).toThrow(
      'Net payment terms must be a integer value',
    );
  });

  it('should fail if contract_file is missing', () => {
    const invalidData = { ...validData, contract_file: null };

    expect(() => productionsSchema.parse(invalidData)).toThrow(
      'Contract is required',
    );
  });

  it('should allow an existing contract file with a valid URL', () => {
    const valid = {
      ...validData,
      contract_file: {
        name: 'contract.pdf',
        path: 'https://example.com/contract.pdf',
      },
    };

    expect(() => productionsSchema.parse(valid)).not.toThrow();
  });
});
