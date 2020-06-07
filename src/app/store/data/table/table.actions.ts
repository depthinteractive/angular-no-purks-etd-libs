import { Action } from '@ngrx/store';

export const GET_DATA = '[TABLE] get data';
export const SET_DATA = '[TABLE] set data';
export const SET_LOADING = '[TABLE] set loading';
export const CHANGE_MODE = '[TABLE] change mode';
export const VOID = '[TABLE] void';

export class GetData implements Action {
  readonly type = GET_DATA;
  constructor( public params: {} ) {}
}

export class SetData implements Action {
    readonly type = SET_DATA;
    constructor( public data: {}[] ) {}
}

export class SetLoading implements Action {
  readonly type = SET_LOADING;
  constructor( public loading: boolean = false ) {}
}

export class ChangeMode implements  Action {
  readonly type = CHANGE_MODE;

  constructor ( public mode: string ) {}
}

export class Void implements Action {
  readonly type = VOID;

  constructor( ...args ) {
  }
}

export type Actions = GetData | SetData | SetLoading | ChangeMode | Void;
