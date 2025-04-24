import { fCurrency, valueFormatter } from '@/core/lib/numbers';

describe('Test Number Functions', () => {
  it('Test fCurrency with default options', async () => {
    const value = fCurrency({ amount: 230 });
    expect(value).toBe('$230.00');
  });

  it('Test fCurrency with default options', async () => {
    const value = fCurrency({ amount: 230.55444 });
    expect(value).toBe('$230.55');
  });

  it('Test fCurrency with default options and decimals', async () => {
    const value = fCurrency({ amount: 230.55444 });
    expect(value).toBe('$230.55');
  });

  it('Test valueFormatter with type number', async () => {
    const value = valueFormatter(1200, 'number');
    expect(value).toBe('1,200');
  });
  it('Test valueFormatter with type number', async () => {
    const value = valueFormatter('1200', 'number');
    expect(value).toBe('1,200');
  });
  it('Test valueFormatter with type number', async () => {
    const value = valueFormatter('Hola', 'number');
    console.log(value);

    expect(value).toBe('NaN');
  });

  it('Test valueFormatter with type percentage', async () => {
    const value = valueFormatter(80, 'percentage');
    expect(value).toBe('80.0%');
  });

  it('Test valueFormatter with type percentage', async () => {
    const value = valueFormatter(80.12, 'percentage');
    expect(value).toBe('80.1%');
  });
  it('Test valueFormatter with type percentage', async () => {
    const value = valueFormatter(80.17, 'percentage');
    expect(value).toBe('80.2%');
  });

  it('Test valueFormatter with type percentage', async () => {
    const value = valueFormatter('', 'percentage');
    expect(value).toBe('0%');
  });
  it('Test valueFormatter with type percentage', async () => {
    const value = valueFormatter('0', 'percentage');
    expect(value).toBe('0%');
  });

  it('Test formatDateUTC with a utc string date', async () => {
    const date = valueFormatter('2021-01-01T23:00:00Z', 'date');
    expect(date).toBe('01/01/2021');
  });

  it('Test formatDateUTC with a bad formatted date', async () => {
    const date = valueFormatter('01-01-2021', 'date');
    expect(date).toBe('01/01/2021');
  });
});
