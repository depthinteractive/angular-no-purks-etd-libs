/*
 * Import modules
 */
import {BrowserModule} from '@angular/platform-browser';
import {APP_INITIALIZER, NgModule} from '@angular/core';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {FormsModule} from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';
import {StoreModule} from '@ngrx/store';
import {EffectsModule} from '@ngrx/effects';
import {AppRoutingModule} from './app-routing.module';
import {PERFECT_SCROLLBAR_CONFIG, PerfectScrollbarConfigInterface, PerfectScrollbarModule} from 'ngx-perfect-scrollbar';
/*
 * Import localization options
 */
import {HashLocationStrategy, LocationStrategy, registerLocaleData} from '@angular/common';
import ru from '@angular/common/locales/ru';
import {NgZorroAntdModule, NZ_I18N, ru_RU} from 'ng-zorro-antd';

import {AppSticky} from './directives/sticky.directive';
/*
 * Import reducers
 */
import {AppReducer} from './store/app/app.reducer';
import {ActionsReducer} from './store/actions/actions.reducer';
import {DictsReducer} from './store/dicts/dicts.reducer';
import {FiltersReducer} from './store/filters/filters.reducer';
import {GroupmentReducer} from './store/groupment/groupment.reducer';
import {IndicatorsReducer} from './store/indicators/indicators.reducer';
import {ParametersReducer} from './store/parameters/parameters.reducer';
import {TableReducer} from './store/data/table/table.reducer';
import {DetailsDataReducer} from './store/data/details/details.reducer';
/*
 * Import Effects
 */
import {DetailsEffects} from './store/data/details/details.effects';
import {ParametersEffects} from './store/parameters/parameters.effects';
import {TableEffects} from './store/data/table/table.effects';
import {AppEffects} from './store/app/app.effects';
import {IndicatorsEffects} from './store/indicators/indicators.effects';
/*
 * Import pipes
 */
import {TransformTableValuePipe} from './pipes/transform-table-value.pipe';
import {GetExpandColStyle} from './pipes/get-expand-col-style.pipe';
import {RendererDetailsDocSumPipe} from './pipes/renderer-details-doc-sum.pipe';
import {TableGroupValuePipe} from './pipes/table-group-value.pipe';
import {RendererTableValuePipe} from './pipes/renderer-table-value.pipe';
import {TableFilterValuePipe} from './pipes/table-filter-value.pipe';
import {RendererTableHeaderPipe} from './pipes/renderer-table-header.pipe';
/*
 * Import components
 */
import {AppComponent} from './app.component';
import {LayoutComponent} from './components/layout/layout.component';
import {LayoutHeaderComponent} from './components/layout/header/header.component';
import {LayoutWorkspaceComponent} from './components/layout/workspace/workspace.component';
import {LayoutSiderComponent} from './components/layout/sider/sider.component';
import {SettingsComponent} from './components/general/settings/settings.component';
import {TableComponent} from './components/general/table/table.component';
import {DetailsComponent} from './components/general/details/details.component';
/*
 * Import effects
 */
import {GroupmentEffects} from './store/groupment/groupment.effects';
import {DictsEffects} from './store/dicts/dicts.effects';
import {FiltersEffects} from './store/filters/filters.effects';
import { PaExtendedSearchComponent } from './components/general/settings/pa-extended-search/pa-extended-search.component';
import { LengthPipe } from './pipes/length.pipe';
import { SplitPipe } from './pipes/split.pipe';
import { SubsidaryTargetTooltipPipe } from './pipes/subsidary-target-tooltip.pipe';
import { TableGroupNamePipe } from './pipes/table-group-name.pipe';
import { SortOrganizationsPipe } from './pipes/sort-organizations.pipe';
import { TableValueIsEmptyPipe } from './pipes/table-value-is-empty.pipe';
import {StatesService} from './services/states.service';


registerLocaleData(ru);

const EFFECTS = [
  AppEffects,
  TableEffects,
  DetailsEffects,
  ParametersEffects,
  IndicatorsEffects,
  GroupmentEffects,
  DictsEffects,
  FiltersEffects
];

const REDUCERS = {
  actions: ActionsReducer,
  app: AppReducer,
  details: DetailsDataReducer,
  dicts: DictsReducer,
  filters: FiltersReducer,
  groupment: GroupmentReducer,
  indicators: IndicatorsReducer,
  parameters: ParametersReducer,
  table: TableReducer
};
const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {};

@NgModule({
  declarations: [
    AppComponent,
    LayoutComponent,
    LayoutHeaderComponent,
    LayoutWorkspaceComponent,
    LayoutSiderComponent,
    SettingsComponent,
    TableComponent,
    DetailsComponent,
    AppSticky,

    TransformTableValuePipe,
    GetExpandColStyle,
    TableGroupValuePipe,
    RendererTableValuePipe,
    RendererDetailsDocSumPipe,
    TableFilterValuePipe,
    RendererTableHeaderPipe,
    PaExtendedSearchComponent,
    LengthPipe,
    SplitPipe,
    SubsidaryTargetTooltipPipe,
    TableGroupNamePipe,
    SortOrganizationsPipe,
    TableValueIsEmptyPipe
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    EffectsModule.forRoot(EFFECTS),
    FormsModule,
    HttpClientModule,
    NgZorroAntdModule.forRoot(),
    PerfectScrollbarModule,
    StoreModule.forRoot(REDUCERS)
  ],
  providers: [
    TransformTableValuePipe,
    TableValueIsEmptyPipe,
    {provide: LocationStrategy, useClass: HashLocationStrategy},
    {provide: NZ_I18N, useValue: ru_RU},
    {
      provide: PERFECT_SCROLLBAR_CONFIG,
      useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
