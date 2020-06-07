import {Injectable} from '@angular/core';
import {States} from '../store/states';
import {Entry, TypedEntry} from '../models/entry.model';
import {LocalStorageService} from './local-storage.service';
import {Parameters} from '../models/general/parameters/parameters.model';
import {IFilters} from '../models/general/parameters/filters.model';
import {Dicts} from '../models/dicts.model';
import {ITable} from '../models/general/table/table.model';
import {Details} from '../models/details.model';
import {App} from '../models/app.model';

@Injectable({
  providedIn: 'root'
})
export class StatesService {
  private static _instance: StatesService;
  private static _maxTimestampDiff: number = 600000;
  private _states: TypedEntry<Entry | null> = {common: null, letterOfCredit: null};
  private _app: App | null = null;

  public static get instance(): StatesService {
    if (!StatesService._instance) {
      const $localStorage: LocalStorageService = new LocalStorageService();
      const instance: StatesService = new StatesService();
      const currentTimestamp: number = (new Date()).getTime();
      const lastChangesTimestamp: number = $localStorage.getNumber('timestamp');

      if (currentTimestamp - lastChangesTimestamp <= this._maxTimestampDiff) {
        instance.app = <App>$localStorage.getObject('app');
        instance.states = {
          common: $localStorage.getObject('common'),
          letterOfCredit: $localStorage.getObject('letterOfCredit')
        };
      }

      StatesService._instance = instance;
    }

    return StatesService._instance;
  }

  public get app(): App | null {
    return this._app;
  }

  public get mode(): string | null {
    return this.app !== null ? this.app.mode : 'common';
  }

  public getParameters(defaultStates: TypedEntry<Parameters>): TypedEntry<Parameters> {
    return this.getState(defaultStates, 'parameters');
  }

  public getIndicators(defaultStates: TypedEntry<string[]>): TypedEntry<string[]> {
    return this.getState(defaultStates, 'indicators');
  }

  public getGroupment(defaultStates: TypedEntry<Entry[]>): TypedEntry<Entry[]> {
    return this.getState(defaultStates, 'groupment');
  }

  public getFilters(defaultStates: TypedEntry<IFilters>): TypedEntry<IFilters> {
    return this.getState(defaultStates, 'filters');
  }

  public getDicts(defaultStates: TypedEntry<Dicts>): TypedEntry<Dicts> {
    return this.getState(defaultStates, 'dicts');
  }

  public getTable(defaultStates: TypedEntry<ITable>): TypedEntry<ITable> {
    return this.getState(defaultStates, 'table');
  }

  public getDetails(defaultStates: TypedEntry<Details>): TypedEntry<Details> {
    return this.getState(defaultStates, 'details');
  }

  public set app(app: App) {
    this._app = app;
  }

  private getState<T>(defaultStates: TypedEntry<T>, name: string): TypedEntry<T> {
    return Object
      .entries(this._states)
      .reduce((resultState, [key, states]) => {
        let state: T = defaultStates[key];

        if (states !== null) {
          state = this.transformState(states[name], name);
        }

        return {...resultState, [key]: state};
      }, {});
  }

  private set states(states: TypedEntry<Entry | null>) {
    this._states = states;
  }

  private transformState<T>(state: Entry, name: string): T {
    switch (name) {
      case 'parameters':
        try {
          state = {
            ...state,
            pDate: new Date(state.pDate)
          };
        } catch (e) {
          state = null;
        }
        break;
    }

    return state as T;
  }
}
