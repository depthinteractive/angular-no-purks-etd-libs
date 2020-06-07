import { Action } from '@ngrx/store';

import * as Actions from './actions.actions';

export function ActionsReducer (
  _a: '',
  action: Actions.Actions
) {
  switch ( action.type ) {
    case Actions.CALL_ACTION:
      return {...action};

    default:
      return {name: ''};
  }
}
