import { Action } from '@ngrx/store';

export const ADD_SYSTEM_INFO = '[App] add system info';
export const COLLAPSE_SETTINGS = '[App] collapse setting ';
export const SELECT_MODE = '[App] select mode';
export const SET_MODE = '[App] set mode';
export const SET_MODE_LOADING = '[App] set mode loading';

export class AddSystemInfo implements Action {
  readonly type = ADD_SYSTEM_INFO;

  constructor( public title: string, public value: string) {}
}

export class CollapseSettings implements Action {
  readonly type = COLLAPSE_SETTINGS;

  constructor( public collapse: boolean = null ) {}
}

export class SelectMode implements Action {
  readonly type = SELECT_MODE;

  constructor( public mode: string ) {}
}

export class SetMode implements Action {
  readonly type = SET_MODE;

  constructor( public mode: string ) {}
}

export class SetModeLoading implements Action {
  readonly type = SET_MODE_LOADING;

  constructor( public modeLoading: boolean = false ) {}
}


export type Actions = AddSystemInfo | CollapseSettings | SetMode | SetModeLoading;
