import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {NzFormatBeforeDropEvent} from 'ng-zorro-antd';
import {Observable, of} from 'rxjs';
import {delay, take} from 'rxjs/operators';
import {select, Store} from '@ngrx/store';

import {Dicts} from '../../../models/dicts.model';
import {Filters} from '../../../models/general/parameters/filters.model';
import {Parameters} from '../../../models/general/parameters/parameters.model';

import {States} from '../../../store/states';
import {AppSelectors} from '../../../store/app/app.selectors';

import {GeneralParametersService as ParametersService} from './settings.service';
import {Entry, TypedEntry} from '../../../models/entry.model';
import * as DictsActions from '../../../store/dicts/dicts.actions';
import * as ParametersActions from '../../../store/parameters/parameters.actions';
import {ParametersSelectors} from '../../../store/parameters/parameters.selectors';
import {FiltersSelectors} from '../../../store/filters/filters.selectors';
import {filtersFieldsMeta} from './settings.utils';
import getModeLoading = AppSelectors.getModeLoading;
import getSettingsCollapse = AppSelectors.getSettingsCollapse;

import getParameters = ParametersSelectors.getParameters;
import getFiltersList = FiltersSelectors.getFiltersList;
import getMode = AppSelectors.getMode;
import {ObservableUtil} from '../../../store/utils/observable.util';

let parametersService = null;

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.less'],
  providers: [ParametersService],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class SettingsComponent implements OnInit {
  public pAccount: Dicts;
  public dicts$: Observable<Dicts> = this.store.select('dicts');
  public filters$: Observable<Filters> = this.store.select('filters');
  public filtersList$: Observable<string[]> = this.store.pipe(select(getFiltersList));
  public groupment$: Observable<Entry[]> = this.store.select('groupment');
  public indicators$: Observable<string[]> = this.store.select('indicators');
  public parameters$: Observable<Parameters> = this.store.pipe(select(getParameters));
  public settingsCollapse$: Observable<boolean> = this.store.pipe(select(getSettingsCollapse));
  public appModeLoading$: Observable<boolean> = this.store.select(getModeLoading);
  public loadingReportButton = false;
  public loadingParameters = true;
  public paLoadingStatus = null;
  public filtersFieldsMeta: TypedEntry<Entry> = filtersFieldsMeta;
  public paExtendedSearchShow: boolean = false;
  public appMode$: Observable<string> = this.store.pipe(
    select(getMode),
    delay(500)
  );
  public selectedOrganization: Entry | null;

  constructor(
    private store: Store<States>,
    private service: ParametersService
  ) {
  }

  public ngOnInit(): void {
    parametersService = this.service;
    this.appMode$.subscribe(mode => {
      setTimeout(() => {
        this.getPersonalAccounts();
      });
    });

    setTimeout(() =>
        this.loadingParameters = false,
      250
    );
  }

  public onChange(name: string, value: any, ...args: any[]): void {
    this.service.onChange(name, value, args);

    if (name === 'pDate') {
      this.getPersonalAccounts();
    }

    if (name === 'pDate' || name === 'pAccountWithPBudget') {
      this.changeButtonReportState();
    }
  }

  public beforeDropGroup(nodes: NzFormatBeforeDropEvent): Observable<boolean> {
    const dragNode: Entry = nodes.dragNode.origin;
    const node: Entry = nodes.node.origin;

    if (!dragNode.dragable || !node.dragable) {
      return of(false);
    }

    parametersService.onChange('groupment', nodes, ['reorder']);
    return of(true);
  }

  public dragStartGroup($event): void {
    const dragNode: Entry = $event.dragNode.origin;

    if (!dragNode.dragable) {
      $event.event.preventDefault();
    }
  }

  public loadData() {
    const parameters: Parameters = ObservableUtil.take(this.parameters$);
    this.loadingReportButton = true;
    parametersService.observeHasUpdate(parameters.pAccount);

    setTimeout(() => {
      this.service.getData(parameters);
      this.changeButtonReportState(false);
      this.loadingReportButton = false;
    }, 500);
  }

  public showPaExtendedSearch(): void {
    this.paExtendedSearchShow = true;
  }

  public onDrop($event) {
    $event.event.preventDefault();
    return false;
  }

  public selectPaOrganization($event: Entry): void {
    if (!$event || !$event.key) {
      return;
    }

    this.onChange('pAccountWithPBudget', $event.key);
    this.selectOrganization($event);
  }

  public selectOrganization(organization: Entry): void {
    this.selectedOrganization = organization;
  }

  private changeButtonReportState(state: boolean = null) {
    const parameters: Parameters = ObservableUtil.take(this.parameters$);

    if (state === null) {
      state = parameters.pDate !== null && parameters.pAccountWithPBudget !== null;
    }

    this.store.dispatch(new ParametersActions.SetButtonState(state));
  }

  private getPersonalAccounts(): void {
    this.paLoadingStatus = 'validating';

    this.parameters$
      .pipe(
        take(1)
      )
      .subscribe(parameters => {
        const {pDate, pAccount, pAccountWithPBudget} = parameters;

        if (parameters) {
          this.service
            .getPersonalAccounts(pDate)
            .subscribe((PA: Entry[]) => {
              this.store.dispatch(
                new DictsActions.SetDict('pAccountWithPBudget', PA)
              );

              if (!PA.some(_PA => _PA.key === pAccountWithPBudget)) {
                parameters.pAccount = null;
                this.onChange('pAccountWithPBudget', null);
              }

              this.paLoadingStatus = null;
            });
        }
      });
  }
}
