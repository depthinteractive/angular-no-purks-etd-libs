import {Injectable} from '@angular/core';
import {Action, select, Store} from '@ngrx/store';
import {Actions, Effect, ofType} from '@ngrx/effects';
import {Observable} from 'rxjs';
import {filter, map} from 'rxjs/operators';
import {States} from '../states';
import * as parametersActions from './parameters.actions';
import {AppSelectors} from '../app/app.selectors';
import {Entry} from '../../models/entry.model';
import * as actions from '../app/app.actions';
import {ObservableUtil} from '../utils/observable.util';
import {getDictSelector} from '../dicts/dicts.selectors';

@Injectable()
export class ParametersEffects {
  // private mode$: Observable<string> = this.store.pipe(select(getMode));
  private organizations$: Observable<Entry[]> = this.store.pipe(select(getDictSelector, {name: 'pAccountWithPBudget'}));

  constructor(
    private actions$: Actions,
    private store: Store<States>
  ) {
  }

  @Effect({})
  private setButtonEnable$ = this.actions$
    .pipe(
      ofType(parametersActions.SET_PARAMETER),
      filter(({name}: Entry) =>
        name !== 'pAccountWithPBudget' && name !== 'buttonEnable'
      ),
      map((action: Entry) => {
        return new parametersActions.SetParameter('buttonEnable', true);
      })
    );

  @Effect()
  private setPAccountAndPBudget$ = this.setPAccountWithPBudgetAction$.pipe(
    map(({name, value, mode}: Entry) => {
      if (value === null) {
        return new parametersActions.Void();
      }

      const [pAccount, pBudget]: string[] = value.split('-').map(item => item.trim());

      return new parametersActions.SetParameters({pAccount, pBudget});
    })
  );

  @Effect()
  private setOrganization$ = this.setPAccountWithPBudgetAction$.pipe(
    map(({value}: Entry) =>
      this.getOrganizationByPAccountWithPBudget(value)
    ),
    map((organization: Entry | null) =>
      new parametersActions.SetParameters({organization})
    )
  );

  @Effect()
  private changeMode = this.actions$
    .pipe(
      ofType(actions.SET_MODE),
      map((action: { mode }) =>
        new parametersActions.ChangeMode(action.mode)
      )
    );

  private get setPAccountWithPBudgetAction$(): Observable<Action> {
    return this.actions$.pipe(
      ofType(parametersActions.SET_PARAMETER),
      filter(({name}: Entry) =>
        name === 'pAccountWithPBudget'
      )
    );
  }

  private getOrganizationByPAccountWithPBudget(pAccountWithPBudget: string): Entry | null {
    const organizations: Entry[] = ObservableUtil.take(this.organizations$);
    return organizations.find(org => org.key === pAccountWithPBudget) || null;
  }
}
