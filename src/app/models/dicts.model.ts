import { Entry } from './entry.model';

export interface Dicts {
  pAccountWithPBudget?:      Entry[];
  subsidary_target_income?:  Entry[];
  subsidary_target_expense?: Entry[];
  documents?:                Entry[];
  FAIP?:                     Entry[];
  Obligation?:               Entry[];
  IGK?:                      Entry[];
  groups?:                   Entry[];
  indicators?:               Entry[];
  letterOfCreditNumber?:     Entry[];

}
