import {IFilters} from '../../models/general/parameters/filters.model';
import {TypedEntry} from '../../models/entry.model';

const EMPTY: string[] = [];

export const filtersInitialState: TypedEntry<IFilters> = {
  common: {
    Obligation: EMPTY,
    IGK: EMPTY,
    FAIP: EMPTY,
    subsidary_target_expense: EMPTY,
    subsidary_target_income: EMPTY
  },
  letterOfCredit: {
    Obligation: EMPTY,
    letterOfCreditNumber: EMPTY
  }
};

