import { Injectable } from '@angular/core';
import {Observable, Subject} from 'rxjs';
import {sa} from '@angular/core/src/render3';

const DEFAULT_TYPE = 'text/plain';
const DEFAULT_EXTENSION = 'txt';

enum EXTENSIONS {
  default = 'txt',
  xls = 'xls',
  xlsx = 'xlsx'
}
enum TYPES {
  default = 'text/plain',
  xls = 'application/vnd.ms-excel',
  xlsx = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
}

@Injectable({
  providedIn: 'root'
})
export class FileService {

  constructor() { }

  public static save ( _name: string, _type: string = 'txt', _data: any = null ): void {
    const extension = EXTENSIONS[_type] || EXTENSIONS.default;
    const type = TYPES[_type] || TYPES.default;
    const name = `${_name}.${extension}`;

    const blob = new Blob(
      [ new Uint8Array( _data ) ],
      { type: type }
    );

    if (window.navigator && window.navigator.msSaveOrOpenBlob) {
      window.navigator.msSaveOrOpenBlob( blob, name );
    } else {
      const body: HTMLElement = document.querySelector('body');
      const link: HTMLElement = document.createElement('a');

      link['href'] = URL.createObjectURL( blob );
      link['download'] = name;
      body.appendChild( link );
      link.click();
      body.removeChild( link );
    }
  }

  public save ( name: string, type: string = 'txt', data: any = null ): Observable<boolean> {
    const save: Subject<boolean> = new Subject<boolean>();

    try {
      FileService.save( name, type, data );
      save.next( true );
      save.complete();
    } catch (e) {
      save.next( false );
      save.complete();
    }

    return save;
  }
}
