import {Injectable} from '@angular/core';
import {DatePipe} from '@angular/common';
import {Observable, Subject} from 'rxjs';

import {Store} from '@ngrx/store';
import {States} from '../../../store/states';

import * as DictsActions from './../../../store/dicts/dicts.actions';
import * as FiltersActions from './../../../store/filters/filters.actions';
import * as GroupmentActions from './../../../store/groupment/groupment.actions';
import * as IndicatorsActions from './../../../store/indicators/indicators.actions';
import * as ParametersActions from './../../../store/parameters/parameters.actions';
import * as AppActions from './../../../store/actions/actions.actions';
import * as TableActions from './../../../store/data/table/table.actions';

import {RequestService} from '../../../services/request.service';
import {ConfigService} from '../../../services/config.service';
import {Entry} from '../../../models/entry.model';
import {NzFormatEmitEvent} from 'ng-zorro-antd';

import {MSINDAY} from './settings.utils';
import {Parameters} from '../../../models/general/parameters/parameters.model';
import {delay} from 'rxjs/operators';
import {AppSelectors} from '../../../store/app/app.selectors';
import getMode = AppSelectors.getMode;
import {ObservableUtil} from '../../../store/utils/observable.util';

@Injectable({
  providedIn: 'root'
})
export class GeneralParametersService {
  private hasUpdateInterval;
  private appMode$ = this.store.select(getMode);

  constructor(
    private store: Store<States>,
    private datePipe: DatePipe,
    private $config: ConfigService,
    private $request: RequestService
  ) {
  }

  onChange(name: string, value: any, args: any[]): void {
    switch (name) {
      case 'indicators':
        this.setIndicators(value['keys']);
        break;

      case 'filter':
        this.setFilter(args[0], value, args[1]);
        break;

      case 'groupment':
        switch (args[0]) {
          case 'add':
            this.addGroup(value);
            break;

          case 'remove':
            this.removeGroup(value);
            break;

          case 'reorder':
            this.reorderGroup(value);
            break;

          default:
            break;
        }
        break;

      default:
        this.setParameter(name, value);
        break;
    }
  }

  private addGroup(value: any) {
    this.store.dispatch(new GroupmentActions.AddGroup(value));
  }

  private removeGroup(key: string) {
    this.store.dispatch(new GroupmentActions.RemoveGroup(key));
  }

  private reorderGroup(reorder: NzFormatEmitEvent) {
    this.store.dispatch(new GroupmentActions.ReorderGroup(reorder));
  }

  private setFilter(name: string, values: string[], dict: Entry[]) {
    this.store.dispatch(
      new FiltersActions.SetFilter(name, values)
    );
  }

  private setParameter(name: string, value: Date | string): void {
    this.store.dispatch(new ParametersActions.SetParameter(name, value));
  }

  private setIndicators(values: string[]): void {
    this.store.dispatch(new IndicatorsActions.SetIndicators(values));
  }

  public onInit(): void {
  }

  private getDict(name: string): Promise<boolean> {
    const url = this.$config.get('rest', name);

    const promise = new Promise<boolean>((_resolve) => {
      this.$request.get(url).subscribe((response: { data, success, fail }) => {
        if (response.success) {
          _resolve(true);
          this.store.dispatch(new DictsActions.SetDict(name, response.data));
        } else {
          _resolve(false);
        }
      });
    });

    return promise;
  }

  public getData({pAccount, pBudget, pDate, exclClosedBYear, exclProcessedBYear}: Parameters) {
    /*
     * Добавляем к выбранной дате + 1 день
     * Чтобы попадали из фаха данные не на дату отчёта, а на момент запроса
     */
    const mode: string = ObservableUtil.take(this.appMode$);
    pDate = new Date(pDate.getTime() + MSINDAY);

    let params: {} = {
      pAccount, pBudget,
      pDate: this.datePipe.transform(pDate, 'dd.MM.yyyy')
    };

    params = {...params, exclClosedBYear, exclProcessedBYear};

    // this.store.dispatch( new TableActions.SetLoading( true ) );
    this.store.dispatch(new TableActions.GetData(params));
  }

  public observeHasUpdate(pAccount: string): void {
    const url = this.$config.get('rest', 'hasUpdate');

    clearInterval(this.hasUpdateInterval);

    this.hasUpdateInterval = setInterval(() => {
      this.$request
        .get(
          url,
          {params: {pAccount: pAccount, interval: 300}}
        )
        .subscribe((response: { data: { hasUpdate, errorMessage }, success, fail }) => {
          if (response.success && response.data.hasUpdate) {
            this.store.dispatch(new ParametersActions.SetButtonState(true));

            this.store.dispatch(new AppActions.CallAction(
              'callNotification',
              {
                title: 'Внимание!',
                message: 'Произошло обновление данных по лицевому счету. Нажмите "Сформировать отчет", чтобы обновить данные в отчете'
              }
            ));
          }
        });
    }, 60000);
  }

  public getPersonalAccounts(pDate: Date): Observable<Entry[]> {
    const personalAccounts = new Subject<Entry[]>(),
      paUrl = this.$config.get('rest', 'PA'),
      paParams = {pDate: this.datePipe.transform(pDate, 'dd.MM.yyyy')};

    this.$request.get(paUrl, {params: paParams}).subscribe((response: { data, success, fail }) => {
      if (response.success) {
        personalAccounts.next(response.data);
      }

      if (response.fail) {
        this.store.dispatch(new AppActions.CallAction(
          'callNotification',
          {
            type: 'error',
            title: 'Ошибка загрузки справочника лицевых счетов',
            message: 'При загрузке справочника лицевых счетов возникла ошибка.' +
              'Пожалуйста, повторите действие позже или обратитесь к администратору'
          }
        ));
      }

      personalAccounts.complete();
    });

    return personalAccounts;
  }

  public clearObserveHasUpdate(): void {
    clearInterval(this.hasUpdateInterval);
  }
}
