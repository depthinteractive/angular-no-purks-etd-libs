import { Injectable } from '@angular/core';
import { Action } from '@ngrx/store';
import { Entry } from '../../models/Entry.model';

export const SET_DICT = '[Dicts] set dict';
export const CHANGE_MODE = '[Dicts] change mode';
export const VOID = '[Dicts] void';

export class SetDict implements Action {
    readonly type = SET_DICT;
    
    constructor( public dictaName: string, public dict: Entry[] ) {}
}

export class ChangeMode implements Action {
  readonly type = CHANGE_MODE;

  constructor( public mode: string = null ) {}
}

export class Void implements Action {
  readonly type = VOID;

  constructor( ...args ) { }
}

export type Actions = SetDict | ChangeMode | Void;
