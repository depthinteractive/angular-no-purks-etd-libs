import {Entry} from '../../entry.model';

export interface Parameters {
  buttonEnable: boolean;
  pAccountWithPBudget: string;
  pAccount: string;
  pBudget: string;
  pDate: Date;
  exclClosedBYear?: boolean;
  exclProcessedBYear?: boolean;
  organization?: Entry | null;
}
