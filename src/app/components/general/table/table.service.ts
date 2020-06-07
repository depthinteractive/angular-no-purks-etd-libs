import {Injectable} from '@angular/core';
import {select, Store} from '@ngrx/store';
import {filter, shareReplay, take, takeWhile} from 'rxjs/operators';
import {States} from '../../../store/states';
import * as DetailsActions from './../../../store/data/details/details.actions';
import * as TableActions from './../../../store/data/table/table.actions';
import {GetData as GetTableData} from './../../../store/data/table/table.actions';

import {Entry} from '../../../models/entry.model';
import {Dicts} from '../../../models/dicts.model';
import {Table} from '../../../models/general/table/table.model';
import {TableColumn} from '../../../models/general/table/table-column.model';
import {TableRow} from '../../../models/general/table/table-row.model';

import {RequestService} from '../../../services/request.service';
import {ConfigService} from '../../../services/config.service';
import {ReportService} from '../../../services/report.service';
import {merge, Observable, of} from 'rxjs';
import {AppSelectors} from '../../../store/app/app.selectors';
import {Parameters} from '../../../models/general/parameters/parameters.model';
import {Filters} from '../../../models/general/parameters/filters.model';
import {KOOFields, TABLE} from './table.utils';
import {ParametersSelectors} from '../../../store/parameters/parameters.selectors';
import getParameters = ParametersSelectors.getParameters;
import getMode = AppSelectors.getMode;
import {ObservableUtil} from '../../../store/utils/observable.util';
import {normalizeNumber, parseNumber} from '../../../utils/common.utils';
import {OpenDocumentService} from '../../../services/open-document.service';
import {Debounce} from '../../../decorators/debounce.decorator';
import {getDictSelector} from '../../../store/dicts/dicts.selectors';

const TABLE_CELL_WIDTH = '175px';
const TABLE_FIRST_CELL_WIDTH = '350px';

@Injectable()
export class GeneralTableService {
  private isAlive: boolean = true;
  private dicts: Dicts;
  private data: {
    filters: Object,
    indicators: string[],
  };
  protected table: Table = TABLE;
  protected table$: Observable<{ data, loading }> = this.store.select('table');
  private wrapperEl;

  private timeoutTableUpdate: any;
  private timeoutWindowResize: any;
  private parameters$: Observable<Parameters> = this.store.select('parameters');

  constructor(
    private store: Store<States>,
    private $config: ConfigService,
    private $request: RequestService,
    private $report: ReportService,
    private $openDocument: OpenDocumentService
  ) {
    this.data = {
      filters: null,
      indicators: null
    };

    this.table.emitExpandRow = () => {
      this.calculateTableHeight();
    };
  }

  public onWindowResize(): void {
    clearTimeout(this.timeoutWindowResize);

    this.timeoutWindowResize = setTimeout(
      () => {
        this.calculateTableWidth();
        this.calculateTableHeight();
      },
      300
    );
  }

  public onInit(): Table {
    this.wrapperEl = document.querySelector('.app-workspace__table');
    this.store
      .select('actions')
      .pipe(
        takeWhile(() => this.isAlive)
      )
      .subscribe((action: Entry) => {
        switch (action.name) {
          case 'exportTableToExcel':
            this.exportTableToExcel();
            break;

          case 'getData':
            this.getData(action.data);
            break;
        }
      });

    this.store
      .select('dicts')
      .pipe(
        takeWhile(() => this.isAlive)
      )
      .subscribe(dicts => {
        this.dicts = dicts;
      });

    this.mode$
      .pipe(
        takeWhile(() => this.isAlive)
      )
      .subscribe(() =>
        setTimeout(() =>
          this.createTableColumns()
        )
      );

    this.store
      .select('filters')
      .pipe(
        takeWhile(() => this.isAlive)
      )
      .subscribe((filters: Filters) => {
        this.table.filtering = filters;
        this.constructTable();
      });

    this.store
      .select('groupment')
      .pipe(
        takeWhile(() => this.isAlive)
      )
      .subscribe(groupment => {
        this.table.grouping = groupment;
        this.constructTable();
      });

    this.store
      .select('indicators')
      .pipe(
        takeWhile(() => this.isAlive)
      )
      .subscribe(indicators => {
        this.data.indicators = indicators;
        this.constructTable();
      });

    this.table$
      .pipe(
        takeWhile(() => this.isAlive)
      )
      .subscribe(({data}) => {
        this.table.data.source = data;
        this.constructTable();
      });

    this.store
      .pipe(
        select(AppSelectors.getSettingsCollapse),
        takeWhile(() => this.isAlive)
      )
      .subscribe(() => {
        setTimeout(() => {
          this.calculateTableWidth();
          this.calculateTableHeadColOffsetTop();
        }, 350);
      });

    this.createTableColumns();
    this.constructTable();

    return this.table;
  }

  public get subsidaryTargets$(): Observable<Entry[]> {
    return this.store.pipe(
      select(getDictSelector, {name: 'subsidary_target'}),
      filter(subsidaryTargets =>
        !!subsidaryTargets
      )
    );
  }

  public get mode$(): Observable<string> {
    return this.store.pipe(
      select(getMode)
    );
  }

  public get mode(): string {
    return ObservableUtil.take(
      this.mode$
    );
  }

  public getTable$(): Observable<any> {
    return this.table$.pipe(
      shareReplay(1)
    );
  }

  private getData(data) {
    this.store.dispatch(new GetTableData(data));
  }

  private exportTableToExcel(): void {
    let parameters: Parameters;

    this.store
      .select(getParameters)
      .pipe(take(1))
      .subscribe((_parameters: Parameters) =>
        parameters = _parameters
      );

    this.$report.getDataReport(
      parameters.pAccount,
      parameters.pDate,
      this.table.data.rows,
      this.table.columns
    );
  }

  public openObligationDocuments({acrLinkGuid, acrLinkType}: Entry): void {
    this.$openDocument.openDocument(acrLinkGuid, acrLinkType, 'Аналитический код раздела');
  }

  public openDetails(row: { [key: string]: any }, indicators: string[] | null = null): void {
    const parameters: Parameters = ObservableUtil.take(this.parameters$);
    const params: Entry = {
      'pIGK': row.IGK,
      'pObligation': row.Obligation
    };

    switch (this.mode) {
      case 'common':
        params['exclProcessedBYear'] = parameters.exclProcessedBYear;
        params['exclClosedBYear'] = parameters.exclClosedBYear;
        params['pFAIP'] = row.FAIP;
        params['pSubsidaryTarget'] = row.subsidary_target;
        break;

      case 'letterOfCredit':
        params['pOkato'] = row.okato;
        params['pLetterOfCreditNumber'] = row.letterOfCreditNumber;
        break;
    }

    this.store.dispatch(
      new DetailsActions.GetDetails(params, indicators)
    );
  }


  public constructTable(): void {
    this.store.dispatch(
      new TableActions.SetLoading(true)
    );

    this.constructTableProcess();
  }

  @Debounce(1000)
  public constructTableProcess(): void {
    const {table, dicts, store} = this;

    if (dicts) {
      this.constructTableColumns();
      this.constructTableHeader();
      this.constructTableRows();
    }

    setTimeout(() => {
      table.onChange.next(null);
      store.dispatch(
        new TableActions.SetLoading(false)
      );
    }, 100);
  }

  public createTableColumns(): void {
    const table = this.table,
      dicts = this.dicts;

    table.columns = [];
    table.data.model = [];

    table.columns = createTableColumns(dicts.indicators);
    createFirstColumn();

    function createTableColumns(indicators: Entry[]): TableColumn[] {
      return indicators
        .map(indicator => {
          const column: TableColumn = createColumn(indicator);
          const children: Entry[] = (indicator.children || []).filter(_children => _children.isLeaf);

          if (children.length > 0) {
            column.children = createTableColumns(children);
          } else {
            table.data.model.push(column);
          }

          return column;
        });
    }

    function createFirstColumn() {
      const firstColumn: TableColumn = createColumn({key: 'indicators', title: ''}, true);
      table.data.model.unshift(firstColumn);
      table.columns.unshift(firstColumn);
    }

    function createColumn(columnData: Entry, visible: boolean = false): TableColumn {
      const {key, title, relative} = columnData;
      const prop: Object = {rowspan: 1, colspan: 1};

      return {key, title, visible, prop, relative};
    }
  }

  constructTableColumns(): void {
    const source = this.data, table = this.table;
    constructTableColumns(table.columns);
    this.calculateTableWidth();
    this.calculateTableHeight();

    function constructTableColumns(columns: TableColumn[], parentVisible: boolean = false): void {
      columns.forEach((column: TableColumn) => {
        column.visible = parentVisible || source.indicators.includes(column.key) || column.key === 'indicators';

        if (column.children) {
          constructTableColumns(column.children, column.visible);
          column.visible = column.visible || column.children.some((c: TableColumn) => c.visible);
        }
      });
    }
  }

  private calculateTableWidth() {
    const tableWrapperWidth = this.wrapperEl.clientWidth - parseInt(window.getComputedStyle(this.wrapperEl)['padding-right'], 10);
    const visibleColumns = this.table.data.model
      .filter((col: TableColumn, colIndex: number) =>
        col.visible
      );

    let tableWidth = 0;

    this.table.options['nzWidthConfig'] = visibleColumns
      .map((col, colIndex) => {
        return colIndex === 0 ? TABLE_FIRST_CELL_WIDTH : TABLE_CELL_WIDTH;
      });

    tableWidth = this.table.options['nzWidthConfig'].reduce((sum, item) =>
      sum + parseInt(item, 10),
      tableWidth
    );


    this.table.options.nzScroll['x'] = tableWidth > tableWrapperWidth ? (tableWidth + 'px') : '100%';
  }

  private calculateTableHeight() {
  }

  constructTableHeader(): void {
    const table = this.table;
    let tableHeaderRows = 1;
    calculateHeaderRows(table.columns);

    table.header = new Array(table.options['headerRows']);

    createFirstTableColumnTitle();
    constructTableHeader(this.table.columns);
    calculateSpan(table.columns);

    function calculateHeaderRows(columns: TableColumn[], rows: number = 1) {
      columns.forEach((column: TableColumn) => {
        if (column.visible && tableHeaderRows < rows) {
          tableHeaderRows = rows;
        }

        if (column.children) {
          calculateHeaderRows(column.children, rows + 1);
        }
      });

      table.options['headerRows'] = tableHeaderRows;
    }

    function createFirstTableColumnTitle(): void {
      table.columns[0].title = table.grouping
        .map(group =>
          group['title']
        )
        .join(' / ');
    }

    function constructTableHeader(columns: TableColumn[], level: number = 0) {
      columns.forEach((column: TableColumn) => {
        if (!table.header[level] && column.visible) {
          table.header[level] = [];
        }

        if (column.visible) {
          table.header[level].push({...column});
        }

        if (column.children) {
          constructTableHeader(column.children, level + 1);
        }
      });
    }

    function calculateSpan(columns: TableColumn[], level: number = 0): number {
      let colspan: number;

      columns.forEach((column: TableColumn) => {
        if (!column.visible) {
          column.prop['colspan'] = 0;
        }

        if (column.children) {
          column.prop['colspan'] = calculateSpan(column.children, level + 1);
          column.prop['rowspan'] = 1;
        } else {
          column.prop['colspan'] = 1;
          column.prop['rowspan'] = table.options['headerRows'] - level;
        }
      });

      colspan = columns.filter(column => column.visible).reduce((sum, column) => {
        return sum + column.prop['colspan'];
      }, 0);

      return colspan;
    }
  }

  public constructTableRows(): void {
    const table = this.table,
      columns = table.data.model.filter(({visible}) => visible);

    table.data.rows = [...table.data.source];

    if (table.filtering) {
      filterTableRows();
    }

    if (table.grouping.length > 0) {
      table.data.rows = constructTableRows();

      constructFirstRow();
    }

    function filterTableRows() {
      table.data.rows = table.data.rows.filter(row =>
        Object
          .entries(table.filtering)
          .every(([name, values]) => {
            const {expense, subsidary_target} = row;

            if (values.length === 0) {
              return true;
            }

            switch (name) {
              case 'subsidary_target_income':
                return expense || values.includes(subsidary_target);

              case 'subsidary_target_expense':
                return !expense || values.includes(subsidary_target);

              default:
                return values.includes(row[name]);
            }
          })
      );

    }

    function constructTableRows() {
      const rows: TableRow[] = [];
      const groups: Entry[] = [...table.grouping];

      table.data.rows
        .filter(({expense}) => !expense)
        .forEach(groupingRows);

      if (groups.some(({key}) => key === 'subsidary_target')) {
        const index = groups.findIndex(({key}) =>
          key === 'subsidary_target'
        );
        const subsidary_target_enlarged: Entry = {key: 'subsidary_target_enlarged', title: 'subsidary_target_enlarged'};

        groups.splice(index, 1, subsidary_target_enlarged, groups[index]);
      }

      table.data.rows
        .filter(({expense}) => expense)
        .forEach(groupingRows);

      sortRows(rows);

      return rows;

      function groupingRows(row: TableRow): void {
        const insertRow: TableRow = {...row};
        let groupRows: TableRow[] = rows, parentRow: TableRow = null;

        groups.forEach(({key}, groupIndex: number) => {
          let groupRow: TableRow;

          if (key === 'subsidary_target') {
            groupRow = groupRows.find(_row =>
              _row[key] === insertRow[key] && _row.expense === insertRow.expense
            );
          } else {
            groupRow = groupRows.find(_row =>
              _row[key] === insertRow[key]
            );
          }

          if (!groupRow) {
            groupRow = createNewGroupRow(insertRow, parentRow, groupIndex, key);

            if (key === 'subsidary_target_enlarged') {
              groupRow.excludeFromReport = true;
            }

            KOOFields
              .forEach(field =>
                groupRow[field] = insertRow[field]
              );

            groupRows.push(groupRow);
          }

          columns.forEach(({key: _key}) => {
            const value: number = (groupRow[_key] || 0) + parseNumber(insertRow[_key]);

            groupRow[_key] = normalizeNumber(value);
          });

          parentRow = groupRow;
          groupRows = groupRow['children'];
        });
      }

      function sortRows(_rows: TableRow[]): void {
        const firstRow: TableRow = _rows.slice(-1).shift();

        if (firstRow) {
          const {group}: TableRow = firstRow;

          _rows.sort((row1, row2) =>
            row1[group] < row2[group]
              ? -1
              : (
                row1[group] > row2[group]
                  ? 1
                  : 0
              )
          );
        }

        _rows.forEach(row =>
          row.children && row.children > 0 ? sortRows(row.children) : void (0)
        );
      }


      function createNewGroupRow(insertRow: TableRow, parentRow: TableRow, groupIndex: number, groupKey: string): TableRow {
        const groupRow: TableRow = {
          children: [],
          group: groupKey,
          parent: parentRow,
          expand: false,
          level: groupIndex,
          PA: insertRow.PA,
          [groupKey]: insertRow[groupKey]
        };

        groups.forEach(({key}) => {
          if (parentRow && typeof parentRow[key] !== 'undefined') {
            groupRow[key] = parentRow[key];
          }
        });

        if (groupKey.includes('subsidary_target')) {
          groupRow.expense = insertRow.expense;
          if (groupRow.expense) {
            groupRow.subsidary_target_enlarged = insertRow.subsidary_target_enlarged;
          }
        }

        return groupRow;
      }
    }

    function constructFirstRow() {
      if (table.data.rows.length === 0) {
        return;
      }

      const resultRow = {PA: table.data.source[0]['PA'], level: -1};

      table.data.source.forEach(row => {
        columns.forEach(({key}) => {
          resultRow[key] = normalizeNumber(
            (resultRow[key] || 0) + parseNumber(row[key])
          );
        });
      });

      Object.keys(resultRow)
        .filter(key =>
          isNaN(resultRow[key]) && key !== 'PA'
        )
        .forEach(key =>
          resultRow[key] = 0
        );

      table.data.rows.unshift(resultRow);
    }
  }

  public pagingChange(): void {
    this.table.paging.start = (this.table.paging.index - 1) * this.table.paging.size;
    this.table.paging.end = this.table.paging.start + this.table.paging.size;
  }

  public calculateTableHeadColOffsetTop(): void {
  }

  public onDestroy(): void {
    this.isAlive = false;
  }
}
