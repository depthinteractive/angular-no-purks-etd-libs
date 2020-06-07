export interface IFilters {
  FAIP?:                     string[];
  IGK?:                      string[];
  Obligation?:               string[];
  subsidary_target_expense?: string[];
  subsidary_target_income?:  string[];
  letterOfCreditNumber?:     string[];
}

export class Filters implements IFilters {
  public FAIP: string[];
  public IGK: string[];
  public Obligation: string[];
  public subsidary_target_expense: string[];
  public subsidary_target_income: string[];
  public letterOfCreditNumber: string[];

  constructor () {
    this.FAIP = [];
    this.IGK = [];
    this.Obligation = [];
    this.subsidary_target_expense = [];
    this.subsidary_target_income = [];
    this.letterOfCreditNumber = [];
  }
}
