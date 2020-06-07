import {Injectable} from '@angular/core';
import {select, Store} from '@ngrx/store';
import {Actions, Effect, ofType} from '@ngrx/effects';
import {of} from 'rxjs';
import {map, switchMap, catchError, take, timeout} from 'rxjs/operators';

import {States} from '../../states';
import {Http} from '../../../models/http.model';

import {DatePipe} from '@angular/common';

import {CallAction} from '../../actions/actions.actions';
import * as DetailsActions from './details.actions';
import {ConfigService} from '../../../services/config.service';
import {RequestService} from '../../../services/request.service';
import {NotificationsService} from '../../../services/notifications.service';
import * as ParametersActions from '../../parameters/parameters.actions';
import Response = Http.Response;
import * as appActions from '../../app/app.actions';
import {AppSelectors} from '../../app/app.selectors';
import getMode = AppSelectors.getMode;

export const MSINDAY = 86400000;

@Injectable()
export class DetailsEffects {
  private detailsUrl: string;
  private hasUpdateUrl: string;

  constructor(
    private actions$: Actions,
    private $config: ConfigService,
    private $request: RequestService,
    private $notification: NotificationsService,
    private store: Store<States>,
    private datePipe: DatePipe
  ) {
    this.hasUpdateUrl = this.$config.get('rest', 'hasUpdate');

    this.store
      .pipe(
        select(getMode)
      )
      .subscribe(mode =>
        this.detailsUrl = this.$config.get('rest', 'documents', mode)
      );
  }

  @Effect()
  getDetails$ = this.actions$
    .pipe(
      ofType(DetailsActions.GET_DETAILS),
      switchMap((action: { params, indicators }) => {
        const params = {...action.params};

        this.store
          .select('parameters')
          .pipe(
            take(1)
          )
          .subscribe(_params => {
            const pDate = new Date(_params['pDate']);
            pDate.setTime(
              _params['pDate'].getTime() + MSINDAY
            );

            params['pBudget'] = _params['pBudget'];
            params['pAccount'] = _params['pAccount'];
            params['pDate'] = this.datePipe
              .transform(pDate, 'dd.MM.yyyy');
          });

        return this.$request
          .get(
            this.hasUpdateUrl,
            {params: {pAccount: params.pAccount, interval: 300}}
          )
          .pipe(
            map((response: Http.Response) => {
              const hasUpdate = response.data['hasUpdate'];

              if (hasUpdate) {
                this.store
                  .dispatch(
                    new CallAction(
                      'callNotification',
                      {
                        title: 'Внимание!',
                        message: 'Данные по лицевому счету обновились. Пожалуйста, переформируйте отчет'
                      }
                    )
                  );

                this.store
                  .dispatch(
                    new ParametersActions.SetButtonState(true)
                  );
              }

              return new DetailsActions.LoadDetails(params, action.indicators);
            }),
            catchError(error => of(console.error(error)))
          );
      })
    );


  @Effect()
  loadDetails$ = this.actions$
    .pipe(
      ofType(DetailsActions.LOAD_DETAILS),
      switchMap((action: { params, indicators }) => {
          const params = {...action.params};

          Object.keys(params).forEach(key => {
            if (typeof params[key] === 'undefined') {
              delete params[key];
            }
          });

          return this.$request
            .get(this.detailsUrl, {params: params})
            .pipe(
              map((response: Response) => {
                const {commonData} = response['data'];

                commonData.forEach(row => {
                  row.IGK = params.pIGK;
                  row.Obligation = params.pObligation;
                  row.letterOfCreditNumber = params.pLetterOfCreditNumber;
                } );

                return new DetailsActions
                  .SetDetails(commonData, action.indicators);
              }),
              catchError(error =>
                of(console.error(error))
              )
            );
        }
      )
    );

  @Effect()
  private changeMode = this.actions$
    .pipe(
      ofType(appActions.SET_MODE),
      map((action: { mode }) =>
        new DetailsActions.ChangeMode(action.mode)
      )
    );
}
