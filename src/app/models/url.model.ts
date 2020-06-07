export interface IUrl {
  pattern: string;
  stringify: ( params: object ) => string;
}

export class Url implements IUrl {
  pattern: string;
  stringify: ( params: object ) => string;

  constructor( pattern: string, stringify: ( params: object ) => string ) {
    this.pattern = pattern;
    this.stringify = stringify
  }
}
