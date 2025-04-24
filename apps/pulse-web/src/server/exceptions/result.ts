import { HttpError, HttpServerError, HttpServerErrorType } from './server-errors';

export type ErrorTypes = HttpServerError | HttpError | HttpServerErrorType;

export type ResultObject<TData> = {
  success: boolean;
  data: TData | null;
  error: ErrorTypes | null;
};

export class Result<TData> {
  success: boolean;
  data: TData | null;
  error: ErrorTypes | null;

  constructor(success: boolean, data: TData | null, error: ErrorTypes | null) {
    this.success = success;
    this.data = data;
    this.error = error;
  }

  static Success<TData>(data: TData): Result<TData> {
    return new Result<TData>(true, data, null);
  }

  static Fail<TError extends ErrorTypes>(error: TError): Result<null> {
    return new Result<null>(false, null, error);
  }

  toJSON(): ResultObject<TData> {
    return {
      success: this.success,
      data: this.data,
      error: this.error,
    };
  }
}
