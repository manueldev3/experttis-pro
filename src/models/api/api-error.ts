export type ApiErrorCodeType = "search/error";

export interface ApiErrorInterface {
  code: ApiErrorCodeType;
  message: string;
}

export default class ApiError implements ApiErrorInterface {
  code: ApiErrorCodeType;
  message: string;

  constructor(data: ApiErrorInterface) {
    this.code = data.code;
    this.message = data.message;
  }
}
