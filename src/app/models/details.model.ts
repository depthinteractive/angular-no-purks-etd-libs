export interface IDetails {
  data: Object[];
  expense: boolean;
  loading: boolean;
  visible: boolean;
}

export class Details implements IDetails {
  public data: Object[] = [];
  public expense: boolean = null;
  public loading: boolean = true;
  public visible: boolean = false;
}
