import { Injectable } from '@angular/core';
import { Action } from '@ngrx/store';

export const SET_INDICATORS = '[Indicators] set';
export const CHANGE_MODE = '[Indicators] change mode';
export const VOID = '[Indicators] void';

export class SetIndicators implements Action {
  readonly type = SET_INDICATORS;

  constructor( public indicators: string[] ) {}
}

export class ChangeMode implements Action {
  readonly type = CHANGE_MODE;

  constructor( public mode: string = null ) {}
}

export class Void implements Action {
  readonly type = VOID;

  constructor( ...args ) { }
}

export type Actions = SetIndicators | ChangeMode | Void;
