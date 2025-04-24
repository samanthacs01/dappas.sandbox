import { registerBillsPaymentSchema } from './../../../../src/modules/admin/payable/modules/bills/components/forms/libs/schemas';

describe('registerBillsPaymentSchema', () => {
  const maxAmount = 1000;

  it('should validate a correct payment amount', () => {
    const schema = registerBillsPaymentSchema(maxAmount);
    const validData = { amount: 500 };

    expect(() => schema.parse(validData)).not.toThrow();
  });

  it('should fail if the payment amount is zero', () => {
    const schema = registerBillsPaymentSchema(maxAmount);
    const invalidData = { amount: 0 };

    expect(() => schema.parse(invalidData)).toThrow(
      'Payment amount is required',
    );
  });

  it('should fail if the payment amount exceeds the maximum allowed', () => {
    const schema = registerBillsPaymentSchema(maxAmount);
    const invalidData = { amount: 1500 };

    expect(() => schema.parse(invalidData)).toThrow(
      'The amount to pay cannot exceed the balance',
    );
  });

  it('should fail if the payment amount is missing', () => {
    const schema = registerBillsPaymentSchema(maxAmount);
    const invalidData = {};

    expect(() => schema.parse(invalidData)).toThrow('Required');
  });

  it('should fail if the payment amount is not a number', () => {
    const schema = registerBillsPaymentSchema(maxAmount);
    const invalidData = { amount: 'abc' };

    expect(() => schema.parse(invalidData)).toThrow();
  });
});
