import { HttpClient, HttpHeaders } from '@angular/common/http';

export namespace Http {
  export interface IResponse {
    data: any;
    error: any;
    fail: boolean;
    headers: Headers;
    success: boolean;
  }

  export interface IRequest {
    type: string;
    url: string;
    data: {};
    options: {
      headers?: any;
      params?: {};
      observe?: 'string';
      [key: string]: any;
    };
  }

  export class Response implements IResponse {
    data: any;
    error: any;
    fail: boolean;
    headers: Headers;
    success: boolean;

    constructor(
      data: any = null,
      error: any = null,
      fail: boolean,
      success: boolean,
      headers: Headers
    ) {
      this.data = data;
      this.error = error;
      this.fail = fail;
      this.success = success;
      this.headers = headers;
    }
  }
}
