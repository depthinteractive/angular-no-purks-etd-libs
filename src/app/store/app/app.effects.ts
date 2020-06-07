import {Injectable} from '@angular/core';
import {select, Store} from '@ngrx/store';
import {States} from '../states';
import * as actions from './app.actions';
import {Actions, Effect, ofType} from '@ngrx/effects';
import {debounceTime, delay, filter, map, tap} from 'rxjs/operators';
import {ObservableUtil} from '../utils/observable.util';
import {AppSelectors} from './app.selectors';
import {LocalStorageService} from '../../services/local-storage.service';
import {App} from '../../models/app.model';
import getAllStatesSelector = AppSelectors.getAllStatesSelector;

@Injectable()
export class AppEffects {
  private mode: string;
  private app: App;

  constructor(
    private actions$: Actions,
    private store: Store<States>,
    private $localStorage: LocalStorageService
  ) {
    this.store
      .pipe(
        select(AppSelectors.getAppState),
        debounceTime(1000),
      )
      .subscribe(app => this.app = app);
  }

  @Effect({dispatch: false})
  private saveStateEffect$ = this.actions$.pipe(
    debounceTime(1000),
    tap(() => {
      /*Пока отключаем за ненадобностью*/
      /*this.$localStorage.setObject(this.mode, this.allStates);
      this.$localStorage.setObject('app', this.app);
      this.$localStorage.set('timestamp', (new Date()).getTime());*/
    })
  );

  @Effect({dispatch: false})
  private changeModeEffect$ = this.actions$.pipe(
    ofType(actions.SELECT_MODE),
    tap(({mode}: { mode: string }) =>
      this.mode = mode
    )
  );

  @Effect()
  private setModeLoadingTrueEffect$ = this.actions$.pipe(
    ofType(actions.SELECT_MODE),
    map(({mode}: { mode: string }) => {
      this.store.dispatch(new actions.SetMode(mode));
      return new actions.SetModeLoading(true);
    })
  );

  @Effect()
  private setModeLoadingFalseEffect$ = this.actions$.pipe(
    ofType(actions.SET_MODE_LOADING),
    filter(({modeLoading}: { modeLoading: boolean }) => modeLoading),
    delay(1000),
    map(() =>
      new actions.SetModeLoading(false)
    )
  );

  public get allStates(): States {
    const allStates: States = ObservableUtil.take(
      this.store.pipe(
        select(getAllStatesSelector)
      )
    );

    return allStates;
  }
}
