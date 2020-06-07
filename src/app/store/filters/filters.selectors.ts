import { createSelector } from '@ngrx/store';
import { App } from '../../models/app.model';
import { States } from '../states';
import {Parameters} from '../../models/general/parameters/parameters.model';
import {IFilters} from '../../models/general/parameters/filters.model';

export namespace FiltersSelectors {
  export const getFiltersState = ( states: States ) => states.filters;

  export const getFiltersList  = createSelector( getFiltersState, ( filters: IFilters ) =>
    Object.keys( filters )
  );
}
