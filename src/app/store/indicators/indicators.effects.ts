import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { States } from '../states';
import * as indicatorsActions from './indicators.actions';
import * as actions from '../app/app.actions';


@Injectable()
export class IndicatorsEffects {
  constructor(
    private actions$: Actions,
    private store: Store<States>
  ) {
  }

  @Effect()
  private changeMode = this.actions$
    .pipe(
      ofType( actions.SET_MODE ),
      map( (action: {mode}) =>
        new indicatorsActions.ChangeMode(action.mode)
      )
    );
}
