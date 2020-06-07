import {Inject, Pipe, PipeTransform} from '@angular/core';
import {Entry, TypedEntry} from '../models/entry.model';
import {TableValueIsEmptyPipe} from './table-value-is-empty.pipe';

@Pipe({
  name: 'tableFilterValue'
})
export class TableFilterValuePipe implements PipeTransform {

  constructor(
    @Inject(TableValueIsEmptyPipe) private $isEmpty: TableValueIsEmptyPipe
  ) {
  }


  public transform(value: any, columnKey: string, rowGroup: string, row: Entry = {}): any {
    const rowGroupValue: any = row[rowGroup];
    const subsidiaryTargetColumns: string[] = [
      'DATA_42', 'DATA_59', 'DATA_140', 'DATA_141', 'DATA_142', 'BALANCE_TOTAL', 'LETTER_OF_CREDIT_BALANCE', 'NON_EXPENDABLE_FUNDS'
    ];
    const obligationColumns: string[] = [
      'DATA_44', 'DATA_45', 'DATA_46', 'DATA_47', 'DATA_48', 'DATA_49',
      'DATA_50', 'DATA_51',  'UNUSED_INCOME_BALANCE', 'UNUSED_PAYOUT_BALANCE'
    ];


    if (!rowGroup) {
      rowGroup = '';
    }

    if (rowGroup.includes('subsidary_target') && subsidiaryTargetColumns.includes(columnKey)) {
      return null;
    }

    if (obligationColumns.includes(columnKey) && this.$isEmpty.transform(row.Obligation)) {
      return null;
    }

    return value;
  }
}

