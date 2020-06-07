import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, Subject, Subscription } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';

const HEADERS = {
  'Content-Type': 'application/json;charset=utf-8'
};

@Injectable({
  providedIn: 'root'
})
export class RequestService {
  constructor(
    private http: HttpClient,
    private route: ActivatedRoute
  ) {

  }

  public get ( url: string, options: {} = {}) {
    return this.request( 'get', url, {}, options );
  }

  public post ( url: string, data: {} = {}, options: {} = {}, headers?: {} ) {
    return this.request( 'post', url, data, options, headers );
  }

  private request( type: string, url: string, data: {} = {}, httpOptions: {} = {}, headers: {} = HEADERS ): any {
    let request: any;
    const testLogin = this.route.snapshot.queryParams['testLogin'];

    httpOptions['headers'] = this.constructHttpHeaderOptions( headers, httpOptions['headers']  );
    httpOptions['observe'] = 'response';

    if ( typeof testLogin !== 'undefined' ) {
      httpOptions['headers'] = this.constructHttpHeaderOptions( {testLogin: testLogin}, httpOptions['headers'] );
    }

    switch ( type ) {
      case 'post':
        request = this.http.post( url, data, httpOptions );
        break;

      case 'get':
      default:
        request = this.http.get( url, httpOptions );
    }

    return this.responseTransform( request );
  }

  private constructHttpHeaderOptions  ( headers: {} = {}, httpHeaders = new HttpHeaders() ): any  {
    httpHeaders = Object.keys( headers ).reduce( ( _headers, header ) => {
      return _headers.append( header, headers[header] );
    }, httpHeaders );

    return httpHeaders;
  }

  private responseTransform ( request: Observable<any> ): Observable<Object> {
    const response = new Subject<{data: any, fail: boolean, success: boolean, headers?: Headers}>();


    const subscription: Subscription = request.subscribe( success => {
      response.next( {data: success.body, fail: false, success: true, headers: success.headers} );
    }, error => {
      response.next( {data: error.body, fail: true, success: false, headers: error.headers} );
    } );

    return response;

    function unsubscribe (): void  {
      subscription.unsubscribe();
    }
  }
}
