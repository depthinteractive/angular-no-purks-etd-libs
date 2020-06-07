import {Injectable} from '@angular/core';
import {select, Store} from '@ngrx/store';
import {Actions, Effect, ofType} from '@ngrx/effects';
import {of} from 'rxjs';
import {map, switchMap, catchError, take} from 'rxjs/operators';
import {States} from '../../states';
import * as TableActions from './table.actions';
import * as DictsActions from './../../dicts/dicts.actions';
import {ConfigService} from '../../../services/config.service';
import {RequestService} from '../../../services/request.service';
import * as appActions from '../../app/app.actions';
import * as DetailsActions from '../details/details.actions';
import {AppSelectors} from '../../app/app.selectors';
import getMode = AppSelectors.getMode;


@Injectable()
export class TableEffects {
  private tableDataUrl: string;

  constructor(
    private actions$: Actions,
    private $config: ConfigService,
    private $request: RequestService,
    private store: Store<States>
  ) {
    this.store
      .pipe(
        select(getMode)
      )
      .subscribe(mode =>
        this.tableDataUrl = this.$config.get('rest', 'report', mode)
      );
  }

  @Effect()
  getData$ = this.actions$
    .pipe(
      ofType(TableActions.GET_DATA),
      switchMap((action: { params }) => {
          this.store.dispatch(
            new TableActions.SetLoading(true)
          );

          return this.$request
            .get(this.tableDataUrl, {params: action.params})
            .pipe(
              map(res => {
                Object.keys(res['data'])
                  .filter(key => key !== 'commonData')
                  .forEach(key =>
                    this.store.dispatch(
                      new DictsActions.SetDict(key, res['data'][key])
                    )
                  );

                return new TableActions.SetData(res['data']['commonData']);
              }),
              catchError(error => of(console.error(error)))
            );
        }
      )
    );

  @Effect()
  private changeMode = this.actions$
    .pipe(
      ofType(appActions.SET_MODE),
      map((action: { mode }) =>
        new TableActions.ChangeMode(action.mode)
      )
    );
}
