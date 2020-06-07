import {Injectable} from '@angular/core';
import {Action} from '@ngrx/store';

export const SET_FILTER = '[Filters] set filter';
export const SET_FILTERS = '[Filters] set filters';
export const CHANGE_MODE = '[Filters] change mode';
export const VOID = '[Filters] void';

export class SetFilter implements Action {
  readonly type = SET_FILTER;

  constructor(public name: string, public values: string[]) {
  }
}

export class SetFilters implements Action {
  readonly type = SET_FILTERS;

  constructor(public filters: Array<Object> = []) {
  }
}

export class ChangeMode implements Action {
  readonly type = CHANGE_MODE;

  constructor(public mode: string = null) {
  }
}

export class Void implements Action {
  readonly type = VOID;

  constructor(...args) {
  }
}

export type Actions = SetFilter | SetFilters | ChangeMode | Void;
