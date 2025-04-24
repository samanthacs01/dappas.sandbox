import { HTTP_API_STATUS, HttpServerError } from '@/server/exceptions/server-errors';

describe('Tests Error class', () => {
  it('should initialize all properties with provided values when constructed', () => {
    const detail = 'Error details';
    const instance = '/api/resource/123';
    const status = HTTP_API_STATUS.INTERNAL_SERVER_ERROR;
    const title = 'Internal Server Error';
    const type = 'https://api.example.com/errors/internal-error';

    const error = new HttpServerError(detail, instance, status, title, type);

    expect(error.detail).toBe(detail);
    expect(error.instance).toBe(instance);
    expect(error.status).toBe(status);
    expect(error.title).toBe(title);
    expect(error.type).toBe(type);
    expect(error._tag).toBe('HttpServerError');
  });


  it('should return object matching HttpServerErrorType interface when toJSON is called', () => {
    const errorData = {
      detail: 'Error details',
      instance: '/api/resource/123',
      status: HTTP_API_STATUS.INTERNAL_SERVER_ERROR,
      title: 'Internal Server Error',
      type: 'https://api.example.com/errors/internal-error',
    };

    const error = new HttpServerError(
      errorData.detail,
      errorData.instance,
      errorData.status,
      errorData.title,
      errorData.type,
    );

    const jsonResult = error.toJSON();

    expect(jsonResult).toEqual(errorData);
  });


  it('should accept empty strings for text properties when constructed', () => {
    const error = new HttpServerError(
      '',
      '',
      HTTP_API_STATUS.INTERNAL_SERVER_ERROR,
      '',
      '',
    );

    expect(error.detail).toBe('');
    expect(error.instance).toBe('');
    expect(error.title).toBe('');
    expect(error.type).toBe('');
    expect(error.status).toBe(HTTP_API_STATUS.INTERNAL_SERVER_ERROR);
  });


  it('should handle different HTTP_API_STATUS enum values when constructed', () => {
    const statuses = [
      HTTP_API_STATUS.UNAUTHORIZED,
      HTTP_API_STATUS.INTERNAL_SERVER_ERROR,
      HTTP_API_STATUS.BILL_RETAINED,
    ];

    statuses.forEach((status) => {
      const error = new HttpServerError(
        'Error details',
        '/api/resource/123',
        status,
        'Error Title',
        'error-type',
      );

      expect(error.status).toBe(status);
    });
  });
});


