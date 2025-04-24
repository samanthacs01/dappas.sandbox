import { getApiErrorMessage } from '@/server/exceptions/error-codes';
import { ErrorTypes } from '@/server/exceptions/result';
import { HTTP_API_STATUS } from '@/server/exceptions/server-errors';

describe('Test error code functions', () => {
  it('should return bill retained message when error status is BILL_RETAINED', () => {
    const error = {
      status: HTTP_API_STATUS.BILL_RETAINED,
      detail: '',
      instance: '',
      title: '',
      type: '',
    };
    const fallback = 'Default error message';

    const result = getApiErrorMessage(fallback, error);

    expect(result).toBe(
      'You cannot add or modify expenses because retentions were applied to the paid bill.',
    );
  });

  it('should return internal server error message when error status is INTERNAL_SERVER_ERROR', () => {
    const error = {
      status: HTTP_API_STATUS.INTERNAL_SERVER_ERROR,
      detail: '',
      instance: '',
      title: '',
      type: '',
    };
    const fallback = 'Default error message';

    const result = getApiErrorMessage(fallback, error);

    expect(result).toBe(
      'An error occurred while processing your request. Please try again later.',
    );
  });

  it('should return fallback message when error is undefined', () => {
    const fallback = 'Default error message';

    const result = getApiErrorMessage(fallback, undefined);

    expect(result).toBe(fallback);
  });

  it('should return fallback message when error object has no status', () => {
    const error = {} as ErrorTypes;
    const fallback = 'Default error message';

    const result = getApiErrorMessage(fallback, error);

    expect(result).toBe(fallback);
  });

  it('should return fallback message when error status is unhandled', () => {
    const error = {
      status: 9999,
      detail: '',
      instance: '',
      title: '',
      type: '',
    };
    const fallback = 'Default error message';

    const result = getApiErrorMessage(fallback, error);

    expect(result).toBe(fallback);
  });

  it('should return fallback message when error is null', () => {
    const fallback = 'Default error message';
    const error = null;

    const result = getApiErrorMessage(fallback, error);

    expect(result).toBe(fallback);
  });

  it('should return unauthorized message when error status is UNAUTHORIZED with correct ErrorTypes structure', () => {
    const error = {
      status: HTTP_API_STATUS.UNAUTHORIZED,
      detail: '',
      instance: '',
      title: '',
      type: '',
    };
    const fallback = 'Default error message';

    const result = getApiErrorMessage(fallback, error);

    expect(result).toBe('You are not authorized to perform this action.');
  });
});
