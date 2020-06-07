import {Injectable} from '@angular/core';
import {select, Store} from '@ngrx/store';

import {States} from '../../../store/states';

import {COLUMNS, PARAMETERS, WIDTH_CONFIG} from './details.utils';
import {Observable} from 'rxjs';
import * as DetailsActions from '../../../store/data/details/details.actions';
import {map} from 'rxjs/operators';
import {Parameters} from '../../../models/general/parameters/parameters.model';
import {ReportService} from '../../../services/report.service';
import {ParametersSelectors} from '../../../store/parameters/parameters.selectors';
import {Entry} from '../../../models/entry.model';
import {AppSelectors} from '../../../store/app/app.selectors';
import {ObservableUtil} from '../../../store/utils/observable.util';
import getParameters = ParametersSelectors.getParameters;
import getMode = AppSelectors.getMode;
import {OpenDocumentService} from '../../../services/open-document.service';

@Injectable({
  providedIn: 'root'
})
export class DetailsService {
  private columns = COLUMNS;
  private parameters = PARAMETERS;
  private widthConfig = WIDTH_CONFIG;

  private _appMode$: Observable<string>;
  private _columns$: Observable<Entry[]>;

  constructor(
    private store: Store<States>,
    private $report: ReportService,
    private $openDocument: OpenDocumentService
  ) {
    this._appMode$ = this.store.pipe(
      select(getMode)
    );

    this._columns$ = this._appMode$.pipe(
      map(mode =>
        this.columns[mode]
      )
    );
  }

  public get details$(): Observable<{ data }> {
    return this.store.select('details');
  }

  public get columns$(): Observable<Entry[]> {
    return this._columns$;
  }

  public get parameters$(): Observable<Entry[]> {
    return this._appMode$.pipe(
      map(mode =>
        this.parameters[mode]
      )
    );
  }

  public get widthConfig$(): Observable<string[]> {
    return this._appMode$.pipe(
      map(mode =>
        this.widthConfig[mode]
      )
    );
  }

  public openDocument(docguid: string, doctitle: string, docdate: string, doctype: string): void {
    this.$openDocument.openDocument(docguid, doctype, doctitle, docdate);
  }

  public closeDetails(): void {
    this.store.dispatch(new DetailsActions.ClearDetails());
  }

  public exportToExcel() {
    const {data} = ObservableUtil.take(this.details$);
    const {pAccount, pDate}: Parameters = ObservableUtil.take(
      this.store.pipe(
        select(getParameters)
      )
    );

    this.$report.getDetailsDataReport(pAccount, pDate, data);
  }

  private prepareDataForExportToExcel(data: {}[]): {}[] {
    const columns = ObservableUtil.take(this.columns$);

    return data.map(row =>
      columns.reduce((acc, {title, key}) => {
        return {...acc, ...{[title]: row[key]}};
      }, {})
    );
  }
}
