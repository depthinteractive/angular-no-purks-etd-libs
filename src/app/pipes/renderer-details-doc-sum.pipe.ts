import { Pipe, PipeTransform } from '@angular/core';
import {TableRow} from '../models/general/table/table-row.model';
import {ObjectUnsubscribedError} from 'rxjs';

@Pipe({
  name: 'rendererDetailsDocSum'
})
export class RendererDetailsDocSumPipe implements PipeTransform {
  transform( row: TableRow, args?: any): any {
    for ( const key of Object.keys(row).filter(_key => _key.includes('DATA_') ) ) {
      const value = Number( row[key]);

      if ( !isNaN( value ) && value !== 0 ) {
        return value;
      }
    }

    return 0;
  }
}
