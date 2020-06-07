import * as TableActions from './table.actions';
import {TableRow} from '../../../models/general/table/table-row.model';
import {normalizeNumber, parseNumber} from '../../../utils/common.utils';
import {TypedEntry} from '../../../models/entry.model';
import {StatesService} from '../../../services/states.service';
import {ITable} from '../../../models/general/table/table.model';

interface IRow {
  [key: string]: number;
}

class Table implements ITable {
  public data: TableRow[] = [];
  public loading: boolean = false;
}

const $states: StatesService = StatesService.instance;

const $$table: TypedEntry<ITable> = $states.getTable({common: new Table(), letterOfCredit: new Table()});
let $$mode = $states.mode;

export function TableReducer(
  table: ITable = $$table[$$mode],
  actions: TableActions.Actions
) {

  switch (actions.type) {
    case TableActions.SET_LOADING:
      table.loading = actions.loading;
      changeTable({...table});
      return table;

    case TableActions.SET_DATA:
      table.data = prepareData(actions.data);
      changeTable({...table});
      return {...table};

    case TableActions.CHANGE_MODE:
      $$mode = actions.mode;
      if (!$$table[$$mode]) {
        $$table[$$mode] = new Table();
      }
      return $$table[$$mode];

    default:
      return table;
  }


  function changeTable(_table: Table) {
    $$table[$$mode] = _table;
  }

  function prepareData(data: Array<TableRow>) {
    data = [...data];

    if ($$mode === 'common') {
      data
        .map(parseRowNumbers)
        .forEach((row: TableRow) => {
          const {DATA_40, DATA_41, DATA_44, DATA_48, DATA_56, DATA_57, DATA_58, DATA_59, DATA_134, DATA_135, DATA_136, DATA_137, DATA_141, DATA_142}: IRow = row;

          row['BALANCE_TOTAL'] = normalizeNumber(DATA_59 + DATA_40 - DATA_41);
          row['UNUSED_INCOME_BALANCE'] = normalizeNumber(DATA_44 - DATA_40);
          row['UNUSED_PAYOUT_BALANCE'] = normalizeNumber(DATA_48 - DATA_41);
          row['LETTER_OF_CREDIT_BALANCE'] = normalizeNumber(DATA_56 - DATA_57 - DATA_58);
          row['NON_EXPENDABLE_FUNDS'] = normalizeNumber(DATA_141 + DATA_142);
        });
    } else if ($$mode === 'letterOfCredit') {
      data
        .map(parseRowNumbers)
        .forEach((row: TableRow) => {
          const {DATA_60, DATA_61, DATA_62, DATA_63}: IRow = row;

          row['DATA_60_m_62_m_63'] = normalizeNumber(DATA_60 - DATA_62 - DATA_63);
          row['DATA_62_m_61'] = normalizeNumber(DATA_62 - DATA_61);
        });
    }

    return data;
  }

  function parseRowNumbers(row: TableRow): TableRow {
    Object
      .keys(row)
      .filter(key =>
        key.includes('DATA_')
      )
      .forEach(key => {
        row[key] = parseNumber(row[key]);
      });

    return row;
  }
}
