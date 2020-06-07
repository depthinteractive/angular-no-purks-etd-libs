import { Injectable } from '@angular/core';
import { Action } from '@ngrx/store';

export const CLEAR_DETAILS = '[DETAILS] clear';
export const GET_DETAILS = '[DETAILS] get';
export const LOAD_DETAILS = '[DETAILS] load';
export const SELECT_DETAILS = '[DETAILS] select';
export const SET_DETAILS = '[DETAILS] set';
export const CHANGE_MODE = '[DETAILS] change mode';
export const VOID = '[DETAILS] void';

export class ClearDetails implements Action {
  readonly type = CLEAR_DETAILS;

  constructor() {}
}

export class GetDetails implements Action {
  readonly type = GET_DETAILS;

  constructor( public params: {}, public indicators: string[] | null = null ) { }
}

export class LoadDetails implements Action {
  readonly type = LOAD_DETAILS;

  constructor( public params: {}, public indicators: string[] | null = null ) { }
}

export class SelectDetails implements Action {
  readonly type = SELECT_DETAILS;

  constructor( public row: Object, public indicator: string ) {}
}

export class SetDetails implements Action {
  readonly type = SET_DETAILS;

  constructor( public details: {}[] = [], public indicators: string[] = null, public expense: boolean = null) {}
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


export type Actions = ClearDetails | GetDetails | LoadDetails | SelectDetails | SetDetails | ChangeMode | Void;
