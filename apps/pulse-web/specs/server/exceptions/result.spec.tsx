import { Result } from '@/server/exceptions/result';
import { HttpError, HttpServerError } from '@/server/exceptions/server-errors';

describe('Result', () => {
  it('should create a success result', () => {
    const data = { message: 'Success' };
    const result = Result.Success(data);

    expect(result.success).toBe(true);
    expect(result.data).toBe(data);
    expect(result.error).toBeNull();
  });

  it('should create a failure result', () => {
    const error = new HttpError('Error occurred');
    const result = Result.Fail(error);

    expect(result.success).toBe(false);
    expect(result.data).toBeNull();
    expect(result.error).toBe(error);
  });

  it('should convert result to JSON', () => {
    const data = { message: 'Success' };
    const result = Result.Success(data);
    const jsonResult = result.toJSON();

    expect(jsonResult).toEqual({
      success: true,
      data: data,
      error: null,
    });
  });

  it('should handle HttpServerError', () => {
    const error = new HttpServerError(
      'Server error',
      'dummy',
      500,
      'Server error',
      'Server error',
    );
    const result = Result.Fail(error);

    expect(result.success).toBe(false);
    expect(result.data).toBeNull();
    expect(result.error).toBe(error);
  });
});
