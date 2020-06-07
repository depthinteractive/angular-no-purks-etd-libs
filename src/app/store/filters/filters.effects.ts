import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { States } from '../states';
import * as filtersActions from './filters.actions';
import * as appActions from '../app/app.actions';


@Injectable()
export class FiltersEffects {
  constructor(
    private actions$: Actions,
    private store: Store<States>
  ) {
  }

  @Effect()
  private changeMode = this.actions$
    .pipe(
      ofType( appActions.SET_MODE ),
      map( (action: {mode}) =>
        new filtersActions.ChangeMode(action.mode)
      )
    );
}
