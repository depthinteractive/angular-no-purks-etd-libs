import {Pipe, PipeTransform} from '@angular/core';
import {Entry} from '../models/entry.model';
import {startWith} from 'rxjs/operators';
import {TransformTableValuePipe} from './transform-table-value.pipe';
import {TableRow} from '../models/general/table/table-row.model';

@Pipe({
  name: 'tableGroupValue'
})
export class TableGroupValuePipe implements PipeTransform {
  constructor(
    private tableTransformValuePipe: TransformTableValuePipe
  ) {
  }

  public transform(row: TableRow, index: number, groupKey: string): string {
    if (index === -1) {
      groupKey = 'PA';
    }

    return row[groupKey];
  }
}
