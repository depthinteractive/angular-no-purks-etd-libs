import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {Observable} from 'rxjs';
import {select, Store} from '@ngrx/store';
import {States} from '../../../store/states';

import {AppSelectors} from '../../../store/app/app.selectors';
import * as AppActions from '../../../store/app/app.actions';
import * as AnyActions from './../../../store/actions/actions.actions';
import {Entry} from '../../../models/entry.model';

import {MODES} from './header.utils';
import {StatesService} from '../../../services/states.service';
import {map} from 'rxjs/operators';

@Component({
  selector: 'app-layout-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LayoutHeaderComponent implements OnInit {
  public disableButton$: Observable<boolean>;
  public settingsCollapse$: Observable<boolean>;
  public systemInfo$: Observable<{ title, value }[]>;
  public selectedTabIndex$: Observable<number>;
  public modes: Entry[] = MODES;
  private $states = StatesService.instance;

  constructor(
    private store: Store<States>,
    private cdr: ChangeDetectorRef
  ) {
  }

  public ngOnInit(): void {
    this.selectedTabIndex$ = this.store.pipe(
      select(AppSelectors.getSelectedModeIndexSelector)
    );
    this.settingsCollapse$ = this.store.pipe(
      select(AppSelectors.getSettingsCollapse)
    );
    this.systemInfo$ = this.store.pipe(
      select(AppSelectors.getSystemInfo)
    );
    this.selectMode(
      this.$states.mode
    );

    this.disableButton$ = this.store
      .select('table')
      .pipe(
        map(({data}) =>
          !data.length
        )
      );
  }

  public exportTableToExcel() {
    this.store.dispatch(new AnyActions.CallAction('exportTableToExcel'));
  }

  public collapseSettings() {
    this.store.dispatch(new AppActions.CollapseSettings());
  }

  public selectMode(mode: string): void {
    this.store.dispatch(new AppActions.SelectMode(mode));
  }
}
