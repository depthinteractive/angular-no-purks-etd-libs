import {Component, OnInit, OnDestroy} from '@angular/core';
import {Observable, Subscription} from 'rxjs';
import {take} from 'rxjs/operators';
import {Store, select, createSelector, createFeatureSelector} from '@ngrx/store';
import * as fromDetails from './../../../store/data/details/details.reducer';

import {States} from '../../../store/states';

import * as DetailsActions from './../../../store/data/details/details.actions';

import {DetailsService} from './details.service';
import {COLUMNS as columns, WIDTH_CONFIG as widthConfig} from './details.columns';
import {TableRow} from '../../../models/general/table/table-row.model';
import {Entry} from '../../../models/entry.model';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.less']
})
export class DetailsComponent {
  readonly columns$: Observable<Entry[]> = this.$service.columns$;
  readonly parameters$: Observable<Entry[] | null> = this.$service.parameters$;
  readonly widthConfig$: Observable<string[]> = this.$service.widthConfig$;
  public details$: Observable<{ data }> = this.$service.details$;

  constructor(
    private store: Store<States>,
    private $service: DetailsService
  ) {
  }

  public closeDetails(): void {
    this.$service.closeDetails();
  }

  public exportToExcel(): void {
    this.$service.exportToExcel();
  }

  public openDocument({DOC_H_GUID, DOC_H_TYPE, DOC_H_REG_DATE, DOC_SYS_TYPE}): void {
    this.$service.openDocument(DOC_H_GUID, DOC_H_TYPE, DOC_H_REG_DATE, DOC_SYS_TYPE);
  }
}
