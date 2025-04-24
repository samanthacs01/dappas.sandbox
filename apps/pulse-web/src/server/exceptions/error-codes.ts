import { ErrorTypes } from './result';
import { HTTP_API_STATUS } from './server-errors';

export const getApiErrorMessage = (
  fallback: string,
  error?: ErrorTypes | null,
): string => {
  if (!error) return fallback;
  switch (error.status) {
    case HTTP_API_STATUS.BILL_RETAINED:
      return 'You cannot add or modify expenses because retentions were applied to the paid bill.';
    case HTTP_API_STATUS.INTERNAL_SERVER_ERROR:
      return 'An error occurred while processing your request. Please try again later.';
    case HTTP_API_STATUS.UNAUTHORIZED:
      return 'You are not authorized to perform this action.';
    default:
      return fallback;
  }
};
