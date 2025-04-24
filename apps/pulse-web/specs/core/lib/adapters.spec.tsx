import {
  adaptPayableProductionFlightToPayableBills,
  convertPayableProductionBillToPayableBills,
} from '@/core/lib/adapters';
import {
  PayableProductionBill,
  PayableProductionBillStatus,
  PayableProductionFlight,
} from '@/server/types/payable';

describe('Test adapters function', () => {
  it('should map all PayableProductionFlight fields to PayableBills correctly', () => {
    const flight: PayableProductionFlight = {
      id: 1,
      billId: 'BILL-123',
      production: 'PROD-1',
      flight: 'FL-001',
      payer: 'PAYER-1',
      revenue: 1000,
      due_date: new Date('2023-01-01'),
      status: 'pending_payment',
      balance: 500,
      amount: 1000,
    };

    const result = adaptPayableProductionFlightToPayableBills(flight);

    expect(result).toEqual({
      id: 'BILL-123',
      production: 'PROD-1',
      payment_type: '',
      flight_month: '',
      amount: 1000,
      balance: 500,
      due_date: expect.any(String),
      status: 'pending_payment',
      identifier: 'FL-001',
    });
  });

  // Handles null/undefined due_date by passing through formatDateUTC
  it('should handle undefined due_date', () => {
    const flight: PayableProductionFlight = {
      id: 1,
      billId: 'BILL-123',
      production: 'PROD-1',
      flight: 'FL-001',
      payer: 'PAYER-1',
      revenue: 1000,
      due_date: undefined as unknown as Date,
      status: 'pending_payment',
      balance: 500,
      amount: 1000,
    };

    const result = adaptPayableProductionFlightToPayableBills(flight);

    expect(result.due_date).toBe('');
  });

  it('should set empty strings for payment_type and flight_month', () => {
    const flight: PayableProductionFlight = {
      id: 1,
      billId: 'BILL-123',
      production: 'PROD-1',
      flight: 'FL-001',
      payer: 'PAYER-1',
      revenue: 1000,
      due_date: new Date('2023-01-01'),
      status: 'pending_payment',
      balance: 500,
      amount: 1000,
    };

    const result = adaptPayableProductionFlightToPayableBills(flight);

    expect(result.payment_type).toBe('');
    expect(result.flight_month).toBe('');
  });

  it('should correctly map all PayableProductionBill fields to PayableBills format', () => {
    const mockProductionBill: PayableProductionBill = {
      id: 123,
      month: 5,
      revenue: 1000,
      expenses: 500,
      net_due: 500,
      balance: 500,
      due_date: new Date('2023-05-01'),
      status: 'pending_payment',
      billId: 'BILL-123',
      production: 'Test Production',
    };

    const result =
      convertPayableProductionBillToPayableBills(mockProductionBill);

    expect(result).toEqual({
      id: '123',
      production: 'Test Production',
      payment_type: '',
      flight_month: '5',
      amount: 1000,
      balance: 500,
      due_date: expect.any(String),
      status: 'pending_payment',
      identifier: 'BILL-123',
    });
  });

  it('should convert numeric id to string format', () => {
    const mockProductionBill: PayableProductionBill = {
      id: 12345,
      month: 1,
      revenue: 100,
      expenses: 50,
      net_due: 50,
      balance: 50,
      due_date: new Date(),
      status: 'pending_payment',
      billId: 'BILL-1',
      production: 'Prod',
    };

    const result =
      convertPayableProductionBillToPayableBills(mockProductionBill);

    expect(result.id).toBe('12345');
    expect(typeof result.id).toBe('string');
  });

  it('should throw error when productionBill is null or undefined', () => {
    expect(() => {
      convertPayableProductionBillToPayableBills(
        undefined as unknown as PayableProductionBill,
      );
    }).toThrow();

    expect(() => {
      convertPayableProductionBillToPayableBills(
        null as unknown as PayableProductionBill,
      );
    }).toThrow();
  });

  it('should handle missing or null field values', () => {
    const mockProductionBill: PayableProductionBill = {
      id: 1,
      month: null as unknown as number,
      revenue: null as unknown as number,
      expenses: 0,
      net_due: 0,
      balance: null as unknown as number,
      due_date: null as unknown as Date,
      status: null as unknown as PayableProductionBillStatus,
      billId: null as unknown as string,
      production: null as unknown as string,
    };

    expect(
      convertPayableProductionBillToPayableBills(mockProductionBill),
    ).toEqual({
      id: '1',
      production: null,
      payment_type: '',
      flight_month: null,
      amount: null,
      balance: null,
      due_date: '',
      status: undefined,
      identifier: null,
    });
  });
});
