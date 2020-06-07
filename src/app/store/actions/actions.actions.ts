import { Injectable } from '@angular/core';
import { Action } from '@ngrx/store';

export const CALL_ACTION = '[Action] call';

export class CallAction implements Action {
  readonly type = CALL_ACTION;

  constructor( public name: string, public data?: {} ) {}
}

export type Actions = CallAction;
