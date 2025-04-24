export class HttpError extends Error {
  _tag = 'HttpError';
  status = 500;
}
export type HttpServerErrorType = {
  detail: string;
  instance: string;
  status: HTTP_API_STATUS;
  title: string;
  type: string;
};

export class HttpServerError extends Error implements HttpServerErrorType {
  _tag = 'HttpServerError';
  detail: string;
  instance: string;
  status: HTTP_API_STATUS;
  title: string;
  type: string;

  constructor(
    detail: string,
    instance: string,
    status: HTTP_API_STATUS,
    title: string,
    type: string,
  ) {
    super(title);
    this.detail = detail;
    this.instance = instance;
    this.status = status;
    this.title = title;
    this.type = type;
  }

  get message() {
    return this.detail;
  }

  toJSON(): HttpServerErrorType {
    return {
      detail: this.detail,
      instance: this.instance,
      status: this.status,
      title: this.title,
      type: this.type,
    };
  }
}

export enum HTTP_STATUS {
  OK = 200,
  CREATED = 201,
  ACCEPTED = 202,
  NO_CONTENT = 204,
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  METHOD_NOT_ALLOWED = 405,
  INTERNAL_SERVER_ERROR = 500,
  NOT_IMPLEMENTED = 501,
  BAD_GATEWAY = 502,
  SERVICE_UNAVAILABLE = 503,
  GATEWAY_TIMEOUT = 504,
}

export enum HTTP_API_STATUS {
  UNAUTHORIZED = 401,
  INTERNAL_SERVER_ERROR = 500,
  BILL_RETAINED = 4001,
}
