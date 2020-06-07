import { Injectable } from '@angular/core';
import { IUrl, Url } from '../models/url.model';
import {stringify} from 'querystring';

const PARAMREGEX = /\{(\/|\?)[^\}]*\}/g,
      PARAMNAMEREGEX = /[^\/\?]+?(?=})/g,
      PATHPARAMREGEX = /\{\/[^\}]*\}/,
      SERCHPARAMREGEX = /\{\?[^\}]*\}/;

@Injectable({
  providedIn: 'root'
})
export class UrlService {
  constructor() { }

  public create( pattern: string = null ): Url {
    if ( pattern === null ) {
      throw 'Cannot create UrlModel object with empty pattern';
    }

    const url: IUrl = new Url( pattern, urlStringify);


    return url;

    function urlStringify ( params: object ) {
      const paramsMatch: string[] = this.pattern.match( PARAMREGEX );

      if ( paramsMatch && paramsMatch.length > 0 ) {
        return urlStringifyParams( this.pattern, paramsMatch, params );
      } else {
        return this.pattern;
      }
    }

    function urlStringifyParams( url: string, paramsMatch: string[], params: object ): string {
      let urlHasSearchDelimiter = false;

      paramsMatch.forEach( paramMatch => {
        const paramName = paramMatch.match( PARAMNAMEREGEX )[0];

        if ( PATHPARAMREGEX.test( paramMatch ) && params[paramName] ){
          url = url.replace( paramMatch, `/${params[paramName]}` );
        } else if ( SERCHPARAMREGEX.test( paramMatch ) && params[paramName] ) {
          const delimiter = urlHasSearchDelimiter ? '&' : '?';
          url = url.replace(paramMatch, `${delimiter}${paramName}=${params[paramName]}`);

          urlHasSearchDelimiter = true;
        }
      } );
      url = url.replace( PARAMREGEX, '' );

      if ( url.includes('://') ) {
        url = url.split('://').
        map(part => {
          return part.replace(/\/\//g, '/');
        }).
        join('://');
      } else {
        url = url.replace(/\/\//g, '/');
      }

      return url;
    }
  }
}
