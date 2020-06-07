import { Pipe, PipeTransform } from '@angular/core';
import {TableRow} from '../models/general/table/table-row.model';
import {Entry} from '../models/entry.model';

@Pipe({
  name: 'tableGroupName'
})
export class TableGroupNamePipe implements PipeTransform {

  public transform(row: TableRow, grouping: Entry[] = [], index: number, groupKey: string): string {
    if (index === -1) {
      return 'Лицевой счет';
    } else if (row.expense && groupKey.includes('subsidary_target')) {
      return 'Направление расходования';
    } else if (!row.expense && groupKey === 'subsidary_target') {
      return 'Источник поступления';
    }

    let group: Entry = grouping.find((_group: Entry) =>
      _group.key === groupKey
    );

    if (!group) {
      group = grouping['index'];
    }

    return group ? group.title : '';
  }
}
