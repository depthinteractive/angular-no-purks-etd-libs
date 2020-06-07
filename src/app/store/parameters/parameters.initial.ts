import { Parameters } from '../../models/general/parameters/parameters.model';

export const parametersInitialState: Parameters = {
  buttonEnable: false,
  pAccountWithPBudget: null,
  pAccount: null,
  pBudget: null,
  pDate: new Date(),
  exclClosedBYear: false,
  exclProcessedBYear: false,
  organization: null
};
