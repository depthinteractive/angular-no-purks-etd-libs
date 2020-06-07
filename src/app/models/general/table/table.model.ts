import { Entry } from '../../entry.model';
import { TableColumn } from './table-column.model';
import {Observable, Subject} from 'rxjs';
import {Filters, IFilters} from '../parameters/filters.model';
import {TableRow} from './table-row.model';

export interface Table {
  columns:   TableColumn[];
  data: {
    model:   TableColumn[];
    rows:    Entry[];
    source?: Entry[];
  };
  filtering?: IFilters;
  grouping?: Entry[];
  hasData?: boolean;
  header: Array<TableColumn[]>;
  options: {
    emptyCell?: string;
    nzScroll?: {
      x?: string;
      y?: string;
    };
    nzWidthConfig?: string[];
    ready: boolean;
    size?: string;
  };
  paging: {
    index: number;
    onChange?: Function;
    start?: number;
    end?: number;
    size: number;
  };
  expandRowChange?: Function;
  emitExpandRow?: Function;
  onChange: Subject<any>;
}

export interface ITable {
  data: TableRow[];
  loading: boolean;
}
