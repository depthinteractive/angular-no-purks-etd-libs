import {Filters} from '../../../models/general/parameters/filters.model';
import {TableRow} from '../../../models/general/table/table-row.model';
import {Subject} from 'rxjs';

export const KOOFields: string[] = ['acrLinkGuid', 'acrLinkType', 'p_name', 'r_name', 'ik_termkoo', 'ik_requisitesgk', 'IGK', 'letterOfCreditInfo', 'okato'];

export const TABLE = {
  columns: [],
  data: {
    model: [],
    rows: null,
    source: null
  },
  filtering: new Filters(),
  grouping: [],
  hasData: false,
  header: [],
  options: {
    emptyCell: 'Пусто',
    nzScroll: { x: '100%', y: null },
    nzWidthConfig: ['150px', '150px', '150px', '150px'],
    ready: false,
    size: 'middle'
  },
  paging: {
    index: 1,
    size: 20,
    start: 0,
    end: 19,
    onChange: function ($event: Array<Object> ) {
      this.displayData = $event;
      this.refreshStatus();
    }
  },
  expandRowChange: function ( row: TableRow, a: any ) {
    const rows: TableRow[] = [...this.data.rows];
    const rowIndex: number = this.data.rows.findIndex( r => r === row );

    if ( row.expand ) {
      addChildren();
    } else {
      removeChildren( row.children );
    }

    this.data.rows = [...rows];
    this.emitExpandRow();

    function addChildren () {
      rows.splice( rowIndex, 1, ...[row], ...row.children );
    }

    function removeChildren ( removeRows: any[] ) {
      removeRows.forEach( _row => {
        if ( _row['children'] && _row['children'].length > 0 && _row['expand'] ) {
          removeChildren( _row['children'] );
          _row['expand'] = false;
        }

        rows.splice( rows.findIndex( __row => __row === _row ), 1 );
      } );
    }
  },
  onChange: new Subject<any>()
};
