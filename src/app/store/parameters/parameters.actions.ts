import {Action} from '@ngrx/store';

import {Parameters} from '../../models/general/parameters/parameters.model';

export const SET_BUTTON_STATE = '[Parameters] set button state';
export const SET_PARAMETER = '[Parameters] set parameter';
export const SET_PARAMETERS = '[Parameters] set settings';
export const CHANGE_MODE = '[Parameters] change mode';
export const VOID = '[Parametes] void';

export class SetButtonState implements Action {
  readonly type = SET_BUTTON_STATE;

  constructor(public state: boolean, public mode: string = null) {
  }
}

export class SetParameter implements Action {
  readonly type = SET_PARAMETER;

  constructor(public name: string, public value: Date | string | boolean) {
  }
}

export class SetParameters implements Action {
  readonly type = SET_PARAMETERS;

  constructor(public parameters: Parameters | Object) {
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

export type Actions = SetButtonState | SetParameter | SetParameters | ChangeMode | Void;
