import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { States } from './../../../store/states';

import { AppSelectors } from '../../../store/app/app.selectors';

@Component({
  selector: 'app-layout-workspace',
  templateUrl: './workspace.component.html',
  styleUrls: ['./workspace.component.less']
})
export class LayoutWorkspaceComponent implements OnInit {
  public settingsCollapse$: Observable<boolean>;

  constructor(
    private store: Store<States>,
  ) {
    this.settingsCollapse$ = this.store.select( AppSelectors.getSettingsCollapse );
  }

  ngOnInit() {
  }

}
