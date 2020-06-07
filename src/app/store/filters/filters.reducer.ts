import {IFilters} from '../../models/general/parameters/filters.model';
import * as FiltersActions from './filters.actions';
import {filtersInitialState} from './filters.initial';
import {StatesService} from '../../services/states.service';

const $states: StatesService = StatesService.instance;

const $$filters = $states.getFilters(filtersInitialState);
let $$mode = $states.mode;

export function FiltersReducer(
  filters: IFilters = {},
  actions: FiltersActions.Actions
) {
  switch (actions.type) {
    case FiltersActions.SET_FILTER:
      filters[actions.name] = actions.values;
      changeFilters(filters);
      return {...filters};

    case FiltersActions.SET_FILTERS:
      changeFilters(filters);
      return {...actions.filters};

    case FiltersActions.CHANGE_MODE:
      $$mode = actions.mode;
      filters = $$filters[$$mode];
      return {...filters};

    default:
      return filters;
  }

  function changeFilters(_filters: IFilters): void {
    $$filters[$$mode] = _filters;
  }
}
