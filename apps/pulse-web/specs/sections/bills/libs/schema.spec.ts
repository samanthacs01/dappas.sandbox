import { z } from 'zod';
import { productionsSchema } from './../../../../src/modules/admin/payable/libs/utils/schema';
import { registerBillsPaymentSchema } from './../../../../src/modules/admin/payable/modules/bills/components/forms/libs/schemas';

describe('productionsSchema', () => {
  it('should throw an error if contact_name is missing', () => {
    const invalidInput = {
      entity_name: 'Test Entity',
      entity_address: '123 Test St',
      contact_phone_number: '1234567890',
      contact_email: 'test@example.com',
      production_split: 50.5,
      production_billing_type: 'billing',
      net_payment_terms: 30,
      production_expense_recoupment_type: 'before',
      contract_file: new File(['content'], 'contract.pdf', {
        type: 'application/pdf',
      }),
    };

    expect(() => productionsSchema.parse(invalidInput)).toThrow(z.ZodError);
  });

  it('should throw an error if contact_phone_number is missing', () => {
    const invalidInput = {
      entity_name: 'Test Entity',
      entity_address: '123 Test St',
      contact_name: 'John Doe',
      contact_email: 'test@example.com',
      production_split: 50.5,
      production_billing_type: 'billing',
      net_payment_terms: 30,
      production_expense_recoupment_type: 'before',
      contract_file: new File(['content'], 'contract.pdf', {
        type: 'application/pdf',
      }),
    };

    expect(() => productionsSchema.parse(invalidInput)).toThrow(z.ZodError);
  });

  it('should throw an error if contact_email is missing', () => {
    const invalidInput = {
      entity_name: 'Test Entity',
      entity_address: '123 Test St',
      contact_name: 'John Doe',
      contact_phone_number: '1234567890',
      production_split: 50.5,
      production_billing_type: 'billing',
      net_payment_terms: 30,
      production_expense_recoupment_type: 'before',
      contract_file: new File(['content'], 'contract.pdf', {
        type: 'application/pdf',
      }),
    };

    expect(() => productionsSchema.parse(invalidInput)).toThrow(z.ZodError);
  });

  it('should throw an error if production_split is missing', () => {
    const invalidInput = {
      entity_name: 'Test Entity',
      entity_address: '123 Test St',
      contact_name: 'John Doe',
      contact_phone_number: '1234567890',
      contact_email: 'test@example.com',
      production_billing_type: 'billing',
      net_payment_terms: 30,
      production_expense_recoupment_type: 'before',
      contract_file: new File(['content'], 'contract.pdf', {
        type: 'application/pdf',
      }),
    };

    expect(() => productionsSchema.parse(invalidInput)).toThrow(z.ZodError);
  });

  it('should throw an error if production_billing_type is missing', () => {
    const invalidInput = {
      entity_name: 'Test Entity',
      entity_address: '123 Test St',
      contact_name: 'John Doe',
      contact_phone_number: '1234567890',
      contact_email: 'test@example.com',
      production_split: 50.5,
      net_payment_terms: 30,
      production_expense_recoupment_type: 'before',
      contract_file: new File(['content'], 'contract.pdf', {
        type: 'application/pdf',
      }),
    };

    expect(() => productionsSchema.parse(invalidInput)).toThrow(z.ZodError);
  });

  it('should throw an error if net_payment_terms is missing', () => {
    const invalidInput = {
      entity_name: 'Test Entity',
      entity_address: '123 Test St',
      contact_name: 'John Doe',
      contact_phone_number: '1234567890',
      contact_email: 'test@example.com',
      production_split: 50.5,
      production_billing_type: 'billing',
      production_expense_recoupment_type: 'before',
      contract_file: new File(['content'], 'contract.pdf', {
        type: 'application/pdf',
      }),
    };

    expect(() => productionsSchema.parse(invalidInput)).toThrow(z.ZodError);
  });

  it('should throw an error if production_expense_recoupment_type is missing', () => {
    const invalidInput = {
      entity_name: 'Test Entity',
      entity_address: '123 Test St',
      contact_name: 'John Doe',
      contact_phone_number: '1234567890',
      contact_email: 'test@example.com',
      production_split: 50.5,
      production_billing_type: 'billing',
      net_payment_terms: 30,
      contract_file: new File(['content'], 'contract.pdf', {
        type: 'application/pdf',
      }),
    };

    expect(() => productionsSchema.parse(invalidInput)).toThrow(z.ZodError);
  });

  it('should throw an error if contract_file is missing', () => {
    const invalidInput = {
      entity_name: 'Test Entity',
      entity_address: '123 Test St',
      contact_name: 'John Doe',
      contact_phone_number: '1234567890',
      contact_email: 'test@example.com',
      production_split: 50.5,
      production_billing_type: 'billing',
      net_payment_terms: 30,
      production_expense_recoupment_type: 'before',
    };

    expect(() => productionsSchema.parse(invalidInput)).toThrow(z.ZodError);
  });

  // Invalid field values
  it('should throw an error if entity_name is too short', () => {
    const invalidInput = {
      entity_name: 'A', // Too short
      entity_address: '123 Test St',
      contact_name: 'John Doe',
      contact_phone_number: '1234567890',
      contact_email: 'test@example.com',
      production_split: 50.5,
      production_billing_type: 'billing',
      net_payment_terms: 30,
      production_expense_recoupment_type: 'before',
      contract_file: new File(['content'], 'contract.pdf', {
        type: 'application/pdf',
      }),
    };

    expect(() => productionsSchema.parse(invalidInput)).toThrow(z.ZodError);
  });

  it('should throw an error if contact_name is too short', () => {
    const invalidInput = {
      entity_name: 'Test Entity',
      entity_address: '123 Test St',
      contact_name: 'J', // Too short
      contact_phone_number: '1234567890',
      contact_email: 'test@example.com',
      production_split: 50.5,
      production_billing_type: 'billing',
      net_payment_terms: 30,
      production_expense_recoupment_type: 'before',
      contract_file: new File(['content'], 'contract.pdf', {
        type: 'application/pdf',
      }),
    };

    expect(() => productionsSchema.parse(invalidInput)).toThrow(z.ZodError);
  });

  it('should throw an error if contact_phone_number is too short', () => {
    const invalidInput = {
      entity_name: 'Test Entity',
      entity_address: '123 Test St',
      contact_name: 'John Doe',
      contact_phone_number: '123', // Too short
      contact_email: 'test@example.com',
      production_split: 50.5,
      production_billing_type: 'billing',
      net_payment_terms: 30,
      production_expense_recoupment_type: 'before',
      contract_file: new File(['content'], 'contract.pdf', {
        type: 'application/pdf',
      }),
    };

    expect(() => productionsSchema.parse(invalidInput)).toThrow(z.ZodError);
  });

  it('should throw an error if contact_email is invalid', () => {
    const invalidInput = {
      entity_name: 'Test Entity',
      entity_address: '123 Test St',
      contact_name: 'John Doe',
      contact_phone_number: '1234567890',
      contact_email: 'invalid-email', // Invalid email
      production_split: 50.5,
      production_billing_type: 'billing',
      net_payment_terms: 30,
      production_expense_recoupment_type: 'before',
      contract_file: new File(['content'], 'contract.pdf', {
        type: 'application/pdf',
      }),
    };

    expect(() => productionsSchema.parse(invalidInput)).toThrow(z.ZodError);
  });

  it('should throw an error if production_split is invalid', () => {
    const invalidInput = {
      entity_name: 'Test Entity',
      entity_address: '123 Test St',
      contact_name: 'John Doe',
      contact_phone_number: '1234567890',
      contact_email: 'test@example.com',
      production_split: 101, // Invalid value
      production_billing_type: 'billing',
      net_payment_terms: 30,
      production_expense_recoupment_type: 'before',
      contract_file: new File(['content'], 'contract.pdf', {
        type: 'application/pdf',
      }),
    };

    expect(() => productionsSchema.parse(invalidInput)).toThrow(z.ZodError);
  });

  it('should throw an error if net_payment_terms is less than 1', () => {
    const invalidInput = {
      entity_name: 'Test Entity',
      entity_address: '123 Test St',
      contact_name: 'John Doe',
      contact_phone_number: '1234567890',
      contact_email: 'test@example.com',
      production_split: 50.5,
      production_billing_type: 'billing',
      net_payment_terms: 0, // Invalid value
      production_expense_recoupment_type: 'before',
      contract_file: new File(['content'], 'contract.pdf', {
        type: 'application/pdf',
      }),
    };

    expect(() => productionsSchema.parse(invalidInput)).toThrow(z.ZodError);
  });
});

describe('registerBillsPaymentSchema', () => {
  const maxAmount = 1000;
  const schema = registerBillsPaymentSchema(maxAmount);

  it('should validate correct input', () => {
    const validInput = { amount: 500 };
    expect(() => schema.parse(validInput)).not.toThrow();
  });

  it('should throw an error if amount is less than 0', () => {
    const invalidInput = { amount: -1 };
    expect(() => schema.parse(invalidInput)).toThrow(z.ZodError);
  });

  it('should throw an error if amount is 0', () => {
    const invalidInput = { amount: 0 };
    expect(() => schema.parse(invalidInput)).toThrow(z.ZodError);
  });

  it('should throw an error if amount exceeds the maximum allowed', () => {
    const invalidInput = { amount: 1001 }; // Exceeds maxAmount
    expect(() => schema.parse(invalidInput)).toThrow(z.ZodError);
  });

  it('should throw an error if amount is missing', () => {
    const invalidInput = {}; // Missing amount
    expect(() => schema.parse(invalidInput)).toThrow(z.ZodError);
  });

  it('should throw an error if amount is not a number', () => {
    const invalidInput = { amount: 'not-a-number' }; // Invalid type
    expect(() => schema.parse(invalidInput)).toThrow(z.ZodError);
  });

  it('should allow the maximum amount', () => {
    const validInput = { amount: maxAmount }; // Equal to maxAmount
    expect(() => schema.parse(validInput)).not.toThrow();
  });

  it('should throw an error if amount is null', () => {
    const invalidInput = { amount: null }; // Null value
    expect(() => schema.parse(invalidInput)).toThrow(z.ZodError);
  });

  it('should throw an error if amount is undefined', () => {
    const invalidInput = { amount: undefined }; // Undefined value
    expect(() => schema.parse(invalidInput)).toThrow(z.ZodError);
  });
});
