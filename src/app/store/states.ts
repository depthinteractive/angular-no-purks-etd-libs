import {App} from '../models/app.model';
import {Dicts} from '../models/dicts.model';
import {Entry} from '../models/entry.model';
import {Filters} from '../models/general/parameters/filters.model';
import {Parameters} from '../models/general/parameters/parameters.model';
import {TableRow} from '../models/general/table/table-row.model';

export interface States {
  readonly app: App;
  readonly action: { name };
  readonly details: {
    data: TableRow[];
    loading: boolean;
    visible: boolean;
  };
  readonly dicts: Dicts;
  readonly filters: Filters;
  readonly groupment: Entry[];
  readonly indicators: string[];
  readonly parameters: Parameters;
  readonly table: {
    data: TableRow[];
    loading: boolean;
  };
  timestamp?: number;
}
