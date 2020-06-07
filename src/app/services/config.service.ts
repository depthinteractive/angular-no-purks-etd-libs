import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ConfigService {
  private $config: Object;

  constructor( ) {
    this.$config = window['$config'];
  }

  get ( ...args: any[] ): any {
    let value: any = this.$config;

    while ( args.length > 0 && typeof value !== 'undefined') {
      value = value[ args.shift() ];
    }

    return typeof value !== 'undefined' ? value : null ;
  }
}
